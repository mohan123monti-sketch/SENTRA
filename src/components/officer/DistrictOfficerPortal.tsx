import React, { useState } from 'react';
import { useSentra } from '../../context/SentraContext';
import { 
  Building, 
  Users, 
  AlertTriangle, 
  Clock, 
  BarChart3, 
  FileText, 
  Download, 
  Filter, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

export const DistrictOfficerPortal: React.FC = () => {
  const { victim, cases, alerts, interventions } = useSentra();
  const [filterStage, setFilterStage] = useState<string>('all');
  const [reportGenerated, setReportGenerated] = useState<boolean>(false);

  const pendingInterventions = interventions.filter(i => i.status === 'scheduled');
  const urgentAlerts = alerts.filter(a => a.severity === 'priority_review' || a.severity === 'urgent_attention');

  const counsellorWorkloads = [
    { name: "Dr. Ananya Raman", role: "Senior Clinical Counsellor", activeCases: 82, needsReview: 13, avgResponseHours: 4.2 },
    { name: "Dr. K. Swaminathan", role: "Mental Health Specialist", activeCases: 74, needsReview: 6, avgResponseHours: 3.8 },
    { name: "Ms. Radhika Nair", role: "Victim Support Officer", activeCases: 68, needsReview: 9, avgResponseHours: 5.1 },
    { name: "Mr. T. Murugan", role: "DLSA Support Liaison", activeCases: 61, needsReview: 4, avgResponseHours: 3.2 }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Officer Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-teal-800 font-semibold">
              District Administration Command
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-mono">Chennai South District Support Unit</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
            Inspector M. Kumar, District Support & Case Officer
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoring Case Milestones, High-Risk Support Interventions & Caseworker Coordination
          </p>
        </div>

        <button
          onClick={() => {
            setReportGenerated(true);
            setTimeout(() => setReportGenerated(false), 4000);
          }}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Statutory District Report (PDF)</span>
        </button>
      </div>

      {reportGenerated && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-950">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Official District Well-Being & Intervention Log generated with official digital seal.</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Active Cases</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">285</div>
          <div className="text-[11px] text-slate-400 mt-1">Monitored across 6 stages</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-orange-200 bg-orange-50/20 shadow-xs">
          <div className="text-xs text-orange-950 font-medium flex items-center justify-between">
            <span>Requiring Review</span>
            <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-orange-900 font-mono mt-1">
            {urgentAlerts.length + 3}
          </div>
          <div className="text-[11px] text-orange-800 mt-1">Acute baseline deviations</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Pending Interventions</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
            {pendingInterventions.length + 5}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Scheduled within 48h</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Avg Response Time</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">4.1 hrs</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">&darr; 22% faster vs target</div>
        </div>
      </div>

      {/* Priority Cases Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-700 font-bold">
              District Priority Cases
            </h3>
            <p className="text-xs text-slate-500">
              Correlating upcoming trial proceedings with well-being distress signals
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="bg-slate-50 text-slate-700 border border-slate-200 rounded px-2 py-1 text-xs"
            >
              <option value="all">All Stages</option>
              <option value="trial">Trial Stage Only</option>
              <option value="investigation">Investigation</option>
              <option value="compensation_support">Compensation Support</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-mono text-slate-500">
              <tr>
                <th className="py-3 px-4">Case Number</th>
                <th className="py-3 px-4">Victim Pseudonym</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Risk Status</th>
                <th className="py-3 px-4">Next Court Event</th>
                <th className="py-3 px-4">Assigned Counsellor</th>
                <th className="py-3 px-4 text-right">Intervention State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/80 bg-orange-50/20">
                <td className="py-3 px-4 font-mono font-bold text-slate-900">
                  {victim.caseId}
                </td>
                <td className="py-3 px-4 font-mono text-slate-800">{victim.pseudonym}</td>
                <td className="py-3 px-4 uppercase font-mono text-teal-800">
                  {cases[0].stage}
                </td>
                <td className="py-3 px-4">
                  <RiskBadge severity={victim.currentRisk} size="sm" />
                </td>
                <td className="py-3 px-4 font-medium text-slate-900">
                  Trial Examination (04-Oct)
                </td>
                <td className="py-3 px-4 text-slate-600">{victim.assignedCounsellor}</td>
                <td className="py-3 px-4 text-right">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-semibold">
                    Scheduled
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/80">
                <td className="py-3 px-4 font-mono font-bold text-slate-900">
                  CASE-2026-1102
                </td>
                <td className="py-3 px-4 font-mono text-slate-800">Kavita N. (V-7821)</td>
                <td className="py-3 px-4 uppercase font-mono">investigation</td>
                <td className="py-3 px-4">
                  <RiskBadge severity="monitoring" size="sm" />
                </td>
                <td className="py-3 px-4 text-slate-600">Status Review (18-Oct)</td>
                <td className="py-3 px-4 text-slate-600">Dr. Ananya Raman</td>
                <td className="py-3 px-4 text-right">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                    Routine Follow-up
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/80">
                <td className="py-3 px-4 font-mono font-bold text-slate-900">
                  CASE-2026-0422
                </td>
                <td className="py-3 px-4 font-mono text-slate-800">Farida B. (V-6510)</td>
                <td className="py-3 px-4 uppercase font-mono">compensation</td>
                <td className="py-3 px-4">
                  <RiskBadge severity="routine" size="sm" />
                </td>
                <td className="py-3 px-4 text-slate-600">Relief Committee (25-Oct)</td>
                <td className="py-3 px-4 text-slate-600">Dr. K. Swaminathan</td>
                <td className="py-3 px-4 text-right">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                    Completed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Caseworker Staff Workload & Response Turnaround */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-700 font-bold">
              Caseworker Workload & Operational Capacity
            </h3>
            <p className="text-xs text-slate-500">
              Ensuring fair distribution of cases requiring priority human review
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">District Quota: Max 90 / Caseworker</span>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {counsellorWorkloads.map((c, i) => (
            <div key={i} className="p-3.5 rounded border border-slate-200 bg-slate-50/60 space-y-2 text-xs">
              <div className="font-bold text-slate-900">{c.name}</div>
              <div className="text-[11px] text-slate-500 leading-tight">{c.role}</div>
              
              <div className="pt-2 border-t border-slate-200/80 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Active Cases:</span>
                  <span className="font-mono font-bold text-slate-800">{c.activeCases}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Requiring Review:</span>
                  <span className="font-mono font-bold text-orange-700">{c.needsReview}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Avg Turnaround:</span>
                  <span className="font-mono font-medium text-teal-800">{c.avgResponseHours}h</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
