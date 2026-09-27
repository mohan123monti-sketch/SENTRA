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
  CheckCircle2,
  PlusCircle,
  Activity,
  PieChart
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';
import { saveVictimProfileToDB } from '../../services/db';
import { VictimProfile } from '../../types/sentra';
import { INITIAL_VICTIM } from '../../data/mockData';

export const DistrictOfficerPortal: React.FC = () => {
  const { victim, cases, alerts, interventions } = useSentra();
  const [filterStage, setFilterStage] = useState<string>('all');
  const [reportGenerated, setReportGenerated] = useState<boolean>(false);

  const pendingInterventions = interventions.filter(i => i.status === 'scheduled');
  const urgentAlerts = alerts.filter(a => a.severity === 'priority_review' || a.severity === 'urgent_attention');

  // New Victim State
  const [showAddVictim, setShowAddVictim] = useState(false);
  const [newVictim, setNewVictim] = useState({ name: '', mobileNumber: '', caseType: 'General Support', ageGroup: '18-24', gender: 'Female' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddVictim = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const generatedId = `V-${Math.floor(1000 + Math.random() * 9000)}`;
    const generatedCaseId = `CASE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const victimToSave: VictimProfile = {
      ...INITIAL_VICTIM,
      id: generatedId,
      name: newVictim.name,
      pseudonym: `${newVictim.name} (${generatedId})`,
      mobileNumber: newVictim.mobileNumber,
      caseType: newVictim.caseType,
      ageGroup: newVictim.ageGroup,
      gender: newVictim.gender,
      caseId: generatedCaseId,
      district: 'Chennai South'
    };

    await saveVictimProfileToDB(victimToSave);
    setIsSubmitting(false);
    setShowAddVictim(false);
    alert(`Victim ${newVictim.name} successfully registered with ID: ${generatedId}`);
    setNewVictim({ name: '', mobileNumber: '', caseType: 'General Support', ageGroup: '18-24', gender: 'Female' });
  };

  const counsellorWorkloads = [
    { name: "Dr. Ananya Raman", role: "Senior Clinical Counsellor", activeCases: 82, needsReview: 13, avgResponseHours: 4.2 },
    { name: "Dr. K. Swaminathan", role: "Mental Health Specialist", activeCases: 74, needsReview: 6, avgResponseHours: 3.8 },
    { name: "Ms. Radhika Nair", role: "Victim Support Officer", activeCases: 68, needsReview: 9, avgResponseHours: 5.1 },
    { name: "Mr. T. Murugan", role: "DLSA Support Liaison", activeCases: 61, needsReview: 4, avgResponseHours: 3.2 }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Officer Header */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-teal-800 dark:text-teal-300 font-semibold">
              District Administration Command
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Chennai South District Support Unit</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            Inspector M. Kumar, District Support & Case Officer
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitoring Case Milestones, High-Risk Support Interventions & Caseworker Coordination
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddVictim(!showAddVictim)}
            className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add New Victim</span>
          </button>
          <button
            onClick={() => {
              setReportGenerated(true);
              setTimeout(() => setReportGenerated(false), 4000);
            }}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report (PDF)</span>
          </button>
        </div>
      </div>

      {showAddVictim && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/50 mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Register New Complainant (Victim)</h3>
            <button onClick={() => setShowAddVictim(false)} className="text-xs text-slate-500 hover:text-slate-800">Close</button>
          </div>
          <form onSubmit={handleAddVictim} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Full Name</label>
              <input required type="text" value={newVictim.name} onChange={e => setNewVictim({...newVictim, name: e.target.value})} className="w-full p-2 border rounded" placeholder="e.g. Meera R." />
            </div>
            <div>
              <label className="block font-semibold mb-1">Mobile Number</label>
              <input required type="text" value={newVictim.mobileNumber} onChange={e => setNewVictim({...newVictim, mobileNumber: e.target.value})} className="w-full p-2 border rounded" placeholder="e.g. 9876543210" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Case Category</label>
              <select value={newVictim.caseType} onChange={e => setNewVictim({...newVictim, caseType: e.target.value})} className="w-full p-2 border rounded">
                <option value="General Support">General Support</option>
                <option value="Special Offence & Intimidation">Special Offence & Intimidation</option>
                <option value="Domestic Harassment">Domestic Harassment</option>
                <option value="Aggravated Assault">Aggravated Assault</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Age Group</label>
              <select value={newVictim.ageGroup} onChange={e => setNewVictim({...newVictim, ageGroup: e.target.value})} className="w-full p-2 border rounded">
                <option value="Under 18">Under 18</option>
                <option value="18-24">18-24</option>
                <option value="25-34">25-34</option>
                <option value="35-44">35-44</option>
                <option value="45+">45+</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Gender</label>
              <select value={newVictim.gender} onChange={e => setNewVictim({...newVictim, gender: e.target.value})} className="w-full p-2 border rounded">
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={isSubmitting} className="w-full py-2 bg-teal-700 text-white font-semibold rounded hover:bg-teal-800">
                {isSubmitting ? 'Registering...' : 'Register Victim to Database'}
              </button>
            </div>
          </form>
        </div>
      )}

      {reportGenerated && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-950">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Official District Well-Being & Intervention Log generated with official digital seal.</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Active Cases</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono mt-1">285</div>
          <div className="text-[11px] text-slate-400 mt-1">Monitored across 6 stages</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-orange-200 bg-orange-50/20 shadow-xs">
          <div className="text-xs text-orange-950 font-medium flex items-center justify-between">
            <span>Requiring Review</span>
            <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-orange-900 font-mono mt-1">
            {urgentAlerts.length + 3}
          </div>
          <div className="text-[11px] text-orange-800 mt-1">Acute baseline deviations</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pending Interventions</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono mt-1">
            {pendingInterventions.length + 5}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Scheduled within 48h</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-between">
            <span>District Success Rate</span>
            <Activity className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono mt-1">94.2%</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">&uarr; +2.4% this quarter</div>
        </div>
      </div>

      {/* Demographics & Categories Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center gap-2 mb-3 border-b pb-2 border-slate-100">
            <PieChart className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Priority Breakdown</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-slate-500">Routine</span><span className="font-mono">60%</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Monitoring</span><span className="font-mono">25%</span></div>
            <div className="flex justify-between"><span className="text-orange-600 font-semibold">Priority Review</span><span className="font-mono font-bold text-orange-600">10%</span></div>
            <div className="flex justify-between"><span className="text-rose-600 font-semibold">Urgent</span><span className="font-mono font-bold text-rose-600">5%</span></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center gap-2 mb-3 border-b pb-2 border-slate-100">
            <Users className="w-4 h-4 text-teal-500" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Age Demographics</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-slate-500">Under 18</span><span className="font-mono">15%</span></div>
            <div className="flex justify-between"><span className="text-slate-500">18 - 24</span><span className="font-mono">35%</span></div>
            <div className="flex justify-between"><span className="text-slate-500">25 - 34</span><span className="font-mono">30%</span></div>
            <div className="flex justify-between"><span className="text-slate-500">35+</span><span className="font-mono">20%</span></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center gap-2 mb-3 border-b pb-2 border-slate-100">
            <Users className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Gender Identity</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-slate-500">Female</span><span className="font-mono">75%</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Male</span><span className="font-mono">20%</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Other / Unspecified</span><span className="font-mono">5%</span></div>
          </div>
        </div>
      </div>

      {/* Priority Cases Table */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-bold">
              District Priority Cases
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Correlating upcoming trial proceedings with well-being distress signals
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 rounded px-2 py-1 text-xs"
            >
              <option value="all">All Stages</option>
              <option value="trial">Trial Stage Only</option>
              <option value="investigation">Investigation</option>
              <option value="compensation_support">Compensation Support</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-700/80 text-[11px] uppercase font-mono text-slate-500 dark:text-slate-400">
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
              <tr className="hover:bg-slate-50 dark:bg-slate-950/80 bg-orange-50/20">
                <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                  {victim.caseId}
                </td>
                <td className="py-3 px-4 font-mono text-slate-800 dark:text-slate-200">{victim.pseudonym}</td>
                <td className="py-3 px-4 uppercase font-mono text-teal-800 dark:text-teal-300">
                  {cases[0].stage}
                </td>
                <td className="py-3 px-4">
                  <RiskBadge severity={victim.currentRisk} size="sm" />
                </td>
                <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                  Trial Examination (04-Oct)
                </td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{victim.assignedCounsellor}</td>
                <td className="py-3 px-4 text-right">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-teal-100 text-teal-800 dark:text-teal-300 font-semibold">
                    Scheduled
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 dark:bg-slate-950/80">
                <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                  CASE-2026-1102
                </td>
                <td className="py-3 px-4 font-mono text-slate-800 dark:text-slate-200">Kavita N. (V-7821)</td>
                <td className="py-3 px-4 uppercase font-mono">investigation</td>
                <td className="py-3 px-4">
                  <RiskBadge severity="monitoring" size="sm" />
                </td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">Status Review (18-Oct)</td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">Dr. Ananya Raman</td>
                <td className="py-3 px-4 text-right">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 font-semibold">
                    Routine Follow-up
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 dark:bg-slate-950/80">
                <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                  CASE-2026-0422
                </td>
                <td className="py-3 px-4 font-mono text-slate-800 dark:text-slate-200">Farida B. (V-6510)</td>
                <td className="py-3 px-4 uppercase font-mono">compensation</td>
                <td className="py-3 px-4">
                  <RiskBadge severity="routine" size="sm" />
                </td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">Relief Committee (25-Oct)</td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">Dr. K. Swaminathan</td>
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
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/50">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" /> Top Counselors & Workload
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Ranking operational capacity and response turnaround across the district
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">District Quota: Max 90 / Caseworker</span>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {counsellorWorkloads.map((c, i) => (
            <div key={i} className="p-3.5 rounded border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-950/60 space-y-2 text-xs">
              <div className="font-bold text-slate-900 dark:text-white">{c.name}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{c.role}</div>
              
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700/80/80 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Active Cases:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{c.activeCases}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Requiring Review:</span>
                  <span className="font-mono font-bold text-orange-700">{c.needsReview}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Avg Turnaround:</span>
                  <span className="font-mono font-medium text-teal-800 dark:text-teal-300">{c.avgResponseHours}h</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
