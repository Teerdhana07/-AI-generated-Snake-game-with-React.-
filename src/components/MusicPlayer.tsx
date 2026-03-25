import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: 'CYBER_HORIZON.WAV', artist: 'AI_GEN_ALPHA', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'GRID_RUNNER.FLAC', artist: 'AI_GEN_BETA', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'DIGITAL_AFTERGLOW.OGG', artist: 'AI_GEN_GAMMA', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  return (
    <div className="border-4 border-fuchsia-600 bg-black p-6 shadow-[8px_8px_0px_#00FFFF] w-full max-w-md mx-auto flex flex-col gap-6 screen-tear" style={{ animationDelay: '0.5s' }}>
      <div className="border-b-4 border-cyan-500 pb-2 flex justify-between items-end">
        <h3 className="text-cyan-400 font-bold text-3xl glitch" data-text="AUDIO_SUBSYS">AUDIO_SUBSYS</h3>
        <span className="text-fuchsia-500 text-2xl">[{isPlaying ? 'ACTIVE' : 'IDLE'}]</span>
      </div>

      <div className="bg-gray-900 border-4 border-fuchsia-600 p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(0deg,transparent,transparent_4px,#00FFFF_4px,#00FFFF_8px)] pointer-events-none"></div>
        <p className="text-fuchsia-400 text-2xl truncate">&gt; FILE: {currentTrack.title}</p>
        <p className="text-cyan-500 text-xl truncate">&gt; AUTH: {currentTrack.artist}</p>
        
        <div className="flex items-end gap-1 h-16 mt-6">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className={`flex-1 bg-cyan-400 ${isPlaying ? 'animate-pulse' : ''}`}
              style={{ 
                height: isPlaying ? `${Math.random() * 100}%` : '10%', 
                transition: 'height 0.1s',
                opacity: Math.random() * 0.5 + 0.5
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex gap-4">
          <button onClick={prevTrack} className="flex-1 bg-cyan-600 text-black py-2 text-2xl font-bold hover:bg-fuchsia-500 hover:text-white transition-colors shadow-[4px_4px_0px_#FF00FF]">
            {'<<'}
          </button>
          <button onClick={togglePlay} className="flex-[2] bg-fuchsia-600 text-black py-2 text-2xl font-bold hover:bg-cyan-400 transition-colors shadow-[4px_4px_0px_#00FFFF]">
            {isPlaying ? 'HALT' : 'EXEC'}
          </button>
          <button onClick={nextTrack} className="flex-1 bg-cyan-600 text-black py-2 text-2xl font-bold hover:bg-fuchsia-500 hover:text-white transition-colors shadow-[4px_4px_0px_#FF00FF]">
            {'>>'}
          </button>
        </div>
        
        <div className="flex flex-col border-2 border-cyan-500 p-2">
          <span className="text-cyan-400 text-xl mb-2">VOL_LVL</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-4 bg-gray-800 appearance-none cursor-pointer accent-fuchsia-500"
          />
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={nextTrack}
      />
    </div>
  );
}
