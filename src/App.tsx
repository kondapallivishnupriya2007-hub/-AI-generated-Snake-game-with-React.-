import React from 'react';
import { motion } from 'motion/react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      id="app-container" 
      className="min-h-screen scanlines crt-flicker flex items-center justify-center p-4 relative"
    >
      <div id="background-gradient" className="absolute inset-0 pointer-events-none opacity-20 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-magenta-900 via-black to-black" />
      
      <div id="main-layout" className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-center z-10">
        
        {/* Left Side (Decorative/Info) */}
        <motion.div 
          id="system-logs-panel"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="hidden md:flex flex-col gap-4 text-cyan-800 font-pixel"
        >
          <div className="uppercase tracking-widest text-xs border-b border-cyan-900 pb-2">System Logs //</div>
          <div className="animate-pulse">Loading core modules... OK</div>
          <div>Initializing audio synthesis... OK</div>
          <div>Neural net handshake... ESTABLISHED</div>
          <div className="mt-8 opacity-50">
            WARNING: Unstable frequency detected in Sector 4.
          </div>
          <div className="glitch-text text-magenta-900 mt-4" data-text="0x000F8A">0x000F8A</div>
        </motion.div>

        {/* Center: Game */}
        <motion.div 
          id="game-center-panel"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center"
        >
          <h1 id="game-title" className="text-6xl font-pixel glitch-text tracking-widest mb-8" data-text="NEON_SNAKE">
            NEON_SNAKE
          </h1>
          <SnakeGame />
        </motion.div>

        {/* Right Side: Audio */}
        <motion.div 
          id="audio-right-panel"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center md:items-end gap-8"
        >
          <MusicPlayer />
          
          <div id="status-indicator" className="hidden md:block text-right">
            <div className="border border-magenta-900 p-2 inline-block">
              <div className="text-xs uppercase text-magenta-700 tracking-widest mb-1">Status</div>
              <div className="text-cyan-600">ONLINE // SECURE</div>
            </div>
          </div>
        </motion.div>
        
      </div>
    </motion.div>
  );
}
