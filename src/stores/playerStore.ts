import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Song, PlayMode } from "../types";
import { getAudioBlob, updateSong as updateSongInDB } from "../lib/db";

interface PlayerState {
  currentSong: Song | null;
  queue: Song[];
  currentIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playMode: PlayMode;
  shuffleIndices: number[];
  currentShuffleIndex: number;

  setCurrentSong: (song: Song) => Promise<void>;
  playSong: (song: Song, queue?: Song[], startIndex?: number) => Promise<void>;
  playPause: () => void;
  next: () => void;
  previous: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlayMode: (mode: PlayMode) => void;
  cyclePlayMode: () => void;
  addToQueue: (song: Song) => void;
  addSongsToQueue: (songs: Song[]) => void;
  removeFromQueue: (index: number) => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  clearQueue: () => void;
  playFromQueue: (index: number) => void;
  incrementPlayCount: () => void;
  generateShuffleIndices: () => void;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      currentSong: null,
      queue: [],
      currentIndex: -1,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 0.8,
      isMuted: false,
      playMode: "sequence",
      shuffleIndices: [],
      currentShuffleIndex: 0,

      setCurrentSong: async (song) => {
        const blob = await getAudioBlob(song.audioBlobId);
        if (blob) {
          const url = URL.createObjectURL(blob);
          set({
            currentSong: song,
            currentTime: 0,
            duration: song.duration,
          });
        }
      },

      playSong: async (song, queue, startIndex) => {
        const blob = await getAudioBlob(song.audioBlobId);
        if (blob) {
          const url = URL.createObjectURL(blob);
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
            currentSong: song,
            queue: actualQueue,
            currentIndex: index >= 0 ? index : 0,
            currentTime: 0,
            duration: song.duration,
            isPlaying: true,
            shuffleIndices: [],
            currentShuffleIndex: 0,
          });

          get().incrementPlayCount();
        }
      },

      playPause: () => {
        const { isPlaying } = get();
        set({ isPlaying: !isPlaying });
      },

      next: () => {
        const {
          queue,
          currentIndex,
          playMode,
          shuffleIndices,
          currentShuffleIndex,
        } = get();
        if (queue.length === 0) return;

        let nextIndex: number;

        if (playMode === "repeatOne") {
          set({ currentTime: 0 });
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

          set({
            shuffleIndices: indices,
            currentShuffleIndex: nextShuffleIndex,
          });
        } else {
          nextIndex = currentIndex + 1;

          if (nextIndex >= queue.length) {
            if (playMode === "repeatAll") {
              nextIndex = 0;
            } else {
              set({ isPlaying: false });
              return;
            }
          }
        }

        const nextSong = queue[nextIndex];
        if (nextSong) {
          set({
            currentSong: nextSong,
            currentIndex: nextIndex,
            currentTime: 0,
            duration: nextSong.duration,
            isPlaying: true,
          });
          get().incrementPlayCount();
        }
      },

      previous: () => {
        const { queue, currentIndex, currentTime } = get();
        if (queue.length === 0) return;

        if (currentTime > 3) {
          set({ currentTime: 0 });
          return;
        }

        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
          prevIndex = queue.length - 1;
        }

        const prevSong = queue[prevIndex];
        if (prevSong) {
          set({
            currentSong: prevSong,
            currentIndex: prevIndex,
            currentTime: 0,
            duration: prevSong.duration,
            isPlaying: true,
          });
          get().incrementPlayCount();
        }
      },

      setCurrentTime: (time) => set({ currentTime: time }),

      setDuration: (duration) => set({ duration }),

      setVolume: (volume) => {
        const clamped = Math.max(0, Math.min(1, volume));
        set({ volume: clamped, isMuted: clamped === 0 });
      },

      toggleMute: () => {
        const { isMuted, volume } = get();
        if (isMuted && volume === 0) {
          set({ isMuted: false, volume: 0.5 });
        } else {
          set({ isMuted: !isMuted });
        }
      },

      setPlayMode: (mode) => {
        if (mode === "shuffle") {
          const { queue } = get();
          const indices = Array.from(
            { length: queue.length },
            (_, i) => i,
          ).sort(() => Math.random() - 0.5);
          set({
            playMode: mode,
            shuffleIndices: indices,
            currentShuffleIndex: 0,
          });
        } else {
          set({ playMode: mode, shuffleIndices: [], currentShuffleIndex: 0 });
        }
      },

      cyclePlayMode: () => {
        const { playMode, setPlayMode } = get();
        const modes: PlayMode[] = [
          "sequence",
          "shuffle",
          "repeatOne",
          "repeatAll",
        ];
        const currentIndex = modes.indexOf(playMode);
        const nextMode = modes[(currentIndex + 1) % modes.length];
        setPlayMode(nextMode);
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
            currentSong: newQueue[newIndex] || null,
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
        set({
          queue: [],
          currentIndex: -1,
          currentSong: null,
          isPlaying: false,
          shuffleIndices: [],
          currentShuffleIndex: 0,
        });
      },

      playFromQueue: (index) => {
        const { queue } = get();
        const song = queue[index];
        if (song) {
          set({
            currentSong: song,
            currentIndex: index,
            currentTime: 0,
            duration: song.duration,
            isPlaying: true,
          });
          get().incrementPlayCount();
        }
      },

      incrementPlayCount: () => {
        const { currentSong } = get();
        if (currentSong) {
          const updatedSong: Song = {
            ...currentSong,
            playCount: currentSong.playCount + 1,
            lastPlayedAt: Date.now(),
          };
          updateSongInDB(updatedSong);
        }
      },

      generateShuffleIndices: () => {
        const { queue } = get();
        const indices = Array.from({ length: queue.length }, (_, i) => i).sort(
          () => Math.random() - 0.5,
        );
        set({ shuffleIndices: indices, currentShuffleIndex: 0 });
      },
    }),
    {
      name: "player-store",
      partialize: (state) => ({
        volume: state.volume,
        isMuted: state.isMuted,
        playMode: state.playMode,
      }),
    },
  ),
);
