import React, { useEffect } from 'react';
import { X, Terminal, Award } from 'lucide-react';

interface EasterEggModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EasterEggModal: React.FC<EasterEggModalProps> = ({ isOpen, onClose }) => {
  // Listen for Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200 overflow-hidden"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-slate-900 border-2 border-emerald-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-2.5rem)] h-auto text-center"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Top Accent Line */}
        <div className="h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 shrink-0" />

        {/* HEADER */}
        <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between gap-4 shrink-0 z-10">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">Secret Developer Terminal</span>
          </div>

          <button
            onClick={onClose}
            className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Close</span>
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0 flex flex-col items-center gap-3 overscroll-contain">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <Terminal className="w-7 h-7" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Easter Egg Unlocked!</span>
          </div>

          <p className="text-slate-200 text-xs font-medium leading-relaxed">
            You discovered Aditya Gupta&apos;s secret developer vault! Access granted to 60 FPS WebGL Engine physics controls and raw telemetry parameters.
          </p>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 w-full text-left font-mono text-[11px] text-emerald-400 flex flex-col gap-1 shadow-inner">
            <p>&gt; SYSTEM STATUS: ALL SYSTEMS NOMINAL</p>
            <p>&gt; RAPIER/CANNON PHYSICS: ACTIVE</p>
            <p>&gt; THREE.JS RENDERER: 60 FPS</p>
            <p>&gt; GCP BIGQUERY PIPELINES: ONLINE</p>
            <p>&gt; PYTORCH DL MODELS: TRAINED (72.3% ACC)</p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-3 px-6 bg-slate-950 border-t border-slate-800 flex items-center justify-center shrink-0 z-10">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            Resume Exploration
          </button>
        </div>
      </div>
    </div>
  );
};
