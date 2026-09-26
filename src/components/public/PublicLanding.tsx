import React, { useState } from 'react';
import { 
  ShieldCheck, 
  HeartHandshake, 
  Cpu, 
  TrendingUp, 
  Scale, 
  Lock, 
  UserCheck, 
  ArrowRight, 
  FileText, 
  Clock, 
  AlertCircle,
  HelpCircle,
  Building2,
  PhoneCall,
  CheckCircle2,
  XCircle,
  Activity,
  Sliders,
  Eye,
  Users,
  BarChart3,
  Database,
  KeyRound,
  Volume2,
  ArrowDown,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SentraLogo } from '../common/SentraLogo';

interface PublicLandingProps {
  onStartLogin: (tab?: 'victim' | 'staff') => void;
  onOpenLegalModal: (page: any) => void;
  onNavigateSection?: (section: string) => void;
}

export const PublicLanding: React.FC<PublicLandingProps> = ({ 
  onStartLogin, 
  onOpenLegalModal 
}) => {
  // Interactive Simulator State for Homepage Demonstration
  const [simulatorMood, setSimulatorMood] = useState<number>(2); // 1-5
  const [simulatorStress, setSimulatorStress] = useState<number>(5); // 1-5
  const [simulatorSleep, setSimulatorSleep] = useState<number>(1); // 1-5
  const [simulatorProximityHearing, setSimulatorProximityHearing] = useState<boolean>(true);
  const [simulatorVoiceTension, setSimulatorVoiceTension] = useState<boolean>(true);
  const [simulatorActiveStep, setSimulatorActiveStep] = useState<number>(1);

  // Active FAQ Accordion item
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Calculate simulator dynamic values
  const simulatedDistressScore = Math.min(96, Math.max(12, Math.round(
    ((5 - simulatorMood) * 12) + 
    ((simulatorStress - 1) * 9) + 
    ((5 - simulatorSleep) * 6) + 
    (simulatorProximityHearing ? 18 : 0) + 
    (simulatorVoiceTension ? 12 : 0)
  ) * 0.76));

  const baselineAverage = 28;
  const simulatedDelta = Math.round(((simulatedDistressScore - baselineAverage) / baselineAverage) * 100);

  const getSimulatedRisk = () => {
    if (simulatedDistressScore >= 70) return { label: 'Priority Human Review', color: 'bg-orange-50 text-orange-900 border-orange-200', text: 'Urgent caseworker callback recommended' };
    if (simulatedDistressScore >= 45) return { label: 'Active Monitoring', color: 'bg-amber-50 text-amber-900 border-amber-200', text: 'Gentle follow-up suggested' };
    return { label: 'Routine Monitoring', color: 'bg-emerald-50 text-emerald-900 border-emerald-200', text: 'Metrics within established baseline' };
  };

  const riskInfo = getSimulatedRisk();

  const faqItems = [
    {
      q: "Does SENTRA diagnose mental-health disorders or clinical conditions?",
      a: "No. SENTRA strictly prohibits autonomous psychiatric diagnosis. The system calculates empirical statistical deviations from a victim's self-reported baseline and flags potential distress spikes for certified clinical counsellors and caseworkers to evaluate."
    },
    {
      q: "Can the AI autonomously make legal, protective, or emergency decisions?",
      a: "Never. SENTRA is strictly a decision-support platform. It cannot reschedule court hearings, revoke protection details, dispatch emergency transport, or alter legal proceedings. All protective interventions require verified authorization by a licensed caseworker or protection officer."
    },
    {
      q: "Why is a Personal Baseline superior to generic population thresholds?",
      a: "Every individual experiences stress and trauma uniquely. Someone with a typically calm demeanor who suddenly reports elevated anxiety ahead of a court trial may still fall below a generic 'high risk' population threshold. By comparing individuals against their own longitudinal history, SENTRA catches acute relative shifts that population-wide averages miss."
    },
    {
      q: "What data is collected, and how is victim privacy protected?",
      a: "SENTRA follows strict Privacy-by-Design and Data Minimization standards. It only processes self-reported check-in scores, optional text reflections, and optional encrypted voice snippets. It never collects GPS tracking, device contacts, camera surveillance, background microphone audio, or social media activity. All records are protected by AES-256 encryption at rest and TLS 1.3 in transit."
    },
    {
      q: "How does Role-Based Access Control (RBAC) safeguard sensitive information?",
      a: "Access is strictly segregated by role. Complainants see only their personal case journey and support options. Clinical counsellors see their assigned cases and clinical notes. State and National executive administrators view only aggregated, de-identified statistical indicators and cannot view individual victim identities or personal conversations."
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="pt-8 sm:pt-14 pb-8 max-w-5xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono text-slate-800 mb-6">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
          <span>National Justice & Victim Well-Being Public-Service Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
          SENTRA
        </h1>
        <p className="text-lg sm:text-2xl font-semibold text-teal-900 mt-2 max-w-3xl mx-auto">
          Sentiment and Emotional Tracking Risk & Analysis
        </p>

        <p className="text-base sm:text-lg text-slate-600 mt-3 font-medium italic">
          "Early insight. Human support. Safer outcomes."
        </p>

        <p className="text-sm sm:text-base text-slate-600 mt-4 max-w-2xl mx-auto leading-relaxed">
          An AI-assisted well-being monitoring and decision-support infrastructure designed to support victims and complainants throughout the investigation, trial, compensation, rehabilitation, and support journey.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onStartLogin('victim')}
            className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded text-sm font-semibold flex items-center gap-2 transition-colors shadow-xs"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Victim Portal Access (OTP)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onStartLogin('staff')}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded text-sm font-semibold flex items-center gap-2 transition-colors shadow-xs"
          >
            <Lock className="w-4 h-4 text-slate-300" />
            <span>Caseworker & Official Login</span>
          </button>

          <a
            href="#interactive-simulator"
            className="px-5 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded text-sm font-medium transition-colors"
          >
            Test Live Interactive Simulator &darr;
          </a>
        </div>

        {/* Four Non-Negotiable Core Truths */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="p-3 bg-white rounded border border-slate-200 text-xs">
            <div className="flex items-center gap-1.5 text-rose-700 font-bold font-mono uppercase text-[11px]">
              <XCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Not An AI Therapist</span>
            </div>
            <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
              Never conducts automated therapy or clinical counseling without humans.
            </p>
          </div>

          <div className="p-3 bg-white rounded border border-slate-200 text-xs">
            <div className="flex items-center gap-1.5 text-rose-700 font-bold font-mono uppercase text-[11px]">
              <XCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Not A Diagnostic Tool</span>
            </div>
            <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
              Never claims to diagnose clinical depression, PTSD, or psychiatric illness.
            </p>
          </div>

          <div className="p-3 bg-white rounded border border-slate-200 text-xs">
            <div className="flex items-center gap-1.5 text-rose-700 font-bold font-mono uppercase text-[11px]">
              <XCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Not Surveillance</span>
            </div>
            <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
              Zero GPS tracking, camera feeds, social media scraping, or contact harvesting.
            </p>
          </div>

          <div className="p-3 bg-white rounded border border-slate-200 text-xs">
            <div className="flex items-center gap-1.5 text-teal-800 font-bold font-mono uppercase text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Human Decision Support</span>
            </div>
            <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
              Empowers certified human caseworkers to intervene early when it matters most.
            </p>
          </div>
        </div>
      </section>

      {/* 2. THE CHALLENGE */}
      <section id="the-challenge" className="max-w-5xl mx-auto px-4 scroll-mt-24">
        <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 shadow-xs">
          <span className="text-xs font-mono uppercase tracking-wider text-teal-800 font-semibold">
            01. The Systemic Problem
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Why Victims Struggle in Prolonged Legal Proceedings
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            From filing a complaint to final court judgment, complainants navigate months or years of intense stress. Without proactive monitoring, critical signs of distress remain invisible until crisis strikes.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-600 leading-relaxed">
            <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
              <div className="w-7 h-7 rounded bg-amber-100 text-amber-800 flex items-center justify-center font-bold font-mono">
                !
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Trial-Proximity Vulnerability</h3>
              <p>
                Distress indicators spike dramatically right before cross-examinations, witness testimonies, and bail hearings. Caseworkers rarely know who needs urgent grounding or protection.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
              <div className="w-7 h-7 rounded bg-amber-100 text-amber-800 flex items-center justify-center font-bold font-mono">
                !
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Caseworker Caseload Blindspots</h3>
              <p>
                A single case officer or clinical counsellor oversees 70–100 active files across different court jurisdictions. Manual check-in calls cannot scale without data-driven baseline prioritization.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
              <div className="w-7 h-7 rounded bg-amber-100 text-amber-800 flex items-center justify-center font-bold font-mono">
                !
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Secondary Victimization</h3>
              <p>
                Unaddressed fear and isolation cause complainants to retract statements or drop out of court cases. Early emotional and legal support is vital to ensuring justice and safety.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE SIMULATOR (SIGNATURE HOMEPAGE DEMO) */}
      <section id="interactive-simulator" className="max-w-5xl mx-auto px-4 scroll-mt-24">
        <div className="bg-white rounded-lg border-2 border-teal-800/40 p-6 sm:p-8 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-teal-800 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                <span>Interactive Architecture Simulator</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                See How SENTRA Detects Baseline Shifts in Real-Time
              </h2>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-teal-50 text-teal-800 border border-teal-200 self-start sm:self-auto">
              Live Engine Preview
            </span>
          </div>

          <p className="text-xs text-slate-600 mt-3 leading-relaxed">
            Adjust the check-in parameters below to observe how SENTRA's Multimodal Feature Fusion extracts indicators, contrasts against the victim's personal baseline, and prepares an explainable card for human caseworker review.
          </p>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Interactive Input Controls */}
            <div className="lg:col-span-6 space-y-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <h3 className="font-bold text-slate-800 text-sm pb-2 border-b border-slate-200">
                1. Complainant Check-In Inputs
              </h3>

              {/* Mood Slider */}
              <div>
                <div className="flex justify-between font-medium text-slate-700 mb-1">
                  <span>Self-Reported Mood / Emotional State:</span>
                  <span className="font-mono font-bold text-slate-900">{simulatorMood} / 5</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={simulatorMood}
                  onChange={(e) => setSimulatorMood(Number(e.target.value))}
                  className="w-full accent-teal-700 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>1 - Very Low / Terrified</span>
                  <span>3 - Neutral</span>
                  <span>5 - Very Calm</span>
                </div>
              </div>

              {/* Stress Slider */}
              <div>
                <div className="flex justify-between font-medium text-slate-700 mb-1">
                  <span>Stress & Anxiety Level:</span>
                  <span className="font-mono font-bold text-slate-900">{simulatorStress} / 5</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={simulatorStress}
                  onChange={(e) => setSimulatorStress(Number(e.target.value))}
                  className="w-full accent-teal-700 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>1 - Minimal Stress</span>
                  <span>3 - Moderate</span>
                  <span>5 - Overwhelming</span>
                </div>
              </div>

              {/* Sleep Slider */}
              <div>
                <div className="flex justify-between font-medium text-slate-700 mb-1">
                  <span>Sleep Restfulness Quality:</span>
                  <span className="font-mono font-bold text-slate-900">{simulatorSleep} / 5</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={simulatorSleep}
                  onChange={(e) => setSimulatorSleep(Number(e.target.value))}
                  className="w-full accent-teal-700 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>1 - Disrupted / Insomnia</span>
                  <span>3 - Fair</span>
                  <span>5 - Fully Restful</span>
                </div>
              </div>

              {/* Contextual Case & Acoustic Toggles */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={simulatorProximityHearing}
                    onChange={(e) => setSimulatorProximityHearing(e.target.checked)}
                    className="rounded text-teal-700 focus:ring-teal-700"
                  />
                  <span className="font-medium text-slate-800">
                    High-Stakes Court Hearing scheduled within 7 days
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={simulatorVoiceTension}
                    onChange={(e) => setSimulatorVoiceTension(e.target.checked)}
                    className="rounded text-teal-700 focus:ring-teal-700"
                  />
                  <span className="font-medium text-slate-800">
                    Optional Voice Sample reflects vocal prosody tension
                  </span>
                </label>
              </div>
            </div>

            {/* Right: Real-time Explainable AI Output */}
            <div className="lg:col-span-6 space-y-4 p-5 rounded-lg border border-slate-200 bg-white shadow-xs text-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-bold text-slate-900 text-sm">
                    2. AI Decision-Support Output
                  </span>
                  <span className={`px-2 py-0.5 rounded border text-[11px] font-mono uppercase font-bold ${riskInfo.color}`}>
                    {riskInfo.label}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Distress Indicator</span>
                    <span className="text-2xl font-bold font-mono text-slate-900">{simulatedDistressScore} / 100</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Scale: Lower is calmer</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Baseline Variance</span>
                    <span className={`text-2xl font-bold font-mono ${simulatedDelta > 20 ? 'text-rose-700' : 'text-slate-800'}`}>
                      {simulatedDelta >= 0 ? `+${simulatedDelta}%` : `${simulatedDelta}%`}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Historical Baseline: 28</span>
                  </div>
                </div>

                {/* "WHAT CHANGED?" Card Breakdown */}
                <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200 rounded text-xs text-amber-950 space-y-1.5">
                  <div className="font-bold uppercase tracking-wider text-[11px] text-amber-900 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                    <span>Explainable Rationale ("What Changed?"):</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-amber-900">
                    {simulatedDelta > 25 && (
                      <li>Distress indicator increased {simulatedDelta}% over personal baseline threshold.</li>
                    )}
                    {simulatorSleep <= 2 && (
                      <li>Severe sleep disruption reported over multiple consecutive days.</li>
                    )}
                    {simulatorProximityHearing && (
                      <li>Case proceeding proximity: High-stakes court examination listed in 7 days.</li>
                    )}
                    {simulatorVoiceTension && (
                      <li>Acoustic prosodic markers show vocal cadence deceleration and pitch tension.</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Caseworker Action Recommended */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Caseworker Decision Action: <strong className="text-slate-800">{riskInfo.text}</strong>
                </span>
                <button
                  onClick={() => onStartLogin('staff')}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 shrink-0"
                >
                  Test Review in Staff Portal &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE 4-STAGE OPERATING ARCHITECTURE */}
      <section id="operating-model" className="max-w-5xl mx-auto px-4 scroll-mt-24">
        <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 shadow-xs">
          <span className="text-xs font-mono uppercase tracking-wider text-teal-800 font-semibold">
            02. Operating Lifecycle
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            How SENTRA Works from Check-in to Human Intervention
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            SENTRA operates in a continuous, compassionate feedback loop that respects victim privacy while empowering authorized professionals with early signals.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded border border-slate-200 bg-slate-50 space-y-2">
              <div className="w-8 h-8 rounded bg-teal-800 text-white font-mono font-bold flex items-center justify-center text-xs">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Gentle Monitoring</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complainants complete short, respectful check-ins via web, mobile, SMS, or IVRS in their preferred language (English, Tamil, Hindi).
              </p>
            </div>

            <div className="p-4 rounded border border-slate-200 bg-slate-50 space-y-2">
              <div className="w-8 h-8 rounded bg-teal-800 text-white font-mono font-bold flex items-center justify-center text-xs">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Multimodal Fusion</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The inference engine fuses structured ratings, text sentiment, optional voice acoustic tension, and case timeline milestone proximity.
              </p>
            </div>

            <div className="p-4 rounded border border-slate-200 bg-slate-50 space-y-2">
              <div className="w-8 h-8 rounded bg-teal-800 text-white font-mono font-bold flex items-center justify-center text-xs">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Personal Baseline Delta</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Current metrics are evaluated against the victim's personal baseline. Deviations trigger explainable "WHAT CHANGED?" alert cards.
              </p>
            </div>

            <div className="p-4 rounded border border-slate-200 bg-slate-50 space-y-2">
              <div className="w-8 h-8 rounded bg-teal-800 text-white font-mono font-bold flex items-center justify-center text-xs">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Human Intervention</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Caseworkers review explainable flags, record clinical assessments, schedule support sessions, or coordinate courtroom protection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MULTIMODAL AI & PERSONAL BASELINE DEEP DIVE */}
      <section id="multimodal-engine" className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6 scroll-mt-24">
        <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-7 shadow-xs space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-teal-800 font-semibold">
            03. Multimodal Inference Engine
          </span>
          <h2 className="text-lg font-bold text-slate-900">
            Multimodal Data Stream Ingestion
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            SENTRA moves beyond static multiple-choice questionnaires by fusing four complementary data streams into a coherent statistical representation:
          </p>

          <div className="space-y-2 pt-2 text-xs text-slate-700">
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <strong className="text-slate-900">1. Structured Ratings:</strong> Mood (1-5), stress (1-5), sleep restfulness (1-5), safety affirmation, and direct callback requests.
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <strong className="text-slate-900">2. Natural Language Processing:</strong> Multilingual sentiment analysis in English, தமிழ், and हिन्दी, detecting fear, helplessness, and acute anxiety markers.
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <strong className="text-slate-900">3. Acoustic Prosodic Extraction:</strong> Optional vocal analysis measuring pitch variability, speech rate cadence, and energy depression.
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <strong className="text-slate-900">4. Case-Stage Context:</strong> Correlates check-ins with judicial milestones (e.g., proximity to court cross-examination or bail hearing).
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-7 shadow-xs space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-teal-800 font-semibold">
            04. Longitudinal Science
          </span>
          <h2 className="text-lg font-bold text-slate-900">
            Personal Baseline vs. Static Cutoffs
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Standard psychiatric questionnaires use one-size-fits-all population cutoff scores that fail in legal protection environments:
          </p>

          <div className="space-y-2.5 pt-2 text-xs">
            <div className="p-3 rounded border border-rose-200 bg-rose-50/50 text-rose-950">
              <span className="font-bold text-rose-900 block">Flaw of Static Population Cutoffs:</span>
              <p className="text-[11px] mt-0.5">
                A naturally stoic person experiencing severe internal panic may score below the clinical alert threshold, remaining invisible until they withdraw from the court case.
              </p>
            </div>

            <div className="p-3 rounded border border-teal-200 bg-teal-50/50 text-teal-950">
              <span className="font-bold text-teal-900 block">The SENTRA Longitudinal Baseline:</span>
              <p className="text-[11px] mt-0.5">
                SENTRA models the individual's baseline across their past 30 days. When their personal score shifts by $+30\%$ or $+60\%$, an early alert is generated immediately, regardless of population averages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. EXPLAINABLE AI & "WHAT CHANGED?" */}
      <section id="explainable-ai" className="max-w-5xl mx-auto px-4 scroll-mt-24">
        <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 shadow-xs">
          <span className="text-xs font-mono uppercase tracking-wider text-teal-800 font-semibold">
            05. Transparent AI
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            "WHAT CHANGED?" — Complete AI Explainability
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
            Black-box machine learning models are unacceptable in justice and public welfare. Every alert generated by SENTRA contains explicit human-readable rationale and SHAP feature weights.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded border border-slate-200 bg-slate-50 space-y-1.5">
              <span className="font-mono text-teal-800 font-bold uppercase text-[11px]">Transparency Pillar 1</span>
              <h3 className="font-bold text-slate-900 text-sm">Concrete Feature Attribution</h3>
              <p className="text-slate-600 leading-relaxed">
                Caseworkers see exactly why a case was flagged: baseline distress shift $+62\%$, sleep rating $1/5$, and hearing proximity in 8 days.
              </p>
            </div>

            <div className="p-4 rounded border border-slate-200 bg-slate-50 space-y-1.5">
              <span className="font-mono text-teal-800 font-bold uppercase text-[11px]">Transparency Pillar 2</span>
              <h3 className="font-bold text-slate-900 text-sm">Confidence & Model Versioning</h3>
              <p className="text-slate-600 leading-relaxed">
                Displays calibrated model confidence (e.g., $94\%$) and deployed engine release (v2.4.1), ensuring full traceability and reproducibility.
              </p>
            </div>

            <div className="p-4 rounded border border-slate-200 bg-slate-50 space-y-1.5">
              <span className="font-mono text-teal-800 font-bold uppercase text-[11px]">Transparency Pillar 3</span>
              <h3 className="font-bold text-slate-900 text-sm">Human Primacy Guarantee</h3>
              <p className="text-slate-600 leading-relaxed">
                The caseworker evaluates situational nuance and records professional clinical notes. AI never overrides or replaces human casework decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SIX-TIER ROLE-BASED ACCESS CONTROL (RBAC) */}
      <section id="rbac-governance" className="max-w-5xl mx-auto px-4 scroll-mt-24">
        <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 shadow-xs">
          <span className="text-xs font-mono uppercase tracking-wider text-teal-800 font-semibold">
            06. Multi-Tier Governance
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Six Purpose-Built Portals for the Justice & Care Ecosystem
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            SENTRA enforces strict Role-Based Access Control (RBAC). Each stakeholder sees only what is necessary for their authorized responsibilities:
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Role 1 */}
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase font-bold text-teal-800">Role 1</span>
                <span className="text-[10px] text-slate-400 font-mono">Mobile OTP Access</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Victim / Complainant Portal</h3>
              <p className="text-slate-600 leading-relaxed">
                Gentle check-ins, case stage timeline, appointment confirmations, support requests, and data rights controls. No scary raw scores.
              </p>
            </div>

            {/* Role 2 */}
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase font-bold text-teal-800">Role 2</span>
                <span className="text-[10px] text-slate-400 font-mono">Clinical Staff</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Clinical Counsellor Console</h3>
              <p className="text-slate-600 leading-relaxed">
                Supervised caseload, baseline variance alerts, explainable AI cards, and mandatory human review forms with professional clinical notes.
              </p>
            </div>

            {/* Role 3 */}
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase font-bold text-teal-800">Role 3</span>
                <span className="text-[10px] text-slate-400 font-mono">Police / Officer</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">District Support & Case Officer</h3>
              <p className="text-slate-600 leading-relaxed">
                Priority case queues correlating hearings with distress spikes, caseworker workload distribution, turnaround time metrics, and statutory reports.
              </p>
            </div>

            {/* Role 4 */}
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase font-bold text-teal-800">Role 4</span>
                <span className="text-[10px] text-slate-400 font-mono">DLSA / Court</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Legal & Protection Officer</h3>
              <p className="text-slate-600 leading-relaxed">
                Witness intimidation and threat alerts, courtroom security escorts, protection review schedules, and DLSA free legal counsel assignment.
              </p>
            </div>

            {/* Role 5 */}
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase font-bold text-teal-800">Role 5</span>
                <span className="text-[10px] text-slate-400 font-mono">Executive Policy</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">State & National Oversight</h3>
              <p className="text-slate-600 leading-relaxed">
                Aggregated, de-identified district performance, intervention turnaround speeds, and case-stage distributions. Zero individual PII exposed.
              </p>
            </div>

            {/* Role 6 */}
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase font-bold text-teal-800">Role 6</span>
                <span className="text-[10px] text-slate-400 font-mono">Cyber Security</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">System Administrator</h3>
              <p className="text-slate-600 leading-relaxed">
                Least-privilege RBAC matrix, immutable security audit trail, retention configuration, and AI model fairness and calibration registries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. PRIVACY-BY-DESIGN & SECURITY ASSURANCE */}
      <section id="privacy-security" className="max-w-5xl mx-auto px-4 scroll-mt-24">
        <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 shadow-xs">
          <span className="text-xs font-mono uppercase tracking-wider text-teal-800 font-semibold">
            07. Privacy & Cyber Security
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Privacy-by-Design Built for Public Trust
          </h2>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Strict Data Minimization:</strong>
                  <p className="mt-0.5">Collects only what is strictly necessary for well-being monitoring. No GPS tracking, no social media tracking, no device contact harvesting.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">End-to-End Encryption:</strong>
                  <p className="mt-0.5">All data is encrypted in transit using TLS 1.3 and at rest using AES-256. Sensitive victim reflections are segregated from system administrative logs.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Database className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Tamper-Evident Audit Logging:</strong>
                  <p className="mt-0.5">Every login, check-in, human evaluation, and intervention generates an immutable cryptographic log entry with masked IP.</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <UserCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Sovereign Consent Controls:</strong>
                  <p className="mt-0.5">Complainants can toggle optional voice processing or request data retention reviews at any time without compromising their legal standing.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Zero Commercial Advertising or Tracking:</strong>
                  <p className="mt-0.5">SENTRA has zero third-party commercial cookies, tracking pixels, or monetized data brokers. Strictly public service.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Scale className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Statutory Compliance Safeguards:</strong>
                  <p className="mt-0.5">Designed to conform with national data protection legislation and Web Content Accessibility Guidelines (WCAG) 2.1 AA.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section id="faq-section" className="max-w-5xl mx-auto px-4 scroll-mt-24">
        <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 shadow-xs">
          <span className="text-xs font-mono uppercase tracking-wider text-teal-800 font-semibold">
            08. Frequently Asked Questions
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Understanding SENTRA's Purpose, Bounds & Guarantees
          </h2>

          <div className="mt-6 space-y-3">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="rounded border border-slate-200 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 bg-slate-50/70 hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                      {item.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-4 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. CALL TO ACTION & TRANSPARENCY CONTACT */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <div className="bg-slate-900 text-white rounded-lg p-8 sm:p-12 shadow-sm space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ready to Explore SENTRA?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Experience the complete end-to-end workflow across victim check-in, explainable AI flag generation, and caseworker intervention.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onStartLogin('victim')}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
            >
              Victim Support Portal Login
            </button>
            <button
              onClick={() => onStartLogin('staff')}
              className="px-6 py-3 border border-slate-700 hover:bg-slate-800 text-slate-200 rounded text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Caseworker / Staff Login
            </button>
            <button
              onClick={() => onOpenLegalModal('transparency')}
              className="px-5 py-3 text-slate-400 hover:text-white text-xs font-medium transition-colors"
            >
              Review AI Transparency Standards &rarr;
            </button>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 max-w-md mx-auto">
            Statutory Notice: SENTRA is deployed as an authorized decision-support technology. For immediate life-safety emergencies, contact the National Emergency Helpline (112).
          </div>
        </div>
      </section>
    </div>
  );
};
