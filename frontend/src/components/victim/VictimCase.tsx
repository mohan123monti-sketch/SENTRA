import React from 'react';
import { useSentra } from '../../context/SentraContext';
import { CaseTimeline } from '../common/CaseTimeline';
import { translations } from '../../utils/translations';
import { FileText, Calendar, User, ShieldCheck, Scale, Clock, Briefcase, Heart } from 'lucide-react';

export const VictimCase: React.FC = () => {
  const { victim, cases, language, checkIns, interventions } = useSentra();
  const t = translations[language];

  const currentCase = cases.find(c => c.id === victim.caseId) || cases[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">

      {/* ── Page Header & Overview ─────────────────────────────── */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 md:p-8 shadow-md text-white">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-teal-300 font-bold bg-teal-900/40 px-2.5 py-1 rounded-md border border-teal-800 inline-flex items-center gap-1.5 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Authorized Case Portal
            </span>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              My Case Overview
            </h1>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              Track your official judicial milestones and statutory support stages. 
              All updates are synchronized securely with the court registry.
            </p>
          </div>

          {/* Case Info Pill */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 min-w-[240px] shrink-0">
            <div className="text-xs text-slate-300 font-mono uppercase mb-1">Case Number</div>
            <div className="text-xl font-bold font-mono tracking-tight text-white mb-4">
              {currentCase.caseNumber}
            </div>
            
            <div className="space-y-2 text-sm text-slate-200">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-slate-400">Jurisdiction</span>
                <span className="font-semibold text-right max-w-[120px] truncate">{currentCase.courtName}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-400">Category</span>
                <span className="font-semibold">{currentCase.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Status & Important Dates ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Current Status Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 md:p-8 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <Scale className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Current Status</h2>
          </div>
          
          <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-900/50 rounded-xl p-5 md:p-6">
            <div className="text-sm font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider mb-2">
              Active Phase
            </div>
            <div className="text-2xl md:text-3xl font-bold text-teal-950 dark:text-teal-100 capitalize mb-2">
              {currentCase.stage.replace('_', ' ')}
            </div>
            <p className="text-sm text-teal-700 dark:text-teal-400">
              The case is currently in the active proceeding phase. Next hearing is focused on "{currentCase.nextEventTitle}".
            </p>
          </div>
        </div>

        {/* Important Dates */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Calendar className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Important Dates</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">FIR Filed</div>
                <div className="text-xs font-mono text-slate-500 mt-1">{currentCase.filingDate}</div>
              </div>
            </div>

            <div className="w-0.5 h-6 bg-slate-100 dark:bg-slate-800 ml-5 -my-2"></div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <div className="text-sm font-bold text-teal-900 dark:text-teal-100">Next Hearing</div>
                <div className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400 mt-1">{currentCase.nextHearingDate}</div>
                <div className="text-xs text-teal-600/80 mt-0.5">{currentCase.nextEventTitle}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Case Timeline ──────────────────────────────────────── */}
      <CaseTimeline
        caseRecord={currentCase}
        checkIns={checkIns}
        interventions={interventions}
      />

      {/* ── Support Available ──────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-teal-600" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Assigned Support Team</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-700/50 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Clinical Counsellor</div>
              <div className="text-base font-bold text-slate-900 dark:text-white">{victim.assignedCounsellor}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Available for emotional support and wellbeing check-ins throughout your case journey.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-700/50 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Protection Officer</div>
              <div className="text-base font-bold text-slate-900 dark:text-white">{victim.assignedOfficer}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Coordinates courtroom security, safe transport, and protective measures during hearings.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
