import React, { useState, useRef, useEffect } from 'react';
import {
  Home,
  Chart,
  Plus,
  More,
  Trash,
  Edit,
  SmartPlaylist,
  Playlist as PlaylistIcon,
} from './Icons';
import { useUIStore } from '../stores/uiStore';
import { usePlaylistStore } from '../stores/playlistStore';
import { usePlayerStore } from '../stores/playerStore';
import { Playlist } from '../types';

const Sidebar: React.FC = () => {
  const { currentView, currentPlaylistId, setCurrentView, setCurrentPlaylistId } = useUIStore();
  const { playlists, createPlaylist, deletePlaylist, updatePlaylist } = usePlaylistStore();
  const { addToQueue } = usePlayerStore();
  
  const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null);
  const [editingPlaylistName, setEditingPlaylistName] = useState('');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; playlist: Playlist } | null>(null);
  const [selectedPlaylistForMenu, setSelectedPlaylistForMenu] = useState<Playlist | null>(null);
  
  const newPlaylistInputRef = useRef<HTMLInputElement>(null);
  const editPlaylistInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showNewPlaylistInput && newPlaylistInputRef.current) {
      newPlaylistInputRef.current.focus();
    }
  }, [showNewPlaylistInput]);

  useEffect(() => {
    if (editingPlaylistId && editPlaylistInputRef.current) {
      editPlaylistInputRef.current.focus();
      editPlaylistInputRef.current.select();
    }
  }, [editingPlaylistId]);

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) {
      setShowNewPlaylistInput(false);
      return;
    }
    await createPlaylist(newPlaylistName.trim());
    setNewPlaylistName('');
    setShowNewPlaylistInput(false);
  };

  const handleStartEdit = (playlist: Playlist, e: React.MouseEvent) => {
    e.stopPropagation();
    setContextMenu(null);
    setEditingPlaylistId(playlist.id);
    setEditingPlaylistName(playlist.name);
  };

  const handleSaveEdit = async () => {
    if (!editingPlaylistId) return;
    if (editingPlaylistName.trim()) {
      await updatePlaylist(editingPlaylistId, { name: editingPlaylistName.trim() });
    }
    setEditingPlaylistId(null);
    setEditingPlaylistName('');
  };

  const handleDeletePlaylist = async (playlist: Playlist) => {
    await deletePlaylist(playlist.id);
    if (currentPlaylistId === playlist.id) {
      setCurrentView('library');
      setCurrentPlaylistId(null);
    }
    setContextMenu(null);
  };

  const handleContextMenu = (e: React.MouseEvent, playlist: Playlist) => {
    if (playlist.isSmart) return;
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, playlist });
    setSelectedPlaylistForMenu(playlist);
  };

  const handlePlaylistClick = (playlist: Playlist) => {
    setCurrentView('playlist');
    setCurrentPlaylistId(playlist.id);
  };

  const userPlaylists = playlists.filter(p => !p.isSmart);
  const smartPlaylists = playlists.filter(p => p.isSmart);

  const isPlaylistActive = (playlistId: string) => currentView === 'playlist' && currentPlaylistId === playlistId;

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-item">
          <div className="sidebar-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
            <span className="sidebar-logo-text">音乐播放器</span>
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">导航</div>
        <div
          className={`sidebar-item ${currentView === 'library' ? 'active' : ''}`}
          onClick={() => { setCurrentView('library'); setCurrentPlaylistId(null); }}
        >
          <Home />
          <span className="sidebar-item-text">音乐库</span>
        </div>
        <div
          className={`sidebar-item ${currentView === 'statistics' ? 'active' : ''}`}
          onClick={() => { setCurrentView('statistics'); setCurrentPlaylistId(null); }}
        >
          <Chart />
          <span className="sidebar-item-text">统计</span>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <div className="sidebar-section-title">智能歌单</div>
        </div>
        {smartPlaylists.map((playlist) => (
          <div
            key={playlist.id}
            className={`sidebar-item ${isPlaylistActive(playlist.id) ? 'active' : ''}`}
            onClick={() => handlePlaylistClick(playlist)}
          >
            <SmartPlaylist />
            <span className="sidebar-item-text">{playlist.name}</span>
          </div>
        ))}
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <div className="sidebar-section-title">我的歌单</div>
          <button className="sidebar-add-btn" onClick={() => setShowNewPlaylistInput(true)}>
            <Plus />
          </button>
        </div>
        
        {showNewPlaylistInput && (
          <div className="sidebar-new-playlist">
            <input
              ref={newPlaylistInputRef}
              type="text"
              className="sidebar-input"
              placeholder="歌单名称"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreatePlaylist();
                if (e.key === 'Escape') {
                  setShowNewPlaylistInput(false);
                  setNewPlaylistName('');
                }
              }}
              onBlur={handleCreatePlaylist}
            />
          </div>
        )}

        <div className="sidebar-playlist-list">
          {userPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              className={`sidebar-item ${isPlaylistActive(playlist.id) ? 'active' : ''}`}
              onClick={() => handlePlaylistClick(playlist)}
              onContextMenu={(e) => handleContextMenu(e, playlist)}
            >
              {editingPlaylistId === playlist.id ? (
                <input
                  ref={editPlaylistInputRef}
                  type="text"
                  className="sidebar-input"
                  value={editingPlaylistName}
                  onChange={(e) => setEditingPlaylistName(e.target.value)}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === 'Enter') handleSaveEdit();
                    if (e.key === 'Escape') {
                      setEditingPlaylistId(null);
                      setEditingPlaylistName('');
                    }
                  }}
                  onBlur={handleSaveEdit}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <>
                  <PlaylistIcon />
                  <span className="sidebar-item-text">{playlist.name}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {contextMenu && selectedPlaylistForMenu && (
        <div
          className="context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="context-menu-item"
            onClick={(e) => handleStartEdit(selectedPlaylistForMenu, e)}
          >
            <Edit />
            <span>重命名</span>
          </div>
          <div
            className="context-menu-item danger"
            onClick={() => handleDeletePlaylist(selectedPlaylistForMenu)}
          >
            <Trash />
            <span>删除歌单</span>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
