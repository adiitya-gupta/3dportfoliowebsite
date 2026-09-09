import React from 'react';
import { X, Terminal, Award } from 'lucide-react';

interface EasterEggModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EasterEggModal: React.FC<EasterEggModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-500/20 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
          <Terminal className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Award className="w-3.5 h-3.5" />
          <span>Secret Developer Terminal</span>
        </div>

        <h3 className="text-2xl font-black text-white">Easter Egg Unlocked!</h3>
        <p className="text-slate-300 text-xs mt-2 leading-relaxed">
          You discovered Aditya Gupta&apos;s secret developer vault! Access granted to 60 FPS WebGL Engine physics controls and raw telemetry parameters.
        </p>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 my-5 text-left font-mono text-[11px] text-emerald-400 flex flex-col gap-1">
          <p>&gt; SYSTEM STATUS: ALL SYSTEMS NOMINAL</p>
          <p>&gt; RAPIER/CANNON PHYSICS: ACTIVE</p>
          <p>&gt; THREE.JS RENDERER: 60 FPS</p>
          <p>&gt; GCP BIGQUERY PIPELINES: ONLINE</p>
          <p>&gt; PYTORCH DL MODELS: TRAINED (72.3% ACC)</p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
        >
          Resume Exploration
        </button>
      </div>
    </div>
  );
};
