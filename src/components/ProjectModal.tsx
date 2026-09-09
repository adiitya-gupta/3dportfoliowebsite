import React from 'react';
import { X, ExternalLink, Sparkles, Activity } from 'lucide-react';
import type { Project } from '../types';
import { GithubIcon } from './SocialIcons';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Glowing Top Accent Line */}
        <div
          className="absolute top-0 left-0 right-0 h-2"
          style={{ backgroundColor: project.color }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Section */}
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white"
              style={{ backgroundColor: project.color }}
            >
              {project.category}
            </span>
            <span className="text-xs text-slate-400 font-mono">3D Kiosk Showcase</span>
          </div>

          <h2 className="text-3xl font-black text-white tracking-tight">{project.title}</h2>
          <p className="text-slate-300 text-sm leading-relaxed mt-1">{project.fullDescription}</p>
        </div>

        {/* Live Project Stats (if available) */}
        {project.stats && project.stats.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {project.stats.map((stat, idx) => (
              <div key={idx} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3 text-center">
                <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
                <p className="text-lg font-black text-cyan-400 mt-0.5">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Highlights & Features */}
        <div className="mb-6">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Key Architecture & Features
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {project.highlights.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tech Stack Badges */}
        <div className="mb-8">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-cyan-400" />
            Technologies Built With
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700 transition-all"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* External Link Buttons */}
        <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
          >
            <span>Launch Live Demo</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 transition-all"
          >
            <GithubIcon className="w-4 h-4" />
            <span>GitHub Source</span>
          </a>
        </div>
      </div>
    </div>
  );
};
