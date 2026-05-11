import React from "react";
import Sidebar from "./Sidebar";
import PlayerBar from "./PlayerBar";
import Visualizer from "./Visualizer";
import QueuePanel from "./QueuePanel";
import LyricsPanel from "./LyricsPanel";
import EqualizerPanel from "./EqualizerPanel";
import LibraryView from "./LibraryView";
import PlaylistView from "./PlaylistView";
import StatisticsView from "./StatisticsView";
import { useUIStore } from "../stores/uiStore";
import { usePlaybackStore } from "../stores/playbackStore";
import { useLibraryStore } from "../stores/libraryStore";

interface LayoutProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  analyserRef: React.RefObject<AnalyserNode | null>;
  onSeekStart?: () => void;
  onSeekEnd?: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  audioRef,
  analyserRef,
  onSeekStart,
  onSeekEnd,
}) => {
  const {
    queuePanelOpen,
    lyricsPanelOpen,
    equalizerPanelOpen,
    currentView,
    currentPlaylistId,
    visualizerEnabled,
  } = useUIStore();

  const { currentSong, isPlaying } = usePlaybackStore();
  const { loading } = useLibraryStore();

  const showVisualizer = visualizerEnabled && currentSong && isPlaying;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="empty-state">
          <div className="loading-spinner" />
          <p className="empty-state-subtitle" style={{ marginTop: 24 }}>
            加载中...
          </p>
        </div>
      );
    }

    switch (currentView) {
      case "playlist":
        return <PlaylistView playlistId={currentPlaylistId} />;
      case "statistics":
        return <StatisticsView />;
      case "library":
      default:
        return <LibraryView />;
    }
  };

  const renderSidePanel = () => {
    if (queuePanelOpen) {
      return <QueuePanel />;
    }
    if (lyricsPanelOpen) {
      return <LyricsPanel />;
    }
    if (equalizerPanelOpen) {
      return <EqualizerPanel />;
    }
    return null;
  };

  const sidePanelOpen = queuePanelOpen || lyricsPanelOpen || equalizerPanelOpen;

  return (
    <div className="main-layout">
      <Sidebar />

      <div className="main-content">
        <div className="content-body">{renderContent()}</div>
      </div>

      <div className={`side-panel ${!sidePanelOpen ? "collapsed" : ""}`}>
        {renderSidePanel()}
      </div>

      {showVisualizer && analyserRef.current && (
        <Visualizer analyser={analyserRef.current} />
      )}

      <PlayerBar
        audioRef={audioRef}
        onSeekStart={onSeekStart}
        onSeekEnd={onSeekEnd}
      />
    </div>
  );
};

export default Layout;
