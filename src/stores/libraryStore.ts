import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Song, SortField, SortDirection, ViewMode } from '../types';
import { getAllSongs, addSong as addSongToDB, deleteSong as deleteSongFromDB, updateSong } from '../lib/db';
import { createSongFromFile } from '../lib/metadata';

interface LibraryState {
  songs: Song[];
  loading: boolean;
  viewMode: ViewMode;
  searchQuery: string;
  sortField: SortField;
  sortDirection: SortDirection;
  selectedSongIds: Set<string>;
  isInitialized: boolean;
  
  initialize: () => Promise<void>;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  setSort: (field: SortField, direction?: SortDirection) => void;
  toggleSortDirection: () => void;
  importFiles: (files: FileList | File[]) => Promise<void>;
  removeSong: (id: string) => Promise<void>;
  removeSongs: (ids: string[]) => Promise<void>;
  toggleSongSelection: (id: string) => void;
  clearSelection: () => void;
  selectAll: () => void;
  getFilteredSongs: () => Song[];
  getAlbums: () => { album: string; artist: string; coverImage?: string; songCount: number }[];
  getArtists: () => { artist: string; albumCount: number; songCount: number }[];
}

function sortSongs(songs: Song[], field: SortField, direction: SortDirection): Song[] {
  return [...songs].sort((a, b) => {
    let comparison = 0;
    
    switch (field) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'artist':
        comparison = a.artist.localeCompare(b.artist);
        break;
      case 'album':
        comparison = a.album.localeCompare(b.album);
        break;
      case 'duration':
        comparison = a.duration - b.duration;
        break;
      case 'addedAt':
        comparison = a.addedAt - b.addedAt;
        break;
      case 'playCount':
        comparison = a.playCount - b.playCount;
        break;
    }
    
    return direction === 'asc' ? comparison : -comparison;
  });
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      songs: [],
      loading: false,
      viewMode: 'song',
      searchQuery: '',
      sortField: 'title',
      sortDirection: 'asc',
      selectedSongIds: new Set(),
      isInitialized: false,
      
      initialize: async () => {
        if (get().isInitialized) return;
        
        set({ loading: true });
        try {
          const songs = await getAllSongs();
          set({ songs, isInitialized: true });
        } finally {
          set({ loading: false });
        }
      },
      
      setViewMode: (mode) => set({ viewMode: mode }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      setSort: (field, direction) => {
        const { sortField: currentField, sortDirection: currentDirection } = get();
        const newDirection = direction ?? (field === currentField ? (currentDirection === 'asc' ? 'desc' : 'asc') : 'asc');
        set({ sortField: field, sortDirection: newDirection });
      },
      
      toggleSortDirection: () => {
        const { sortDirection } = get();
        set({ sortDirection: sortDirection === 'asc' ? 'desc' : 'asc' });
      },
      
      importFiles: async (files) => {
        const fileArray = Array.isArray(files) ? files : Array.from(files);
        const audioExtensions = ['.mp3', '.wav', '.ogg', '.flac'];
        const audioFiles = fileArray.filter(f => 
          audioExtensions.some(ext => f.name.toLowerCase().endsWith(ext))
        );
        
        if (audioFiles.length === 0) return;
        
        set({ loading: true });
        
        try {
          const newSongs: Song[] = [];
          
          for (const file of audioFiles) {
            try {
              const { song, blob } = await createSongFromFile(file);
              await addSongToDB(song, blob);
              newSongs.push(song);
            } catch (error) {
              console.error('Failed to import file:', file.name, error);
            }
          }
          
          if (newSongs.length > 0) {
            set((state) => ({
              songs: [...state.songs, ...newSongs],
            }));
          }
        } finally {
          set({ loading: false });
        }
      },
      
      removeSong: async (id) => {
        await deleteSongFromDB(id);
        set((state) => ({
          songs: state.songs.filter(s => s.id !== id),
          selectedSongIds: new Set(
            [...state.selectedSongIds].filter(songId => songId !== id)
          ),
        }));
      },
      
      removeSongs: async (ids) => {
        for (const id of ids) {
          await deleteSongFromDB(id);
        }
        set((state) => ({
          songs: state.songs.filter(s => !ids.includes(s.id)),
          selectedSongIds: new Set(
            [...state.selectedSongIds].filter(songId => !ids.includes(songId))
          ),
        }));
      },
      
      toggleSongSelection: (id) => {
        set((state) => {
          const newSelected = new Set(state.selectedSongIds);
          if (newSelected.has(id)) {
            newSelected.delete(id);
          } else {
            newSelected.add(id);
          }
          return { selectedSongIds: newSelected };
        });
      },
      
      clearSelection: () => set({ selectedSongIds: new Set() }),
      
      selectAll: () => {
        const { getFilteredSongs } = get();
        const filtered = getFilteredSongs();
        set({ selectedSongIds: new Set(filtered.map(s => s.id)) });
      },
      
      getFilteredSongs: () => {
        const { songs, searchQuery, sortField, sortDirection } = get();
        
        let filtered = songs;
        
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          filtered = songs.filter(song =>
            song.title.toLowerCase().includes(query) ||
            song.artist.toLowerCase().includes(query) ||
            song.album.toLowerCase().includes(query) ||
            song.genre.toLowerCase().includes(query)
          );
        }
        
        return sortSongs(filtered, sortField, sortDirection);
      },
      
      getAlbums: () => {
        const { getFilteredSongs } = get();
        const filtered = getFilteredSongs();
        
        const albumMap = new Map<string, { album: string; artist: string; coverImage?: string; songCount: number }>();
        
        for (const song of filtered) {
          const key = `${song.album} - ${song.artist}`;
          const existing = albumMap.get(key);
          
          if (existing) {
            existing.songCount++;
          } else {
            albumMap.set(key, {
              album: song.album,
              artist: song.artist,
              coverImage: song.coverImage,
              songCount: 1,
            });
          }
        }
        
        return Array.from(albumMap.values()).sort((a, b) => a.album.localeCompare(b.album));
      },
      
      getArtists: () => {
        const { getFilteredSongs } = get();
        const filtered = getFilteredSongs();
        
        const artistMap = new Map<string, { artist: string; albums: Set<string>; songCount: number }>();
        
        for (const song of filtered) {
          const existing = artistMap.get(song.artist);
          
          if (existing) {
            existing.albums.add(song.album);
            existing.songCount++;
          } else {
            artistMap.set(song.artist, {
              artist: song.artist,
              albums: new Set([song.album]),
              songCount: 1,
            });
          }
        }
        
        return Array.from(artistMap.values())
          .map(({ artist, albums, songCount }) => ({
            artist,
            albumCount: albums.size,
            songCount,
          }))
          .sort((a, b) => a.artist.localeCompare(b.artist));
      },
    }),
    {
      name: 'library-store',
      partialize: (state) => ({
        viewMode: state.viewMode,
        sortField: state.sortField,
        sortDirection: state.sortDirection,
      }),
    }
  )
);
