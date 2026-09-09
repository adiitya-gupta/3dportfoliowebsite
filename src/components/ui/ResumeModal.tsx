import React from 'react';
import { X, Download, FileText, CheckCircle2 } from 'lucide-react';
import { PORTFOLIO_DATA, MILESTONES, CERTIFICATIONS } from '../../data/portfolio';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Resume Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold text-cyan-400 uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4" />
              <span>Official Curriculum Vitae</span>
            </div>
            <h2 className="text-3xl font-black text-white">{PORTFOLIO_DATA.name}</h2>
            <p className="text-xs text-slate-400 mt-1">{PORTFOLIO_DATA.title}</p>
          </div>

          <a
            href={PORTFOLIO_DATA.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              // Simulated download feedback if link is placeholder
              if (PORTFOLIO_DATA.resumeUrl === '#') {
                e.preventDefault();
                alert('Downloading Aditya Gupta Resume PDF...');
              }
            }}
            className="py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </a>
        </div>

        {/* Education Section */}
        <div className="mb-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Education</h3>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h4 className="font-bold text-sm text-white">{PORTFOLIO_DATA.education}</h4>
            <p className="text-xs text-slate-400 mt-1">{PORTFOLIO_DATA.school}</p>
          </div>
        </div>

        {/* Internships & Work Experience */}
        <div className="mb-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Internship History</h3>
          <div className="flex flex-col gap-3">
            {MILESTONES.map((item) => (
              <div key={item.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-cyan-400">{item.role}</span>
                  <span className="text-slate-500 font-mono">{item.year}</span>
                </div>
                <p className="text-xs font-semibold text-slate-300 mb-2">{item.organization}</p>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">{item.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {item.skills.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Google Cloud Certifications */}
        <div className="mb-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Certifications & Credentials</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CERTIFICATIONS.map((cert, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
