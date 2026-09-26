import React, { useState } from 'react';
import { 
  Building2, 
  BarChart2, 
  TrendingUp, 
  Users, 
  Clock, 
  ShieldCheck, 
  Download,
  CheckCircle2,
  PieChart
} from 'lucide-react';

export const StateNationalPortal: React.FC = () => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Aggregated de-identified district metrics across the state
  const districtData = [
    { district: "Chennai South", activeCases: 285, requiringReview: 16, interventionsPending: 8, avgHours: 4.1, rate: "94%" },
    { district: "Chennai North", activeCases: 242, requiringReview: 11, interventionsPending: 5, avgHours: 4.6, rate: "91%" },
    { district: "Coimbatore Urban", activeCases: 198, requiringReview: 9, interventionsPending: 4, avgHours: 3.9, rate: "96%" },
    { district: "Madurai Urban", activeCases: 174, requiringReview: 8, interventionsPending: 3, avgHours: 4.4, rate: "93%" },
    { district: "Salem North", activeCases: 142, requiringReview: 6, interventionsPending: 2, avgHours: 4.0, rate: "95%" },
    { district: "Tiruchirappalli", activeCases: 128, requiringReview: 5, interventionsPending: 2, avgHours: 3.7, rate: "97%" }
  ];

  const stageDistribution = [
    { stage: "Complaint Registered", count: 210, percent: "18%" },
    { stage: "Investigation", count: 345, percent: "30%" },
    { stage: "Case Proceedings", count: 260, percent: "22%" },
    { stage: "Trial & Testimony", count: 180, percent: "15%" },
    { stage: "Compensation / Relief", count: 110, percent: "10%" },
    { stage: "Rehabilitation", count: 64, percent: "5%" }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Executive Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-teal-800 font-semibold">
              National & State Executive Oversight
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-mono">Department of Justice & Social Defence</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
            Statewide Victim Support & Early-Intervention Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Aggregated, De-Identified Trajectories & Turnaround Indicators Across Jurisdictions
          </p>
        </div>

        <button
          onClick={() => {
            setDownloadSuccess(true);
            setTimeout(() => setDownloadSuccess(false), 3000);
          }}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export State Parliamentary Brief (CSV/PDF)</span>
        </button>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-950">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Aggregated state executive dataset downloaded successfully. Zero PII exported.</span>
        </div>
      )}

      {/* Privacy Notice Banner */}
      <div className="p-3 bg-slate-100 border border-slate-200 rounded text-xs text-slate-700 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-slate-600 shrink-0" />
        <span>
          <strong>Data Minimization Principle:</strong> Individual victim identities and free-text reflections are isolated at the district caseworker tier. Executive dashboards display purely statistical aggregates.
        </span>
      </div>

      {/* Macro Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total State Caseload</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">1,169</div>
          <div className="text-[11px] text-slate-400 mt-1">Active across 6 pilot districts</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Cases Requiring Review</div>
          <div className="text-2xl font-bold text-orange-800 font-mono mt-1">55</div>
          <div className="text-[11px] text-slate-400 mt-1">4.7% of total active caseload</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Interventions Delivered</div>
          <div className="text-2xl font-bold text-teal-800 font-mono mt-1">842</div>
          <div className="text-[11px] text-slate-400 mt-1">Trauma support, legal aid, relief</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Statewide Response Time</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">4.1 hrs</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">Within 6-hour statutory window</div>
        </div>
      </div>

      {/* District Comparison Grid */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-700 font-bold">
            District Performance & Caseworker Turnaround
          </h3>
          <p className="text-xs text-slate-500">
            Monitoring response times and review completion across judicial divisions
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-mono text-slate-500">
              <tr>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Active Cases</th>
                <th className="py-3 px-4">Flagged for Review</th>
                <th className="py-3 px-4">Interventions Scheduled</th>
                <th className="py-3 px-4">Avg Review Speed</th>
                <th className="py-3 px-4 text-right">Cadence Adherence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {districtData.map((d, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-semibold text-slate-900">{d.district}</td>
                  <td className="py-3 px-4 font-mono font-medium">{d.activeCases}</td>
                  <td className="py-3 px-4 font-mono text-orange-800 font-bold">{d.requiringReview}</td>
                  <td className="py-3 px-4 font-mono text-teal-800">{d.interventionsPending}</td>
                  <td className="py-3 px-4 font-mono">{d.avgHours} hrs</td>
                  <td className="py-3 px-4 font-mono text-right font-bold text-emerald-700">{d.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Stage Distribution */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
        <div className="pb-3 border-b border-slate-100">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-700 font-bold">
            Judicial Stage Distribution Across Monitored Population
          </h3>
          <p className="text-xs text-slate-500">
            Distress correlates strongly with transition phases into Trial and Examination
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {stageDistribution.map((item, idx) => (
            <div key={idx} className="p-3 rounded border border-slate-200 bg-slate-50">
              <div className="text-[11px] text-slate-500 truncate" title={item.stage}>
                {item.stage}
              </div>
              <div className="text-base font-bold text-slate-900 font-mono mt-1">
                {item.count}
              </div>
              <div className="text-[10px] text-teal-700 font-mono mt-0.5">
                {item.percent} of active
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
