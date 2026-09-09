import React from 'react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Palette,
  HelpCircle,
  Boxes,
  Home,
  User,
  Briefcase,
  Milestone,
  Mail,
  Gamepad2,
  Sun,
  Moon,
  FileText,
  Monitor,
  Eye,
  Menu
} from 'lucide-react';
import type { EnvironmentTheme } from '../types/index';
import { TELEPORT_TARGETS } from '../data/portfolio';

interface NavbarProps {
  currentZone: string;
  isMuted: boolean;
  theme: EnvironmentTheme;
  is3DMode: boolean;
  isDebugMode: boolean;
  onTeleport: (id: string) => void;
  onToggleMute: () => void;
  onToggleTheme: () => void;
  onToggle3DMode: () => void;
  onToggleDebug: () => void;
  onResetCar: () => void;
  onResetCrates: () => void;
  onOpenColorPicker: () => void;
  onOpenHelp: () => void;
  onOpenResume: () => void;
  onOpenMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentZone,
  isMuted,
  theme,
  is3DMode,
  isDebugMode,
  onTeleport,
  onToggleMute,
  onToggleTheme,
  onToggle3DMode,
  onToggleDebug,
  onResetCar,
  onResetCrates,
  onOpenColorPicker,
  onOpenHelp,
  onOpenResume,
  onOpenMenu
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Home': return <Home className="w-3.5 h-3.5" />;
      case 'User': return <User className="w-3.5 h-3.5" />;
      case 'Briefcase': return <Briefcase className="w-3.5 h-3.5" />;
      case 'Boxes': return <Boxes className="w-3.5 h-3.5" />;
      case 'Milestone': return <Milestone className="w-3.5 h-3.5" />;
      case 'Mail': return <Mail className="w-3.5 h-3.5" />;
      case 'Gamepad2': return <Gamepad2 className="w-3.5 h-3.5" />;
      default: return <Home className="w-3.5 h-3.5" />;
    }
  };

  return (
    <header className="fixed top-2 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-7xl select-none flex flex-col gap-1.5 items-center">
      {/* Row 1: Brand & Quick Action Controls */}
      <div className="w-full bg-slate-950/90 backdrop-blur-lg border border-slate-800/90 rounded-2xl p-1.5 px-3.5 shadow-2xl flex items-center justify-between gap-3">
        {/* Brand & Name */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-black text-slate-950 text-sm shadow-md shadow-cyan-500/30">
            A
          </div>
          <div>
            <h1 className="font-extrabold text-xs text-white tracking-wider leading-none">ADITYA GUPTA</h1>
            <p className="text-[8px] text-cyan-400 font-semibold tracking-wide leading-tight hidden sm:block">DATA SCIENCE & ML ENGINEER</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Full Portfolio Navigation Menu Button */}
          <button
            onClick={onOpenMenu}
            title="Open Full Portfolio Navigation Menu (Key M)"
            className="p-1 px-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:brightness-110 transition-all text-[11px] font-black flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/30"
          >
            <Menu className="w-4 h-4 text-slate-950" />
            <span>MENU</span>
          </button>

          {/* 2D / 3D Mode Switcher */}
          <button
            onClick={onToggle3DMode}
            title={is3DMode ? 'Switch to Traditional 2D Portfolio' : 'Launch 3D Game World'}
            className="p-1 px-2.5 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-all text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-sm shadow-cyan-500/20"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>{is3DMode ? '2D View' : '3D World'}</span>
          </button>

          {/* Resume Viewer */}
          <button
            onClick={onOpenResume}
            title="View & Download Resume"
            className="p-1 px-2.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-purple-300 hover:text-white hover:border-purple-400 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-black shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Resume</span>
          </button>

          {/* Day/Night Theme Toggle */}
          <button
            onClick={onToggleTheme}
            title={theme === 'night' ? 'Switch to Day Light' : 'Switch to Cyber Night'}
            className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-amber-300 hover:text-white hover:border-amber-400 transition-all cursor-pointer shadow-sm"
          >
            {theme === 'night' ? <Moon className="w-3.5 h-3.5 text-purple-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          {is3DMode && (
            <>
              {/* Reset Crates */}
              <button
                onClick={onResetCrates}
                title="Reset Physics Crates"
                className="p-1 px-2.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-cyan-300 hover:text-white hover:border-cyan-400 transition-all text-xs font-black hidden sm:flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Boxes className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline">Crates</span>
              </button>

              {/* Reset Car */}
              <button
                onClick={onResetCar}
                title="Reset Car Position (R)"
                className="p-1 px-2.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-amber-300 hover:text-white hover:border-amber-400 transition-all text-xs font-black hidden sm:flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Reset</span>
              </button>

              {/* Color Customizer */}
              <button
                onClick={onOpenColorPicker}
                title="Custom Car Paint"
                className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-pink-300 hover:text-white hover:border-pink-400 transition-all cursor-pointer shadow-sm"
              >
                <Palette className="w-3.5 h-3.5 text-pink-400" />
              </button>
            </>
          )}

          {/* Audio Mute */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-emerald-300 hover:text-white hover:border-emerald-400 transition-all cursor-pointer shadow-sm"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          {/* Help & Debug Controls */}
          {is3DMode && (
            <>
              <button
                onClick={onToggleDebug}
                title="Toggle Physics Vectors & Ramp Colliders (Key P)"
                className={`p-1 px-2.5 rounded-lg border transition-all text-xs flex items-center gap-1.5 cursor-pointer font-black shadow-sm ${
                  isDebugMode
                    ? 'bg-amber-500/30 border-amber-400 text-amber-200 shadow-md shadow-amber-500/30'
                    : 'bg-slate-900/90 border-slate-700/80 text-amber-300 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">{isDebugMode ? 'DEBUG ON' : 'DEBUG'}</span>
              </button>

              <button
                onClick={onOpenHelp}
                title="Controls & Instructions"
                className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-cyan-300 hover:text-white hover:border-cyan-400 transition-all cursor-pointer shadow-sm"
              >
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Row 2: Teleport Navigation Links (3D Mode) - Centered Floating Pill Bar */}
      {is3DMode && (
        <nav className="w-full bg-slate-950/95 backdrop-blur-md border border-slate-800/90 rounded-xl p-1.5 px-2 shadow-xl flex items-center justify-start md:justify-center gap-1.5 overflow-x-auto scrollbar-none max-w-full">
          {TELEPORT_TARGETS.map((target) => {
            const isActive = currentZone.toLowerCase().includes(target.label.toLowerCase());
            return (
              <button
                key={target.id}
                onClick={() => onTeleport(target.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 shadow-sm ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/40 border border-cyan-300/60'
                    : 'bg-white text-slate-950 border border-slate-200 hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-400'
                }`}
              >
                {getIcon(target.iconName)}
                <span>{target.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
};
