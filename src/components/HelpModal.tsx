import React from 'react';
import { X, Navigation, Zap, RotateCcw, HelpCircle } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
          <HelpCircle className="w-4 h-4" />
          <span>Interactive Guide</span>
        </div>
        <h3 className="text-2xl font-black text-white mb-4">How To Explore</h3>

        <div className="flex flex-col gap-4 text-xs text-slate-300">
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <span className="font-semibold">Steer & Drive</span>
            <div className="flex gap-1 font-mono">
              <span className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-white font-bold">W A S D</span>
              <span className="text-slate-500">/</span>
              <span className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-white font-bold">ARROWS</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <span className="font-semibold flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Nitro Turbo Boost
            </span>
            <span className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-white font-bold font-mono">SHIFT</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <span className="font-semibold flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-rose-400" />
              Handbrake / Flip Car
            </span>
            <div className="flex gap-1 font-mono">
              <span className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-white font-bold">SPACE</span>
              <span className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-white font-bold">R</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <span className="font-semibold flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-cyan-400" />
              Quick Teleport
            </span>
            <span className="text-slate-400">Click any navbar link at top</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all"
        >
          Got It, Start Driving!
        </button>
      </div>
    </div>
  );
};
