import React, { useEffect } from 'react';
import { X, ExternalLink, Sparkles, Activity } from 'lucide-react';
import type { Project } from '../types';
import { GithubIcon } from './SocialIcons';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  // Listen for Escape key to close modal
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

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
        {/* Glowing Top Accent Line */}
        <div
          className="h-2 shrink-0"
          style={{ backgroundColor: project.color }}
        />

        {/* PERMANENT TOP HEADER WITH CLOSE BUTTON */}
        <div className="bg-slate-900 border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between gap-4 shrink-0 z-10">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white shrink-0 shadow-sm"
              style={{ backgroundColor: project.color }}
            >
              {project.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">{project.title}</h2>
          </div>

          <button
            onClick={onClose}
            title="Close Project (Esc)"
            className="py-2 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-500/30 flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
          >
            <X className="w-4 h-4 text-white" />
            <span>Close</span>
          </button>
        </div>

        {/* SCROLLABLE BODY CONTENT */}
        <div className="p-4 sm:p-6 overflow-y-auto touch-pan-y flex-1 min-h-0 flex flex-col gap-6 selection:bg-cyan-500 selection:text-slate-950 overscroll-contain">
          <p className="text-slate-100 text-xs sm:text-sm leading-relaxed font-medium">{project.fullDescription}</p>

          {/* Live Project Stats (if available) */}
          {project.stats && project.stats.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {project.stats.map((stat, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-3 text-center shadow-md">
                  <p className="text-xs text-cyan-300 font-bold">{stat.label}</p>
                  <p className="text-lg font-black text-white mt-0.5">{stat.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Highlights & Features */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Key Architecture & Features</span>
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {project.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-100 font-medium bg-slate-950 p-3 rounded-xl border border-slate-800 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack Badges */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Technologies Built With</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-950 border border-cyan-500/30 text-cyan-300 shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* External Link & Close Footer */}
        <div className="p-3.5 px-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0 z-10">
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 transition-all cursor-pointer"
          >
            <span>Launch Live Demo</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
          >
            <GithubIcon className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>

          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-500/30 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <X className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
