import React, { useEffect } from 'react';
import { X, Sparkles, GraduationCap, Brain, Terminal, ShieldCheck } from 'lucide-react';
import { PORTFOLIO_DATA } from '../../data/portfolio';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
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
        className="relative w-full max-w-2xl bg-slate-900 border-2 border-cyan-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-2.5rem)] h-auto"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Top Accent Line */}
        <div className="h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 shrink-0" />

        {/* PERMANENT TOP HEADER WITH CLOSE BUTTON */}
        <div className="bg-slate-900 border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between gap-4 shrink-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider block">3D ABOUT STATION</span>
              <h2 className="text-xl font-black text-white leading-none">{PORTFOLIO_DATA.name}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            title="Close About (Esc)"
            className="py-2 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-500/30 flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
          >
            <X className="w-4 h-4 text-white" />
            <span>Close</span>
          </button>
        </div>

        {/* SCROLLABLE BODY CONTENT */}
        <div className="p-4 sm:p-6 overflow-y-auto touch-pan-y flex-1 min-h-0 flex flex-col gap-5 overscroll-contain">
          {/* Professional Introduction */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col gap-2 shadow-md">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-cyan-400" />
              <span>Professional Introduction & Background</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
              {PORTFOLIO_DATA.bio}
            </p>
          </div>

          {/* Academic Profile */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col gap-2 shadow-md">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span>Academic Specialization & Education</span>
            </h3>
            <p className="text-xs sm:text-sm font-black text-cyan-300">{PORTFOLIO_DATA.education}</p>
            <p className="text-xs font-bold text-slate-300">{PORTFOLIO_DATA.school}</p>
          </div>

          {/* Key Competencies Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-black text-white mb-1.5 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Data Science & ML</span>
              </h4>
              <p className="text-xs text-slate-200 font-medium leading-relaxed">Classification, Regression, CNN Deep Learning in PyTorch, Scikit-learn Optimization, and NLP TF-IDF Pipelines.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-black text-white mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Cloud & Full-Stack</span>
              </h4>
              <p className="text-xs text-slate-200 font-medium leading-relaxed">Google Cloud BigQuery, Compute Engine Load Balancing, Streamlit App Deployments, and RESTful APIs.</p>
            </div>
          </div>
        </div>

        {/* PERMANENT BOTTOM FOOTER */}
        <div className="p-3.5 px-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4 shrink-0 z-10">
          <p className="text-xs text-slate-300 font-bold hidden sm:block">
            Aditya Gupta • AI & Data Science Engineer
          </p>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <X className="w-4 h-4 text-white" />
            <span>CLOSE ABOUT STATION</span>
          </button>
        </div>
      </div>
    </div>
  );
};
