import React, { useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { CAR_COLORS } from '../data/portfolioData';

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentColorHex: number;
  onSelectColor: (hex: number) => void;
}

export const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  isOpen,
  onClose,
  currentColorHex,
  onSelectColor
}) => {
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
        className="relative w-full max-w-sm bg-slate-900 border-2 border-cyan-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-2.5rem)] h-auto"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Top Accent Line */}
        <div className="h-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 shrink-0" />

        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between gap-4 shrink-0 z-10">
          <div>
            <h3 className="text-base font-black text-white leading-none">Car Paint Customizer</h3>
            <p className="text-[10px] text-cyan-400 font-bold mt-1">Select a custom finish for your vehicle</p>
          </div>

          <button
            onClick={onClose}
            className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto flex-1 min-h-0 overscroll-contain">
          <div className="grid grid-cols-2 gap-3">
            {CAR_COLORS.map((color) => {
              const isSelected = currentColorHex === color.hex;
              return (
                <button
                  key={color.hex}
                  onClick={() => {
                    onSelectColor(color.hex);
                    onClose();
                  }}
                  className={`p-3 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-cyan-400 bg-slate-950 shadow-lg shadow-cyan-500/20'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-full border border-white/20 shrink-0 shadow-inner"
                    style={{ backgroundColor: color.css }}
                  />
                  <span className="text-xs font-bold text-slate-100 truncate">{color.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-cyan-400 ml-auto shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
