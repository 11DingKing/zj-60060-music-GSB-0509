import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lyrics } from '../types';
import { getLyricsBySongId, addLyrics, updateLyrics } from '../lib/db';
import { parseLRC } from '../utils/lyrics';
import { generateId } from '../utils/audio';

interface LyricsState {
  lyricsCache: Map<string, Lyrics>;
  currentLyrics: Lyrics | null;
  activeIndex: number;
  isLoading: boolean;
  error: string | null;

  loadLyrics: (songId: string) => Promise<void>;
  importLRC: (songId: string, content: string) => Promise<void>;
  setActiveIndex: (index: number) => void;
  clearCurrentLyrics: () => void;
  clearError: () => void;
  getCurrentLyrics: () => Lyrics | null;
}

export const useLyricsStore = create<LyricsState>()(
  persist(
    (set, get) => ({
      lyricsCache: new Map(),
      currentLyrics: null,
      activeIndex: -1,
      isLoading: false,
      error: null,

      loadLyrics: async (songId) => {
        const cached = get().lyricsCache.get(songId);
        if (cached) {
          set({ currentLyrics: cached, activeIndex: -1, error: null });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const savedLyrics = await getLyricsBySongId(songId);
          if (savedLyrics) {
            set((state) => ({
              lyricsCache: new Map(state.lyricsCache).set(songId, savedLyrics),
              currentLyrics: savedLyrics,
              activeIndex: -1,
              isLoading: false,
            }));
          } else {
            set({ currentLyrics: null, activeIndex: -1, isLoading: false });
          }
        } catch {
          set({ isLoading: false, error: '加载歌词失败' });
        }
      },

      importLRC: async (songId, content) => {
        set({ isLoading: true, error: null });

        try {
          const parsed = parseLRC(content);
          const existing = await getLyricsBySongId(songId);
          const lyricsData: Lyrics = {
            id: existing?.id || generateId(),
            songId,
            content,
            parsed,
          };

          if (existing) {
            await updateLyrics(lyricsData);
          } else {
            await addLyrics(lyricsData);
          }

          set((state) => ({
            lyricsCache: new Map(state.lyricsCache).set(songId, lyricsData),
            currentLyrics: lyricsData,
            activeIndex: -1,
            isLoading: false,
          }));
        } catch {
          set({ isLoading: false, error: '解析歌词文件失败' });
        }
      },

      setActiveIndex: (index) => set({ activeIndex: index }),

      clearCurrentLyrics: () => set({ currentLyrics: null, activeIndex: -1 }),

      clearError: () => set({ error: null }),

      getCurrentLyrics: () => get().currentLyrics,
    }),
    {
      name: 'lyrics-store',
      partialize: () => ({}),
    }
  )
);
