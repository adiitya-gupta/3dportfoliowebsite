import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, RotateCcw, Gamepad2, Disc } from 'lucide-react';
import type { VehicleControls } from '../types';

interface MobileControlsProps {
  onControlsChange: (updater: (prev: VehicleControls) => VehicleControls) => void;
  onResetCar: () => void;
}

type ControlMode = 'joystick' | 'buttons';

export const MobileControls: React.FC<MobileControlsProps> = ({ onControlsChange, onResetCar }) => {
  const [controlMode, setControlMode] = useState<ControlMode>('buttons');
  const [activeKeys, setActiveKeys] = useState<Record<string, boolean>>({});

  // Virtual Joystick State
  const joystickRef = useRef<HTMLDivElement | null>(null);
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const pointerIdRef = useRef<number | null>(null);
  const joystickCenterRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Trigger Haptic Feedback
  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      try {
        navigator.vibrate(12);
      } catch {
        // Ignore haptic errors on unsupported devices
      }
    }
  };

  const handlePointerDown = (key: keyof VehicleControls, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Ignore pointer capture errors
    }
    triggerHaptic();

    setActiveKeys((prev) => ({ ...prev, [key]: true }));
    onControlsChange((prev) => ({ ...prev, [key]: true }));
  };

  const handlePointerUp = (key: keyof VehicleControls, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore release capture errors
    }

    setActiveKeys((prev) => ({ ...prev, [key]: false }));
    onControlsChange((prev) => ({ ...prev, [key]: false }));
  };

  // Joystick Pointer Handlers
  const handleJoystickPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    joystickCenterRef.current = { x: centerX, y: centerY };
    pointerIdRef.current = e.pointerId;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore capture errors
    }

    setJoystickActive(true);
    updateJoystickPosition(e.clientX, e.clientY, rect.width / 2);
    triggerHaptic();
  };

  const handleJoystickPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!joystickActive || pointerIdRef.current !== e.pointerId) return;
    e.preventDefault();

    const maxRadius = 45; // Max pixel offset
    updateJoystickPosition(e.clientX, e.clientY, maxRadius);
  };

  const handleJoystickPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== e.pointerId) return;
    e.preventDefault();

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }

    pointerIdRef.current = null;
    setJoystickActive(false);
    setJoystickPos({ x: 0, y: 0 });

    // Reset Steering & Acceleration from Joystick
    onControlsChange((prev) => ({
      ...prev,
      left: false,
      right: false,
      forward: prev.forward && activeKeys.forward ? true : false,
      backward: prev.backward && activeKeys.backward ? true : false
    }));
  };

  const updateJoystickPosition = (clientX: number, clientY: number, maxRadius: number) => {
    const dx = clientX - joystickCenterRef.current.x;
    const dy = clientY - joystickCenterRef.current.y;
    const distance = Math.hypot(dx, dy);

    const clampedDist = Math.min(distance, maxRadius);
    const angle = Math.atan2(dy, dx);

    const normX = clampedDist * Math.cos(angle);
    const normY = clampedDist * Math.sin(angle);

    setJoystickPos({ x: normX, y: normY });

    // Calculate Steering Normalized Value (-1 to 1)
    const steerVal = normX / maxRadius;
    const driveVal = -normY / maxRadius; // Up is forward

    onControlsChange((prev) => ({
      ...prev,
      left: steerVal < -0.2,
      right: steerVal > 0.2,
      forward: driveVal > 0.35 || prev.forward,
      backward: driveVal < -0.35 || prev.backward
    }));
  };

  // Reset all active controls on blur/unmount
  useEffect(() => {
    return () => {
      onControlsChange(() => ({
        forward: false,
        backward: false,
        left: false,
        right: false,
        brake: false,
        boost: false
      }));
    };
  }, [onControlsChange]);

  return (
    <div className="fixed inset-x-0 bottom-3 z-30 pointer-events-none select-none px-3 flex items-end justify-between max-w-7xl mx-auto">
      {/* LEFT SIDE: Steering Controls (Virtual Joystick or Touch D-Pad) */}
      <div className="pointer-events-auto flex flex-col gap-2 items-start">
        {/* Mode Selector Pill */}
        <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-full p-1 flex items-center gap-1 shadow-lg">
          <button
            onClick={() => {
              setControlMode('buttons');
              triggerHaptic();
            }}
            title="D-Pad Touch Buttons"
            className={`px-2.5 py-1 rounded-full text-[10px] font-black flex items-center gap-1 transition-all cursor-pointer ${
              controlMode === 'buttons'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-3 h-3" />
            <span>BUTTONS</span>
          </button>

          <button
            onClick={() => {
              setControlMode('joystick');
              triggerHaptic();
            }}
            title="Bruno Simon Analog Touch Joystick"
            className={`px-2.5 py-1 rounded-full text-[10px] font-black flex items-center gap-1 transition-all cursor-pointer ${
              controlMode === 'joystick'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Disc className="w-3 h-3" />
            <span>JOYSTICK</span>
          </button>
        </div>

        {/* Steering Interface */}
        {controlMode === 'joystick' ? (
          /* Analog Touch Joystick Component */
          <div
            ref={joystickRef}
            onPointerDown={handleJoystickPointerDown}
            onPointerMove={handleJoystickPointerMove}
            onPointerUp={handleJoystickPointerUp}
            onPointerCancel={handleJoystickPointerUp}
            className="relative w-28 h-28 sm:w-32 sm:h-32 bg-slate-950/85 backdrop-blur-md rounded-full border-2 border-slate-800 shadow-2xl flex items-center justify-center touch-none cursor-grab active:cursor-grabbing"
          >
            {/* Outer Ring Accent */}
            <div className="absolute inset-2 rounded-full border border-cyan-500/30 pointer-events-none" />

            {/* Inner Moveable Knob */}
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-xl transition-transform duration-75 flex items-center justify-center border-2 ${
                joystickActive
                  ? 'bg-gradient-to-br from-cyan-400 to-blue-600 border-cyan-300 shadow-cyan-500/50 scale-110'
                  : 'bg-slate-900 border-slate-700 text-cyan-400'
              }`}
              style={{
                transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`
              }}
            >
              <div className="w-4 h-4 rounded-full bg-slate-950/40 border border-white/40" />
            </div>
          </div>
        ) : (
          /* D-Pad Buttons (Steer Left & Right) */
          <div className="flex items-center gap-2 bg-slate-950/90 backdrop-blur-lg p-2 rounded-2xl border border-slate-800 shadow-2xl touch-none">
            <button
              onPointerDown={(e) => handlePointerDown('left', e)}
              onPointerUp={(e) => handlePointerUp('left', e)}
              onPointerCancel={(e) => handlePointerUp('left', e)}
              title="Steer Left"
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-2xl font-black shadow-lg transition-all border touch-none cursor-pointer ${
                activeKeys.left
                  ? 'bg-cyan-500 text-slate-950 border-cyan-300 scale-95 shadow-cyan-500/40'
                  : 'bg-slate-900 text-slate-200 border-slate-800 hover:border-cyan-500/50'
              }`}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              onPointerDown={(e) => handlePointerDown('right', e)}
              onPointerUp={(e) => handlePointerUp('right', e)}
              onPointerCancel={(e) => handlePointerUp('right', e)}
              title="Steer Right"
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-2xl font-black shadow-lg transition-all border touch-none cursor-pointer ${
                activeKeys.right
                  ? 'bg-cyan-500 text-slate-950 border-cyan-300 scale-95 shadow-cyan-500/40'
                  : 'bg-slate-900 text-slate-200 border-slate-800 hover:border-cyan-500/50'
              }`}
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        )}
      </div>

      {/* RIGHT SIDE: Action Controls (Nitro, Reset, Brake, Gas) */}
      <div className="pointer-events-auto flex items-end gap-2 bg-slate-950/90 backdrop-blur-lg p-2 rounded-2xl border border-slate-800 shadow-2xl touch-none scale-95 sm:scale-100 origin-bottom-right">
        {/* Reset Car */}
        <button
          onClick={() => {
            onResetCar();
            triggerHaptic();
          }}
          title="Reset Car (R)"
          className="w-11 h-11 sm:w-12 sm:h-12 bg-slate-900 text-amber-400 border border-slate-800 rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer hover:border-amber-500/50"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Boost Nitro */}
        <button
          onPointerDown={(e) => handlePointerDown('boost', e)}
          onPointerUp={(e) => handlePointerUp('boost', e)}
          onPointerCancel={(e) => handlePointerUp('boost', e)}
          title="Nitro Turbo Boost (Shift)"
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center font-black shadow-lg transition-all border touch-none cursor-pointer ${
            activeKeys.boost
              ? 'bg-amber-500 text-slate-950 border-amber-300 scale-95 shadow-amber-500/50'
              : 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30'
          }`}
        >
          <Zap className="w-7 h-7" />
        </button>

        {/* Brake / Reverse */}
        <button
          onPointerDown={(e) => handlePointerDown('backward', e)}
          onPointerUp={(e) => handlePointerUp('backward', e)}
          onPointerCancel={(e) => handlePointerUp('backward', e)}
          title="Brake / Reverse"
          className={`w-13 h-13 sm:w-15 sm:h-15 rounded-xl flex items-center justify-center font-black text-xs shadow-lg transition-all border touch-none cursor-pointer ${
            activeKeys.backward
              ? 'bg-rose-500 text-white border-rose-300 scale-95 shadow-rose-500/50'
              : 'bg-rose-500/20 text-rose-400 border-rose-500/40 hover:bg-rose-500/30'
          }`}
        >
          BRAKE
        </button>

        {/* Gas / Acceleration */}
        <button
          onPointerDown={(e) => handlePointerDown('forward', e)}
          onPointerUp={(e) => handlePointerUp('forward', e)}
          onPointerCancel={(e) => handlePointerUp('forward', e)}
          title="Drive Forward (W / Up)"
          className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center font-black text-base shadow-xl transition-all border touch-none cursor-pointer ${
            activeKeys.forward
              ? 'bg-cyan-400 text-slate-950 border-white scale-95 shadow-cyan-400/60'
              : 'bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 border-cyan-400 hover:brightness-110 shadow-cyan-500/40'
          }`}
        >
          GAS
        </button>
      </div>
    </div>
  );
};
