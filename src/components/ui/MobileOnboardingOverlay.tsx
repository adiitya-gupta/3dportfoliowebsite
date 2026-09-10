import React, { useState, useEffect } from 'react';
import { Gamepad2, Compass, Sparkles, X, ChevronRight } from 'lucide-react';

interface MobileOnboardingOverlayProps {
  onDismiss?: () => void;
}

export const MobileOnboardingOverlay: React.FC<MobileOnboardingOverlayProps> = ({ onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-dismiss or check local storage if previously dismissed
  useEffect(() => {
    const hasSeen = localStorage.getItem('has_seen_3d_drive_tutorial');
    if (hasSeen === 'true') {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('has_seen_3d_drive_tutorial', 'true');
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-md pointer-events-auto select-none animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-950/95 backdrop-blur-2xl border-2 border-cyan-400/80 rounded-2xl p-3.5 sm:p-4 shadow-2xl shadow-cyan-500/20 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-white tracking-wide uppercase flex items-center gap-1.5">
                <span>Mobile Drive & Navigation</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </h3>
              <p className="text-[9px] text-cyan-300 font-semibold">Bruno Simon 3D World Controls</p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Instructions Body */}
        <div className="grid grid-cols-2 gap-2 text-left">
          {/* Item 1: Drive */}
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-2.5 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-cyan-400 font-black text-[11px]">
              <Gamepad2 className="w-3.5 h-3.5 shrink-0" />
              <span>1. HOW TO DRIVE</span>
            </div>
            <p className="text-[10px] text-slate-300 leading-snug font-medium">
              Touch & drag <strong className="text-white font-bold">ANYWHERE</strong> on screen OR use the Joystick / Gas pedals on bottom corners.
            </p>
          </div>

          {/* Item 2: Navigate */}
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-2.5 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-black text-[11px]">
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span>2. NAVIGATE</span>
            </div>
            <p className="text-[10px] text-slate-300 leading-snug font-medium">
              Drive into any glowing ring OR tap <strong className="text-white font-bold">MENU / Teleport Pills</strong> at top for 1-tap access!
            </p>
          </div>
        </div>

        {/* Action Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/40 cursor-pointer active:scale-95 transition-all"
        >
          <span>LET'S DRIVE! (GOT IT)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
