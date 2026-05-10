import React, { useState, useRef, useEffect } from "react";
import { Close, Trash, More, Play, GripVertical, List } from "./Icons";
import { usePlaybackStore } from "../stores/playbackStore";
import { usePlaylistStore } from "../stores/playlistStore";
import { useUIStore } from "../stores/uiStore";
import { Song } from "../types";
import { formatTime } from "../utils/format";

const QueuePanel: React.FC = () => {
  const {
    queue,
    currentIndex,
    playSong,
    removeFromQueue,
    reorderQueue,
  } = usePlaylistStore();
  const { currentSong } = usePlaybackStore();
  const { toggleQueuePanel } = useUIStore();

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    index: number;
  } | null>(null);
  const dragRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== index) {
      reorderQueue(dragIndex, index);
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDoubleClick = (song: Song, index: number) => {
    const { playFromQueue } = usePlaylistStore.getState();
    playFromQueue(index);
  };

  const handleContextMenu = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, index });
  };

  const handleRemove = (index: number) => {
    removeFromQueue(index);
    setContextMenu(null);
  };

  const getQueueBefore = () => {
    if (currentIndex === -1) return [];
    return queue.slice(0, currentIndex);
  };

  const getQueueAfter = () => {
    if (currentIndex === -1) return queue;
    return queue.slice(currentIndex + 1);
  };

  const queueBefore = getQueueBefore();
  const queueAfter = getQueueAfter();

  return (
    <div className="side-panel-content queue-panel">
      <div className="panel-header">
        <h3 className="panel-title">播放队列</h3>
        <button className="panel-close-btn" onClick={toggleQueuePanel}>
          <Close />
        </button>
      </div>

      <div className="queue-content">
        {currentSong && (
          <div className="queue-section">
            <div className="queue-section-title">正在播放</div>
            <div
              className={`queue-item active`}
              onDoubleClick={() => handleDoubleClick(currentSong, currentIndex)}
              draggable
              onDragStart={(e) => handleDragStart(e, currentIndex)}
              onDragEnd={handleDragEnd}
              onContextMenu={(e) => handleContextMenu(e, currentIndex)}
            >
              <div className="queue-item-grip">
                <GripVertical />
              </div>
              <div className="queue-item-cover">
                <img
                  src={
                    currentSong.coverImage ||
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23535353"%3E%3Cpath d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/%3E%3C/svg%3E'
                  }
                  alt={currentSong.title}
                />
                <div className="queue-item-playing">
                  <Play />
                </div>
              </div>
              <div className="queue-item-info">
                <div className="queue-item-title">{currentSong.title}</div>
                <div className="queue-item-artist">{currentSong.artist}</div>
              </div>
              <div className="queue-item-duration">
                {formatTime(currentSong.duration)}
              </div>
            </div>
          </div>
        )}

        {queueBefore.length > 0 && (
          <div className="queue-section">
            <div className="queue-section-title">
              上一曲 ({queueBefore.length})
            </div>
            {queueBefore.map((song, idx) => {
              const actualIndex = idx;
              return (
                <div
                  key={`before-${song.id}-${idx}`}
                  className={`queue-item ${dragOverIndex === actualIndex ? "drag-over" : ""} ${dragIndex === actualIndex ? "dragging" : ""}`}
                  onDoubleClick={() => handleDoubleClick(song, actualIndex)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, actualIndex)}
                  onDragOver={(e) => handleDragOver(e, actualIndex)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, actualIndex)}
                  onDragEnd={handleDragEnd}
                  onContextMenu={(e) => handleContextMenu(e, actualIndex)}
                >
                  <div className="queue-item-grip">
                    <GripVertical />
                  </div>
                  <div className="queue-item-cover">
                    <img
                      src={
                        song.coverImage ||
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23535353"%3E%3Cpath d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/%3E%3C/svg%3E'
                      }
                      alt={song.title}
                    />
                  </div>
                  <div className="queue-item-info">
                    <div className="queue-item-title">{song.title}</div>
                    <div className="queue-item-artist">{song.artist}</div>
                  </div>
                  <div className="queue-item-duration">
                    {formatTime(song.duration)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {queueAfter.length > 0 && (
          <div className="queue-section">
            <div className="queue-section-title">
              待播放 ({queueAfter.length})
            </div>
            {queueAfter.map((song, idx) => {
              const actualIndex = currentIndex + 1 + idx;
              return (
                <div
                  key={`after-${song.id}-${idx}`}
                  className={`queue-item ${dragOverIndex === actualIndex ? "drag-over" : ""} ${dragIndex === actualIndex ? "dragging" : ""}`}
                  onDoubleClick={() => handleDoubleClick(song, actualIndex)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, actualIndex)}
                  onDragOver={(e) => handleDragOver(e, actualIndex)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, actualIndex)}
                  onDragEnd={handleDragEnd}
                  onContextMenu={(e) => handleContextMenu(e, actualIndex)}
                >
                  <div className="queue-item-grip">
                    <GripVertical />
                  </div>
                  <div className="queue-item-cover">
                    <img
                      src={
                        song.coverImage ||
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23535353"%3E%3Cpath d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/%3E%3C/svg%3E'
                      }
                      alt={song.title}
                    />
                  </div>
                  <div className="queue-item-info">
                    <div className="queue-item-title">{song.title}</div>
                    <div className="queue-item-artist">{song.artist}</div>
                  </div>
                  <div className="queue-item-duration">
                    {formatTime(song.duration)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {queue.length === 0 && !currentSong && (
          <div className="empty-state small">
            <div className="empty-state-icon">
              <List />
            </div>
            <p className="empty-state-subtitle">播放队列为空</p>
            <p className="empty-state-hint">在音乐库中双击歌曲播放</p>
          </div>
        )}
      </div>

      {contextMenu !== null && (
        <div
          className="context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="context-menu-item danger"
            onClick={() => handleRemove(contextMenu.index)}
          >
            <Trash />
            <span>从队列中移除</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueuePanel;
