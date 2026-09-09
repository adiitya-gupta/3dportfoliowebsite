import React, { useEffect } from 'react';
import { X, Download, FileText, CheckCircle2, Award } from 'lucide-react';
import { PORTFOLIO_DATA, MILESTONES, CERTIFICATIONS } from '../../data/portfolio';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border-2 border-cyan-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh] max-h-[850px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Gradient Bar */}
        <div className="h-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 shrink-0" />

        {/* PERMANENT STICKY HEADER - STAYS AT TOP AT ALL TIMES */}
        <div className="bg-slate-900 border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between gap-4 shrink-0 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-black text-slate-950 text-xl shadow-md shadow-cyan-500/30 shrink-0">
              A
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black text-cyan-400 uppercase tracking-wider">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>OFFICIAL CURRICULUM VITAE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{PORTFOLIO_DATA.name}</h2>
              <p className="text-xs text-cyan-300 font-bold">{PORTFOLIO_DATA.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={PORTFOLIO_DATA.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (PORTFOLIO_DATA.resumeUrl === '#') {
                  e.preventDefault();
                  alert('Downloading Aditya Gupta Resume PDF...');
                }
              }}
              className="py-2.5 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/30 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download PDF</span>
            </a>

            <button
              onClick={onClose}
              title="Close Resume (Esc)"
              className="py-2.5 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-500/30 flex items-center gap-2 cursor-pointer transition-all"
            >
              <X className="w-4 h-4 text-white" />
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* SCROLLABLE BODY CONTENT - ULTRA HIGH CONTRAST BOLD TEXT */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-6 selection:bg-cyan-500 selection:text-slate-950">
          {/* Education Section */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Education & Academic Background</span>
            </h3>
            <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-md">
              <h4 className="font-black text-base sm:text-lg text-white leading-snug">{PORTFOLIO_DATA.education}</h4>
              <p className="text-xs sm:text-sm font-extrabold text-cyan-300 mt-1.5">{PORTFOLIO_DATA.school}</p>
            </div>
          </div>

          {/* Internships & Work Experience */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Internship & Professional Experience</span>
            </h3>
            <div className="flex flex-col gap-4">
              {MILESTONES.map((item) => (
                <div key={item.id} className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-md hover:border-slate-700 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs mb-2 gap-1.5">
                    <span className="font-black text-base text-cyan-300">{item.role}</span>
                    <span className="text-amber-400 font-mono font-bold bg-amber-500/15 px-3 py-1 rounded-lg border border-amber-500/40 w-max text-xs">
                      {item.year}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-black text-white mb-2">{item.organization}</p>
                  <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed mb-3">{item.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.skills.map((s, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs text-cyan-300 font-bold shadow-sm">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Google Cloud Certifications */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Google Cloud & Professional Certifications</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CERTIFICATIONS.map((cert, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-white font-extrabold bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PERMANENT FOOTER BAR - ALWAYS VISIBLE WITH RED CLOSE BUTTON */}
        <div className="p-3.5 px-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4 shrink-0 shadow-inner">
          <p className="text-xs text-slate-200 font-bold hidden sm:block">
            Aditya Gupta • Data Science & ML Engineer Resume
          </p>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <X className="w-4 h-4 text-white" />
            <span>CLOSE RESUME</span>
          </button>
        </div>
      </div>
    </div>
  );
};
