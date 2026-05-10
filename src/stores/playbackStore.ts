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
  shuffleIndices: number[];
  currentShuffleIndex: number;

  setCurrentSong: (song: Song) => Promise<void>;
  playPause: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlayMode: (mode: PlayMode) => void;
  cyclePlayMode: () => void;
  incrementPlayCount: () => void;
  generateShuffleIndices: (queueLength: number) => void;
  setPlaying: (playing: boolean) => void;
  resetPlayback: () => void;
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
      shuffleIndices: [],
      currentShuffleIndex: 0,

      setCurrentSong: async (song) => {
        const blob = await getAudioBlob(song.audioBlobId);
        if (blob) {
          URL.createObjectURL(blob);
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
        if (mode === "shuffle") {
          set({
            playMode: mode,
            shuffleIndices: [],
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

      generateShuffleIndices: (queueLength) => {
        const indices = Array.from({ length: queueLength }, (_, i) => i).sort(
          () => Math.random() - 0.5,
        );
        set({ shuffleIndices: indices, currentShuffleIndex: 0 });
      },

      setPlaying: (playing) => set({ isPlaying: playing }),

      resetPlayback: () =>
        set({
          currentSong: null,
          isPlaying: false,
          currentTime: 0,
          duration: 0,
          shuffleIndices: [],
          currentShuffleIndex: 0,
        }),
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
