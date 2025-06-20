'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";

interface AudioProgressBarProps {
  audio: HTMLAudioElement | null;
  isPlaying: boolean;
}

export default function AudioProgressBar({ audio, isPlaying }: AudioProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      if (!isDragging && audio.duration > 0) {
        const currentProgress = (audio.currentTime / audio.duration) * 100;
        setProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [audio, isDragging]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audio || !duration || duration === 0) return;
    
    const value = parseFloat(e.target.value);
    const newTime = (value / 100) * duration;
    
    if (!isNaN(newTime) && newTime >= 0 && newTime <= duration) {
      audio.currentTime = newTime;
      setProgress(value);
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!isPlaying && progress === 0) return null;

  return (
    <Card className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t shadow-lg z-50">
      <div className="max-w-3xl mx-auto flex items-center gap-4 p-4">
        <span className="text-sm text-muted-foreground w-12 text-center">
          {formatTime(audio?.currentTime || 0)}
        </span>
        
        <div className="flex-1">
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={Math.max(0, Math.min(100, progress))}
            onChange={handleSliderChange}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-progress"
            style={{
              background: `linear-gradient(to right, #000000 0%, #000000 ${progress}%, #e5e7eb ${progress}%, #e5e7eb 100%)`
            }}
          />
        </div>
        
        <span className="text-sm text-muted-foreground w-12 text-center">
          {formatTime(duration)}
        </span>
      </div>

      <style jsx>{`
        .slider-progress::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #000000;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider-progress::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #000000;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider-progress::-webkit-slider-track {
          height: 8px;
          border-radius: 4px;
        }

        .slider-progress::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: transparent;
        }

        .slider-progress:focus {
          outline: none;
        }

        .slider-progress:hover::-webkit-slider-thumb {
          transform: scale(1.1);
        }

        .slider-progress:hover::-moz-range-thumb {
          transform: scale(1.1);
        }
      `}</style>
    </Card>
  );
}