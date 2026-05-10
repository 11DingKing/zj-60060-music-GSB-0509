import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
  Repeat,
  RepeatOne,
  Shuffle,
  List,
  Lyrics,
  Equalizer,
  Visualizer,
} from "./Icons";
import { usePlaybackStore } from "../stores/playbackStore";
import { usePlaylistStore } from "../stores/playlistStore";
import { useUIStore } from "../stores/uiStore";
import { PlayMode } from "../types";
import { formatTime } from "../utils/format";

interface PlayerBarProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  onSeekStart?: () => void;
  onSeekEnd?: () => void;
}

const PlayerBar: React.FC<PlayerBarProps> = ({
  audioRef,
  onSeekStart,
  onSeekEnd,
}) => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playMode,
    playPause,
    setVolume,
    toggleMute,
    setPlayMode,
  } = usePlaybackStore();

  const { next, previous } = usePlaylistStore();

  const {
    queuePanelOpen,
    lyricsPanelOpen,
    equalizerPanelOpen,
    visualizerEnabled,
    visualizerMode,
    toggleQueuePanel,
    toggleLyricsPanel,
    toggleEqualizerPanel,
    toggleVisualizer,
    setVisualizerMode,
  } = useUIStore();

  const [isSeeking, setIsSeeking] = useState(false);
  const [seekTime, setSeekTime] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  const displayTime = isSeeking ? seekTime : currentTime;
  const progressPercent = duration > 0 ? (displayTime / duration) * 100 : 0;
  const volumePercent = (isMuted ? 0 : volume) * 100;

  const handleProgressClick = (e: React.MouseEvent) => {
    if (!progressRef.current || duration <= 0) return;

    const rect = progressRef.current.getBoundingClientRect();
    const percent = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width),
    );
    const newTime = percent * duration;

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleProgressMouseDown = (e: React.MouseEvent) => {
    setIsSeeking(true);
    onSeekStart?.();
    handleProgressClick(e);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isSeeking || !progressRef.current || duration <= 0) return;

      const rect = progressRef.current.getBoundingClientRect();
      const percent = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width),
      );
      const newTime = percent * duration;
      setSeekTime(newTime);

      if (audioRef.current) {
        audioRef.current.currentTime = newTime;
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isSeeking) {
        if (audioRef.current && progressRef.current && duration > 0) {
          const rect = progressRef.current.getBoundingClientRect();
          const percent = Math.max(
            0,
            Math.min(1, (e.clientX - rect.left) / rect.width),
          );
          const finalTime = percent * duration;
          audioRef.current.currentTime = finalTime;
        }
        setIsSeeking(false);
        onSeekEnd?.();
      }
    };

    if (isSeeking) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isSeeking, duration, audioRef]);

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width),
    );
    setVolume(percent);
    if (isMuted && percent > 0) {
      toggleMute();
    }
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX />;
    if (volume < 0.5) return <Volume1 />;
    return <Volume2 />;
  };

  const cyclePlayMode = () => {
    const modes: PlayMode[] = ["sequence", "shuffle", "repeatOne", "repeatAll"];
    const currentIndex = modes.indexOf(playMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setPlayMode(nextMode);
  };

  const getPlayModeIcon = () => {
    switch (playMode) {
      case "shuffle":
        return <Shuffle style={{ color: "#1db954" }} />;
      case "repeatOne":
        return <RepeatOne style={{ color: "#1db954" }} />;
      case "repeatAll":
        return <Repeat style={{ color: "#1db954" }} />;
      default:
        return <Repeat style={{ opacity: 0.7 }} />;
    }
  };

  const getPlayModeTitle = () => {
    switch (playMode) {
      case "shuffle":
        return "随机播放";
      case "repeatOne":
        return "单曲循环";
      case "repeatAll":
        return "列表循环";
      default:
        return "顺序播放";
    }
  };

  return (
    <footer className="player-bar">
      <div className="player-bar-left">
        {currentSong ? (
          <>
            <div className="player-cover">
              <img
                src={
                  currentSong.coverImage ||
                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23535353"%3E%3Cpath d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/%3E%3C/svg%3E'
                }
                alt={currentSong.title}
                className="player-cover-img"
              />
            </div>
            <div className="player-info">
              <div className="player-title" title={currentSong.title}>
                {currentSong.title}
              </div>
              <div className="player-artist" title={currentSong.artist}>
                {currentSong.artist}
              </div>
            </div>
          </>
        ) : (
          <div className="player-info-empty">未选择歌曲</div>
        )}
      </div>

      <div className="player-bar-center">
        <div className="player-controls">
          <button
            className="player-btn player-btn-mode"
            onClick={cyclePlayMode}
            title={getPlayModeTitle()}
          >
            {getPlayModeIcon()}
          </button>
          <button
            className="player-btn"
            onClick={previous}
            disabled={!currentSong}
          >
            <SkipBack />
          </button>
          <button
            className="player-btn player-btn-play"
            onClick={playPause}
            disabled={!currentSong}
          >
            {isPlaying ? <Pause /> : <Play />}
          </button>
          <button className="player-btn" onClick={next} disabled={!currentSong}>
            <SkipForward />
          </button>
          <button
            className={`player-btn player-btn-mode ${queuePanelOpen ? "active" : ""}`}
            onClick={toggleQueuePanel}
            title="播放队列"
          >
            <List />
          </button>
        </div>

        <div className="player-progress">
          <span className="player-time">{formatTime(displayTime)}</span>
          <div
            ref={progressRef}
            className="progress-bar"
            onMouseDown={handleProgressMouseDown}
          >
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="progress-bar-thumb" />
              </div>
            </div>
          </div>
          <span className="player-time">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-bar-right">
        <div className="player-extra-controls">
          <button
            className={`player-btn ${visualizerEnabled ? "active" : ""}`}
            onClick={toggleVisualizer}
            title="频谱可视化"
          >
            <Visualizer />
          </button>
          <button
            className={`player-btn ${lyricsPanelOpen ? "active" : ""}`}
            onClick={toggleLyricsPanel}
            title="歌词"
            disabled={!currentSong}
          >
            <Lyrics />
          </button>
          <button
            className={`player-btn ${equalizerPanelOpen ? "active" : ""}`}
            onClick={toggleEqualizerPanel}
            title="均衡器"
          >
            <Equalizer />
          </button>
        </div>

        <div className="player-volume">
          <button
            className="player-btn"
            onClick={toggleMute}
            title={isMuted ? "取消静音" : "静音"}
          >
            {getVolumeIcon()}
          </button>
          <div className="volume-slider" onClick={handleVolumeClick}>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${volumePercent}%` }}
              >
                <div className="progress-bar-thumb" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PlayerBar;
