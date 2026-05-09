import React, { useEffect, useRef, useState } from 'react';
import { useUIStore } from '../stores/uiStore';
import { Bar, Wave, Circle } from './Icons';

interface VisualizerProps {
  analyser: AnalyserNode;
}

const Visualizer: React.FC<VisualizerProps> = ({ analyser }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const { visualizerMode, setVisualizerMode } = useUIStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resizeCanvas();

    const drawBars = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      
      analyser.getByteFrequencyData(dataArray);
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, width, height);

      const barCount = 64;
      const barWidth = width / barCount;
      
      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor(i * bufferLength / barCount);
        const barHeight = (dataArray[dataIndex] / 255) * height * 0.9;
        
        const hue = (i / barCount) * 120 + 120;
        const saturation = 70;
        const lightness = 50 + (dataArray[dataIndex] / 255) * 20;
        
        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        
        const x = i * barWidth;
        const y = height - barHeight;
        
        ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
      }

      animationRef.current = requestAnimationFrame(drawBars);
    };

    const drawWave = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      
      analyser.getByteTimeDomainData(dataArray);
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, width, height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#1db954';
      ctx.beginPath();

      const sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(29, 185, 84, 0.3)';
      ctx.beginPath();
      x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2 + 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }
      ctx.stroke();

      animationRef.current = requestAnimationFrame(drawWave);
    };

    const drawCircle = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.35;
      
      analyser.getByteFrequencyData(dataArray);
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, width, height);

      const pointCount = 180;
      const angleStep = (Math.PI * 2) / pointCount;

      for (let i = 0; i < pointCount; i++) {
        const dataIndex = Math.floor((i / pointCount) * bufferLength);
        const value = dataArray[dataIndex] / 255;
        const barLength = value * radius * 0.7;
        
        const angle = i * angleStep;
        const innerX = centerX + Math.cos(angle) * radius;
        const innerY = centerY + Math.sin(angle) * radius;
        const outerX = centerX + Math.cos(angle) * (radius + barLength);
        const outerY = centerY + Math.sin(angle) * (radius + barLength);
        
        const hue = (i / pointCount) * 360;
        const saturation = 80;
        const lightness = 50 + value * 20;
        
        ctx.beginPath();
        ctx.moveTo(innerX, innerY);
        ctx.lineTo(outerX, outerY);
        ctx.strokeStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#1db954';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.fillStyle = '#1db954';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
      ctx.fill();

      animationRef.current = requestAnimationFrame(drawCircle);
    };

    const draw = () => {
      switch (visualizerMode) {
        case 'wave':
          drawWave();
          break;
        case 'circle':
          drawCircle();
          break;
        case 'bar':
        default:
          drawBars();
          break;
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [analyser, visualizerMode]);

  return (
    <div className="visualizer">
      <div className="visualizer-header">
        <div className="visualizer-modes">
          <button
            className={`visualizer-mode-btn ${visualizerMode === 'bar' ? 'active' : ''}`}
            onClick={() => setVisualizerMode('bar')}
            title="柱状频谱"
          >
            <Bar />
          </button>
          <button
            className={`visualizer-mode-btn ${visualizerMode === 'wave' ? 'active' : ''}`}
            onClick={() => setVisualizerMode('wave')}
            title="波形图"
          >
            <Wave />
          </button>
          <button
            className={`visualizer-mode-btn ${visualizerMode === 'circle' ? 'active' : ''}`}
            onClick={() => setVisualizerMode('circle')}
            title="圆形频谱"
          >
            <Circle />
          </button>
        </div>
      </div>
      <canvas ref={canvasRef} className="visualizer-canvas" />
    </div>
  );
};

export default Visualizer;
