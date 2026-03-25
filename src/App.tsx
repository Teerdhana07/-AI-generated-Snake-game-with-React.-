import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 font-digital overflow-hidden relative flex flex-col uppercase">
      <div className="static-noise"></div>
      
      <header className="w-full p-4 border-b-4 border-fuchsia-600 flex justify-between items-center relative z-10 bg-black screen-tear">
        <div className="bg-fuchsia-600 text-black px-4 py-1 font-bold text-3xl tracking-widest shadow-[4px_4px_0px_#00FFFF]">
          SYS.OP.SNAKE
        </div>
        <div className="text-cyan-400 text-2xl glitch" data-text="ERR_CODE: 0x00F">
          ERR_CODE: 0x00F
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-8 p-8 z-10 w-full max-w-7xl mx-auto">
        <div className="flex-1 w-full flex justify-center screen-tear" style={{ animationDelay: '1.2s' }}>
          <SnakeGame />
        </div>
        
        <div className="w-full lg:w-96 flex flex-col gap-8">
          <div className="border-4 border-cyan-500 bg-black p-4 shadow-[8px_8px_0px_#FF00FF] screen-tear" style={{ animationDelay: '2.7s' }}>
            <h2 className="text-3xl font-bold text-fuchsia-500 mb-4 border-b-4 border-fuchsia-500 pb-2 glitch" data-text="DIRECTIVE_">DIRECTIVE_</h2>
            <p className="text-cyan-300 text-xl leading-tight space-y-2">
              <span className="block">&gt; INITIATE GRID TRAVERSAL.</span>
              <span className="block">&gt; CONSUME MAGENTA DATA PACKETS.</span>
              <span className="block">&gt; AVOID SYSTEM BOUNDARIES.</span>
              <span className="block">&gt; AVOID SELF-INTERSECTION.</span>
              <span className="block">&gt; AUDIO SUBSYSTEM LINKED.</span>
            </p>
          </div>
          
          <MusicPlayer />
        </div>
      </main>
    </div>
  );
}
