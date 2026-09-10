import React, { useEffect } from 'react';
import { X, Navigation, Zap, RotateCcw, HelpCircle } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
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
        className="relative w-full max-w-md bg-slate-900 border-2 border-cyan-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-2.5rem)] h-auto"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Top Accent Line */}
        <div className="h-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 shrink-0" />

        {/* HEADER */}
        <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between gap-4 shrink-0 z-10">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-black text-cyan-400 uppercase tracking-wider">Interactive Controls Guide</span>
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
        <div className="p-4 sm:p-6 overflow-y-auto touch-pan-y flex-1 min-h-0 flex flex-col gap-4 overscroll-contain">
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <span className="font-bold text-white text-xs">Steer & Drive</span>
            <div className="flex gap-1 font-mono">
              <span className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-cyan-300 font-bold text-xs">W A S D</span>
              <span className="text-slate-400 text-xs">/</span>
              <span className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-cyan-300 font-bold text-xs">ARROWS</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <span className="font-bold text-white text-xs flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Nitro Turbo Boost
            </span>
            <span className="bg-slate-900 border border-slate-700 px-2.5 py-1 rounded text-amber-400 font-bold font-mono text-xs">SHIFT</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <span className="font-bold text-white text-xs flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-rose-400" />
              Handbrake / Flip Car
            </span>
            <div className="flex gap-1 font-mono">
              <span className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-rose-300 font-bold text-xs">SPACE</span>
              <span className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-rose-300 font-bold text-xs">R</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <span className="font-bold text-white text-xs flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-cyan-400" />
              Quick Teleport
            </span>
            <span className="text-cyan-300 font-bold text-xs">Click top navbar pills</span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-3 px-6 bg-slate-950 border-t border-slate-800 flex items-center justify-center shrink-0 z-10">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-cyan-500/30"
          >
            Got It, Start Driving!
          </button>
        </div>
      </div>
    </div>
  );
};
