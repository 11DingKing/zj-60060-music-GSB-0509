import React, { useRef, useEffect, useState } from "react";
import { Music, Clock, Users, TrendingUp } from "./Icons";
import { useLibraryStore } from "../stores/libraryStore";
import { Song } from "../types";
import { formatTime, formatDate, formatDuration } from "../utils/format";

const StatisticsView: React.FC = () => {
  const { songs } = useLibraryStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState<"top" | "recent" | "chart">("top");

  const songsWithPlays = songs.filter((s) => s.playCount > 0);

  const top20Songs = [...songsWithPlays]
    .sort((a, b) => b.playCount - a.playCount)
    .slice(0, 20);

  const recentSongs = [...songsWithPlays]
    .filter((s) => s.lastPlayedAt !== undefined && s.lastPlayedAt > 0)
    .sort((a, b) => (b.lastPlayedAt as number) - (a.lastPlayedAt as number))
    .slice(0, 20);

  const totalPlayTime = songs.reduce(
    (acc, song) => acc + song.playCount * song.duration,
    0,
  );

  const artistStats = songs.reduce(
    (acc, song) => {
      const artist = song.artist || "未知艺术家";
      if (!acc[artist]) {
        acc[artist] = { count: 0, duration: 0 };
      }
      acc[artist].count += song.playCount;
      acc[artist].duration += song.playCount * song.duration;
      return acc;
    },
    {} as Record<string, { count: number; duration: number }>,
  );

  const artistChartData = Object.entries(artistStats)
    .filter(([_, stats]) => stats.count > 0)
    .map(([artist, stats]) => ({ artist, ...stats }))
    .sort((a, b) => b.duration - a.duration);

  useEffect(() => {
    if (
      activeTab !== "chart" ||
      !canvasRef.current ||
      artistChartData.length === 0
    )
      return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2 - 30;
    const radius = Math.min(width, height) / 2 - 80;

    const totalDuration = artistChartData.reduce(
      (acc, item) => acc + item.duration,
      0,
    );

    const colors = [
      "#1db954",
      "#1ed760",
      "#535353",
      "#b3b3b3",
      "#4c1f31",
      "#6d28d9",
      "#0d7377",
      "#e91e63",
      "#ff9800",
      "#795548",
      "#607d8b",
      "#00bcd4",
    ];

    let startAngle = -Math.PI / 2;

    artistChartData.forEach((item, index) => {
      if (item.duration === 0) return;

      const sliceAngle = (item.duration / totalDuration) * Math.PI * 2;
      const endAngle = startAngle + sliceAngle;
      const color = colors[index % colors.length];

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      if (sliceAngle > 0.1) {
        const midAngle = startAngle + sliceAngle / 2;
        const labelRadius = radius * 0.65;
        const labelX = centerX + Math.cos(midAngle) * labelRadius;
        const labelY = centerY + Math.sin(midAngle) * labelRadius;

        const percentage = ((item.duration / totalDuration) * 100).toFixed(1);

        ctx.fillStyle = "#fff";
        ctx.font = "12px -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${percentage}%`, labelX, labelY);
      }

      startAngle = endAngle;
    });

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = "#121212";
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("播放时长", centerX, centerY - 10);
    ctx.font = "14px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillStyle = "#b3b3b3";
    ctx.fillText(formatDuration(totalDuration), centerX, centerY + 12);
  }, [activeTab, artistChartData]);

  const getColorForIndex = (index: number) => {
    const colors = [
      "#1db954",
      "#1ed760",
      "#535353",
      "#b3b3b3",
      "#4c1f31",
      "#6d28d9",
      "#0d7377",
      "#e91e63",
      "#ff9800",
      "#795548",
      "#607d8b",
      "#00bcd4",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="statistics-view">
      <div className="view-header">
        <h2 className="view-title">统计</h2>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon primary">
            <Music />
          </div>
          <div className="stat-info">
            <div className="stat-value">{songs.length}</div>
            <div className="stat-label">歌曲总数</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon secondary">
            <TrendingUp />
          </div>
          <div className="stat-info">
            <div className="stat-value">
              {songsWithPlays.reduce((acc, s) => acc + s.playCount, 0)}
            </div>
            <div className="stat-label">总播放次数</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon accent">
            <Clock />
          </div>
          <div className="stat-info">
            <div className="stat-value">{formatDuration(totalPlayTime)}</div>
            <div className="stat-label">总播放时长</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon muted">
            <Users />
          </div>
          <div className="stat-info">
            <div className="stat-value">{Object.keys(artistStats).length}</div>
            <div className="stat-label">艺术家数量</div>
          </div>
        </div>
      </div>

      <div className="stats-tabs">
        <button
          className={`stats-tab ${activeTab === "top" ? "active" : ""}`}
          onClick={() => setActiveTab("top")}
        >
          播放最多
        </button>
        <button
          className={`stats-tab ${activeTab === "recent" ? "active" : ""}`}
          onClick={() => setActiveTab("recent")}
        >
          最近播放
        </button>
        <button
          className={`stats-tab ${activeTab === "chart" ? "active" : ""}`}
          onClick={() => setActiveTab("chart")}
        >
          按艺术家统计
        </button>
      </div>

      <div className="stats-content">
        {activeTab === "top" && (
          <div className="song-table">
            <div className="song-table-header">
              <div className="table-header-cell">排名</div>
              <div className="table-header-cell">歌曲</div>
              <div className="table-header-cell">艺术家</div>
              <div className="table-header-cell">播放次数</div>
              <div className="table-header-cell">时长</div>
            </div>
            <div className="song-table-body">
              {top20Songs.length === 0 ? (
                <div className="empty-state small">
                  <p className="empty-state-subtitle">暂无播放记录</p>
                </div>
              ) : (
                top20Songs.map((song, index) => (
                  <div key={song.id} className="song-table-row">
                    <div className="table-cell rank-cell">
                      <span
                        className={`rank-number ${index < 3 ? "top" : ""}`}
                        style={
                          index < 3 ? { color: getColorForIndex(index) } : {}
                        }
                      >
                        {index + 1}
                      </span>
                    </div>
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
                      </div>
                      <span className="song-title-text">{song.title}</span>
                    </div>
                    <div className="table-cell">{song.artist}</div>
                    <div className="table-cell">
                      <span className="play-count">{song.playCount} 次</span>
                    </div>
                    <div className="table-cell">
                      {formatTime(song.duration)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "recent" && (
          <div className="song-table">
            <div className="song-table-header">
              <div className="table-header-cell">歌曲</div>
              <div className="table-header-cell">艺术家</div>
              <div className="table-header-cell">播放次数</div>
              <div className="table-header-cell">最后播放</div>
            </div>
            <div className="song-table-body">
              {recentSongs.length === 0 ? (
                <div className="empty-state small">
                  <p className="empty-state-subtitle">暂无最近播放记录</p>
                </div>
              ) : (
                recentSongs.map((song) => (
                  <div key={song.id} className="song-table-row">
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
                      </div>
                      <span className="song-title-text">{song.title}</span>
                    </div>
                    <div className="table-cell">{song.artist}</div>
                    <div className="table-cell">
                      <span className="play-count">{song.playCount} 次</span>
                    </div>
                    <div className="table-cell">
                      <span className="recent-time">
                        {formatDate(song.lastPlayedAt as number)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "chart" && (
          <div className="chart-container">
            {artistChartData.length === 0 ? (
              <div className="empty-state small">
                <p className="empty-state-subtitle">暂无播放统计数据</p>
              </div>
            ) : (
              <>
                <canvas ref={canvasRef} className="pie-chart" />
                <div className="chart-legend">
                  {artistChartData.slice(0, 10).map((item, index) => (
                    <div key={item.artist} className="legend-item">
                      <span
                        className="legend-color"
                        style={{ backgroundColor: getColorForIndex(index) }}
                      />
                      <span className="legend-name">{item.artist}</span>
                      <span className="legend-duration">
                        {formatDuration(item.duration)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsView;
