import React, { useState } from 'react';
import { useSentra } from '../../context/SentraContext';
import { 
  Server, 
  Users, 
  ShieldCheck, 
  FileCode, 
  Sliders, 
  Cpu, 
  Lock, 
  Bell, 
  CheckCircle2,
  RefreshCw,
  UserPlus,
  Globe,
  Search
} from 'lucide-react';

export const SystemAdminPortal: React.FC = () => {
  const { auditLogs, resetDemoData } = useSentra();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'roles' | 'audit_logs' | 'configuration' | 'ai_model'>('overview');
  const [logSearch, setLogSearch] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showAddStateUser, setShowAddStateUser] = useState(false);
  const [newStateUser, setNewStateUser] = useState({ name: '', email: '', state: 'Tamil Nadu' });
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);

  const handleAddStateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingUser(true);
    setTimeout(() => {
      alert(`State Admin ${newStateUser.name} successfully registered for ${newStateUser.state}.`);
      setIsSubmittingUser(false);
      setShowAddStateUser(false);
      setNewStateUser({ name: '', email: '', state: 'Tamil Nadu' });
    }, 1000);
  };

  const stateAnalytics = [
    { state: 'Tamil Nadu', activeCases: 1169, successRate: '94.3%' },
    { state: 'Karnataka', activeCases: 842, successRate: '92.1%' },
    { state: 'Maharashtra', activeCases: 1530, successRate: '89.5%' },
    { state: 'Delhi', activeCases: 2100, successRate: '91.2%' }
  ];

  const filteredLogs = auditLogs.filter(log => 
    log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
    log.actor.toLowerCase().includes(logSearch.toLowerCase()) ||
    log.resource.toLowerCase().includes(logSearch.toLowerCase())
  );

  const rbacMatrix = [
    { role: "Victim / Complainant", checkins: "Write / Read Own", caseInfo: "Authorized Read", aiCalculations: "No Access", clinicalNotes: "No Access", systemConfig: "No Access" },
    { role: "Clinical Counsellor", checkins: "Read Assigned", caseInfo: "Full Read Assigned", aiCalculations: "Full Read & Evaluate", clinicalNotes: "Write & Read Assigned", systemConfig: "No Access" },
    { role: "District Case Officer", checkins: "Read Masked Assigned", caseInfo: "Full Read Assigned", aiCalculations: "Alerts & Risk Read", clinicalNotes: "Interventions Only", systemConfig: "No Access" },
    { role: "Legal Protection Officer", checkins: "Safety Triggers Only", caseInfo: "Proceedings Read", aiCalculations: "Safety Alerts", clinicalNotes: "Protection Only", systemConfig: "No Access" },
    { role: "State / National Admin", checkins: "Aggregated Metrics", caseInfo: "De-Identified Macro", aiCalculations: "Macro Distribution", clinicalNotes: "No Access", systemConfig: "No Access" },
    { role: "System Administrator", checkins: "No Access (PII Isolated)", caseInfo: "No Access (PII Isolated)", aiCalculations: "Telemetry & Calibrations", clinicalNotes: "No Access", systemConfig: "Full Administrative" }
  ];

  const handleReset = () => {
    resetDemoData();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-teal-800 dark:text-teal-300 font-semibold">
              Platform Infrastructure & Cyber Governance
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Host: sentra-cluster-01.gov</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            System Administration & Security Console
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cryptographic Audit Logging, RBAC Enforcement, AI Model Registry & National Analytics
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddStateUser(!showAddStateUser)}
            className="px-3.5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add State Admin</span>
          </button>
        </div>
      </div>

      {showAddStateUser && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/50 mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Register New State Administrator
            </h3>
            <button onClick={() => setShowAddStateUser(false)} className="text-xs text-slate-500 hover:text-slate-800">Close</button>
          </div>
          <form onSubmit={handleAddStateUser} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Full Name</label>
              <input required type="text" value={newStateUser.name} onChange={e => setNewStateUser({...newStateUser, name: e.target.value})} className="w-full p-2 border rounded" placeholder="e.g. IAS Officer Sharma" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Email / Login ID</label>
              <input required type="email" value={newStateUser.email} onChange={e => setNewStateUser({...newStateUser, email: e.target.value})} className="w-full p-2 border rounded" placeholder="e.g. admin@mh.gov.in" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Assigned State</label>
              <select value={newStateUser.state} onChange={e => setNewStateUser({...newStateUser, state: e.target.value})} className="w-full p-2 border rounded">
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi">Delhi</option>
              </select>
            </div>
            <div className="sm:col-span-3 flex justify-end">
              <button type="submit" disabled={isSubmittingUser} className="px-6 py-2 bg-slate-900 text-white font-semibold rounded hover:bg-slate-800">
                {isSubmittingUser ? 'Registering...' : 'Complete Registration'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab Controls */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900/80 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded transition-colors ${activeTab === 'overview' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-3 py-1.5 rounded transition-colors ${activeTab === 'roles' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white'}`}
          >
            RBAC Matrix
          </button>
          <button
            onClick={() => setActiveTab('audit_logs')}
            className={`px-3 py-1.5 rounded transition-colors ${activeTab === 'audit_logs' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white'}`}
          >
            Audit Logs ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('ai_model')}
            className={`px-3 py-1.5 rounded transition-colors ${activeTab === 'ai_model' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white'}`}
          >
            AI Model Info
          </button>
          <button
            onClick={() => setActiveTab('configuration')}
            className={`px-3 py-1.5 rounded transition-colors ${activeTab === 'configuration' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white'}`}
          >
            Configuration
          </button>
        </div>

      {resetSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-950 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Demo environment dataset restored to clean baseline state.</span>
        </div>
      )}

      {/* Strict Privacy Isolation Notice */}
      <div className="p-3 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 rounded text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
        <Lock className="w-4 h-4 text-slate-700 dark:text-slate-300 shrink-0" />
        <span>
          <strong>Zero-Access Security Bound:</strong> System administrators do not possess decryption privileges for sensitive victim case conversations or clinical notes.
        </span>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Cluster Health</div>
              <div className="text-xl font-bold text-emerald-700 font-mono mt-1 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Operational</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Uptime 99.98%</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Data Encryption</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-1">AES-256</div>
              <div className="text-[11px] text-slate-400 mt-1">At rest & in transit (TLS 1.3)</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Immutable Audit Trail</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-1">Active</div>
              <div className="text-[11px] text-slate-400 mt-1">{auditLogs.length} verified events</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Model Inference State</div>
              <div className="text-xl font-bold text-teal-800 dark:text-teal-300 font-mono mt-1">v2.4.1 (SHAP)</div>
              <div className="text-[11px] text-slate-400 mt-1">Explainability Calibrated</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">National Success Rate</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-1">91.8%</div>
              <div className="text-[11px] text-emerald-700 font-medium mt-1">Average across all states</div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 p-5 shadow-xs">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-bold pb-2 border-b border-slate-100 dark:border-slate-800/50 mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-teal-600" /> State-Wise Success & Analytics
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-700/80 text-[11px] uppercase font-mono text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="py-2.5 px-4">State</th>
                    <th className="py-2.5 px-4">Total Active Cases</th>
                    <th className="py-2.5 px-4">Reported Success Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stateAnalytics.map((s, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:bg-slate-950/80">
                      <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">{s.state}</td>
                      <td className="py-2.5 px-4 font-mono">{s.activeCases}</td>
                      <td className="py-2.5 px-4 font-mono font-bold text-emerald-700">{s.successRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/50">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-bold">
                Demo Environment Management
              </h3>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Demo to Clean State</span>
              </button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
              Use this control to reset all check-ins, simulated alerts, casework interventions, and appointments back to the baseline demonstration setup.
            </p>
          </div>
        </div>
      )}

      {/* RBAC MATRIX TAB */}
      {activeTab === 'roles' && (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700/80">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-bold">
              Strict Role-Based Access Control (RBAC) Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Least-privilege policy governing access across judicial, clinical, and administrative tiers
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-700/80 text-[11px] uppercase font-mono text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="py-3 px-4">Role Title</th>
                  <th className="py-3 px-4">Check-ins & Voice</th>
                  <th className="py-3 px-4">Case Lifecycle</th>
                  <th className="py-3 px-4">AI Risk Diagnostics</th>
                  <th className="py-3 px-4">Caseworker Notes</th>
                  <th className="py-3 px-4 text-right">System Configuration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rbacMatrix.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:bg-slate-950/80">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{r.role}</td>
                    <td className="py-3 px-4 font-mono">{r.checkins}</td>
                    <td className="py-3 px-4">{r.caseInfo}</td>
                    <td className="py-3 px-4">{r.aiCalculations}</td>
                    <td className="py-3 px-4">{r.clinicalNotes}</td>
                    <td className="py-3 px-4 text-right font-mono">{r.systemConfig}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AUDIT LOGS TAB */}
      {activeTab === 'audit_logs' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-bold">
                Tamper-Evident Security Audit Trail
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                All logins, check-ins, human evaluations, consent updates, and caseworker interventions are cryptographically registered
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                placeholder="Search audit trail..."
                className="pl-8 pr-3 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-teal-700"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-700 dark:text-slate-300 font-mono">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-700/80 text-[11px] uppercase text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="py-2.5 px-4">Event ID</th>
                    <th className="py-2.5 px-4">Timestamp (UTC)</th>
                    <th className="py-2.5 px-4">Actor & Role</th>
                    <th className="py-2.5 px-4">Action</th>
                    <th className="py-2.5 px-4">Resource</th>
                    <th className="py-2.5 px-4">Masked IP</th>
                    <th className="py-2.5 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:bg-slate-950/80">
                      <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">{log.id}</td>
                      <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400 text-[11px]">{log.timestamp}</td>
                      <td className="py-2.5 px-4 text-slate-800 dark:text-slate-200">
                        {log.actor} <span className="text-slate-400">({log.actorRole})</span>
                      </td>
                      <td className="py-2.5 px-4 font-bold text-teal-800 dark:text-teal-300">{log.action}</td>
                      <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">{log.resource}</td>
                      <td className="py-2.5 px-4 text-slate-400 text-[11px]">{log.ipMasked}</td>
                      <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300 font-sans text-xs">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* AI MODEL INFO TAB */}
      {activeTab === 'ai_model' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 p-5 shadow-xs">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-bold pb-2 border-b border-slate-100 dark:border-slate-800/50">
              AI Decision-Support Model Registry (SENTRA-v2.4.1)
            </h3>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-700/80">
                <div className="font-bold text-slate-900 dark:text-white">Multimodal Pipeline Specifications</div>
                <ul className="space-y-1 list-disc pl-5 text-slate-600 dark:text-slate-400">
                  <li><strong>Text & Emotion:</strong> Multi-lingual sentiment valence parser (-1.0 to +1.0) calibrated for Hindi, Tamil, and English.</li>
                  <li><strong>Acoustic Feature Extraction:</strong> Prosodic pitch variability, vocal cadence, and energy level markers extracted client-side from encrypted audio chunks.</li>
                  <li><strong>Feature Fusion:</strong> Gradient Boosted Decision Tree (XGBoost) with SHAP (SHapley Additive exPlanations) attribution vectors.</li>
                  <li><strong>Baseline Comparison:</strong> Longitudinal personal standard deviation model ($Z$-score delta thresholding).</li>
                </ul>
              </div>

              <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-700/80">
                <div className="font-bold text-slate-900 dark:text-white">Fairness, Calibration & Limitations</div>
                <ul className="space-y-1 list-disc pl-5 text-slate-600 dark:text-slate-400">
                  <li><strong>Fairness Auditing:</strong> Demographic parity tested across age brackets and genders to prevent disparate flagging.</li>
                  <li><strong>Sensitivity Calibration:</strong> Tuned for 92% recall on severe distress markers with required caseworker verification.</li>
                  <li><strong>Non-RAG Distress Engine:</strong> Prompt policy strictly prohibits generative LLMs from inventing mental illness diagnoses.</li>
                  <li><strong>Human Override Rule:</strong> Caseworker assessments take absolute precedence over model recommendations in every case.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIGURATION TAB */}
      {activeTab === 'configuration' && (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-bold pb-2 border-b border-slate-100 dark:border-slate-800/50">
            System Configuration & Data Retention Policies
          </h3>

          <div className="space-y-3 text-xs max-w-xl">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/50">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Check-in Audio Retention</span>
              <span className="font-mono text-slate-600 dark:text-slate-400">30 days after stage disposition</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/50">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Audit Trail Immutable Period</span>
              <span className="font-mono text-slate-600 dark:text-slate-400">7 years (Statutory judicial rule)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/50">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Session Timeout Threshold</span>
              <span className="font-mono text-slate-600 dark:text-slate-400">15 minutes idle disconnect</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-semibold text-slate-800 dark:text-slate-200">TLS Transport Standard</span>
              <span className="font-mono text-slate-600 dark:text-slate-400">TLS 1.3 Strict Ciphers Only</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
