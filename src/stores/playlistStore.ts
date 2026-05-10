import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Playlist, Song, SmartRule } from "../types";
import {
  getAllPlaylists,
  addPlaylist as addPlaylistToDB,
  updatePlaylist as updatePlaylistInDB,
  deletePlaylist as deletePlaylistFromDB,
} from "../lib/db";
import { useLibraryStore } from "./libraryStore";
import { usePlaybackStore } from "./playbackStore";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

interface PlaylistState {
  playlists: Playlist[];
  queue: Song[];
  currentIndex: number;
  isInitialized: boolean;

  initialize: () => Promise<void>;
  createPlaylist: (name: string) => Promise<void>;
  updatePlaylist: (id: string, updates: Partial<Playlist>) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  addSongToPlaylist: (playlistId: string, songId: string) => Promise<void>;
  addSongsToPlaylist: (playlistId: string, songIds: string[]) => Promise<void>;
  removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
  reorderPlaylist: (
    playlistId: string,
    fromIndex: number,
    toIndex: number,
  ) => Promise<void>;
  getSmartPlaylistSongs: (rule: SmartRule) => Song[];
  getPlaylistSongs: (playlist: Playlist) => Song[];

  playSong: (song: Song, queue?: Song[], startIndex?: number) => Promise<void>;
  next: () => void;
  previous: () => void;
  addToQueue: (song: Song) => void;
  addSongsToQueue: (songs: Song[]) => void;
  removeFromQueue: (index: number) => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  clearQueue: () => void;
  playFromQueue: (index: number) => void;
}

