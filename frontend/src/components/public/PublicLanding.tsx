import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, Brain, LineChart, FileText, Activity, Clock, 
  Users, CheckCircle2, Lock, ArrowRight, XCircle, ChevronDown, 
  ChevronUp, Scale, Play, Pause, BarChart3, Fingerprint, Database,
  MessageSquare, UserCheck, AlertTriangle
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [simWeek, setSimWeek] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play simulator
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setSimWeek((prev) => (prev >= 5 ? 1 : prev + 1));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const simData = [
    { week: 1, distress: 30, engagement: 80, fear: 20, note: "Stable baseline", alert: false },
    { week: 2, distress: 35, engagement: 75, fear: 25, note: "Minor variation", alert: false },
    { week: 3, distress: 55, engagement: 60, fear: 50, note: "Increasing distress", alert: false },
    { week: 4, distress: 70, engagement: 40, fear: 75, note: "Reduced engagement + increased fear", alert: false },
    { week: 5, distress: 85, engagement: 20, fear: 90, note: "Significant change detected", alert: true },
  ];

  const currentSim = simData[simWeek - 1];

  const faqItems = [
    { q: "What is SENTRA?", a: "SENTRA is an AI-assisted longitudinal victim well-being monitoring platform designed to help authorized professionals track distress indicators over time." },
    { q: "How does SENTRA identify changes in well-being?", a: "It uses self-reported check-ins and compares current emotional and behavioral indicators against the individual's own historical baseline to detect significant shifts." },
    { q: "Does SENTRA diagnose mental illness?", a: "No. SENTRA strictly generates AI-assisted indicators and does not independently diagnose clinical conditions like depression or PTSD." },
    { q: "Who can see a victim's information?", a: "Access is strictly restricted by role. Clinical counsellors see well-being data, while administrators only see aggregated, de-identified insights. Privacy is a core architectural principle." },
    { q: "Does SENTRA continuously track location?", a: "No. SENTRA collects only information required for the stated purpose. There is zero GPS tracking or ambient device surveillance." },
    { q: "How does human review work?", a: "When SENTRA detects a significant baseline deviation, it generates an explainable alert. An authorized professional then reviews the context and decides on the appropriate intervention." },
    { q: "What information does SENTRA collect?", a: "It collects structured check-in responses, text sentiment, and optional voice check-ins provided actively by the user, alongside the case timeline." },
    { q: "How is AI used?", a: "AI models process text, behavior, and acoustic features to map trends and flag sudden deviations from a personal baseline. It does not replace human decision-making." },
    { q: "Can a victim request human support?", a: "Yes. Victims can request direct contact from a counsellor or case officer at any time through the platform." },
    { q: "Is the data secure?", a: "Yes. All data is protected with end-to-end encryption, strict role-based access control, and immutable audit logs." }
  ];

  return (
    <div className="space-y-24 pb-24 text-slate-800 dark:text-slate-200">
      
      {/* 1. HERO SECTION & VISUAL */}
      <section className="pt-8 sm:pt-16 max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-mono font-medium border border-slate-200 dark:border-slate-700">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>SENTRA • Sentiment and Emotional Tracking Risk & Analysis</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Detect distress earlier.<br/>
            <span className="text-teal-700 dark:text-teal-400">Connect support sooner.</span>
          </h1>
          
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
            An AI-assisted well-being monitoring platform that helps authorized professionals identify changing distress indicators throughout the investigation, trial, compensation and rehabilitation journey.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onStartLogin('victim')}
              className="px-6 py-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Enter Victim Portal
            </button>
            <button
              onClick={() => onStartLogin('staff')}
              className="px-6 py-3.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-lg font-semibold shadow-lg transition-all"
            >
              Staff & Official Login
            </button>
            <a
              href="#how-it-works"
              className="px-4 py-3.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
            >
              Explore SENTRA ↓
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] sm:text-xs font-mono uppercase tracking-wider text-slate-500 pt-4 border-t border-slate-200 dark:border-slate-800">
            <span className="flex items-center gap-1.5"><Brain className="w-3.5 h-3.5 text-teal-600" /> AI-assisted</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="flex items-center gap-1.5"><UserCheck className="w-3.5 h-3.5 text-teal-600" /> Human-reviewed</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-teal-600" /> Privacy-first</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5 text-teal-600" /> Multilingual</span>
          </div>
        </div>

        {/* Hero Visual - Animated Flow */}
        <div className="relative w-full h-[450px] bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden p-6 flex flex-col justify-between shadow-inner">
          <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-slate-800/30 bg-[length:16px_16px]" />
          
          <div className="relative z-10 flex flex-col h-full justify-between items-center text-center">
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 4, repeat: Infinity }} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-xs font-mono shadow-sm">
              INPUT: Text • Voice • Check-ins • Engagement
            </motion.div>
            <div className="w-px h-8 bg-gradient-to-b from-teal-500 to-transparent my-1" />
            <motion.div animate={{ scale: [0.98, 1.02, 0.98] }} transition={{ duration: 3, repeat: Infinity }} className="bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 px-6 py-3 rounded-lg text-sm font-bold text-teal-800 dark:text-teal-300 shadow-md">
              AI ANALYSIS
            </motion.div>
            <div className="w-px h-8 bg-gradient-to-b from-teal-500 to-transparent my-1" />
            <motion.div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-xs font-mono shadow-sm">
              PERSONAL BASELINE
            </motion.div>
            <div className="w-px h-8 bg-gradient-to-b from-teal-500 to-transparent my-1" />
            <motion.div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-xs font-mono shadow-sm">
              DISTRESS TRAJECTORY
            </motion.div>
            <div className="w-px h-8 bg-gradient-to-b from-teal-500 to-transparent my-1" />
            <motion.div animate={{ borderColor: ['#fde047', '#f59e0b', '#fde047'] }} transition={{ duration: 2, repeat: Infinity }} className="bg-amber-50 dark:bg-amber-900/20 border-2 px-6 py-3 rounded-lg text-sm font-bold text-amber-700 dark:text-amber-400 shadow-md">
              EXPLAINABLE ALERT
            </motion.div>
            <div className="w-px h-8 bg-gradient-to-b from-amber-500 to-transparent my-1" />
            <motion.div className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-6 py-3 rounded-lg text-sm font-bold shadow-lg">
              HUMAN REVIEW
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. TRUST / SAFETY STRIP */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <Brain className="w-6 h-6 text-teal-600 mb-3" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">AI-ASSISTED</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">AI identifies indicators. It does not independently make intervention decisions.</p>
          </div>
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <Activity className="w-6 h-6 text-teal-600 mb-3" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">NOT A DIAGNOSTIC TOOL</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">SENTRA does not diagnose depression, PTSD, or other clinical conditions.</p>
          </div>
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <Lock className="w-6 h-6 text-teal-600 mb-3" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">PRIVACY-FIRST</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">No unnecessary GPS tracking, camera surveillance, contact harvesting, or social-media monitoring.</p>
          </div>
          <div className="p-5 bg-teal-50 dark:bg-teal-900/20 rounded-xl border-2 border-teal-200 dark:border-teal-800 shadow-sm">
            <UserCheck className="w-6 h-6 text-teal-700 dark:text-teal-400 mb-3" />
            <h3 className="font-bold text-sm text-teal-900 dark:text-teal-100 mb-2">HUMAN-IN-THE-LOOP</h3>
            <p className="text-xs text-teal-800 dark:text-teal-300">Authorized professionals review important alerts and determine appropriate action.</p>
          </div>
        </div>
      </section>

      {/* 3. HOW SENTRA WORKS */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">How SENTRA works</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3">From a simple check-in to human-supported intervention.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 relative">
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
          
          {[
            { step: '01', title: 'CHECK IN', text: 'Victims can share periodic well-being responses through approved communication channels.' },
            { step: '02', title: 'UNDERSTAND', text: 'Text, optional voice, and structured responses are processed for relevant emotional and behavioural indicators.' },
            { step: '03', title: 'TRACK', text: 'SENTRA compares current indicators with the individual\'s previous baseline.' },
            { step: '04', title: 'DETECT', text: 'Longitudinal changes can trigger an explainable priority indicator.' },
            { step: '05', title: 'REVIEW', text: 'Authorized counsellors or officials review the AI-generated signal.' },
            { step: '06', title: 'SUPPORT', text: 'Appropriate human-led support and follow-up can then be coordinated.' },
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative z-10 flex-1 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center"
            >
              <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-400 text-[10px] font-bold font-mono flex items-center justify-center mb-3">
                {item.step}
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. LIVE SENTRA SIMULATOR */}
      <section className="bg-slate-900 py-20 px-4 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">See SENTRA in action</h2>
            <p className="text-slate-400 mt-3">Follow a fictional case as its well-being indicators change over time.</p>
            <span className="inline-block mt-4 px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded text-[10px] font-mono tracking-widest uppercase">
              DEMO ENVIRONMENT — FICTIONAL DATA
            </span>
          </div>

          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 sm:p-8 flex flex-col lg:flex-row gap-8 shadow-2xl">
            {/* Controls */}
            <div className="lg:w-1/3 space-y-6">
              <div>
                <span className="text-xs font-mono text-slate-400">CASE #ST-10482</span>
                <h3 className="text-lg font-bold mt-1">Timeline Progression</h3>
              </div>
              
              <div className="space-y-2">
                {[1,2,3,4,5].map(w => (
                  <button
                    key={w}
                    onClick={() => { setSimWeek(w); setIsPlaying(false); }}
                    className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${simWeek === w ? 'bg-teal-600 border-teal-500 text-white font-semibold' : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                  >
                    Week {w}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-full py-3 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center gap-2 text-sm font-semibold transition-colors"
              >
                {isPlaying ? <><Pause className="w-4 h-4"/> Pause Simulation</> : <><Play className="w-4 h-4"/> Auto-Play Simulation</>}
              </button>
            </div>

            {/* Dashboard Display */}
            <div className="lg:w-2/3 bg-slate-900 rounded-xl p-6 border border-slate-700 relative overflow-hidden">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h4 className="font-bold text-lg">{currentSim.note}</h4>
                  <p className="text-xs text-slate-400 font-mono mt-1">Week {currentSim.week} Snapshot</p>
                </div>
                {currentSim.alert && (
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="px-3 py-1.5 bg-rose-500/20 border border-rose-500/50 text-rose-400 rounded text-xs font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    HUMAN REVIEW RECOMMENDED
                  </motion.div>
                )}
              </div>

              {/* Fake Charts */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-medium">
                    <span className="text-slate-300">Emotional Distress</span>
                    <span className="font-mono">{currentSim.distress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: `${currentSim.distress}%` }} 
                      transition={{ duration: 0.5 }} 
                      className={`h-full rounded-full ${currentSim.distress > 75 ? 'bg-rose-500' : currentSim.distress > 50 ? 'bg-amber-500' : 'bg-teal-500'}`}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-medium">
                    <span className="text-slate-300">Platform Engagement</span>
                    <span className="font-mono">{currentSim.engagement}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: `${currentSim.engagement}%` }} 
                      transition={{ duration: 0.5 }} 
                      className="h-full bg-blue-500 rounded-full"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-medium">
                    <span className="text-slate-300">Fear-related Language Indicator</span>
                    <span className="font-mono">{currentSim.fear}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: `${currentSim.fear}%` }} 
                      transition={{ duration: 0.5 }} 
                      className={`h-full rounded-full ${currentSim.fear > 75 ? 'bg-rose-500' : currentSim.fear > 50 ? 'bg-amber-500' : 'bg-slate-500'}`}
                    />
                  </div>
                </div>
              </div>

              {currentSim.alert && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                  <h5 className="text-sm font-bold text-rose-300 mb-2">Change detected</h5>
                  <ul className="text-xs text-rose-200 space-y-1 ml-4 list-disc">
                    <li>↑ Distress indicators</li>
                    <li>↑ Fear-related responses</li>
                    <li>↓ Engagement</li>
                    <li>Upcoming case event</li>
                  </ul>
                  <button className="mt-3 text-xs font-semibold px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded transition-colors">
                    View Explanation (Demo)
                  </button>
                </motion.div>
              )}
            </div>
          </div>
          <p className="text-center text-[11px] text-slate-500 mt-6 uppercase tracking-wider font-mono">This is a demo only. Do not imply the model is clinically validated.</p>
        </div>
      </section>

      {/* 5. MULTIMODAL AI & PERSONAL BASELINE (COMBINED FLOW) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">One platform. Multiple signals.</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3">SENTRA captures a holistic view of well-being to establish a deeply personalized baseline.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-teal-600"/> TEXT</h3>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <li>• Sentiment</li>
              <li>• Emotion</li>
              <li>• Context</li>
            </ul>
          </div>
          <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2"><Activity className="w-4 h-4 text-teal-600"/> VOICE</h3>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <li>• Speech-to-text</li>
              <li>• Acoustic features</li>
              <li>• Emotion-related indicators</li>
            </ul>
          </div>
          <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-teal-600"/> BEHAVIOUR</h3>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <li>• Check-in consistency</li>
              <li>• Engagement changes</li>
              <li>• Missed interactions</li>
            </ul>
          </div>
          <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-teal-600"/> CONTEXT</h3>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <li>• Case stage</li>
              <li>• Relevant upcoming events</li>
              <li>• Support history</li>
            </ul>
          </div>
        </div>

        {/* 6. PERSONAL BASELINE FOCUS */}
        <div className="bg-teal-50 dark:bg-slate-900 rounded-2xl border border-teal-100 dark:border-slate-800 p-8 lg:p-12 text-center max-w-4xl mx-auto shadow-inner">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">SENTRA tracks change — not just a moment.</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            A single response does not define a person's well-being. SENTRA looks at changes relative to the individual's own interaction history.
          </p>
          
          <div className="bg-white dark:bg-slate-950 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col space-y-4 font-mono text-xs text-left">
              <div className="flex items-center gap-4"><span className="w-16 text-slate-400">Week 1</span><div className="h-1 bg-slate-300 dark:bg-slate-700 w-1/4 rounded"></div></div>
              <div className="flex items-center gap-4"><span className="w-16 text-slate-400">Week 2</span><div className="h-1 bg-slate-300 dark:bg-slate-700 w-1/4 rounded"></div></div>
              <div className="flex items-center gap-4"><span className="w-16 text-slate-400">Week 3</span><div className="h-1 bg-slate-300 dark:bg-slate-700 w-[28%] rounded"></div></div>
              <div className="flex items-center gap-4"><span className="w-16 text-slate-400">Week 4</span><div className="h-1 bg-slate-300 dark:bg-slate-700 w-1/3 rounded"></div></div>
              <div className="flex items-center gap-4 relative">
                <span className="w-16 text-slate-400 font-bold">Week 5</span>
                <div className="h-1 bg-amber-500 w-2/3 rounded"></div>
                <div className="absolute top-4 left-20 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-400 p-2 rounded shadow-sm">
                  Significant deviation from personal baseline detected.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. EXPLAINABLE AI */}
      <section id="ai-insights" className="max-w-7xl mx-auto px-4 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Don't just flag. Explain.</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3">We believe in transparent indicators, not black-box decisions.</p>
        </div>

        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-950 p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <span className="font-mono text-xs font-bold text-slate-500">CASE #ST-10482</span>
            <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold rounded uppercase tracking-wider border border-amber-200 dark:border-amber-800">
              HUMAN REVIEW RECOMMENDED
            </span>
          </div>
          <div className="p-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">WHY WAS THIS FLAGGED?</h4>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600"/> Distress indicators increased</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600"/> Fear-related responses increased</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600"/> Engagement decreased</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600"/> Recent change differs from personal baseline</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600"/> Relevant case event approaching</li>
            </ul>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center font-mono text-[10px] text-slate-400">
              <span>Model confidence: 78%</span>
              <span>Model: SENTRA-RISK-0.1</span>
            </div>
            
            <button className="w-full mt-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-xs font-semibold transition-colors">
              How this works (AI-generated distress indicator requiring human review)
            </button>
          </div>
        </div>
      </section>

      {/* 8. HUMAN IN THE LOOP & ROLE BASED ACCESS */}
      <section id="human-support" className="bg-slate-50 dark:bg-slate-900/30 py-20 px-4 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">AI identifies. Humans decide.</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-3">SENTRA empowers professionals; it does not replace them.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">COUNSELLOR</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Well-being review, follow-up, and counselling coordination.</p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">CASE / DISTRICT OFFICER</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Case coordination and intervention tracking.</p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">LEGAL / PROTECTION OFFICER</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Safety-related support workflows.</p>
            </div>
          </div>

          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">One platform. Role-specific access.</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { role: 'Victim / Complainant', text: 'Personal check-ins and support access.' },
              { role: 'Counsellor', text: 'Well-being review and intervention tracking.' },
              { role: 'District / Case Officer', text: 'Case coordination and priority monitoring.' },
              { role: 'Legal / Protection Officer', text: 'Safety and protection-support workflows.' },
              { role: 'State / National Administrator', text: 'Aggregated system-level insights.' },
              { role: 'System Administrator', text: 'Security, permissions and system configuration.' },
            ].map((r, i) => (
              <div key={i} className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
                <div className="text-[10px] font-mono text-teal-600 dark:text-teal-400 mb-1">ROLE {i + 1}</div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{r.role}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CASE JOURNEY */}
      <section className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-10">Support throughout the case journey</h2>
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 max-w-5xl mx-auto text-xs">
          {['COMPLAINT', 'INVESTIGATION', 'CASE PROCEEDINGS', 'TRIAL', 'COMPENSATION', 'REHABILITATION'].map((stage, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 mb-4 rounded relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-teal-600 border-2 border-white dark:border-slate-950"></div>
              </div>
              <h4 className="font-bold text-[10px] text-slate-900 dark:text-white tracking-wider mb-2">{stage}</h4>
              <p className="text-slate-500 max-w-[120px]">Check-ins & Human follow-up</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10. PRIVACY & SECURITY & BOUNDARIES */}
      <section id="security-privacy" className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 scroll-mt-24">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Privacy is built into the platform.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
              <h4 className="font-bold text-sm mb-1 text-slate-900 dark:text-white">DATA MINIMIZATION</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">Collect only information required for the stated purpose.</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
              <h4 className="font-bold text-sm mb-1 text-slate-900 dark:text-white">ROLE-BASED ACCESS</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">Access is restricted according to user role and authorization.</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
              <h4 className="font-bold text-sm mb-1 text-slate-900 dark:text-white">AUDITABILITY</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">Sensitive administrative actions can be logged for accountability.</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
              <h4 className="font-bold text-sm mb-1 text-slate-900 dark:text-white">SECURE PROCESSING</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">Use appropriate encryption, secure authentication and protected storage.</p>
            </div>
          </div>
          <button onClick={() => onOpenLegalModal('privacy')} className="mt-6 text-sm font-semibold text-teal-700 hover:text-teal-800 transition-colors">
            View Privacy & Security &rarr;
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Built with boundaries.</h2>
          <div className="space-y-4">
            <div className="p-5 bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-900/50 rounded-lg">
              <h4 className="font-bold text-sm text-rose-900 dark:text-rose-300 mb-1">NOT A THERAPIST</h4>
              <p className="text-xs text-rose-800 dark:text-rose-400">SENTRA does not replace qualified counsellors or mental-health professionals.</p>
            </div>
            <div className="p-5 bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-900/50 rounded-lg">
              <h4 className="font-bold text-sm text-rose-900 dark:text-rose-300 mb-1">NOT A DIAGNOSTIC SYSTEM</h4>
              <p className="text-xs text-rose-800 dark:text-rose-400">SENTRA generates AI-assisted indicators and does not independently diagnose clinical conditions.</p>
            </div>
            <div className="p-5 bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-900/50 rounded-lg">
              <h4 className="font-bold text-sm text-rose-900 dark:text-rose-300 mb-1">NOT SURVEILLANCE</h4>
              <p className="text-xs text-rose-800 dark:text-rose-400">SENTRA should not continuously monitor unrelated personal activity.</p>
            </div>
            <div className="p-4 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-900/50 rounded-lg">
              <h4 className="font-bold text-sm text-teal-900 dark:text-teal-300 mb-1">HUMAN DECISION SUPPORT</h4>
              <p className="text-xs text-teal-800 dark:text-teal-400">Important interventions remain subject to appropriate human review.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FAQ */}
      <section id="faq-section" className="max-w-4xl mx-auto px-4 scroll-mt-24">
        <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-10">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqItems.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span className="font-semibold text-sm text-slate-900 dark:text-white">{item.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-slate-400" /> : <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="p-5 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-950/50">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 12. FINAL CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-slate-900 text-white rounded-2xl p-10 sm:p-16 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Early insight. Human support. Safer outcomes.</h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-10">
            SENTRA brings longitudinal well-being monitoring, explainable AI and human-led support into one secure platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button onClick={() => { window.scrollTo({top:0, behavior:'smooth'}) }} className="px-8 py-3.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-semibold transition-colors shadow-lg">
              Explore the Simulator
            </button>
            <a href="#how-it-works" className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors shadow-lg">
              How SENTRA Works
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
