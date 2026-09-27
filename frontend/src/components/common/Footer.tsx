import React from 'react';
import { SentraLogo } from './SentraLogo';
import { Shield, Scale, Info, Lock } from 'lucide-react';

interface FooterProps {
  onOpenLegalModal: (page: 'privacy' | 'terms' | 'cookies' | 'transparency' | 'accessibility' | 'consent' | 'contact') => void;
  onNavigateView?: (view: 'public' | 'login' | 'portal') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegalModal, onNavigateView }) => {
  const handleScroll = (id: string) => {
    if (onNavigateView) {
      onNavigateView('public');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    }
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-700/80 bg-slate-900 text-slate-300 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-1 space-y-4">
            <SentraLogo light={true} size={32} />
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              Sentiment and Emotional Tracking Risk & Analysis
            </p>
          </div>

          {/* Col 2: Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => handleScroll('how-it-works')} className="hover:text-white transition-colors text-left">How It Works</button>
              </li>
              <li>
                <button onClick={() => handleScroll('ai-insights')} className="hover:text-white transition-colors text-left">AI & Insights</button>
              </li>
              <li>
                <button onClick={() => handleScroll('human-support')} className="hover:text-white transition-colors text-left">Human Support</button>
              </li>
              <li>
                <button onClick={() => handleScroll('faq-section')} className="hover:text-white transition-colors text-left">FAQ</button>
              </li>
            </ul>
          </div>

          {/* Col 3: Trust & Transparency */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200">Trust & Transparency</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => onOpenLegalModal('privacy')} className="hover:text-white transition-colors text-left">Privacy Policy</button>
              </li>
              <li>
                <button onClick={() => onOpenLegalModal('cookies')} className="hover:text-white transition-colors text-left">Cookie Policy</button>
              </li>
              <li>
                <button onClick={() => onOpenLegalModal('terms')} className="hover:text-white transition-colors text-left">Terms of Use</button>
              </li>
              <li>
                <button onClick={() => onOpenLegalModal('transparency')} className="hover:text-white transition-colors text-left">AI Transparency</button>
              </li>
              <li>
                <button onClick={() => onOpenLegalModal('accessibility')} className="hover:text-white transition-colors text-left">Accessibility</button>
              </li>
              <li>
                <button onClick={() => onOpenLegalModal('consent')} className="hover:text-white transition-colors text-left">Consent & Data Rights</button>
              </li>
            </ul>
          </div>

          {/* Col 4: Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200">Support</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => onOpenLegalModal('contact')} className="hover:text-white transition-colors text-left">Contact</button>
              </li>
              <li>
                <button onClick={() => onOpenLegalModal('contact')} className="hover:text-white transition-colors text-left">Grievance / Support</button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 [Implementing Authority / Organization]. All rights reserved.</p>
          <p className="text-center sm:text-right max-w-xl">
            SENTRA is an AI-assisted decision-support platform. Its outputs are not medical diagnoses and do not replace professional assessment or authorized human decision-making.
          </p>
        </div>
      </div>
    </footer>
  );
};
