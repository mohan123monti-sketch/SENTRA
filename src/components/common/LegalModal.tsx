import React from 'react';
import { X, Shield, Lock, FileText, CheckCircle2, AlertTriangle, Eye, HelpCircle } from 'lucide-react';

export type LegalPageType = 
  | 'privacy' 
  | 'terms' 
  | 'cookies' 
  | 'transparency' 
  | 'accessibility' 
  | 'consent' 
  | 'contact';

interface LegalModalProps {
  isOpen: boolean;
  page: LegalPageType | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, page, onClose }) => {
  if (!isOpen || !page) return null;

  const contentMap: Record<LegalPageType, { title: string; subtitle: string; content: React.ReactNode }> = {
    privacy: {
      title: "Privacy Policy (Prototype Template)",
      subtitle: "Data minimization, encryption, and statutory safeguarding protocols",
      content: (
        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900">
            <strong>Legal Notice:</strong> This document is a prototype governance template for [Implementing Authority / Organization]. Final legal text, statutory definitions, and cross-border provisions must be reviewed and ratified by designated legal counsel.
          </div>

          <section>
            <h4 className="font-bold text-slate-900 uppercase tracking-wide">1. Introduction & Authority</h4>
            <p className="mt-1">
              SENTRA (Sentiment and Emotional Tracking Risk & Analysis) is deployed on behalf of [Implementing Authority / Organization] to provide early insight and human support for registered complainants throughout their judicial journey.
            </p>
          </section>

          <section>
            <h4 className="font-bold text-slate-900 uppercase tracking-wide">2. Information Collected (Strict Data Minimization)</h4>
            <p className="mt-1">
              In accordance with data minimization standards, SENTRA collects only: (a) Demographic pseudonymized profile ID, (b) Case stage markers, (c) Voluntary self-reported well-being ratings (mood, stress, sleep, safety, support), (d) Optional free-text reflections, and (e) Optional encrypted voice audio recordings.
            </p>
            <p className="mt-1 font-semibold text-slate-900">
              Prohibited Data: SENTRA never collects GPS coordinates, background ambient microphone audio, continuous camera feeds, personal device contacts, or social media activity.
            </p>
          </section>

          <section>
            <h4 className="font-bold text-slate-900 uppercase tracking-wide">3. AI Processing & Personal Baseline Analysis</h4>
            <p className="mt-1">
              AI models analyze user inputs strictly to detect longitudinal deviations from the individual's established baseline. AI outputs are non-diagnostic decision-support signals flagged exclusively to authorized caseworkers.
            </p>
          </section>

          <section>
            <h4 className="font-bold text-slate-900 uppercase tracking-wide">4. Role-Based Access Control (RBAC) & Encryption</h4>
            <p className="mt-1">
              Access is strictly segregated by role. State and National administrators only access aggregated, de-identified statistics. All data in transit uses TLS 1.3 and is encrypted at rest using AES-256.
            </p>
          </section>

          <section>
            <h4 className="font-bold text-slate-900 uppercase tracking-wide">5. Retention & User Rights</h4>
            <p className="mt-1">
              Complainants maintain statutory rights to inspect logged check-ins, request retention reviews, and withdraw optional voice processing consents at any time without compromising ongoing judicial protections.
            </p>
          </section>
        </div>
      )
    },
    terms: {
      title: "Terms of Use & Caseworker Bounds",
      subtitle: "Governing the authorized operation of the SENTRA decision-support system",
      content: (
        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900">
            <strong>Statutory Disclaimer:</strong> Prototype operational terms for [Implementing Authority / Organization].
          </div>

          <section>
            <h4 className="font-bold text-slate-900 uppercase tracking-wide">1. System Purpose</h4>
            <p className="mt-1">
              SENTRA facilitates well-being tracking to guide proactive human intervention. It is not an automated law-enforcement dispatch system or an autonomous crisis-intervention AI.
            </p>
          </section>

          <section>
            <h4 className="font-bold text-slate-900 uppercase tracking-wide">2. Human-in-the-Loop Imperative</h4>
            <p className="mt-1">
              No legal decision, bail determination, protection revocation, or psychiatric assessment may be made autonomously by the software. All interventions require review and signature by authorized caseworkers.
            </p>
          </section>

          <section>
            <h4 className="font-bold text-slate-900 uppercase tracking-wide">3. No Medical or Legal Guarantee</h4>
            <p className="mt-1">
              Participation in SENTRA monitoring does not guarantee the outcome of legal proceedings or absolute prevention of emotional distress. Immediate emergencies must be directed to national helpline 112.
            </p>
          </section>
        </div>
      )
    },
    transparency: {
      title: "AI Transparency & Responsible AI",
      subtitle: "Architectural boundaries, explainability algorithms, and model limitations",
      content: (
        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="p-3 bg-teal-50 border border-teal-200 rounded text-teal-900">
            <strong>Responsible AI Guarantee:</strong> "SENTRA's AI outputs are decision-support indicators and are not medical diagnoses."
          </div>

          <section>
            <h4 className="font-bold text-slate-900 uppercase tracking-wide">1. What SENTRA AI Does</h4>
            <p className="mt-1">
              The AI evaluates multi-modal signals (check-in scores, optional text sentiment, optional voice acoustic tension) against a user's personal longitudinal baseline. It identifies shifts rather than generic population averages.
            </p>
          </section>

          <section>
            <h4 className="font-bold text-slate-900 uppercase tracking-wide">2. Explainable "What Changed?" Architecture</h4>
            <p className="mt-1">
              Every flagged alert provides explicit feature attribution (e.g., +62% distress shift, sleep disruption, court date proximity). Black-box recommendations are prohibited by system design.
            </p>
          </section>

          <section>
            <h4 className="font-bold text-slate-900 uppercase tracking-wide">3. False Positives & False Negatives</h4>
            <p className="mt-1">
              The model is calibrated to favor sensitivity (early review) over specificity, ensuring victims in distress are not overlooked. However, human caseworkers always evaluate situational context before taking action.
            </p>
          </section>
        </div>
      )
    },
    accessibility: {
      title: "WCAG Accessibility Statement",
      subtitle: "Inclusive design standards for complainants and public servants",
      content: (
        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <p>
            SENTRA conforms to Web Content Accessibility Guidelines (WCAG) 2.1 Level AA specifications to ensure barrier-free access.
          </p>
          <ul className="space-y-1.5 list-disc pl-5">
            <li><strong>High-Contrast Mode:</strong> Accessible via the top utility bar for low-vision users.</li>
            <li><strong>Text Scaling:</strong> Full text enlargement support without horizontal layout breakage.</li>
            <li><strong>Screen Reader Semantic Markup:</strong> Explicit ARIA roles, live regions, and descriptive button labels.</li>
            <li><strong>Multilingual Support:</strong> Available in English, தமிழ் (Tamil), and हिन्दी (Hindi).</li>
            <li><strong>Reduced Motion:</strong> Automatically honors CSS prefers-reduced-motion preferences.</li>
          </ul>
        </div>
      )
    },
    consent: {
      title: "Consent & Statutory Data Rights",
      subtitle: "Granular controls, processing preferences, and consent withdrawal",
      content: (
        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <p>
            Complainants hold sovereign control over optional modalities in SENTRA. Voice processing and caseworker check-in reminders can be adjusted directly from the Profile & Consent tab.
          </p>
          <p>
            Withdrawal of consent for optional features does not affect your legal standing, victim compensation claims, or court rights under [Implementing Authority / Organization].
          </p>
        </div>
      )
    },
    cookies: {
      title: "Cookie Policy & Local Storage",
      subtitle: "Transparent disclosure of local storage tokens and zero tracking policy",
      content: (
        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <p>
            SENTRA utilizes strictly necessary authentication session tokens and accessibility preferences stored in browser local storage.
          </p>
          <p className="font-semibold text-slate-900">
            Zero Commercial Tracking: SENTRA contains NO third-party advertising cookies, cross-site trackers, or commercial telemetry beacons.
          </p>
        </div>
      )
    },
    contact: {
      title: "Contact & Grievance Redressal",
      subtitle: "Dedicated public grievance and data protection officer",
      content: (
        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <p>
            For statutory complaints, data protection inquiries, or caseworker escalation:
          </p>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded font-mono text-xs">
            <div>Office of the Grievance & Compliance Officer</div>
            <div>[Implementing Authority / Organization]</div>
            <div>Email: grievance.officer@sentra.gov (Fictional Demo)</div>
            <div>Toll-free Assistance Liaison: 1800-SENTRA-01</div>
          </div>
        </div>
      )
    }
  };

  const current = contentMap[page];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div className="bg-white rounded-lg border border-slate-200 max-w-2xl w-full p-6 shadow-xl relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-md transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pb-3 border-b border-slate-100">
          <h2 id="legal-modal-title" className="text-base font-bold text-slate-900">
            {current.title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {current.subtitle}
          </p>
        </div>

        <div className="mt-4">
          {current.content}
        </div>

        <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
