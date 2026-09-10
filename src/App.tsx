import React, { useEffect, useRef, useState } from 'react';
import { SceneManager } from './three/SceneManager';
import { Navbar } from './components/Navbar';
import { Speedometer } from './components/Speedometer';
import { MobileControls } from './components/MobileControls';
import { ProjectModal } from './components/ProjectModal';
import { ContactModal } from './components/ContactModal';
import { ColorPickerModal } from './components/ColorPickerModal';
import { HelpModal } from './components/HelpModal';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { ResumeModal } from './components/ui/ResumeModal';
import { AboutModal } from './components/ui/AboutModal';
import { EasterEggModal } from './components/ui/EasterEggModal';
import { TraditionalPortfolio } from './components/ui/TraditionalPortfolio';
import { NavigationMenuModal } from './components/ui/NavigationMenuModal';
import { MobileOnboardingOverlay } from './components/ui/MobileOnboardingOverlay';
import type { VehicleControls, VehicleStats, Project, EnvironmentTheme } from './types/index';
import { soundManager } from './utils/sound';

export const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneManagerRef = useRef<SceneManager | null>(null);

  // App Loading & View Mode State
  const [isLoading, setIsLoading] = useState(false);
  const [is3DMode, setIs3DMode] = useState(true);
  const [theme, setTheme] = useState<EnvironmentTheme>('day');

  // Control State
  const controlsRef = useRef<VehicleControls>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false,
    boost: false
  });

  const resetControls = () => {
    controlsRef.current = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      brake: false,
      boost: false
    };
  };

  // UI State
  const [vehicleStats, setVehicleStats] = useState<VehicleStats>({
    speedKmh: 0,
    nitroLevel: 100,
    isBoosting: false,
    currentZone: 'Start Plaza'
  });

  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isEasterEggOpen, setIsEasterEggOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [currentColorHex, setCurrentColorHex] = useState<number>(0x00f3ff);

  useEffect(() => {
    if (!is3DMode || !canvasRef.current) return;

    // Initialize 3D Scene Manager
    const manager = new SceneManager(canvasRef.current, {
      onVehicleStatsUpdate: (stats) => setVehicleStats(stats),
      onProjectTrigger: (project) => setActiveProject(project),
      onContactTrigger: (active) => setIsContactOpen(active),
      onAboutTrigger: (active) => setIsAboutOpen(active),
      onResumeTrigger: (active) => setIsResumeOpen(active),
      onEasterEggTrigger: (active) => setIsEasterEggOpen(active)
    });
    sceneManagerRef.current = manager;
    manager.applyTheme(theme);
    manager.setCarColor(currentColorHex);

    // Keyboard Event Listener
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      soundManager.init();
      const key = e.key.toLowerCase();
      const code = e.code;

      if (key === 'w' || key === 'arrowup' || code === 'KeyW' || code === 'ArrowUp') {
        controlsRef.current.forward = true;
      }
      if (key === 's' || key === 'arrowdown' || code === 'KeyS' || code === 'ArrowDown') {
        controlsRef.current.backward = true;
      }
      if (key === 'a' || key === 'arrowleft' || code === 'KeyA' || code === 'ArrowLeft') {
        controlsRef.current.left = true;
      }
      if (key === 'd' || key === 'arrowright' || code === 'KeyD' || code === 'ArrowRight') {
        controlsRef.current.right = true;
      }
      if (key === ' ' || key === 'space' || code === 'Space') {
        e.preventDefault();
        controlsRef.current.brake = true;
      }
      if (key === 'shift' || code === 'ShiftLeft' || code === 'ShiftRight') {
        controlsRef.current.boost = true;
      }
      if (key === 'r' || code === 'KeyR') {
        manager.resetVehicle();
      }
      if (key === 'p' || code === 'KeyP') {
        const debugState = manager.toggleDebugMode();
        setIsDebugMode(debugState);
      }
      if (key === 'm' || code === 'KeyM') {
        setIsMenuOpen((prev) => !prev);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const code = e.code;

      if (key === 'w' || key === 'arrowup' || code === 'KeyW' || code === 'ArrowUp') {
        controlsRef.current.forward = false;
      }
      if (key === 's' || key === 'arrowdown' || code === 'KeyS' || code === 'ArrowDown') {
        controlsRef.current.backward = false;
      }
      if (key === 'a' || key === 'arrowleft' || code === 'KeyA' || code === 'ArrowLeft') {
        controlsRef.current.left = false;
      }
      if (key === 'd' || key === 'arrowright' || code === 'KeyD' || code === 'ArrowRight') {
        controlsRef.current.right = false;
      }
      if (key === ' ' || key === 'space' || code === 'Space') {
        controlsRef.current.brake = false;
      }
      if (key === 'shift' || code === 'ShiftLeft' || code === 'ShiftRight') {
        controlsRef.current.boost = false;
      }
    };

    const handleBlur = () => {
      resetControls();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    // Render Loop
    let animationFrameId: number;
    const animate = () => {
      manager.update(controlsRef.current);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      cancelAnimationFrame(animationFrameId);
      manager.dispose();
    };
  }, [isLoading, is3DMode]);

  const handleTeleport = (id: string) => {
    resetControls();
    sceneManagerRef.current?.teleportToZone(id);
  };

  const handleMenuNavigate = (sectionId: string) => {
    resetControls();
    if (sectionId === 'resume') {
      setIsResumeOpen(true);
    } else if (sectionId === 'contact') {
      setIsContactOpen(true);
    } else if (sectionId === 'about') {
      setIsAboutOpen(true);
    } else {
      handleTeleport(sectionId);
    }
  };

  const handleResetCar = () => {
    resetControls();
    sceneManagerRef.current?.resetVehicle();
  };

  const handleResetCrates = () => {
    sceneManagerRef.current?.resetCrates();
  };

  const handleSelectColor = (hex: number) => {
    setCurrentColorHex(hex);
    sceneManagerRef.current?.setCarColor(hex);
  };

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleTheme = () => {
    const newTheme = theme === 'night' ? 'day' : 'night';
    setTheme(newTheme);
    sceneManagerRef.current?.applyTheme(newTheme);
  };

  const handleToggleDebug = () => {
    const debugState = sceneManagerRef.current?.toggleDebugMode() ?? false;
    setIsDebugMode(debugState);
  };

  // Canvas Direct Touch Drag Driving Handlers (Bruno Simon signature touch drag navigation)
  const canvasTouchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    soundManager.init();
    canvasTouchStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasTouchStartRef.current) return;
    const dx = e.clientX - canvasTouchStartRef.current.x;
    const dy = e.clientY - canvasTouchStartRef.current.y;

    controlsRef.current.left = dx < -15;
    controlsRef.current.right = dx > 15;
    controlsRef.current.forward = dy < -15;
    controlsRef.current.backward = dy > 15;
  };

  const handleCanvasPointerUp = () => {
    canvasTouchStartRef.current = null;
    controlsRef.current.left = false;
    controlsRef.current.right = false;
    controlsRef.current.forward = false;
    controlsRef.current.backward = false;
  };

  const handleTouchControlChange = (updater: (prev: VehicleControls) => VehicleControls) => {
    controlsRef.current = updater(controlsRef.current);
  };

  if (!is3DMode) {
    return <TraditionalPortfolio onReturnTo3D={() => setIs3DMode(true)} />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none">
      {/* Three.js WebGL Canvas - with Bruno Simon touch drag support */}
      <canvas
        ref={canvasRef}
        onPointerDown={handleCanvasPointerDown}
        onPointerMove={handleCanvasPointerMove}
        onPointerUp={handleCanvasPointerUp}
        onPointerCancel={handleCanvasPointerUp}
        className="w-full h-full block cursor-pointer touch-none"
      />

      {/* Loading Overlay */}
      {isLoading && (
        <LoadingScreen onEnter={() => setIsLoading(false)} />
      )}

      {/* Header Navbar */}
      <Navbar
        currentZone={vehicleStats.currentZone}
        isMuted={isMuted}
        theme={theme}
        is3DMode={is3DMode}
        isDebugMode={isDebugMode}
        onTeleport={handleTeleport}
        onToggleMute={handleToggleMute}
        onToggleTheme={handleToggleTheme}
        onToggle3DMode={() => setIs3DMode(false)}
        onToggleDebug={handleToggleDebug}
        onResetCar={handleResetCar}
        onResetCrates={handleResetCrates}
        onOpenColorPicker={() => setIsColorPickerOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
      />

      {/* Speedometer & Nitro Overlay */}
      <Speedometer stats={vehicleStats} />

      {/* Mobile Drive & Navigation Initial Guidance Banner */}
      <MobileOnboardingOverlay />

      {/* On-Screen Touch / Mouse Controls */}
      <MobileControls
        onControlsChange={handleTouchControlChange}
        onResetCar={handleResetCar}
      />

      {/* Interactive Modals */}
      <NavigationMenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={handleMenuNavigate}
      />

      {/* Interactive Modals */}
      <ProjectModal
        project={activeProject}
        onClose={() => {
          setActiveProject(null);
          resetControls();
        }}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => {
          setIsContactOpen(false);
          resetControls();
        }}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => {
          setIsAboutOpen(false);
          resetControls();
        }}
      />

      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => {
          setIsResumeOpen(false);
          resetControls();
        }}
      />

      <EasterEggModal
        isOpen={isEasterEggOpen}
        onClose={() => {
          setIsEasterEggOpen(false);
          resetControls();
        }}
      />

      <ColorPickerModal
        isOpen={isColorPickerOpen}
        onClose={() => setIsColorPickerOpen(false)}
        currentColorHex={currentColorHex}
        onSelectColor={handleSelectColor}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
};

export default App;
