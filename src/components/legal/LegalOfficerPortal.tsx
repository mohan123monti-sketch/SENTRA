import React, { useState } from 'react';
import { useSentra } from '../../context/SentraContext';
import { 
  Scale, 
  ShieldAlert, 
  ShieldCheck, 
  Calendar, 
  FileText, 
  UserCheck, 
  AlertTriangle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

export const LegalOfficerPortal: React.FC = () => {
  const { victim, cases, alerts } = useSentra();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'alerts' | 'cases' | 'requests'>('dashboard');

  const safetyAlerts = alerts.filter(a => a.severity === 'priority_review' || a.severity === 'urgent_attention');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-teal-800 font-semibold">
              Legal Protection & Witness Safeguard Unit
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-mono">City Sessions Court Jurisdiction</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
            Adv. Rajeshwari Sen, Legal & Protection Liaison
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Administering Witness Protection Protocols, Court Accompaniment & DLSA Coordination
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded transition-colors ${activeTab === 'dashboard' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3 py-1.5 rounded transition-colors ${activeTab === 'alerts' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Safety Alerts ({safetyAlerts.length})
          </button>
          <button
            onClick={() => setActiveTab('cases')}
            className={`px-3 py-1.5 rounded transition-colors ${activeTab === 'cases' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Trial Proceedings (4)
          </button>
        </div>
      </div>

      {/* Statutory Disclaimer Bar */}
      <div className="p-3 bg-teal-50 border border-teal-200 rounded text-xs text-teal-950 flex items-start gap-2">
        <Scale className="w-4 h-4 text-teal-800 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold">Statutory Protocol:</strong> AI systems cannot issue protective orders, witness summons, or legal opinions. AI flags indicate self-reported distress or threat keywords to prioritize timely human legal and protective intervention.
        </div>
      </div>

      {/* Safety Alerts / Protection Requests */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-700 font-bold">
              Active Witness Safety & Threat Indicators
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated against approaching court dates and cross-examination milestones
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            DLSA Protection Protocol Active
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {/* Priority alert for Priya S. (V-9042) */}
          <div className="p-5 hover:bg-slate-50/60 transition-colors bg-orange-50/20">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-900">
                    {victim.pseudonym}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs font-mono text-slate-600">{victim.caseId}</span>
                  <RiskBadge severity={victim.currentRisk} size="sm" />
                </div>

                <h4 className="text-sm font-bold text-slate-900">
                  Imminent Trial Examination Threat / Intimidation Concern
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Complainant's latest check-in explicitly indicated lack of safety and severe distress ahead of the 04-Oct-2026 cross-examination before Court VIII.
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-mono pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-teal-700" />
                    Trial Date: 04-Oct-2026 (Court VIII)
                  </span>
                  <span>·</span>
                  <span>Assigned Officer: Inspector M. Kumar</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                <button
                  onClick={() => alert("Witness security detail confirmed for hearing 04-Oct-2026.")}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  Approve Court Escort Detail
                </button>
              </div>
            </div>
          </div>

          <div className="p-5 hover:bg-slate-50/60 transition-colors">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-900">
                    Kavita N. (V-7821)
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs font-mono text-slate-600">CASE-2026-1102</span>
                  <RiskBadge severity="monitoring" size="sm" />
                </div>

                <h4 className="text-sm font-bold text-slate-900">
                  Investigation Phase Financial Coercion Check
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Requested legal advice regarding injunction against unauthorized asset liquidation by respondent.
                </p>
              </div>

              <button
                onClick={() => alert("Legal consultation scheduled with DLSA Advocate.")}
                className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded text-xs hover:bg-slate-100"
              >
                Assign DLSA Legal Counsel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
