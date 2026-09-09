import React from 'react';
import { ChevronLeft, ChevronRight, Zap, RotateCcw } from 'lucide-react';
import type { VehicleControls } from '../types';

interface MobileControlsProps {
  onControlsChange: (updater: (prev: VehicleControls) => VehicleControls) => void;
  onResetCar: () => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({ onControlsChange, onResetCar }) => {
  const handleStart = (key: keyof VehicleControls) => {
    onControlsChange((prev) => ({ ...prev, [key]: true }));
  };

  const handleEnd = (key: keyof VehicleControls) => {
    onControlsChange((prev) => ({ ...prev, [key]: false }));
  };

  return (
    <div className="fixed bottom-3 right-3 z-30 flex items-end justify-end gap-2 pointer-events-auto select-none scale-90 sm:scale-100 origin-bottom-right max-w-full">
      {/* Steering Controls (Left & Right Buttons) */}
      <div className="flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-lg p-1.5 rounded-xl border border-slate-800/90 shadow-xl">
        <button
          onTouchStart={() => handleStart('left')}
          onTouchEnd={() => handleEnd('left')}
          onMouseDown={() => handleStart('left')}
          onMouseUp={() => handleEnd('left')}
          onMouseLeave={() => handleEnd('left')}
          title="Steer Left (A / Left Arrow)"
          className="w-14 h-14 bg-slate-900 active:bg-cyan-500 active:text-slate-950 text-slate-200 border border-slate-800 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg transition-all cursor-pointer hover:border-cyan-500/50"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <button
          onTouchStart={() => handleStart('right')}
          onTouchEnd={() => handleEnd('right')}
          onMouseDown={() => handleStart('right')}
          onMouseUp={() => handleEnd('right')}
          onMouseLeave={() => handleEnd('right')}
          title="Steer Right (D / Right Arrow)"
          className="w-14 h-14 bg-slate-900 active:bg-cyan-500 active:text-slate-950 text-slate-200 border border-slate-800 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg transition-all cursor-pointer hover:border-cyan-500/50"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Action Pedals (Gas, Brake, Boost, Reset) */}
      <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md p-2 rounded-2xl border border-slate-800 shadow-2xl">
        {/* Reset */}
        <button
          onClick={onResetCar}
          title="Reset Car Position (R)"
          className="w-12 h-12 bg-slate-900 text-amber-400 border border-slate-800 rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer hover:border-amber-500/50"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Boost Nitro */}
        <button
          onTouchStart={() => handleStart('boost')}
          onTouchEnd={() => handleEnd('boost')}
          onMouseDown={() => handleStart('boost')}
          onMouseUp={() => handleStart('boost')}
          onMouseLeave={() => handleEnd('boost')}
          title="Nitro Turbo Boost (Shift)"
          className="w-14 h-14 bg-amber-500/20 active:bg-amber-500 text-amber-400 border border-amber-500/40 rounded-xl flex items-center justify-center font-black shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          <Zap className="w-7 h-7" />
        </button>

        {/* Brake / Reverse */}
        <button
          onTouchStart={() => handleStart('backward')}
          onTouchEnd={() => handleEnd('backward')}
          onMouseDown={() => handleStart('backward')}
          onMouseUp={() => handleEnd('backward')}
          onMouseLeave={() => handleEnd('backward')}
          title="Brake / Reverse (S / Down Arrow)"
          className="w-14 h-14 bg-rose-500/20 active:bg-rose-500 text-rose-400 border border-rose-500/40 rounded-xl flex items-center justify-center font-black text-xs shadow-lg shadow-rose-500/20 cursor-pointer"
        >
          BRAKE
        </button>

        {/* Gas / Forward */}
        <button
          onTouchStart={() => handleStart('forward')}
          onTouchEnd={() => handleEnd('forward')}
          onMouseDown={() => handleStart('forward')}
          onMouseUp={() => handleEnd('forward')}
          onMouseLeave={() => handleEnd('forward')}
          title="Drive Forward (W / Up Arrow)"
          className="w-16 h-16 bg-cyan-500 hover:bg-cyan-400 text-slate-950 border border-cyan-400 rounded-2xl flex items-center justify-center font-black text-base shadow-xl shadow-cyan-500/30 active:scale-95 cursor-pointer"
        >
          GAS
        </button>
      </div>
    </div>
  );
};
