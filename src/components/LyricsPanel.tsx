import React, { useState, useEffect, useRef } from 'react';
import { Close, Upload, Lyrics as LyricsIcon } from './Icons';
import { usePlaybackStore } from '../stores/playbackStore';
import { useUIStore } from '../stores/uiStore';
import { useLyricsStore } from '../stores/lyricsStore';
import { findActiveLyricIndex } from '../utils/lyrics';

const LyricsPanel: React.FC = () => {
  const currentSong = usePlaybackStore((state) => state.currentSong);
  const currentTime = usePlaybackStore((state) => state.currentTime);
  const setCurrentTime = usePlaybackStore((state) => state.setCurrentTime);
  const toggleLyricsPanel = useUIStore((state) => state.toggleLyricsPanel);
  
  const {
    currentLyrics,
    activeIndex,
    isLoading,
    error,
    loadLyrics,
    importLRC,
    setActiveIndex,
    clearCurrentLyrics,
  } = useLyricsStore();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!currentSong) {
      clearCurrentLyrics();
      return;
    }

    loadLyrics(currentSong.id);
  }, [currentSong?.id]);

  useEffect(() => {
    if (!currentLyrics || !currentLyrics.parsed.length) {
      setActiveIndex(-1);
      return;
    }

    const newActiveIndex = findActiveLyricIndex(currentLyrics.parsed, currentTime);
    
    if (newActiveIndex !== activeIndex) {
      setActiveIndex(newActiveIndex);
      
      if (containerRef.current && newActiveIndex >= 0) {
        const lineElements = containerRef.current.querySelectorAll('.lyrics-line');
        if (lineElements[newActiveIndex]) {
          lineElements[newActiveIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }
    }
  }, [currentTime, currentLyrics, activeIndex]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentSong) return;

    try {
      const text = await file.text();
      await importLRC(currentSong.id, text);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleLineClick = (time: number) => {
    setCurrentTime(time);
  };

  if (!currentSong) {
    return (
      <div className="side-panel-content lyrics-panel">
        <div className="panel-header">
          <h3 className="panel-title">歌词</h3>
          <button className="panel-close-btn" onClick={toggleLyricsPanel}>
            <Close />
          </button>
        </div>
        <div className="empty-state small">
          <p className="empty-state-subtitle">请先播放一首歌曲</p>
        </div>
      </div>
    );
  }

  return (
    <div className="side-panel-content lyrics-panel">
      <div className="panel-header">
        <h3 className="panel-title">歌词</h3>
        <div className="panel-header-actions">
          <label className="panel-btn" title="导入 LRC 歌词">
            <Upload />
            <input
              ref={fileInputRef}
              type="file"
              accept=".lrc,.txt"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
          </label>
          <button className="panel-close-btn" onClick={toggleLyricsPanel}>
            <Close />
          </button>
        </div>
      </div>

      <div className="lyrics-content">
        {isLoading && (
          <div className="empty-state small">
            <div className="loading-spinner" />
          </div>
        )}

        {error && (
          <div className="empty-state small">
            <p className="empty-state-subtitle" style={{ color: '#e22134' }}>{error}</p>
          </div>
        )}

        {!isLoading && !currentLyrics && (
          <div className="empty-state small">
            <div className="empty-state-icon" style={{ fontSize: 48 }}>
              <LyricsIcon />
            </div>
            <p className="empty-state-subtitle">暂无歌词</p>
            <p className="empty-state-hint">点击上方按钮导入 LRC 歌词文件</p>
          </div>
        )}

        {!isLoading && currentLyrics && currentLyrics.parsed.length === 0 && (
          <div className="empty-state small">
            <p className="empty-state-subtitle">歌词格式不正确</p>
          </div>
        )}

        {!isLoading && currentLyrics && currentLyrics.parsed.length > 0 && (
          <div ref={containerRef} className="lyrics-lines">
            {currentLyrics.parsed.map((line, index) => (
              <div
                key={index}
                className={`lyrics-line ${index === activeIndex ? 'active' : ''}`}
                onClick={() => handleLineClick(line.time)}
              >
                {line.text || '\u00A0'}
              </div>
            ))}
            <div style={{ height: '50%' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LyricsPanel;
