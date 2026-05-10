import React, { useEffect, useRef, useState } from "react";
import { useLibraryStore } from "./stores/libraryStore";
import { usePlaylistStore } from "./stores/playlistStore";
import { usePlaybackStore } from "./stores/playbackStore";
import { useEqualizerStore } from "./stores/equalizerStore";
import { getAudioBlob } from "./lib/db";
import Layout from "./components/Layout";

const EQ_FREQUENCIES = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const equalizerFiltersRef = useRef<BiquadFilterNode[]>([]);
  const isSeekingRef = useRef(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const { initialize: initializeLibrary } = useLibraryStore();
  const { initialize: initializePlaylists } = usePlaylistStore();
  const { initialize: initializeEqualizer } = useEqualizerStore();
  const { importFiles } = useLibraryStore();

  const {
    isPlaying,
    currentSong,
    currentTime,
    volume,
    isMuted,
    playMode,
    setCurrentTime,
    setDuration,
    playPause,
  } = usePlaybackStore();

  const { next, previous } = usePlaylistStore();

  const { isEnabled: eqEnabled, currentFrequencies } = useEqualizerStore();

  useEffect(() => {
    const init = async () => {
      await initializeLibrary();
      await initializePlaylists();
      await initializeEqualizer();
    };
    init();
  }, [initializeLibrary, initializePlaylists, initializeEqualizer]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = "anonymous";
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      if (!isSeekingRef.current) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (playMode === "repeatOne") {
        audio.currentTime = 0;
        audio.play();
      } else {
        next();
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [setCurrentTime, setDuration, next, playMode]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  useEffect(() => {
    const loadSong = async () => {
      if (!currentSong || !audioRef.current) return;

      const blob = await getAudioBlob(currentSong.audioBlobId);
      if (blob) {
        const url = URL.createObjectURL(blob);
        audioRef.current.src = url;

        if (isPlaying) {
          audioRef.current.play().catch(console.error);
        }
      }
    };

    loadSong();
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const tolerance = 0.1;
    if (Math.abs(currentTime - audio.currentTime) > tolerance) {
      isSeekingRef.current = true;
      audio.currentTime = currentTime;
      setTimeout(() => {
        isSeekingRef.current = false;
      }, 100);
    }
  }, [currentTime]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    }

    const audioContext = audioContextRef.current;

    if (!sourceNodeRef.current) {
      sourceNodeRef.current = audioContext.createMediaElementSource(audio);
    }

    if (!analyserRef.current) {
      analyserRef.current = audioContext.createAnalyser();
      analyserRef.current.fftSize = 256;
    }

    if (equalizerFiltersRef.current.length === 0) {
      EQ_FREQUENCIES.forEach((freq, i) => {
        const filter = audioContext.createBiquadFilter();
        filter.type =
          i === 0
            ? "lowshelf"
            : i === EQ_FREQUENCIES.length - 1
              ? "highshelf"
              : "peaking";
        filter.frequency.value = freq;
        filter.Q.value = 1;
        filter.gain.value = 0;
        equalizerFiltersRef.current.push(filter);
      });
    }

    const source = sourceNodeRef.current;
    const analyser = analyserRef.current;
    const filters = equalizerFiltersRef.current;

    source.disconnect();
    filters.forEach((f) => f.disconnect());
    analyser.disconnect();

    if (eqEnabled) {
      source.connect(filters[0]);
      for (let i = 0; i < filters.length - 1; i++) {
        filters[i].connect(filters[i + 1]);
      }
      filters[filters.length - 1].connect(analyser);
    } else {
      source.connect(analyser);
    }

    analyser.connect(audioContext.destination);

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
  }, [eqEnabled]);

  useEffect(() => {
    const filters = equalizerFiltersRef.current;
    if (!filters.length) return;

    filters.forEach((filter, i) => {
      filter.gain.value = currentFrequencies[i] || 0;
    });
  }, [currentFrequencies]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.code) {
        case "Space":
          e.preventDefault();
          playPause();
          break;
        case "ArrowRight":
          e.preventDefault();
          if (e.shiftKey) {
            next();
          } else {
            const audio = audioRef.current;
            if (audio) {
              audio.currentTime = Math.min(
                audio.currentTime + 5,
                audio.duration,
              );
            }
          }
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (e.shiftKey) {
            previous();
          } else {
            const audio = audioRef.current;
            if (audio) {
              audio.currentTime = Math.max(audio.currentTime - 5, 0);
            }
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          {
            const { setVolume, volume: currentVolume } =
              usePlaybackStore.getState();
            setVolume(Math.min(currentVolume + 0.1, 1));
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          {
            const { setVolume, volume: currentVolume } =
              usePlaybackStore.getState();
            setVolume(Math.max(currentVolume - 0.1, 0));
          }
          break;
        case "KeyN":
          e.preventDefault();
          usePlaylistStore.getState().next();
          break;
        case "KeyP":
          e.preventDefault();
          usePlaylistStore.getState().previous();
          break;
        case "KeyM":
          e.preventDefault();
          {
            const { toggleMute } = usePlaybackStore.getState();
            toggleMute();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playPause, next, previous]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await importFiles(files);
    }
  };

  return (
    <div
      className="app-container"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragOver && (
        <div className="drop-zone">
          <div className="drop-zone-content">
            <div className="drop-zone-icon">
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.47 1.72a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06L12.75 4.56V18.25a.75.75 0 01-1.5 0V4.56L8.03 7.28a.75.75 0 01-1.06-1.06l4.5-4.5z" />
                <path d="M3.75 12a.75.75 0 01.75.75v6.5a.75.75 0 00.75.75h13.5a.75.75 0 00.75-.75v-6.5a.75.75 0 011.5 0v6.5A2.25 2.25 0 0118.75 21H5.25A2.25 2.25 0 013 19.25v-6.5a.75.75 0 01.75-.75z" />
              </svg>
            </div>
            <h2 className="drop-zone-title">释放文件以导入音乐</h2>
            <p className="drop-zone-subtitle">支持 MP3, WAV, OGG, FLAC 格式</p>
          </div>
        </div>
      )}
      <Layout
        audioRef={audioRef}
        analyserRef={analyserRef}
        onSeekStart={() => {
          isSeekingRef.current = true;
        }}
        onSeekEnd={() => {
          isSeekingRef.current = false;
        }}
      />
    </div>
  );
}

export default App;
