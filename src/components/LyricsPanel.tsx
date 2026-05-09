import React, { useState, useEffect, useRef } from 'react';
import { Close, Upload, Lyrics as LyricsIcon } from './Icons';
import { usePlayerStore } from '../stores/playerStore';
import { useUIStore } from '../stores/uiStore';
import { parseLRC, getLyrics, saveLyrics } from '../lib/metadata';
import type { Lyrics } from '../types';

const LyricsPanel: React.FC = () => {
  const { currentSong, currentTime, setCurrentTime } = usePlayerStore();
  const { toggleLyricsPanel } = useUIStore();
  
  const [lyrics, setLyrics] = useState<Lyrics | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!currentSong) {
      setLyrics(null);
      setActiveIndex(-1);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    getLyrics(currentSong.id).then((savedLyrics) => {
      setLyrics(savedLyrics || null);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
      setError('加载歌词失败');
    });
  }, [currentSong]);

  useEffect(() => {
    if (!lyrics || !lyrics.parsed.length) {
      setActiveIndex(-1);
      return;
    }

    let newActiveIndex = -1;
    for (let i = lyrics.parsed.length - 1; i >= 0; i--) {
      if (currentTime >= lyrics.parsed[i].time) {
        newActiveIndex = i;
        break;
      }
    }
    
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
  }, [currentTime, lyrics, activeIndex]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentSong) return;

    setIsLoading(true);
    setError(null);

    try {
      const text = await file.text();
      const parsedLyrics = parseLRC(text);
      
      await saveLyrics(currentSong.id, parsedLyrics);
      setLyrics({
        id: '',
        songId: currentSong.id,
        content: text,
        parsed: parsedLyrics,
      });
    } catch (err) {
      setError('解析歌词文件失败');
    } finally {
      setIsLoading(false);
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

        {!isLoading && !lyrics && (
          <div className="empty-state small">
            <div className="empty-state-icon" style={{ fontSize: 48 }}>
              <LyricsIcon />
            </div>
            <p className="empty-state-subtitle">暂无歌词</p>
            <p className="empty-state-hint">点击上方按钮导入 LRC 歌词文件</p>
          </div>
        )}

        {!isLoading && lyrics && lyrics.parsed.length === 0 && (
          <div className="empty-state small">
            <p className="empty-state-subtitle">歌词格式不正确</p>
          </div>
        )}

        {!isLoading && lyrics && lyrics.parsed.length > 0 && (
          <div ref={containerRef} className="lyrics-lines">
            {lyrics.parsed.map((line, index) => (
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
