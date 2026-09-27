import React from 'react';
import { useSentra } from '../../context/SentraContext';
import { translations } from '../../utils/translations';
import { 
  Heart, 
  Moon, 
  ShieldCheck, 
  Users, 
  BrainCircuit, 
  Calendar, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  PhoneCall, 
  FileText,
  AlertCircle
} from 'lucide-react';

interface VictimDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenEmergencyModal: () => void;
}

export const VictimDashboard: React.FC<VictimDashboardProps> = ({ 
  onNavigateTab, 
  onOpenEmergencyModal 
}) => {
  const { language, victim, checkIns, appointments, cases } = useSentra();
  const t = translations[language];

  // Latest check-in
  const latestCheckIn = checkIns[0];
  const userCase = cases.find(c => c.id === victim.caseId) || cases[0];
  const nextAppointment = appointments.find(a => a.status === 'confirmed');

  // Calculate Total Hearings
  const totalHearings = userCase?.officialUpdates.filter(
    update => update.stage === 'trial' || update.title.toLowerCase().includes('hearing') || update.title.toLowerCase().includes('court')
  ).length || 0;

  // Friendly non-clinical status message based on recent check-in
  const hasRecentDistress = latestCheckIn && (latestCheckIn.analysis.distressIndicator >= 45 || !latestCheckIn.answers.feelsSafe);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Welcome Banner & Immediate Check-in Callout */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-teal-800 dark:text-teal-300 font-semibold">
                Support ID: {victim.id}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {victim.name || victim.pseudonym} ({victim.caseId})
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {t.howFeelingToday}
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Your well-being matters throughout your case journey. Check in regularly so your support team can stay connected with you.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigateTab('checkin')}
              className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
            >
              <span>{t.startCheckIn}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab('support')}
              className="px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded text-xs font-semibold transition-colors"
            >
              {t.requestSupport}
            </button>
            <button
              onClick={() => onNavigateTab('profile')}
              className="px-3 py-2.5 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 rounded text-xs font-medium transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* 1. "How Am I Doing?" - Human, non-frightening status card */}
        <div className={`mt-5 p-4 rounded-md border flex items-start gap-3 ${
          hasRecentDistress 
            ? 'bg-amber-50/70 border-amber-200 text-amber-950' 
            : 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
        }`}>
          {hasRecentDistress ? (
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <div className="font-semibold text-xs uppercase tracking-wide">
              {hasRecentDistress ? "Caseworker Check-in Update" : "Well-Being Status Summary"}
            </div>
            <p className="text-xs mt-0.5 leading-relaxed">
              {hasRecentDistress ? t.changeStatusText : t.routineStatusText}
            </p>
            {hasRecentDistress && (
              <div className="mt-2.5 flex items-center gap-3">
                <button
                  onClick={() => onNavigateTab('appointments')}
                  className="text-xs font-semibold text-amber-900 underline hover:text-black"
                >
                  View scheduled support &rarr;
                </button>
                <span className="text-amber-400">·</span>
                <span className="text-xs text-amber-800">
                  Assigned Counsellor: {victim.assignedCounsellor}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Well-Being Overview Cards (Emotional wellbeing, Stress, Sleep, Support, Safety) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t.wellbeingOverview}
          </h2>
          <span className="text-[11px] text-slate-400">
            Based on your recent self-reported check-ins
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {/* Concentration Score */}
          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Concentration</span>
              <BrainCircuit className="w-4 h-4 text-blue-500" />
            </div>
            <div className="mt-2">
              <div className="text-base font-bold text-slate-900 dark:text-white font-mono">
                {latestCheckIn?.answers.concentrationScore ? `${latestCheckIn.answers.concentrationScore}/5` : '—'}
              </div>
            </div>
          </div>

          {/* Productivity Score */}
          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Productivity</span>
              <Users className="w-4 h-4 text-orange-500" />
            </div>
            <div className="mt-2">
              <div className="text-base font-bold text-slate-900 dark:text-white font-mono">
                {latestCheckIn?.answers.productivityScore ? `${latestCheckIn.answers.productivityScore}/5` : '—'}
              </div>
            </div>
          </div>

          {/* Happiness Score */}
          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Happiness</span>
              <Heart className="w-4 h-4 text-rose-500" />
            </div>
            <div className="mt-2">
              <div className="text-base font-bold text-slate-900 dark:text-white font-mono">
                {latestCheckIn?.answers.happinessScore ? `${latestCheckIn.answers.happinessScore}/5` : '—'}
              </div>
            </div>
          </div>

          {/* Stress & Worry */}
          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">{t.stress}</span>
              <BrainCircuit className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2">
              <div className="text-base font-bold text-slate-900 dark:text-white font-mono">
                {latestCheckIn ? `${latestCheckIn.answers.stressLevel}/5` : '—'}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {latestCheckIn?.answers.stressLevel && latestCheckIn.answers.stressLevel >= 4 ? 'Elevated' : 'Manageable'}
              </div>
            </div>
          </div>

          {/* Sleep Restfulness */}
          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">{t.sleep}</span>
              <Moon className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-2">
              <div className="text-base font-bold text-slate-900 dark:text-white font-mono">
                {latestCheckIn ? `${latestCheckIn.answers.sleepQuality}/5` : '—'}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {latestCheckIn?.answers.sleepQuality && latestCheckIn.answers.sleepQuality <= 2 ? 'Disrupted' : 'Adequate'}
              </div>
            </div>
          </div>

          {/* Total Court Hearings */}
          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Total Hearings</span>
              <Calendar className="w-4 h-4 text-teal-600" />
            </div>
            <div className="mt-2">
              <div className="text-base font-bold text-slate-900 dark:text-white font-mono">
                {totalHearings}
              </div>
            </div>
          </div>

          {/* Safety */}
          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">{t.safety}</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2">
              <div className={`text-base font-bold ${latestCheckIn?.answers.feelsSafe ? 'text-emerald-700' : 'text-rose-700'}`}>
                {latestCheckIn?.answers.feelsSafe ? 'Safe' : 'Review Needed'}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {latestCheckIn?.answers.feelsSafe ? 'Normal protocol' : 'Officer notified'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 3. Upcoming Support & 4. Case Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Next Scheduled Support Appointment */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Next Upcoming Support
              </span>
              <Calendar className="w-4 h-4 text-teal-700" />
            </div>

            {nextAppointment ? (
              <div className="mt-4 space-y-2">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {nextAppointment.serviceType}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {new Date(nextAppointment.scheduledAt).toLocaleString(undefined, { 
                      month: 'short', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  With: <strong className="text-slate-700 dark:text-slate-300">{nextAppointment.counsellorName}</strong>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Location: {nextAppointment.location}
                </div>
              </div>
            ) : (
              <div className="mt-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                No active appointments scheduled. You can request a session anytime.
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
            <button
              onClick={() => onNavigateTab('appointments')}
              className="text-xs font-semibold text-teal-800 dark:text-teal-300 hover:text-teal-950 flex items-center gap-1"
            >
              <span>{t.myAppointments}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab('support')}
              className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white underline"
            >
              Request New Session
            </button>
          </div>
        </div>

        {/* Current Case Stage Summary */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Current Case Progress
              </span>
              <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold text-slate-900 dark:text-white font-mono">
                  {userCase.caseNumber}
                </span>
                <span className="text-xs font-mono bg-teal-50 dark:bg-teal-900/30 text-teal-900 dark:text-teal-100 border border-teal-200 px-2 py-0.5 rounded uppercase">
                  {userCase.stage.replace('_', ' ')}
                </span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                Next Proceeding: <strong className="text-slate-800 dark:text-slate-200">{userCase.nextEventTitle}</strong>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-mono">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Date: {userCase.nextHearingDate}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Courtroom support and witness assistance are coordinated automatically with your Protection Officer.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/50">
            <button
              onClick={() => onNavigateTab('case')}
              className="text-xs font-semibold text-teal-800 dark:text-teal-300 hover:text-teal-950 flex items-center gap-1"
            >
              <span>{t.viewCase} Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. AURA Chat & Calming Games (AI Coping Tools) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* AURA Chat AI */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-2xl border border-indigo-200 p-5 shadow-lg flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-indigo-200/50">
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-800 font-bold">
                AURA Companion
              </span>
              <BrainCircuit className="w-5 h-5 text-indigo-700" />
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-bold text-indigo-950">Safe AI Chat</h3>
              <p className="text-xs text-indigo-800 mt-1">Talk to our supportive AI companion anytime for guided breathing and grounding techniques.</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-indigo-200/50">
            <button
              onClick={() => onNavigateTab('chatai')}
              className="text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-max shadow-md"
            >
              <span>Start Conversation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Calming Games */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-100 rounded-2xl border border-teal-200 p-5 shadow-lg flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-teal-200/50">
              <span className="text-xs font-mono uppercase tracking-wider text-teal-800 dark:text-teal-300 font-bold">
                Mindful Activities
              </span>
              <Heart className="w-5 h-5 text-teal-700" />
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-bold text-teal-950">Calming Games</h3>
              <p className="text-xs text-teal-800 dark:text-teal-300 mt-1">Distract your mind and lower anxiety with simple, repetitive, and soothing interactions.</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-teal-200/50">
            <button
              onClick={() => onNavigateTab('games')}
              className="text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-max shadow-md"
            >
              <span>Play Mindful Games</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Bar */}
      <div className="bg-slate-100 dark:bg-slate-900/80 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-slate-600 dark:text-slate-400 font-medium">
          Quick Actions:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('checkin')}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded font-medium hover:bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200"
          >
            {t.startCheckIn}
          </button>
          <button
            onClick={() => onNavigateTab('support')}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded font-medium hover:bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200"
          >
            {t.requestSupport}
          </button>
          <button
            onClick={() => onNavigateTab('case')}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded font-medium hover:bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200"
          >
            {t.viewCase}
          </button>
          <button
            onClick={() => onNavigateTab('appointments')}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded font-medium hover:bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200"
          >
            {t.myAppointments}
          </button>
          <button
            onClick={() => onNavigateTab('chatai')}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded font-medium hover:bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200"
          >
            Chat AI
          </button>
          <button
            onClick={() => onNavigateTab('games')}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded font-medium hover:bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200"
          >
            Games
          </button>
          <button
            onClick={onOpenEmergencyModal}
            className="px-3 py-1.5 bg-rose-50 border border-rose-300 rounded font-semibold text-rose-800 hover:bg-rose-100 flex items-center gap-1"
          >
            <PhoneCall className="w-3 h-3" />
            <span>{t.emergencyTitle}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
