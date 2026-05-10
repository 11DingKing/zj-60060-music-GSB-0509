import { create } from "zustand";
import type { Lyrics } from "../types";
import { getLyrics, saveLyrics, parseLRC } from "../utils/lyrics";

interface LyricsState {
  lyrics: Lyrics | null;
  activeIndex: number;
  isLoading: boolean;
  error: string | null;
  cache: Map<string, Lyrics>;

  loadLyrics: (songId: string) => Promise<void>;
  setActiveIndex: (index: number) => void;
  clearLyrics: () => void;
  importLRC: (songId: string, text: string) => Promise<void>;
  getCachedLyrics: (songId: string) => Lyrics | undefined;
}

export const useLyricsStore = create<LyricsState>((set, get) => ({
  lyrics: null,
  activeIndex: -1,
  isLoading: false,
  error: null,
  cache: new Map(),

  loadLyrics: async (songId) => {
    const cache = get().cache;
    const cached = cache.get(songId);
    
    if (cached) {
      set({ lyrics: cached, activeIndex: -1, isLoading: false, error: null });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const savedLyrics = await getLyrics(songId);
      if (savedLyrics) {
        cache.set(songId, savedLyrics);
        set({ lyrics: savedLyrics, activeIndex: -1, isLoading: false });
      } else {
        set({ lyrics: null, activeIndex: -1, isLoading: false });
      }
    } catch {
      set({ isLoading: false, error: '加载歌词失败' });
    }
  },

  setActiveIndex: (index) => set({ activeIndex: index }),

  clearLyrics: () => set({ lyrics: null, activeIndex: -1, isLoading: false, error: null }),

  importLRC: async (songId, text) => {
    set({ isLoading: true, error: null });

    try {
      const parsedLyrics = parseLRC(text);
      await saveLyrics(songId, parsedLyrics);
      
      const lyrics: Lyrics = {
        id: '',
        songId,
        content: text,
        parsed: parsedLyrics,
      };
      
      const cache = get().cache;
      cache.set(songId, lyrics);
      
      set({ lyrics, activeIndex: -1, isLoading: false });
    } catch {
      set({ isLoading: false, error: '解析歌词文件失败' });
    }
  },

  getCachedLyrics: (songId) => get().cache.get(songId),
}));
