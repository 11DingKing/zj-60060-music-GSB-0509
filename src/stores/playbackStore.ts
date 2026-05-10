import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Song, PlayMode } from "../types";
import { getAudioBlob, updateSong as updateSongInDB } from "../lib/db";

interface PlaybackState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playMode: PlayMode;

  setCurrentSong: (song: Song) => Promise<void>;
  playPause: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlayMode: (mode: PlayMode) => void;
  cyclePlayMode: () => void;
  incrementPlayCount: () => void;
}

export const usePlaybackStore = create<PlaybackState>()(
  persist(
    (set, get) => ({
      currentSong: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 0.8,
      isMuted: false,
      playMode: "sequence",

      setCurrentSong: async (song) => {
        const blob = await getAudioBlob(song.audioBlobId);
        if (blob) {
          set({
            currentSong: song,
            currentTime: 0,
            duration: song.duration,
          });
        }
      },

      playPause: () => {
        const { isPlaying } = get();
        set({ isPlaying: !isPlaying });
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
        set({ playMode: mode });
      },

      cyclePlayMode: () => {
        const { playMode } = get();
        const modes: PlayMode[] = [
          "sequence",
          "shuffle",
          "repeatOne",
          "repeatAll",
        ];
        const currentIndex = modes.indexOf(playMode);
        const nextMode = modes[(currentIndex + 1) % modes.length];
        set({ playMode: nextMode });
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
    }),
    {
      name: "playback-store",
      partialize: (state) => ({
        volume: state.volume,
        isMuted: state.isMuted,
        playMode: state.playMode,
      }),
    },
  ),
);