export const usePlaylistStore = create<PlaylistState>()(
  persist(
    (set, get) => ({
      playlists: [],
      queue: [],
      currentIndex: -1,
      isInitialized: false,

      initialize: async () => {
        if (get().isInitialized) return;

        const playlists = await getAllPlaylists();

        const defaultPlaylists: Playlist[] = [
          {
            id: "smart-recently-added",
            name: "Recently Added",
            isSmart: true,
            smartRule: { type: "recentlyAdded", limit: 50 },
            songIds: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          {
            id: "smart-most-played",
            name: "Most Played",
            isSmart: true,
            smartRule: { type: "mostPlayed", limit: 50 },
            songIds: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        ];

        const existingIds = new Set(playlists.map((p) => p.id));
        const newPlaylists = [...playlists];

        for (const defaultPlaylist of defaultPlaylists) {
          if (!existingIds.has(defaultPlaylist.id)) {
            await addPlaylistToDB(defaultPlaylist);
            newPlaylists.push(defaultPlaylist);
          }
        }

        set({ playlists: newPlaylists, isInitialized: true });
      },

      createPlaylist: async (name) => {
        const playlist: Playlist = {
          id: generateId(),
          name,
          isSmart: false,
          songIds: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        await addPlaylistToDB(playlist);
        set((state) => ({
          playlists: [...state.playlists, playlist],
        }));
      },

      updatePlaylist: async (id, updates) => {
        set((state) => {
          const playlists = state.playlists.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p,
          );

          const updated = playlists.find((p) => p.id === id);
          if (updated) {
            updatePlaylistInDB(updated);
          }

          return { playlists };
        });
      },

      deletePlaylist: async (id) => {
        await deletePlaylistFromDB(id);
        set((state) => ({
          playlists: state.playlists.filter((p) => p.id !== id),
        }));
      },

      addSongToPlaylist: async (playlistId, songId) => {
        set((state) => {
          const playlists = state.playlists.map((p) => {
            if (p.id === playlistId && !p.songIds.includes(songId)) {
              const updated = {
                ...p,
                songIds: [...p.songIds, songId],
                updatedAt: Date.now(),
              };
              updatePlaylistInDB(updated);
              return updated;
            }
            return p;
          });

          return { playlists };
        });
      },

      addSongsToPlaylist: async (playlistId, songIds) => {
        set((state) => {
          const playlists = state.playlists.map((p) => {
            if (p.id === playlistId) {
              const newSongIds = songIds.filter(
                (id) => !p.songIds.includes(id),
              );
              if (newSongIds.length > 0) {
                const updated = {
                  ...p,
                  songIds: [...p.songIds, ...newSongIds],
                  updatedAt: Date.now(),
                };
                updatePlaylistInDB(updated);
                return updated;
              }
            }
            return p;
          });

          return { playlists };
        });
      },

      removeSongFromPlaylist: async (playlistId, songId) => {
        set((state) => {
          const playlists = state.playlists.map((p) => {
            if (p.id === playlistId && p.songIds.includes(songId)) {
              const updated = {
                ...p,
                songIds: p.songIds.filter((id) => id !== songId),
                updatedAt: Date.now(),
              };
              updatePlaylistInDB(updated);
              return updated;
            }
            return p;
          });

          return { playlists };
        });
      },

      reorderPlaylist: async (playlistId, fromIndex, toIndex) => {
        set((state) => {
          const playlists = state.playlists.map((p) => {
            if (p.id === playlistId) {
              const newSongIds = [...p.songIds];
              const [removed] = newSongIds.splice(fromIndex, 1);
              newSongIds.splice(toIndex, 0, removed);

              const updated = {
                ...p,
                songIds: newSongIds,
                updatedAt: Date.now(),
              };
              updatePlaylistInDB(updated);
              return updated;
            }
            return p;
          });

          return { playlists };
        });
      },

      getSmartPlaylistSongs: (rule) => {
        const libraryStore = useLibraryStore.getState();
        const allSongs = [...libraryStore.songs];

        switch (rule.type) {
          case "recentlyAdded":
            allSongs.sort((a, b) => b.addedAt - a.addedAt);
            return rule.limit ? allSongs.slice(0, rule.limit) : allSongs;

          case "mostPlayed":
            allSongs.sort((a, b) => b.playCount - a.playCount);
            return rule.limit ? allSongs.slice(0, rule.limit) : allSongs;

          case "custom":
            if (!rule.customFilters) return allSongs;

            let filtered = allSongs;
            for (const filter of rule.customFilters) {
              filtered = filtered.filter((song) => {
                const fieldValue = song[filter.field].toLowerCase();
                const filterValue = filter.value.toLowerCase();

                switch (filter.operator) {
                  case "contains":
                    return fieldValue.includes(filterValue);
                  case "equals":
                    return fieldValue === filterValue;
                  case "startsWith":
                    return fieldValue.startsWith(filterValue);
                  case "endsWith":
                    return fieldValue.endsWith(filterValue);
                  default:
                    return true;
                }
              });
            }

            return rule.limit ? filtered.slice(0, rule.limit) : filtered;

          default:
            return allSongs;
        }
      },

      getPlaylistSongs: (playlist) => {
        if (playlist.isSmart && playlist.smartRule) {
          return get().getSmartPlaylistSongs(playlist.smartRule);
        }

        const libraryStore = useLibraryStore.getState();
        const songMap = new Map(libraryStore.songs.map((s) => [s.id, s]));

        return playlist.songIds
          .map((id) => songMap.get(id))
          .filter((s): s is Song => s !== undefined);
      },

      playSong: async (song, queue, startIndex) => {
        const playbackStore = usePlaybackStore.getState();
        await playbackStore.setCurrentSong(song);

        const actualQueue = queue || [song];
        let index: number;
        if (
          startIndex !== undefined &&
          startIndex >= 0 &&
          startIndex < actualQueue.length
        ) {
          index = startIndex;
        } else {
          index = actualQueue.findIndex((s) => s.id === song.id);
        }

        set({
          queue: actualQueue,
          currentIndex: index >= 0 ? index : 0,
        });

        playbackStore.setPlaying(true);
        playbackStore.incrementPlayCount();
      },

      next: () => {
        const { queue, currentIndex } = get();
        const playbackStore = usePlaybackStore.getState();
        const { playMode, shuffleIndices, currentShuffleIndex } = playbackStore;

        if (queue.length === 0) return;

        let nextIndex: number;

        if (playMode === "repeatOne") {
          playbackStore.setCurrentTime(0);
          return;
        }

        if (playMode === "shuffle") {
          const indices =
            shuffleIndices.length > 0
              ? shuffleIndices
              : Array.from({ length: queue.length }, (_, i) => i).sort(
                  () => Math.random() - 0.5,
                );

          let nextShuffleIndex = currentShuffleIndex + 1;
          if (nextShuffleIndex >= indices.length) {
            nextShuffleIndex = 0;
          }

          nextIndex = indices[nextShuffleIndex];

          usePlaybackStore.setState({
            shuffleIndices: indices,
            currentShuffleIndex: nextShuffleIndex,
          });
        } else {
          nextIndex = currentIndex + 1;

          if (nextIndex >= queue.length) {
            if (playMode === "repeatAll") {
              nextIndex = 0;
            } else {
              playbackStore.setPlaying(false);
              return;
            }
          }
        }

        const nextSong = queue[nextIndex];
        if (nextSong) {
          set({ currentIndex: nextIndex });
          playbackStore.setCurrentSong(nextSong);
          playbackStore.setPlaying(true);
          playbackStore.incrementPlayCount();
        }
      },

      previous: () => {
        const { queue, currentIndex } = get();
        const playbackStore = usePlaybackStore.getState();
        const { currentTime } = playbackStore;

        if (queue.length === 0) return;

        if (currentTime > 3) {
          playbackStore.setCurrentTime(0);
          return;
        }

        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
          prevIndex = queue.length - 1;
        }

        const prevSong = queue[prevIndex];
        if (prevSong) {
          set({ currentIndex: prevIndex });
          playbackStore.setCurrentSong(prevSong);
          playbackStore.setPlaying(true);
          playbackStore.incrementPlayCount();
        }
      },

      addToQueue: (song) => {
        set((state) => ({
          queue: [...state.queue, song],
        }));
      },

      addSongsToQueue: (songs) => {
        set((state) => ({
          queue: [...state.queue, ...songs],
        }));
      },

      removeFromQueue: (index) => {
        set((state) => {
          const newQueue = [...state.queue];
          newQueue.splice(index, 1);

          let newIndex = state.currentIndex;
          if (index < state.currentIndex) {
            newIndex = state.currentIndex - 1;
          } else if (index === state.currentIndex) {
            newIndex = Math.min(index, newQueue.length - 1);
          }

          return {
            queue: newQueue,
            currentIndex: newIndex,
          };
        });
      },

      reorderQueue: (fromIndex, toIndex) => {
        set((state) => {
          const newQueue = [...state.queue];
          const [removed] = newQueue.splice(fromIndex, 1);
          newQueue.splice(toIndex, 0, removed);

          let newIndex = state.currentIndex;
          if (fromIndex === state.currentIndex) {
            newIndex = toIndex;
          } else if (
            fromIndex < state.currentIndex &&
            toIndex >= state.currentIndex
          ) {
            newIndex = state.currentIndex - 1;
          } else if (
            fromIndex > state.currentIndex &&
            toIndex <= state.currentIndex
          ) {
            newIndex = state.currentIndex + 1;
          }

          return {
            queue: newQueue,
            currentIndex: newIndex,
          };
        });
      },

      clearQueue: () => {
        const playbackStore = usePlaybackStore.getState();
        set({
          queue: [],
          currentIndex: -1,
        });
        playbackStore.resetPlayback();
      },

      playFromQueue: (index) => {
        const { queue } = get();
        const playbackStore = usePlaybackStore.getState();
        const song = queue[index];
        if (song) {
          set({ currentIndex: index });
          playbackStore.setCurrentSong(song);
          playbackStore.setPlaying(true);
          playbackStore.incrementPlayCount();
        }
      },
    }),
    {
      name: "playlist-store",
      partialize: () => ({}),
    },
  ),
);
