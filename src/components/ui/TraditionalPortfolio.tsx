import React, { useState } from 'react';
import { Sparkles, Mail, ExternalLink, CheckCircle2, ArrowLeft } from 'lucide-react';
import { PORTFOLIO_DATA, PROJECTS, SKILLS, MILESTONES, CERTIFICATIONS } from '../../data/portfolio';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '../SocialIcons';

interface TraditionalPortfolioProps {
  onReturnTo3D: () => void;
}

export const TraditionalPortfolio: React.FC<TraditionalPortfolioProps> = ({ onReturnTo3D }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = ['All', 'Full-Stack & Business Intelligence', 'Deep Learning & Computer Vision', 'Natural Language Processing', 'Cloud Data Engineering'];

  const filteredProjects = selectedCategory === 'All'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-y-auto">
      <div className="max-w-6xl mx-auto flex flex-col gap-12 py-6">

        {/* Top Switcher Bar */}
        <div className="flex items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-cyan-500/30">
              A
            </div>
            <div>
              <h1 className="font-black text-base text-white tracking-tight">{PORTFOLIO_DATA.name}</h1>
              <p className="text-xs text-cyan-400 font-medium">{PORTFOLIO_DATA.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onReturnTo3D}
            className="py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Launch 3D Game World</span>
          </button>
        </div>

        {/* Hero & About Section */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-3xl flex flex-col gap-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider w-max">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack Developer • AI Engineer • Data Scientist</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Crafting Data-Driven AI Applications & Cloud Data Warehouses
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {PORTFOLIO_DATA.bio}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={`mailto:${PORTFOLIO_DATA.email}`}
                className="py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Aditya</span>
              </a>

              <div className="flex items-center gap-2">
                <a
                  href={PORTFOLIO_DATA.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
                <a
                  href={PORTFOLIO_DATA.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-slate-700 transition-all cursor-pointer"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
                <a
                  href={PORTFOLIO_DATA.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-slate-700 transition-all cursor-pointer"
                >
                  <TwitterIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects Gallery */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Featured Projects</h2>
              <p className="text-xs text-slate-400 mt-0.5">Real-world AI, Machine Learning, & Web Platform implementations</p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between gap-4 hover:border-slate-700 transition-all"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span
                      className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-white"
                      style={{ backgroundColor: project.color }}
                    >
                      {project.category}
                    </span>
                    {project.stats && project.stats[0] && (
                      <span className="text-xs font-extrabold font-mono text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                        {project.stats[0].label}: {project.stats[0].value}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-extrabold text-white">{project.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{project.fullDescription}</p>

                  {/* Highlights */}
                  <div className="flex flex-col gap-1.5 mt-2">
                    {project.highlights.map((h, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 4).map((tech, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] text-slate-300 font-semibold">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Skills Laboratory */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <h2 className="text-2xl font-black text-white tracking-tight mb-1">Technical Skills & Expertise</h2>
          <p className="text-xs text-slate-400 mb-6">Real experience durations and deployment benchmarks</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {SKILLS.map((skill) => (
              <div key={skill.id} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">{skill.category}</span>
                <span className="font-extrabold text-sm text-white">{skill.name}</span>
                <span className="text-[11px] font-mono text-slate-400 mt-1">{skill.experienceDuration}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Internships & Education */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-4">
            <h2 className="text-xl font-black text-white tracking-tight">Internship History</h2>
            <div className="flex flex-col gap-3">
              {MILESTONES.map((ms) => (
                <div key={ms.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-cyan-400">{ms.role}</span>
                    <span className="text-slate-500 font-mono text-[11px]">{ms.year}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-300 mb-1">{ms.organization}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{ms.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-3">
              <h2 className="text-xl font-black text-white tracking-tight">Education</h2>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <h3 className="font-bold text-sm text-white">{PORTFOLIO_DATA.education}</h3>
                <p className="text-xs text-slate-400 mt-1">{PORTFOLIO_DATA.school}</p>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-3">
              <h2 className="text-xl font-black text-white tracking-tight">Certifications & Badges</h2>
              <div className="flex flex-col gap-2">
                {CERTIFICATIONS.map((cert, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
