import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoadingScreenProps {
  onEnter: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onEnter }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('Loading Physics & WebGL Engine...');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stages = [
      { p: 25, label: 'Initializing 3D Cyber Engine...' },
      { p: 55, label: 'Loading Shaders & Materials...' },
      { p: 85, label: 'Building Cyber-Tech World...' },
      { p: 100, label: 'World Initialized & Ready.' }
    ];

    let current = 0;
    const interval = setInterval(() => {
      current += 5;
      if (current > 100) current = 100;
      setProgress(current);

      const foundStage = stages.find((s) => current <= s.p);
      if (foundStage) setStage(foundStage.label);

      if (current === 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsReady(true);
          onEnter(); // Auto-transition into live 3D world!
        }, 400);
      }
    }, 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 p-6 select-none overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative w-full max-w-lg bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl text-center flex flex-col items-center gap-6">

        {/* Brand Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-3xl shadow-xl shadow-cyan-500/30">
          A
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive 3D Portfolio</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">ADITYA GUPTA</h1>
          <p className="text-slate-400 text-xs mt-1">Data Scientist • ML Engineer • Full-Stack Developer</p>
        </div>

        {/* Progress Bar & Stage Indicator */}
        <div className="w-full flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono text-[11px]">{stage}</span>
            <span className="font-extrabold text-cyan-400 font-mono">{progress}%</span>
          </div>
          <div className="w-full h-3 bg-slate-950 border border-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-150 shadow-lg shadow-cyan-500/40"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Enter Button when ready */}
        {isReady ? (
          <button
            onClick={onEnter}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/30 cursor-pointer animate-pulse transition-all"
          >
            <span>Launch Cyber World</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>60 FPS WebGL Engine Ready</span>
          </div>
        )}
      </div>
    </div>
  );
};
