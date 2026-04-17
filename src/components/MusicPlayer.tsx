import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipForward } from 'lucide-react';
import { synth } from '../lib/synth';

const TRACKS = [
  'CYBER_DIRGE.exe',
  'NULL_POINTER_EXCEPTION',
  'NEURAL_DECAY'
];

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [visualizerHeights, setVisualizerHeights] = useState<number[]>(Array(12).fill(10));

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      synth.playTrack(currentTrackIdx);
      interval = window.setInterval(() => {
        setVisualizerHeights(prev => prev.map(() => Math.max(10, Math.random() * 100)));
      }, 100);
    } else {
      synth.stop();
      setVisualizerHeights(Array(12).fill(10));
    }
    return () => {
      window.clearInterval(interval);
    };
  }, [isPlaying, currentTrackIdx]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const skipTrack = () => {
    setCurrentTrackIdx((prev) => (prev + 1) % TRACKS.length);
    if (!isPlaying) setIsPlaying(true);
  };

  return (
    <div id="music-player-container" className="border border-cyan-500 bg-black p-4 w-64 shadow-[0_0_15px_rgba(0,255,255,0.3)]">
      <div id="audio-subsystem-label" className="text-xs text-magenta-500 mb-1 tracking-widest uppercase">
        Audio Subsystem
      </div>
      
      <div id="track-name-ticker" className="text-cyan-400 mb-4 h-8 flex items-center overflow-hidden whitespace-nowrap border-b border-cyan-900 pb-2">
        <span className={isPlaying ? 'glitch-text text-xl' : 'text-xl'} data-text={TRACKS[currentTrackIdx]}>
          {TRACKS[currentTrackIdx]}
        </span>
      </div>

      <div id="media-controls-wrapper" className="flex justify-between items-center bg-cyan-950 p-2 rounded-sm border border-cyan-800">
        <button 
          id="music-play-pause-btn"
          onClick={togglePlay} 
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-cyan-400 hover:text-white hover:drop-shadow-[0_0_8px_cyan] transition-all focus:outline-none"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        
        <div id="track-progress-bar" className="flex-1 px-4">
          <div className="h-1 w-full bg-black relative">
            {isPlaying && (
              <div className="absolute inset-0 bg-cyan-500 animate-pulse opacity-50" />
            )}
            <div className="h-full bg-magenta-500 
                transition-all duration-[200ms]" 
                style={{ width: isPlaying ? `${Math.random() * 100}%` : '0%' }} 
            />
          </div>
        </div>

        <button 
          id="music-skip-btn"
          onClick={skipTrack} 
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-cyan-400 hover:text-white hover:drop-shadow-[0_0_8px_cyan] transition-all focus:outline-none"
        >
          <SkipForward size={24} />
        </button>
      </div>

      {/* Visualizer bars */}
      <div id="audio-visualizer-container" className="flex gap-1 h-6 mt-4 items-end justify-center">
        {visualizerHeights.map((height, i) => (
          <motion.div 
            key={i} 
            className="w-2 bg-cyan-500"
            transition={{ duration: 0.1 }}
            animate={{ 
              height: `${height}%`,
              backgroundColor: Math.random() > 0.8 ? '#FF00FF' : '#00FFFF'
            }}
          />
        ))}
      </div>
    </div>
  );
}
