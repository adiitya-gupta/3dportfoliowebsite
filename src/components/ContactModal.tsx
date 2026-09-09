import React, { useState } from 'react';
import { X, Send, Mail, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PORTFOLIO_INFO } from '../data/portfolioData';
import { GithubIcon, LinkedinIcon, TwitterIcon } from './SocialIcons';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Fire Confetti Celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-white">Message Transmitted!</h3>
            <p className="text-slate-400 text-sm mt-2">Thank you for visiting the 3D Portfolio. I will get back to you shortly!</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
                <Mail className="w-4 h-4" />
                <span>3D Contact Station</span>
              </div>
              <h2 className="text-2xl font-black text-white">Get In Touch</h2>
              <p className="text-slate-400 text-xs mt-1">Have a project idea, inquiry, or opportunity? Drop a message below!</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="name@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="3D Web Development Inquiry"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell me about your project or inquiry..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-rose-500 to-cyan-500 hover:from-rose-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all mt-2"
              >
                <span>Send Transmission</span>
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-slate-800/80">
              <a
                href={PORTFOLIO_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href={PORTFOLIO_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-slate-700 transition-all"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href={PORTFOLIO_INFO.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-slate-700 transition-all"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${PORTFOLIO_INFO.email}`}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-slate-700 transition-all"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
