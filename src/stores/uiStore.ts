import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { VisualizerMode } from "../types";

interface UIState {
  sidebarCollapsed: boolean;
  queuePanelOpen: boolean;
  lyricsPanelOpen: boolean;
  equalizerPanelOpen: boolean;
  visualizerEnabled: boolean;
  visualizerMode: VisualizerMode;
  currentView: "library" | "playlist" | "statistics";
  currentPlaylistId: string | null;
  showImportModal: boolean;

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleQueuePanel: () => void;
  setQueuePanelOpen: (open: boolean) => void;
  toggleLyricsPanel: () => void;
  setLyricsPanelOpen: (open: boolean) => void;
  toggleEqualizerPanel: () => void;
  setEqualizerPanelOpen: (open: boolean) => void;
  toggleVisualizer: () => void;
  setVisualizerEnabled: (enabled: boolean) => void;
  setVisualizerMode: (mode: VisualizerMode) => void;
  cycleVisualizerMode: () => void;
  setCurrentView: (view: "library" | "playlist" | "statistics") => void;
  setCurrentPlaylistId: (id: string | null) => void;
  setShowImportModal: (show: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      queuePanelOpen: false,
      lyricsPanelOpen: false,
      equalizerPanelOpen: false,
      visualizerEnabled: true,
      visualizerMode: "bar",
      currentView: "library",
      currentPlaylistId: null,
      showImportModal: false,

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      toggleQueuePanel: () =>
        set((state) => ({ queuePanelOpen: !state.queuePanelOpen })),
      setQueuePanelOpen: (open) => set({ queuePanelOpen: open }),

      toggleLyricsPanel: () =>
        set((state) => ({ lyricsPanelOpen: !state.lyricsPanelOpen })),
      setLyricsPanelOpen: (open) => set({ lyricsPanelOpen: open }),

      toggleEqualizerPanel: () =>
        set((state) => ({ equalizerPanelOpen: !state.equalizerPanelOpen })),
      setEqualizerPanelOpen: (open) => set({ equalizerPanelOpen: open }),

      toggleVisualizer: () =>
        set((state) => ({ visualizerEnabled: !state.visualizerEnabled })),
      setVisualizerEnabled: (enabled) => set({ visualizerEnabled: enabled }),

      setVisualizerMode: (mode) => set({ visualizerMode: mode }),
      cycleVisualizerMode: () =>
        set((state) => {
          const modes: VisualizerMode[] = ["bar", "wave", "circle"];
          const currentIndex = modes.indexOf(state.visualizerMode);
          return { visualizerMode: modes[(currentIndex + 1) % modes.length] };
        }),

      setCurrentView: (view) => set({ currentView: view }),
      setCurrentPlaylistId: (id) =>
        set({
          currentPlaylistId: id,
          currentView: id ? "playlist" : "library",
        }),

      setShowImportModal: (show) => set({ showImportModal: show }),
    }),
    {
      name: "ui-store",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        visualizerEnabled: state.visualizerEnabled,
        visualizerMode: state.visualizerMode,
        currentView: state.currentView,
      }),
    },
  ),
);
