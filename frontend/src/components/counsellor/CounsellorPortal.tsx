import React, { useState } from 'react';
import { useSentra } from '../../context/SentraContext';
import { 
  Users, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  HeartHandshake, 
  FileText, 
  ShieldAlert, 
  Eye, 
  Filter, 
  PlusCircle, 
  MessageSquare,
  Search,
  Cpu
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';
import { TrendChart } from '../common/TrendChart';
import { ExplainableAICard } from '../common/ExplainableAICard';
import { CaseTimeline } from '../common/CaseTimeline';

interface CounsellorPortalProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const CounsellorPortal: React.FC<CounsellorPortalProps> = ({ activeTab = 'dashboard', setActiveTab }) => {
  const { 
    victim, 
    cases, 
    checkIns, 
    alerts, 
    interventions, 
    appointments, 
    reviewAlert, 
    createIntervention 
  } = useSentra();

  const [selectedCaseId, setSelectedCaseId] = useState(victim.caseId);
  const [reviewNote, setReviewNote] = useState('');
  const [reviewDecision, setReviewDecision] = useState<'confirm' | 'followup' | 'escalate' | 'closed'>('followup');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Intervention creation modal state
  const [showInterventionModal, setShowInterventionModal] = useState(false);
  const [interventionTitle, setInterventionTitle] = useState('Pre-Trial Desensitization & Coping Consultation');
  const [interventionType, setInterventionType] = useState<any>('counselling_session');
  const [interventionPriority, setInterventionPriority] = useState<any>('high');
  const [interventionNotes, setInterventionNotes] = useState('Victim reported extreme anxiety regarding the 04-Oct trial examination. One-on-one session to practice grounding and familiarization.');

  const currentCase = cases.find(c => c.id === selectedCaseId) || cases[0];
  const pendingAlerts = alerts.filter(a => a.status === 'new');
  const latestCheckIn = checkIns[0];

  const handleExecuteHumanReview = (alertId: string) => {
    if (!reviewNote.trim()) {
      alert("Please add professional clinical notes before submitting human review.");
      return;
    }
    reviewAlert(alertId, reviewNote, reviewDecision);
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  const handleCreateInterventionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createIntervention({
      victimId: victim.id,
      caseId: victim.caseId,
      victimPseudonym: victim.pseudonym,
      createdBy: "Dr. Ananya Raman (Senior Clinical Counsellor)",
      creatorRole: "Counsellor",
      type: interventionType,
      title: interventionTitle,
      priority: interventionPriority,
      status: "scheduled",
      actionNotes: interventionNotes
    }, true);

    setShowInterventionModal(false);
    if (setActiveTab) setActiveTab('interventions');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Breadcrumb & Caseworker Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-teal-800 dark:text-teal-300 font-semibold">
              Clinical Caseworker Operational Console
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Registry DLSA-TN-408</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            Dr. Ananya Raman, Senior Clinical Counsellor
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Assigned District: Chennai South · 82 Active Supervised Complainants
          </p>
        </div>
      </div>

      {/* TAB 1: OPERATIONAL DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Metric Blocks */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Assigned Cases</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono mt-1">82</div>
              <div className="text-[11px] text-slate-400 mt-1">Active caseload across 3 courts</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-orange-200 bg-orange-50/20 shadow-xs">
              <div className="text-xs text-orange-950 font-medium flex items-center justify-between">
                <span>Needs Review</span>
                <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
              </div>
              <div className="text-2xl font-bold text-orange-900 font-mono mt-1">13</div>
              <div className="text-[11px] text-orange-800 mt-1">Baseline deviations logged</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Follow-ups Pending</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono mt-1">7</div>
              <div className="text-[11px] text-slate-400 mt-1">Check-in lapses & requests</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Appointments Today</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono mt-1">5</div>
              <div className="text-[11px] text-slate-400 mt-1">2 telehealth, 3 court liaison</div>
            </div>
          </div>

          {/* Priority Alert Banner for Priya S. (V-9042) */}
          {pendingAlerts.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-orange-200 p-5 shadow-xs border-l-4 border-l-orange-600">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-orange-600 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      High Priority Human Review Required: {victim.pseudonym}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Case {victim.caseId} · Trial hearing cross-examination in 8 days (04-Oct-2026)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <RiskBadge severity={victim.currentRisk} />
                  <button
                    onClick={() => { if (setActiveTab) setActiveTab('casedetail'); }}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <span>Inspect Case & Baseline</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                <strong className="text-slate-800 dark:text-slate-200">Trigger Summary:</strong> Distress index elevated to <strong>{latestCheckIn?.analysis.distressIndicator}/100</strong> (+{latestCheckIn?.analysis.baselineDelta.distressDeltaPercent}% over personal baseline). Complainant reported acute sleep deprivation and requested counsellor follow-up.
              </div>
            </div>
          )}

          {/* Quick Queue of Flagged Cases */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-bold">
                  Caseworker Priority Review Queue
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Cases requiring evaluation due to baseline variance</p>
              </div>
              <button
                onClick={() => { if (setActiveTab) setActiveTab('cases'); }}
                className="text-xs text-teal-800 dark:text-teal-300 font-semibold hover:underline"
              >
                View Full Caseload &rarr;
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-700/80 text-[11px] uppercase font-mono text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="py-2.5 px-4">Victim ID</th>
                    <th className="py-2.5 px-4">Case Stage</th>
                    <th className="py-2.5 px-4">Status & Risk</th>
                    <th className="py-2.5 px-4">Baseline Variance</th>
                    <th className="py-2.5 px-4">Upcoming Event</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 dark:bg-slate-950/80 bg-orange-50/20">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {victim.pseudonym}
                    </td>
                    <td className="py-3 px-4 uppercase font-mono text-slate-600 dark:text-slate-400">
                      {currentCase.stage.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4">
                      <RiskBadge severity={victim.currentRisk} size="sm" />
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-rose-700">
                      +{latestCheckIn?.analysis.baselineDelta.distressDeltaPercent}% Distress Shift
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      Trial Examination (04-Oct)
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => { if (setActiveTab) setActiveTab('casedetail'); }}
                        className="px-2.5 py-1 bg-teal-700 text-white rounded text-xs font-semibold hover:bg-teal-800"
                      >
                        Review
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 dark:bg-slate-950/80">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      Kavita N. (V-7821)
                    </td>
                    <td className="py-3 px-4 uppercase font-mono text-slate-600 dark:text-slate-400">
                      Investigation
                    </td>
                    <td className="py-3 px-4">
                      <RiskBadge severity="monitoring" size="sm" />
                    </td>
                    <td className="py-3 px-4 font-mono text-amber-700">
                      Cadence Lapse (Missed 2w)
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      Investigative Review (18-Oct)
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => alert("Reviewing case V-7821")}
                        className="px-2.5 py-1 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs hover:bg-slate-100 dark:bg-slate-900/80"
                      >
                        Details
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 dark:bg-slate-950/80">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      Farida B. (V-6510)
                    </td>
                    <td className="py-3 px-4 uppercase font-mono text-slate-600 dark:text-slate-400">
                      Compensation
                    </td>
                    <td className="py-3 px-4">
                      <RiskBadge severity="routine" size="sm" />
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-700">
                      Nominal / Stabilized
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      Grant Committee (25-Oct)
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => alert("Case V-6510 is in routine monitoring.")}
                        className="px-2.5 py-1 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs hover:bg-slate-100 dark:bg-slate-900/80"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ASSIGNED CASES LIST */}
      {activeTab === 'cases' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Assigned Complainant Registry
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Authorized clinical caseload under District Legal Services Authority & Victim Support Unit
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by ID or Case..."
                  className="pl-8 pr-3 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-teal-700"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-700/80 text-[11px] uppercase font-mono text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="py-3 px-4">Victim Pseudonym</th>
                  <th className="py-3 px-4">Case Number</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Current Risk Level</th>
                  <th className="py-3 px-4">Language</th>
                  <th className="py-3 px-4">Check-ins</th>
                  <th className="py-3 px-4 text-right">Open File</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 dark:bg-slate-950/80">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {victim.pseudonym}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">{victim.caseId}</td>
                  <td className="py-3 px-4 uppercase font-mono">{currentCase.stage}</td>
                  <td className="py-3 px-4">
                    <RiskBadge severity={victim.currentRisk} size="sm" />
                  </td>
                  <td className="py-3 px-4 font-mono uppercase">{victim.preferredLanguage}</td>
                  <td className="py-3 px-4 font-mono">{checkIns.length} logged</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => { if (setActiveTab) setActiveTab('casedetail'); }}
                      className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800"
                    >
                      View Detail
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 dark:bg-slate-950/80">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    Kavita N. (V-7821)
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">CASE-2026-1102</td>
                  <td className="py-3 px-4 uppercase font-mono">investigation</td>
                  <td className="py-3 px-4">
                    <RiskBadge severity="monitoring" size="sm" />
                  </td>
                  <td className="py-3 px-4 font-mono uppercase">ta</td>
                  <td className="py-3 px-4 font-mono">5 logged</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => alert("Loading V-7821")}
                      className="px-3 py-1 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs hover:bg-slate-100 dark:bg-slate-900/80"
                    >
                      View Detail
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 dark:bg-slate-950/80">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    Farida B. (V-6510)
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">CASE-2026-0422</td>
                  <td className="py-3 px-4 uppercase font-mono">compensation_support</td>
                  <td className="py-3 px-4">
                    <RiskBadge severity="routine" size="sm" />
                  </td>
                  <td className="py-3 px-4 font-mono uppercase">en</td>
                  <td className="py-3 px-4 font-mono">11 logged</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => alert("Loading V-6510")}
                      className="px-3 py-1 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs hover:bg-slate-100 dark:bg-slate-900/80"
                    >
                      View Detail
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CASE DETAIL WITH LONGITUDINAL TREND, EXPLAINABLE AI, AND HUMAN REVIEW */}
      {activeTab === 'casedetail' && (
        <div className="space-y-6">
          {/* Case Header Card */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-teal-800 dark:text-teal-300 font-semibold">
                    Clinical Case Profile
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Jurisdiction: {victim.district}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                  <span>{victim.pseudonym}</span>
                  <RiskBadge severity={victim.currentRisk} />
                </h2>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                  <span>Age Group: {victim.ageGroup}</span>
                  <span>·</span>
                  <span>Preferred Language: {victim.preferredLanguage.toUpperCase()}</span>
                  <span>·</span>
                  <span>Case ID: <strong className="font-mono">{victim.caseId}</strong></span>
                  <span>·</span>
                  <span>Hearing: <strong>{currentCase.nextHearingDate} ({currentCase.nextEventTitle})</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowInterventionModal(true)}
                  className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Intervention Plan</span>
                </button>
              </div>
            </div>
          </div>

          {/* Longitudinal Trend Chart: Personal Baseline vs Check-ins */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800/50">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Longitudinal Well-Being Trajectory
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  Personal Baseline vs. Multi-Week Distress Indices
                </h3>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Baseline Established Average: <strong className="font-mono text-teal-800 dark:text-teal-300">26 / 100</strong>
              </div>
            </div>

            <div className="mt-4">
              <TrendChart 
                checkIns={checkIns} 
                baselineScore={26} 
                height={200} 
              />
            </div>
          </div>

          {/* SIGNATURE COMPONENT: "WHAT CHANGED?" EXPLAINABLE AI CARD */}
          {latestCheckIn && (
            <ExplainableAICard 
              analysis={latestCheckIn.analysis} 
              victimPseudonym={victim.pseudonym} 
              showTechnicalMetrics={true} 
            />
          )}

          {/* Signature Case Lifecycle Timeline */}
          <CaseTimeline 
            caseRecord={currentCase} 
            checkIns={checkIns} 
            interventions={interventions} 
          />

          {/* HUMAN REVIEW FORM (CRITICAL WORKFLOW) */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 p-6 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-teal-800 dark:text-teal-300 font-semibold">
                  Caseworker Mandate
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Record Professional Human Assessment & Review Decision
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Mandatory Human-in-the-Loop Protocol
              </span>
            </div>

            {reviewSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-950 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Human review officially logged to immutable audit trail. Caseworker decision registered.
                </span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label htmlFor="clinical-notes" className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  Professional Observations & Clinical Rationale:
                </label>
                <textarea
                  id="clinical-notes"
                  rows={3}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="Record your clinical evaluation of the victim's self-reported stress, upcoming court anxiety, and recommended support..."
                  className="w-full text-xs rounded border border-slate-300 dark:border-slate-700 p-3 focus:border-teal-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Select Intervention / Review Action:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setReviewDecision('followup')}
                    className={`p-2.5 rounded border text-left font-medium transition-colors ${
                      reviewDecision === 'followup' 
                        ? 'border-teal-700 bg-teal-50 dark:bg-teal-900/30 text-teal-950 ring-1 ring-teal-700' 
                        : 'border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="font-bold">Schedule Follow-up</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Initiate counselling session</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReviewDecision('confirm')}
                    className={`p-2.5 rounded border text-left font-medium transition-colors ${
                      reviewDecision === 'confirm' 
                        ? 'border-amber-600 bg-amber-50 text-amber-950 ring-1 ring-amber-600' 
                        : 'border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="font-bold">Active Monitoring</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Maintain weekly cadence</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReviewDecision('escalate')}
                    className={`p-2.5 rounded border text-left font-medium transition-colors ${
                      reviewDecision === 'escalate' 
                        ? 'border-rose-600 bg-rose-50 text-rose-950 ring-1 ring-rose-600' 
                        : 'border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="font-bold">Escalate to Officer</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Request protection review</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReviewDecision('closed')}
                    className={`p-2.5 rounded border text-left font-medium transition-colors ${
                      reviewDecision === 'closed' 
                        ? 'border-slate-700 bg-slate-100 dark:bg-slate-900/80 text-slate-900 dark:text-white ring-1 ring-slate-700' 
                        : 'border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="font-bold">Mark Evaluated</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Close open alert</div>
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  AI does not independently approve or execute interventions.
                </span>

                <button
                  type="button"
                  onClick={() => handleExecuteHumanReview(alerts[0]?.id || 'ALT-DEMO')}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Submit Human Assessment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ALERTS QUEUE */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 p-5 shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                AI Decision-Support Alert Center
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Flagged indicators generated from self-reported check-in deviations against personal baselines
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 p-5 shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                      {alert.victimPseudonym}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{alert.caseId}</span>
                    <RiskBadge severity={alert.severity} size="sm" />
                    <span className="text-[11px] font-mono text-slate-400">
                      Model Conf: {alert.confidence}% (v{alert.modelVersion})
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {alert.title}
                  </h3>

                  <ul className="space-y-1 list-disc pl-5 text-xs text-slate-600 dark:text-slate-400">
                    {alert.whyFlagged.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>

                  {alert.counsellorNotes && (
                    <div className="mt-2 p-2.5 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-700/80 text-xs">
                      <strong className="text-slate-800 dark:text-slate-200">Counsellor Review Note:</strong> {alert.counsellorNotes}
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">
                        Reviewed by {alert.reviewedBy} at {alert.reviewedAt}
                      </div>
                    </div>
                  )}
                </div>

                <div className="shrink-0 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setSelectedCaseId(alert.caseId);
                      if (setActiveTab) setActiveTab('casedetail');
                    }}
                    className="px-3.5 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800"
                  >
                    Evaluate Case
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: INTERVENTIONS */}
      {activeTab === 'interventions' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 p-5 shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Intervention & Support Tracking
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Statutory counselling sessions, protection referrals, and compensation assistance
              </p>
            </div>

            <button
              onClick={() => setShowInterventionModal(true)}
              className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record New Intervention</span>
            </button>
          </div>

          <div className="space-y-3">
            {interventions.map((item) => (
              <div 
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 p-5 shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">{item.id}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs font-semibold text-teal-800 dark:text-teal-300 font-mono uppercase">
                      {item.type.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 uppercase font-semibold">
                      {item.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.actionNotes}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono pt-1">
                    <span>Target: {item.victimPseudonym}</span>
                    <span>·</span>
                    <span>Logged by: {item.createdBy} ({item.creatorRole})</span>
                    <span>·</span>
                    <span>Date: {new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: CREATE INTERVENTION */}
      {showInterventionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 max-w-lg w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800/50">
              Create Authorized Intervention Plan
            </h3>

            <form onSubmit={handleCreateInterventionSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  Intervention Title:
                </label>
                <input
                  type="text"
                  value={interventionTitle}
                  onChange={(e) => setInterventionTitle(e.target.value)}
                  className="w-full text-xs rounded border border-slate-300 dark:border-slate-700 p-2 focus:border-teal-700 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Service Type:
                  </label>
                  <select
                    value={interventionType}
                    onChange={(e) => setInterventionType(e.target.value)}
                    className="w-full text-xs rounded border border-slate-300 dark:border-slate-700 p-2 focus:border-teal-700 focus:outline-none"
                  >
                    <option value="counselling_session">Psychological Counselling</option>
                    <option value="legal_aid_referral">Legal Aid / DLSA Referral</option>
                    <option value="safety_review">Safety / Protection Review</option>
                    <option value="rehabilitation_grant">Rehabilitation Assistance</option>
                    <option value="welfare_check">Welfare Check-in</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Priority Level:
                  </label>
                  <select
                    value={interventionPriority}
                    onChange={(e) => setInterventionPriority(e.target.value)}
                    className="w-full text-xs rounded border border-slate-300 dark:border-slate-700 p-2 focus:border-teal-700 focus:outline-none"
                  >
                    <option value="routine">Routine</option>
                    <option value="medium">Medium</option>
                    <option value="high">High (Pre-Hearing)</option>
                    <option value="immediate">Immediate Attention</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  Action & Coordination Notes:
                </label>
                <textarea
                  rows={3}
                  value={interventionNotes}
                  onChange={(e) => setInterventionNotes(e.target.value)}
                  className="w-full text-xs rounded border border-slate-300 dark:border-slate-700 p-2.5 focus:border-teal-700 focus:outline-none"
                  required
                />
              </div>

              <div className="p-2.5 bg-teal-50 dark:bg-teal-900/30 border border-teal-200 rounded text-[11px] text-teal-900 dark:text-teal-100">
                Notice: Submitting will automatically schedule an appointment slot and notify the victim's portal.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/50">
                <button
                  type="button"
                  onClick={() => setShowInterventionModal(false)}
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
