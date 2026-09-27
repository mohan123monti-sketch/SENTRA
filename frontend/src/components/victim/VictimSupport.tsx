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
  HelpCircle,
  Clock
} from 'lucide-react';

export const VictimSupport: React.FC = () => {
  const { language, victim } = useSentra();
  const t = translations[language];

  const [requestedService, setRequestedService] = useState<string | null>(null);

  const services = [
    {
      id: 'counselling',
      title: 'Emotional Well-Being & Psychological Counselling',
      icon: <HeartHandshake className="w-5 h-5 text-teal-700" />,
      desc: t.counsellingDesc,
      provider: "District Clinical Psychology Unit",
      availability: "Immediate / Within 24-48 Hours",
      status: "Assigned"
    },
    {
      id: 'legal',
      title: 'Legal Aid & DLSA Representation',
      icon: <Scale className="w-5 h-5 text-slate-700 dark:text-slate-300" />,
      desc: t.legalAidDesc,
      provider: "District Legal Services Authority (DLSA)",
      availability: "Monday to Saturday, Court Hours",
      status: "Available"
    },
    {
      id: 'protection',
      title: 'Witness Protection & Courtroom Escort',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-700" />,
      desc: t.protectionDesc,
      provider: "District Protection Officer Liaison",
      availability: "Active Protocol (Hearings & Depositions)",
      status: "Active"
    },
    {
      id: 'compensation',
      title: 'Statutory Victim Compensation Guidance',
      icon: <Coins className="w-5 h-5 text-amber-700" />,
      desc: t.rehabilitationDesc,
      provider: "State Victim Compensation Scheme Board",
      availability: "Post-Charge Sheet & Adjudication",
      status: "Available"
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 p-6 shadow-xs">
        <span className="text-xs font-mono uppercase tracking-wider text-teal-800 dark:text-teal-300 font-semibold">
          Approved Support Network
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
          {t.mySupportServices}
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Access free, authorized government and statutory support schemes tailored to your case journey. Every service is delivered by certified professionals bound by strict confidentiality.
        </p>
      </div>

      {requestedService && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-950">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              Consultation request recorded for <strong>{requestedService}</strong>. Your caseworker will reach out via authorized phone protocol.
            </span>
          </div>
          <button 
            onClick={() => setRequestedService(null)}
            className="text-[11px] underline text-emerald-800 hover:text-emerald-950 ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((svc) => (
          <div 
            key={svc.id}
            className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/50">
                    {svc.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                      {svc.title}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {svc.provider}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 shrink-0">
                  {svc.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                {svc.desc}
              </p>

              <div className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Availability: {svc.availability}</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
              <span className="text-[11px] text-teal-800 dark:text-teal-300 font-medium">
                Free of charge under statutory rules
              </span>
              <button
                onClick={() => setRequestedService(svc.title)}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>{t.contactSupport}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
