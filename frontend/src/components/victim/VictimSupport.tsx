import React, { useState } from 'react';
import { useSentra } from '../../context/SentraContext';
import { translations } from '../../utils/translations';
import { 
  HeartHandshake, 
  Scale, 
  ShieldCheck, 
  Coins, 
  CheckCircle2, 
  ArrowRight, 
  Clock,
  BookOpen
} from 'lucide-react';

export const VictimSupport: React.FC = () => {
  const { language, victim } = useSentra();
  const t = translations[language];

  const [requestedService, setRequestedService] = useState<string | null>(null);

  const services = [
    {
      id: 'counselling',
      title: 'Psychological Counselling',
      icon: <HeartHandshake className="w-5 h-5 text-rose-600" />,
      desc: t.counsellingDesc,
      provider: 'District Clinical Psychology Unit',
      availability: 'Immediate / Within 24-48 Hours',
      status: 'Assigned',
      category: 'Healthcare & Wellbeing',
      iconBg: 'bg-rose-100 dark:bg-rose-900/30 text-rose-800'
    },
    {
      id: 'legal',
      title: 'Legal Aid & DLSA Representation',
      icon: <Scale className="w-5 h-5 text-indigo-600" />,
      desc: t.legalAidDesc,
      provider: 'District Legal Services Authority (DLSA)',
      availability: 'Mon-Sat, Court Hours',
      status: 'Available',
      category: 'Legal & Protection',
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800'
    },
    {
      id: 'protection',
      title: 'Witness Protection & Escort',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      desc: t.protectionDesc,
      provider: 'District Protection Officer Liaison',
      availability: 'Active (Hearings & Depositions)',
      status: 'Active',
      category: 'Legal & Protection',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800'
    },
    {
      id: 'compensation',
      title: 'Victim Compensation Guidance',
      icon: <Coins className="w-5 h-5 text-amber-600" />,
      desc: t.rehabilitationDesc,
      provider: 'State Victim Compensation Scheme Board',
      availability: 'Post-Charge Sheet & Adjudication',
      status: 'Available',
      category: 'Financial Support',
      iconBg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800'
    },
  ];

  // Group services
  const categories = Array.from(new Set(services.map(s => s.category)));

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">

      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 md:p-8 shadow-md text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-teal-300 font-bold bg-teal-900/40 px-2.5 py-1 rounded-md border border-teal-800 inline-flex items-center gap-1.5 mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              Approved Support Network
            </span>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Support & Resource Center
            </h1>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              Access free, authorized government support services tailored to your case journey. Every service is delivered by certified professionals bound by strict confidentiality.
            </p>
          </div>
        </div>
      </div>

      {/* ── Request Confirmation ───────────────────────────────── */}
      {requestedService && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-sm text-emerald-950 shadow-sm animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>
              Request recorded for <strong>{requestedService}</strong>. Your caseworker will reach out via authorized phone protocol.
            </span>
          </div>
          <button
            onClick={() => setRequestedService(null)}
            className="text-xs font-bold bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg text-emerald-800 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Grouped Services ────────────────────────────────────── */}
      <div className="space-y-8 mt-4">
        {categories.map(category => (
          <div key={category}>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              {category}
              <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1 ml-4"></div>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {services.filter(s => s.category === category).map(svc => (
                <div
                  key={svc.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 shadow-sm flex flex-col justify-between group hover:border-teal-300 transition-colors"
                >
                  <div>
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${svc.iconBg}`}>
                        {svc.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-bold text-slate-900 dark:text-white text-base">
                            {svc.title}
                          </h3>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border shrink-0 ${
                            svc.status === 'Active' || svc.status === 'Assigned' 
                              ? 'bg-teal-50 border-teal-200 text-teal-800'
                              : 'bg-slate-100 border-slate-200 text-slate-600'
                          }`}>
                            {svc.status}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-slate-500 mt-1">
                          {svc.provider}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      {svc.desc}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        {svc.availability}
                      </div>
                      <button
                        onClick={() => setRequestedService(svc.title)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors"
                      >
                        {t.contactSupport}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
