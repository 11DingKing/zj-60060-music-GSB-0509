import { create } from "zustand";
import type { Lyrics, LyricLine } from "../types";
import { getLyricsBySongId, addLyrics, updateLyrics } from "../lib/db";
import { parseLRC, lyricsToLRC } from "../utils/lyrics";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

interface LyricsState {
  currentLyrics: Lyrics | null;
  activeLineIndex: number;
  isLoading: boolean;
  error: string | null;

  loadLyrics: (songId: string) => Promise<void>;
  clearLyrics: () => void;
  setActiveLineIndex: (index: number) => void;
  findActiveLine: (currentTime: number) => number;
  importLRCFile: (songId: string, content: string) => Promise<void>;
  seekToLine: (lineIndex: number) => number | null;
}

export const useLyricsStore = create<LyricsState>()((set, get) => ({
  currentLyrics: null,
  activeLineIndex: -1,
  isLoading: false,
  error: null,

  loadLyrics: async (songId) => {
    set({ isLoading: true, error: null });
    try {
      const savedLyrics = await getLyricsBySongId(songId);
      set({ currentLyrics: savedLyrics || null, isLoading: false });
    } catch {
      set({ isLoading: false, error: "加载歌词失败" });
    }
  },

  clearLyrics: () => {
    set({ currentLyrics: null, activeLineIndex: -1, error: null });
  },

  setActiveLineIndex: (index) => {
    set({ activeLineIndex: index });
  },

  findActiveLine: (currentTime) => {
    const { currentLyrics } = get();
    if (!currentLyrics || !currentLyrics.parsed.length) return -1;

    for (let i = currentLyrics.parsed.length - 1; i >= 0; i--) {
      if (currentTime >= currentLyrics.parsed[i].time) {
        return i;
      }
    }
    return -1;
  },

  importLRCFile: async (songId, content) => {
    set({ isLoading: true, error: null });
    try {
      const parsedLines = parseLRC(content);
      const lrcContent = lyricsToLRC(parsedLines);

      const existing = await getLyricsBySongId(songId);

      if (existing) {
        await updateLyrics({
          ...existing,
          content: lrcContent,
          parsed: parsedLines as LyricLine[],
        });
        set({
          currentLyrics: {
            ...existing,
            content: lrcContent,
            parsed: parsedLines as LyricLine[],
          },
          isLoading: false,
        });
      } else {
        const newLyrics: Lyrics = {
          id: generateId(),
          songId,
          content: lrcContent,
          parsed: parsedLines as LyricLine[],
        };
        await addLyrics(newLyrics);
        set({ currentLyrics: newLyrics, isLoading: false });
      }
    } catch {
      set({ isLoading: false, error: "解析歌词文件失败" });
    }
  },

  seekToLine: (lineIndex) => {
    const { currentLyrics } = get();
    if (!currentLyrics || !currentLyrics.parsed[lineIndex]) return null;
    return currentLyrics.parsed[lineIndex].time;
  },
}));
