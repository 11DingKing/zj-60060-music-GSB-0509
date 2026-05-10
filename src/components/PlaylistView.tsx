import React, { useState, useEffect, useRef } from "react";
import { Search, Upload, More, Play, Plus, Trash, Music } from "./Icons";
import { useLibraryStore } from "../stores/libraryStore";
import { usePlaybackStore } from "../stores/playbackStore";
import { usePlaylistStore } from "../stores/playlistStore";
import { Song, Playlist } from "../types";
import { formatTime } from "../utils/format";

interface PlaylistViewProps {
  playlistId: string | null;
}

const PlaylistView: React.FC<PlaylistViewProps> = ({ playlistId }) => {
  const { songs, searchQuery, setSearchQuery, getFilteredSongs, removeSong } =
    useLibraryStore();

  const { playSong, addToQueue } = usePlaylistStore();
  const { currentSong, isPlaying } = usePlaybackStore();
  const { playlists, removeSongFromPlaylist, getPlaylistSongs } =
    usePlaylistStore();

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    song: Song;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const playlist = playlists.find((p) => p.id === playlistId) || null;
  const playlistSongs = playlist ? getPlaylistSongs(playlist) : [];

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSongDoubleClick = (song: Song) => {
    const index = playlistSongs.findIndex((s) => s.id === song.id);
    playSong(song, playlistSongs, index >= 0 ? index : 0);
  };

  const handlePlaySong = (song: Song) => {
    const index = playlistSongs.findIndex((s) => s.id === song.id);
    playSong(song, playlistSongs, index >= 0 ? index : 0);
  };

  const handleAddToQueue = (song: Song) => {
    addToQueue(song);
    setContextMenu(null);
  };

  const handleRemoveFromPlaylist = (song: Song) => {
    if (playlist && !playlist.isSmart) {
      removeSongFromPlaylist(playlist.id, song.id);
    }
    setContextMenu(null);
  };

  const handleContextMenu = (e: React.MouseEvent, song: Song) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, song });
  };

  const playAll = () => {
    if (playlistSongs.length > 0) {
      playSong(playlistSongs[0], playlistSongs, 0);
    }
  };

  if (!playlist) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <Music />
        </div>
        <h3 className="empty-state-title">歌单不存在</h3>
        <p className="empty-state-subtitle">该歌单可能已被删除</p>
      </div>
    );
  }

  const firstSong = playlistSongs[0];

  return (
    <div className="playlist-view">
      <div className="playlist-header">
        <div className="playlist-cover-large">
          <img
            src={
              firstSong?.coverImage ||
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23535353"%3E%3Cpath d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/%3E%3C/svg%3E'
            }
            alt={playlist.name}
            className="playlist-cover-img"
          />
        </div>
        <div className="playlist-info">
          <h1 className="playlist-title">{playlist.name}</h1>
          <p className="playlist-meta">
            {playlist.isSmart ? "智能歌单" : "歌单"} · {playlistSongs.length}{" "}
            首歌曲
          </p>
          <div className="playlist-actions">
            <button
              className="btn-primary"
              onClick={playAll}
              disabled={playlistSongs.length === 0}
            >
              <Play />
              <span>播放全部</span>
            </button>
          </div>
        </div>
      </div>

      <div className="view-toolbar">
        <div className="search-bar">
          <Search />
          <input
            type="text"
            className="search-input"
            placeholder="搜索歌曲..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery("")}>
              ×
            </button>
          )}
        </div>
      </div>

      <div className="view-content">
        {playlistSongs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Music />
            </div>
            <h3 className="empty-state-title">歌单为空</h3>
            <p className="empty-state-subtitle">
              {playlist.isSmart
                ? "智能歌单将自动根据规则收集歌曲"
                : "从音乐库中添加歌曲到这个歌单"}
            </p>
          </div>
        ) : (
          <div className="song-table">
            <div className="song-table-header">
              <div className="table-header-cell">
                <span>标题</span>
              </div>
              <div className="table-header-cell">
                <span>艺术家</span>
              </div>
              <div className="table-header-cell">
                <span>专辑</span>
              </div>
              <div className="table-header-cell">
                <span>时长</span>
              </div>
              <div className="table-header-cell">
                <span>操作</span>
              </div>
            </div>
            <div className="song-table-body">
              {playlistSongs.map((song) => (
                <div
                  key={song.id}
                  className={`song-table-row ${currentSong?.id === song.id ? "playing" : ""}`}
                  onDoubleClick={() => handleSongDoubleClick(song)}
                  onContextMenu={(e) => handleContextMenu(e, song)}
                >
                  <div className="table-cell song-title-cell">
                    <div className="song-cover-small">
                      <img
                        src={
                          song.coverImage ||
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23535353"%3E%3Cpath d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/%3E%3C/svg%3E'
                        }
                        alt={song.title}
                        className="song-cover-img"
                      />
                      {currentSong?.id === song.id && isPlaying && (
                        <div className="song-playing-indicator">
                          <div
                            className="playing-bar"
                            style={{ animationDelay: "0s" }}
                          />
                          <div
                            className="playing-bar"
                            style={{ animationDelay: "0.2s" }}
                          />
                          <div
                            className="playing-bar"
                            style={{ animationDelay: "0.4s" }}
                          />
                        </div>
                      )}
                    </div>
                    <span className="song-title-text">{song.title}</span>
                  </div>
                  <div className="table-cell">{song.artist}</div>
                  <div className="table-cell">{song.album}</div>
                  <div className="table-cell">{formatTime(song.duration)}</div>
                  <div className="table-cell song-actions">
                    <button
                      className="song-action-btn"
                      onClick={() => handlePlaySong(song)}
                      title="播放"
                    >
                      <Play />
                    </button>
                    <button
                      className="song-action-btn"
                      onClick={() => addToQueue(song)}
                      title="添加到队列"
                    >
                      <Plus />
                    </button>
                    {!playlist.isSmart && (
                      <button
                        className="song-action-btn danger"
                        onClick={() => handleRemoveFromPlaylist(song)}
                        title="从歌单中移除"
                      >
                        <Trash />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {contextMenu && (
        <div
          className="context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="context-menu-item"
            onClick={() => {
              handlePlaySong(contextMenu.song);
              setContextMenu(null);
            }}
          >
            <Play />
            <span>播放</span>
          </div>
          <div
            className="context-menu-item"
            onClick={() => handleAddToQueue(contextMenu.song)}
          >
            <Plus />
            <span>添加到队列</span>
          </div>
          {!playlist?.isSmart && (
            <>
              <div className="context-menu-divider" />
              <div
                className="context-menu-item danger"
                onClick={() => handleRemoveFromPlaylist(contextMenu.song)}
              >
                <Trash />
                <span>从歌单中移除</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PlaylistView;
