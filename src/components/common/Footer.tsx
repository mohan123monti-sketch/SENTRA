import React from 'react';
import { SentraLogo } from './SentraLogo';
import { Shield, Scale, Info, Lock } from 'lucide-react';

interface FooterProps {
  onOpenLegalModal: (page: 'privacy' | 'terms' | 'cookies' | 'transparency' | 'accessibility' | 'consent' | 'contact') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegalModal }) => {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-1 space-y-3">
            <SentraLogo light={true} size={28} />
            <p className="text-xs text-slate-400 leading-relaxed">
              Sentiment and Emotional Tracking Risk & Analysis. AI-assisted victim well-being monitoring and decision support for authorized human caseworkers.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <Shield className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>Zero Clinical Diagnosis · Human Review Required</span>
            </div>
          </div>

          {/* Col 2: Legal & Governance */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200">Legal & Governance</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <button 
                  onClick={() => onOpenLegalModal('privacy')} 
                  className="hover:text-white transition-colors text-left"
                >
                  Privacy Policy (Prototype Template)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenLegalModal('terms')} 
                  className="hover:text-white transition-colors text-left"
                >
                  Terms of Use & Caseworker Bounds
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenLegalModal('consent')} 
                  className="hover:text-white transition-colors text-left"
                >
                  Consent & Statutory Data Rights
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenLegalModal('cookies')} 
                  className="hover:text-white transition-colors text-left"
                >
                  Cookie Policy & Local Storage
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: AI Transparency & Standards */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200">Responsible AI & Access</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <button 
                  onClick={() => onOpenLegalModal('transparency')} 
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5"
                >
                  <span>AI Transparency & Limitations</span>
                  <Info className="w-3 h-3 text-teal-400" />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenLegalModal('accessibility')} 
                  className="hover:text-white transition-colors text-left"
                >
                  WCAG Accessibility Statement
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenLegalModal('contact')} 
                  className="hover:text-white transition-colors text-left"
                >
                  Contact & Grievance Officer
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Statutory Boundaries & Disclaimer */}
          <div className="space-y-2 text-xs text-slate-400 bg-slate-800/60 p-3.5 rounded border border-slate-700/60">
            <div className="flex items-center gap-1.5 text-slate-200 font-semibold text-[11px] uppercase tracking-wide">
              <Lock className="w-3.5 h-3.5 text-teal-400" />
              <span>Statutory Prototype Boundary</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              AI outputs are purely indicative decision-support signals for licensed professionals. AI does not autonomously diagnose illness, initiate police action, dispatch emergency transport, or make protection orders.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 [Implementing Authority / Organization]. All rights reserved.</p>
          <p className="text-center sm:text-right text-[11px]">
            Template notice: Final legal texts and data protection clauses must be reviewed and approved by legal counsel prior to jurisdictional launch.
          </p>
        </div>
      </div>
    </footer>
  );
};
