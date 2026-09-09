import React from 'react';
import { X, Sparkles, GraduationCap, Brain, Terminal, ShieldCheck } from 'lucide-react';
import { PORTFOLIO_DATA } from '../../data/portfolio';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs font-extrabold text-cyan-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>3D About Station</span>
            </div>
            <h2 className="text-3xl font-black text-white">{PORTFOLIO_DATA.name}</h2>
            <p className="text-xs text-slate-400 font-medium">{PORTFOLIO_DATA.title}</p>
          </div>

          {/* Professional Introduction */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 flex flex-col gap-2">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-cyan-400" />
              Professional Introduction & Background
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {PORTFOLIO_DATA.bio}
            </p>
          </div>

          {/* Academic Profile */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 flex flex-col gap-2">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-purple-400" />
              Academic Specialization & Education
            </h3>
            <p className="text-xs font-bold text-cyan-300">{PORTFOLIO_DATA.education}</p>
            <p className="text-xs text-slate-400">{PORTFOLIO_DATA.school}</p>
          </div>

          {/* Key Competencies Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-extrabold text-white mb-1 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Data Science & ML
              </h4>
              <p className="text-[11px] text-slate-400">Classification, Regression, CNN Deep Learning in PyTorch, Scikit-learn Optimization, and NLP TF-IDF Pipelines.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-extrabold text-white mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Cloud & Full-Stack
              </h4>
              <p className="text-[11px] text-slate-400">Google Cloud BigQuery, Compute Engine Load Balancing, Streamlit App Deployments, and RESTful APIs.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Close & Return to 3D World
          </button>
        </div>
      </div>
    </div>
  );
};
