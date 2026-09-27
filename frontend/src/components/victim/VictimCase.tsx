import React from 'react';
import { useSentra } from '../../context/SentraContext';
import { CaseTimeline } from '../common/CaseTimeline';
import { translations } from '../../utils/translations';
import { FileText, Calendar, ShieldCheck, MapPin, Building2, User } from 'lucide-react';

export const VictimCase: React.FC = () => {
  const { victim, cases, language, checkIns, interventions } = useSentra();
  const t = translations[language];

  const currentCase = cases.find(c => c.id === victim.caseId) || cases[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-teal-800 dark:text-teal-300 font-semibold">
              Authorized Case Portal
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {t.caseTimelineTitle}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Track official judicial milestones and statutory support stages. Note: Internal officer notes and decision-support indicators are strictly isolated to protect investigative integrity.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded border border-slate-200 dark:border-slate-700/80 text-xs space-y-1 font-mono">
            <div>Case Number: <strong className="text-slate-900 dark:text-white">{currentCase.caseNumber}</strong></div>
            <div>Complainant ID: <strong className="text-slate-900 dark:text-white">{victim.id}</strong></div>
            <div>Court Bench: <span className="text-slate-700 dark:text-slate-300">{currentCase.courtName}</span></div>
          </div>
        </div>
      </div>

      {/* Signature Visual Case Timeline */}
      <CaseTimeline 
        caseRecord={currentCase} 
        checkIns={checkIns} 
        interventions={interventions} 
      />

      {/* Case Details & Support Assignment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Judicial Information */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 p-5 shadow-xs">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 pb-3 border-b border-slate-100 dark:border-slate-800/50 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            <span>Official Proceeding Metadata</span>
          </h3>

          <div className="mt-4 space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400">Case Category</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{currentCase.category}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400">First Information Report Filed</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">{currentCase.filingDate}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400">Current Legal Stage</span>
              <span className="font-semibold text-teal-800 dark:text-teal-300 uppercase font-mono">
                {currentCase.stage.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400">Next Official Hearing</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-teal-700" />
                {currentCase.nextHearingDate}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500 dark:text-slate-400">Hearing Nature</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{currentCase.nextEventTitle}</span>
            </div>
          </div>
        </div>

        {/* Dedicated Support Team Assignment */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 p-5 shadow-xs">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 pb-3 border-b border-slate-100 dark:border-slate-800/50 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-teal-700" />
            <span>Assigned Support Liaisons</span>
          </h3>

          <div className="mt-4 space-y-3.5 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-700/80">
              <div className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400">
                Designated Clinical Counsellor
              </div>
              <div className="font-semibold text-slate-900 dark:text-white text-sm mt-0.5">
                {victim.assignedCounsellor}
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1">
                Authorized under the District Mental Health and Victim Support Registry.
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-700/80">
              <div className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400">
                District Support & Protection Officer
              </div>
              <div className="font-semibold text-slate-900 dark:text-white text-sm mt-0.5">
                {victim.assignedOfficer}
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1">
                Coordinates courtroom security, safe transport, and protective measures.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
