import React, { useState, useEffect, useRef } from "react";
import {
  List,
  Grid,
  Users,
  Search,
  Upload,
  More,
  Play,
  Plus,
  Trash,
  Music,
} from "./Icons";
import { useLibraryStore } from "../stores/libraryStore";
import { usePlayerStore } from "../stores/playerStore";
import { usePlaylistStore } from "../stores/playlistStore";
import { ViewMode, SortField, SortDirection, Song } from "../types";
import { formatTime } from "../utils/format";

const LibraryView: React.FC = () => {
  const {
    songs,
    loading,
    viewMode,
    searchQuery,
    sortField,
    sortDirection,
    importFiles,
    setViewMode,
    setSearchQuery,
    setSort,
    toggleSortDirection,
    getFilteredSongs,
    getAlbums,
    getArtists,
    removeSong,
  } = useLibraryStore();

  const { playSong, addToQueue, currentSong, isPlaying } = usePlayerStore();
  const { playlists, addSongToPlaylist } = usePlaylistStore();

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    song: Song;
  } | null>(null);
  const [selectedAlbumName, setSelectedAlbumName] = useState<string | null>(
    null,
  );
  const [selectedArtistName, setSelectedArtistName] = useState<string | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredSongs = getFilteredSongs();
  const albums = getAlbums();
  const artists = getArtists();

  const userPlaylists = playlists.filter((p) => !p.isSmart);

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await importFiles(files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSongDoubleClick = (song: Song) => {
    const queue = viewMode === "song" ? filteredSongs : [song];
    const index =
      viewMode === "song"
        ? filteredSongs.findIndex((s) => s.id === song.id)
        : 0;
    playSong(song, queue, index >= 0 ? index : 0);
  };

  const handlePlaySong = (song: Song) => {
    const queue = viewMode === "song" ? filteredSongs : [song];
    const index =
      viewMode === "song"
        ? filteredSongs.findIndex((s) => s.id === song.id)
        : 0;
    playSong(song, queue, index >= 0 ? index : 0);
  };

  const handleAddToQueue = (song: Song) => {
    addToQueue(song);
    setContextMenu(null);
  };

  const handleAddToPlaylist = (song: Song, playlistId: string) => {
    addSongToPlaylist(playlistId, song.id);
    setContextMenu(null);
  };

  const handleDeleteSong = (song: Song) => {
    removeSong(song.id);
    setContextMenu(null);
  };

  const handleContextMenu = (e: React.MouseEvent, song: Song) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, song });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      toggleSortDirection();
    } else {
      setSort(field);
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? "↑" : "↓";
  };

  interface AlbumInfo {
    album: string;
    artist: string;
    coverImage?: string;
    songCount: number;
  }

  interface ArtistInfo {
    artist: string;
    albumCount: number;
    songCount: number;
  }

  const getAlbumSongs = (albumName: string) => {
    return filteredSongs.filter((s) => s.album === albumName);
  };

  const getArtistSongs = (artistName: string) => {
    return filteredSongs.filter((s) => s.artist === artistName);
  };

  const playAlbum = (albumInfo: AlbumInfo) => {
    const albumSongs = getAlbumSongs(albumInfo.album);
    if (albumSongs.length > 0) {
      playSong(albumSongs[0], albumSongs, 0);
    }
  };

  const playArtist = (artistInfo: ArtistInfo) => {
    const artistSongs = getArtistSongs(artistInfo.artist);
    if (artistSongs.length > 0) {
      playSong(artistSongs[0], artistSongs, 0);
    }
  };

  const renderSongListView = () => {
    if (filteredSongs.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Music />
          </div>
          <h3 className="empty-state-title">音乐库为空</h3>
          <p className="empty-state-subtitle">
            拖拽音频文件到页面或点击下方按钮导入
          </p>
          <div className="empty-state-actions">
            <label className="btn-primary">
              <Upload />
              <span>导入音乐</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp3,.wav,.ogg,.flac"
                multiple
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />
            </label>
          </div>
        </div>
      );
    }

    return (
      <div className="song-table">
        <div className="song-table-header">
          <div
            className={`table-header-cell sortable ${sortField === "title" ? "sorted" : ""}`}
            onClick={() => handleSort("title")}
          >
            <span>标题</span>
            <span className="sort-indicator">{getSortIcon("title")}</span>
          </div>
          <div
            className={`table-header-cell sortable ${sortField === "artist" ? "sorted" : ""}`}
            onClick={() => handleSort("artist")}
          >
            <span>艺术家</span>
            <span className="sort-indicator">{getSortIcon("artist")}</span>
          </div>
          <div
            className={`table-header-cell sortable ${sortField === "album" ? "sorted" : ""}`}
            onClick={() => handleSort("album")}
          >
            <span>专辑</span>
            <span className="sort-indicator">{getSortIcon("album")}</span>
          </div>
          <div
            className={`table-header-cell sortable ${sortField === "duration" ? "sorted" : ""}`}
            onClick={() => handleSort("duration")}
          >
            <span>时长</span>
            <span className="sort-indicator">{getSortIcon("duration")}</span>
          </div>
          <div className="table-header-cell">
            <span>操作</span>
          </div>
        </div>
        <div className="song-table-body">
          {filteredSongs.map((song) => (
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
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAlbumGridView = () => {
    if (albums.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Grid />
          </div>
          <h3 className="empty-state-title">暂无专辑</h3>
          <p className="empty-state-subtitle">导入音乐后将自动按专辑分组</p>
        </div>
      );
    }

    return (
      <div className="album-grid">
        {albums.map((albumInfo) => {
          const albumSongs = getAlbumSongs(albumInfo.album);
          const firstSong = albumSongs[0];

          return (
            <div
              key={albumInfo.album}
              className="album-card"
              onClick={() =>
                setSelectedAlbumName(
                  selectedAlbumName === albumInfo.album
                    ? null
                    : albumInfo.album,
                )
              }
            >
              <div className="album-cover">
                <img
                  src={
                    albumInfo.coverImage ||
                    firstSong?.coverImage ||
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23535353"%3E%3Cpath d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/%3E%3C/svg%3E'
                  }
                  alt={albumInfo.album}
                  className="album-cover-img"
                />
                <button
                  className="album-play-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    playAlbum(albumInfo);
                  }}
                >
                  <Play />
                </button>
              </div>
              <div className="album-info">
                <h4 className="album-title">{albumInfo.album || "未知专辑"}</h4>
                <p className="album-meta">
                  {albumInfo.songCount} 首歌曲 ·{" "}
                  {albumInfo.artist || "未知艺术家"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderArtistListView = () => {
    if (artists.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Users />
          </div>
          <h3 className="empty-state-title">暂无艺术家</h3>
          <p className="empty-state-subtitle">导入音乐后将自动按艺术家分组</p>
        </div>
      );
    }

    return (
      <div className="artist-list">
        {artists.map((artistInfo) => {
          const artistSongs = getArtistSongs(artistInfo.artist);

          return (
            <div
              key={artistInfo.artist}
              className="artist-item"
              onClick={() =>
                setSelectedArtistName(
                  selectedArtistName === artistInfo.artist
                    ? null
                    : artistInfo.artist,
                )
              }
            >
              <div className="artist-info">
                <div className="artist-avatar">
                  <Users />
                </div>
                <div className="artist-details">
                  <h4 className="artist-name">
                    {artistInfo.artist || "未知艺术家"}
                  </h4>
                  <p className="artist-meta">
                    {artistInfo.albumCount} 张专辑 · {artistInfo.songCount}{" "}
                    首歌曲
                  </p>
                </div>
              </div>
              <button
                className="artist-play-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  playArtist(artistInfo);
                }}
              >
                <Play />
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="library-view">
      <div className="view-header">
        <h2 className="view-title">音乐库</h2>

        <div className="view-toolbar">
          <div className="search-bar">
            <Search />
            <input
              type="text"
              className="search-input"
              placeholder="搜索歌曲、艺术家或专辑..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="search-clear"
                onClick={() => setSearchQuery("")}
              >
                ×
              </button>
            )}
          </div>

          <div className="view-mode-tabs">
            <button
              className={`view-mode-tab ${viewMode === "song" ? "active" : ""}`}
              onClick={() => setViewMode("song")}
            >
              <List />
              <span>歌曲</span>
            </button>
            <button
              className={`view-mode-tab ${viewMode === "album" ? "active" : ""}`}
              onClick={() => setViewMode("album")}
            >
              <Grid />
              <span>专辑</span>
            </button>
            <button
              className={`view-mode-tab ${viewMode === "artist" ? "active" : ""}`}
              onClick={() => setViewMode("artist")}
            >
              <Users />
              <span>艺术家</span>
            </button>
          </div>

          <label className="btn-secondary">
            <Upload />
            <span>导入音乐</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp3,.wav,.ogg,.flac"
              multiple
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />
          </label>
        </div>
      </div>

      <div className="view-content">
        {viewMode === "song" && renderSongListView()}
        {viewMode === "album" && renderAlbumGridView()}
        {viewMode === "artist" && renderArtistListView()}
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
          {userPlaylists.length > 0 && <div className="context-menu-divider" />}
          {userPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              className="context-menu-item"
              onClick={() => handleAddToPlaylist(contextMenu.song, playlist.id)}
            >
              <Plus />
              <span>添加到「{playlist.name}」</span>
            </div>
          ))}
          <div className="context-menu-divider" />
          <div
            className="context-menu-item danger"
            onClick={() => handleDeleteSong(contextMenu.song)}
          >
            <Trash />
            <span>删除</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryView;
