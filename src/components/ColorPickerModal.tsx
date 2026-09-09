import React from 'react';
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-xl font-extrabold text-white mb-1">Car Paint Customizer</h3>
        <p className="text-xs text-slate-400 mb-5">Select a custom color finish for your 3D vehicle</p>

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
                className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                  isSelected
                    ? 'border-cyan-400 bg-slate-950 shadow-lg shadow-cyan-500/20'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full border border-white/20 shrink-0 shadow-inner"
                  style={{ backgroundColor: color.css }}
                />
                <span className="text-xs font-semibold text-slate-200 truncate">{color.name}</span>
                {isSelected && <Check className="w-4 h-4 text-cyan-400 ml-auto" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
