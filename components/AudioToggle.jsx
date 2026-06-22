"use client";

import { useState, useRef, useEffect } from 'react';

export default function AudioToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Try to load ambient audio from public folder
    audioRef.current = new Audio('/ambient.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3; // subtle volume
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Catch potential autoplay restrictions
      audioRef.current.play().catch(e => console.log('Audio play prevented:', e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button 
      onClick={toggleAudio}
      className="audio-toggle"
      aria-label={isPlaying ? "Mute ambient audio" : "Play ambient audio"}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: 'var(--text)',
        fontFamily: 'var(--font-body)',
        fontSize: '0.75rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        transition: 'color 0.3s ease',
      }}
    >
      <span className="audio-bars" style={{ display: 'flex', gap: '2px', height: '12px', alignItems: 'flex-end' }}>
        {[...Array(4)].map((_, i) => (
          <span 
            key={i} 
            style={{
              width: '2px',
              backgroundColor: 'var(--accent)',
              height: isPlaying ? '100%' : '2px',
              animation: isPlaying ? `audioBar 1s ease-in-out infinite alternate ${i * 0.1}s` : 'none',
              transition: 'height 0.3s ease'
            }}
          />
        ))}
      </span>
      <span>{isPlaying ? 'Sound On' : 'Sound Off'}</span>
      
      <style>{`
        @keyframes audioBar {
          0% { height: 2px; }
          100% { height: 12px; }
        }
        .audio-toggle:hover {
          color: var(--accent) !important;
        }
      `}</style>
    </button>
  );
}
