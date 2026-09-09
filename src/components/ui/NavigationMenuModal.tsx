import React from 'react';
import {
  X,
  Home,
  User,
  Boxes,
  Milestone,
  Briefcase,
  GraduationCap,
  Award,
  Trophy,
  FileText,
  Mail,
  Gamepad2,
  ChevronRight
} from 'lucide-react';

interface NavigationMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
}

export const NavigationMenuModal: React.FC<NavigationMenuModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  if (!isOpen) return null;

  const navItems = [
    { id: 'spawn', label: 'HOME', desc: 'Start Plaza & Dev Workstation', icon: Home, color: 'text-cyan-400', bg: 'hover:border-cyan-500/50 hover:bg-cyan-500/10' },
    { id: 'about', label: 'ABOUT', desc: 'Developer Bio & Background', icon: User, color: 'text-purple-400', bg: 'hover:border-purple-500/50 hover:bg-purple-500/10' },
    { id: 'skills', label: 'SKILLS', desc: 'ML & Full-Stack Tech Pedestals', icon: Boxes, color: 'text-emerald-400', bg: 'hover:border-emerald-500/50 hover:bg-emerald-500/10' },
    { id: 'experience', label: 'EXPERIENCE', desc: 'Internship Timeline & Roles', icon: Milestone, color: 'text-amber-400', bg: 'hover:border-amber-500/50 hover:bg-amber-500/10' },
    { id: 'projects', label: 'PROJECTS', desc: 'PyTorch, NLP & BigQuery Apps', icon: Briefcase, color: 'text-cyan-400', bg: 'hover:border-cyan-500/50 hover:bg-cyan-500/10' },
    { id: 'education', label: 'EDUCATION', desc: 'LPU B.Tech CSE (2024 - 2028)', icon: GraduationCap, color: 'text-blue-400', bg: 'hover:border-blue-500/50 hover:bg-blue-500/10' },
    { id: 'certifications', label: 'CERTIFICATIONS', desc: '4 Google Cloud Certified Skill Badges', icon: Award, color: 'text-yellow-400', bg: 'hover:border-yellow-500/50 hover:bg-yellow-500/10' },
    { id: 'achievements', label: 'ACHIEVEMENTS', desc: '72.3% CIFAR-10 & >85% NLP Accuracy', icon: Trophy, color: 'text-amber-400', bg: 'hover:border-amber-500/50 hover:bg-amber-500/10' },
    { id: 'resume', label: 'RESUME', desc: 'View & Download Official PDF/HTML', icon: FileText, color: 'text-purple-400', bg: 'hover:border-purple-500/50 hover:bg-purple-500/10' },
    { id: 'contact', label: 'CONTACT', desc: 'Red Communications Kiosk', icon: Mail, color: 'text-rose-400', bg: 'hover:border-rose-500/50 hover:bg-rose-500/10' },
    { id: 'playground', label: 'STUNTS & PLAYGROUND', desc: 'Speed Ramp & Soccer Ball Alley', icon: Gamepad2, color: 'text-cyan-400', bg: 'hover:border-cyan-500/50 hover:bg-cyan-500/10' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fadeIn">
      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-black text-slate-950 text-lg shadow-lg shadow-cyan-500/30">
              A
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-wide">PORTFOLIO NAVIGATION</h2>
              <p className="text-xs text-cyan-400 font-medium">ADITYA GUPTA • DATA SCIENCE & ML ENGINEER</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 overflow-y-auto pr-1 flex-1 scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 transition-all duration-200 cursor-pointer group ${item.bg}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2.5 rounded-xl bg-slate-900 border border-slate-800 group-hover:scale-110 transition-transform ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left min-w-0">
                    <h3 className="font-black text-xs text-white tracking-wider group-hover:text-cyan-300 transition-colors">
                      {item.label}
                    </h3>
                    <p className="text-[10px] text-slate-400 truncate">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="border-t border-slate-800 pt-3 mt-4 flex items-center justify-between text-[11px] text-slate-400">
          <span>Click any sector to teleport instantly</span>
          <span className="font-mono text-cyan-400">Press [ESC] to Return to Game</span>
        </div>
      </div>
    </div>
  );
};
