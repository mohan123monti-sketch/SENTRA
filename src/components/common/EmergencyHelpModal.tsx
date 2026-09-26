import React, { useState } from 'react';
import { 
  X, 
  PhoneCall, 
  ShieldAlert, 
  HeartHandshake, 
  Scale, 
  AlertTriangle, 
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { useSentra } from '../../context/SentraContext';
import { translations } from '../../utils/translations';

interface EmergencyHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyHelpModal: React.FC<EmergencyHelpModalProps> = ({ isOpen, onClose }) => {
  const { language, victim } = useSentra();
  const t = translations[language];

  const [selectedCategory, setSelectedCategory] = useState<'safety' | 'counselling' | 'legal' | 'other' | null>(null);
  const [requestSent, setRequestSent] = useState(false);
  const [customNote, setCustomNote] = useState('');

  if (!isOpen) return null;

  const handleSubmitImmediateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSent(true);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-modal-title"
    >
      <div className="bg-white rounded-lg border border-slate-200 max-w-xl w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-md transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-700">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 id="emergency-modal-title" className="text-lg font-bold text-slate-900">
              {t.emergencyTitle}
            </h2>
            <p className="text-xs text-slate-500">
              Immediate Safety & Dedicated Caseworker Contact Protocols
            </p>
          </div>
        </div>

        {/* Immediate Danger Notice Box */}
        <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-950">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Immediate Danger Emergency Notice:</strong>
              <p className="mt-0.5 leading-relaxed">
                If you are facing physical violence, imminent stalking, or direct danger, call local designated emergency response immediately:
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="font-mono font-bold bg-white text-rose-800 px-2 py-1 rounded border border-rose-300">
                  National Emergency Helpline: 112
                </span>
                <span className="font-mono font-bold bg-white text-rose-800 px-2 py-1 rounded border border-rose-300">
                  Women's Helpline: 1091
                </span>
                <span className="font-mono font-bold bg-white text-rose-800 px-2 py-1 rounded border border-rose-300">
                  Tele-MANAS Mental Health: 14416
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Core Statutory Disclaimer */}
        <p className="mt-3 text-[11px] text-slate-500 italic leading-relaxed">
          {t.emergencyDisclaimer}
        </p>

        {requestSent ? (
          <div className="mt-5 p-4 bg-emerald-50 border border-emerald-200 rounded text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-emerald-900">
              Urgent Support Request Routed
            </h3>
            <p className="text-xs text-emerald-800 mt-1">
              Your assigned support caseworker ({victim.assignedCounsellor}) and District Support Officer ({victim.assignedOfficer}) have received an urgent alert on their dashboard.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded text-xs font-semibold hover:bg-emerald-800 transition-colors"
            >
              Return to Portal
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitImmediateRequest} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-2">
                Select the nature of your concern:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('safety')}
                  className={`p-3 rounded border text-left flex items-start gap-2.5 transition-colors ${
                    selectedCategory === 'safety' 
                      ? 'border-rose-600 bg-rose-50/50 text-rose-950 ring-1 ring-rose-600' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Safety Concern</div>
                    <div className="text-[11px] text-slate-500">Threats, intimidation, or fear of retaliation</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategory('counselling')}
                  className={`p-3 rounded border text-left flex items-start gap-2.5 transition-colors ${
                    selectedCategory === 'counselling' 
                      ? 'border-teal-700 bg-teal-50/50 text-teal-950 ring-1 ring-teal-700' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <HeartHandshake className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Emotional Support</div>
                    <div className="text-[11px] text-slate-500">Urgent callback with your assigned counsellor</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategory('legal')}
                  className={`p-3 rounded border text-left flex items-start gap-2.5 transition-colors ${
                    selectedCategory === 'legal' 
                      ? 'border-teal-700 bg-teal-50/50 text-teal-950 ring-1 ring-teal-700' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <Scale className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Legal Protection</div>
                    <div className="text-[11px] text-slate-500">Upcoming trial hearing safety or DLSA aid</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategory('other')}
                  className={`p-3 rounded border text-left flex items-start gap-2.5 transition-colors ${
                    selectedCategory === 'other' 
                      ? 'border-teal-700 bg-teal-50/50 text-teal-950 ring-1 ring-teal-700' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <PhoneCall className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">General Help</div>
                    <div className="text-[11px] text-slate-500">Rehabilitation or administrative assistance</div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="emergency-note" className="block text-xs font-semibold text-slate-700 mb-1">
                Brief description (Optional):
              </label>
              <textarea
                id="emergency-note"
                rows={3}
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Share any context that will help caseworkers prepare for your call..."
                className="w-full text-xs rounded border border-slate-300 p-2.5 focus:border-teal-700 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedCategory}
                className="px-4 py-2 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                Send Urgent Request to Caseworker
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
