import React from 'react';
import { Zap, Navigation } from 'lucide-react';
import type { VehicleStats } from '../types';

interface SpeedometerProps {
  stats: VehicleStats;
}

export const Speedometer: React.FC<SpeedometerProps> = ({ stats }) => {
  const speed = stats.speedKmh;
  const maxSpeed = 160;
  const speedPercentage = Math.min(100, (speed / maxSpeed) * 100);

  return (
    <div className="fixed bottom-[145px] left-3 sm:bottom-3 sm:left-3 z-20 flex flex-col gap-1.5 pointer-events-none select-none max-w-[190px] sm:max-w-xs scale-90 sm:scale-100 origin-bottom-left">
      {/* Current Zone Badge */}
      <div className="bg-slate-950/90 backdrop-blur-lg border border-slate-800/90 rounded-lg p-1 px-2.5 flex items-center gap-1.5 text-[10px] text-slate-300 w-max shadow-md">
        <Navigation className="w-3 h-3 text-cyan-400 animate-pulse shrink-0" />
        <span className="text-slate-400 font-medium">Zone:</span>
        <span className="font-bold text-cyan-300 truncate max-w-[120px]">{stats.currentZone}</span>
      </div>

      {/* Speedometer & Nitro Compact Panel */}
      <div className="bg-slate-950/90 backdrop-blur-lg border border-slate-800/90 rounded-xl p-2 px-3 shadow-xl flex items-center gap-2.5">
        {/* Speedometer Circular Arc Representation */}
        <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="40"
              className="text-slate-800/80"
              strokeWidth="12"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Speed Value Track */}
            <circle
              cx="50"
              cy="50"
              r="40"
              className={`${stats.isBoosting ? 'text-cyan-400' : 'text-blue-500'} transition-all duration-150`}
              strokeWidth="12"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * speedPercentage) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-black text-white leading-none">{speed}</span>
            <span className="text-[7px] text-slate-400 font-bold tracking-tighter leading-none mt-0.5">KM/H</span>
          </div>
        </div>

        {/* Nitro Gauge Bar */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px] leading-none">
            <span className="flex items-center gap-1 font-extrabold text-slate-300">
              <Zap className={`w-3 h-3 ${stats.isBoosting ? 'text-cyan-400 animate-bounce' : 'text-amber-400'}`} />
              NITRO
            </span>
            <span className="font-mono text-cyan-400 font-bold">{Math.round(stats.nitroLevel)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full border border-slate-800 overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-100 ${
                stats.isBoosting
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse shadow-md shadow-cyan-500/50'
                  : 'bg-gradient-to-r from-amber-500 to-cyan-400'
              }`}
              style={{ width: `${stats.nitroLevel}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
