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

  // Friendly non-clinical status message based on recent check-in
  const hasRecentDistress = latestCheckIn && (latestCheckIn.analysis.distressIndicator >= 45 || !latestCheckIn.answers.feelsSafe);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Welcome Banner & Immediate Check-in Callout */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-teal-800 font-semibold">
                Support ID: {victim.id}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-600 font-medium">
                {victim.name || victim.pseudonym} ({victim.caseId})
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t.howFeelingToday}
            </h1>
            <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
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
              className="px-3.5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-800 rounded text-xs font-semibold transition-colors"
            >
              {t.requestSupport}
            </button>
            <button
              onClick={() => onNavigateTab('profile')}
              className="px-3 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded text-xs font-medium transition-colors"
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
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-500">
            {t.wellbeingOverview}
          </h2>
          <span className="text-[11px] text-slate-400">
            Based on your recent self-reported check-ins
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {/* Emotional Wellbeing */}
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500">{t.emotionalWellbeing}</span>
              <Heart className="w-4 h-4 text-rose-500" />
            </div>
            <div className="mt-2">
              <div className="text-base font-bold text-slate-900 font-mono">
                {latestCheckIn ? `${latestCheckIn.answers.overallMood}/5` : '—'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {latestCheckIn?.answers.overallMood && latestCheckIn.answers.overallMood >= 4 ? 'Good' : latestCheckIn?.answers.overallMood === 3 ? 'Fair' : 'Under Stress'}
              </div>
            </div>
          </div>

          {/* Stress & Worry */}
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500">{t.stress}</span>
              <BrainCircuit className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2">
              <div className="text-base font-bold text-slate-900 font-mono">
                {latestCheckIn ? `${latestCheckIn.answers.stressLevel}/5` : '—'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {latestCheckIn?.answers.stressLevel && latestCheckIn.answers.stressLevel >= 4 ? 'Elevated' : 'Manageable'}
              </div>
            </div>
          </div>

          {/* Sleep Restfulness */}
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500">{t.sleep}</span>
              <Moon className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-2">
              <div className="text-base font-bold text-slate-900 font-mono">
                {latestCheckIn ? `${latestCheckIn.answers.sleepQuality}/5` : '—'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {latestCheckIn?.answers.sleepQuality && latestCheckIn.answers.sleepQuality <= 2 ? 'Disrupted' : 'Adequate'}
              </div>
            </div>
          </div>

          {/* Support Network */}
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500">{t.support}</span>
              <Users className="w-4 h-4 text-teal-600" />
            </div>
            <div className="mt-2">
              <div className="text-base font-bold text-slate-900">
                {latestCheckIn?.answers.hasSupportToTalk ? 'Connected' : 'Limited'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Caseworker assigned
              </div>
            </div>
          </div>

          {/* Safety */}
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 flex flex-col justify-between col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500">{t.safety}</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2">
              <div className={`text-base font-bold ${latestCheckIn?.answers.feelsSafe ? 'text-emerald-700' : 'text-rose-700'}`}>
                {latestCheckIn?.answers.feelsSafe ? 'Safe' : 'Review Needed'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {latestCheckIn?.answers.feelsSafe ? 'Normal protocol' : 'Officer notified'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 3. Upcoming Support & 4. Case Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Next Scheduled Support Appointment */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
                Next Upcoming Support
              </span>
              <Calendar className="w-4 h-4 text-teal-700" />
            </div>

            {nextAppointment ? (
              <div className="mt-4 space-y-2">
                <div className="text-sm font-semibold text-slate-900">
                  {nextAppointment.serviceType}
                </div>
                <div className="text-xs text-slate-600 flex items-center gap-1.5 font-mono">
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
                <div className="text-xs text-slate-500">
                  With: <strong className="text-slate-700">{nextAppointment.counsellorName}</strong>
                </div>
                <div className="text-xs text-slate-500">
                  Location: {nextAppointment.location}
                </div>
              </div>
            ) : (
              <div className="mt-4 py-3 text-xs text-slate-500">
                No active appointments scheduled. You can request a session anytime.
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onNavigateTab('appointments')}
              className="text-xs font-semibold text-teal-800 hover:text-teal-950 flex items-center gap-1"
            >
              <span>{t.myAppointments}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab('support')}
              className="text-xs text-slate-600 hover:text-slate-900 underline"
            >
              Request New Session
            </button>
          </div>
        </div>

        {/* Current Case Stage Summary */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
                Current Case Progress
              </span>
              <FileText className="w-4 h-4 text-slate-600" />
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold text-slate-900 font-mono">
                  {userCase.caseNumber}
                </span>
                <span className="text-xs font-mono bg-teal-50 text-teal-900 border border-teal-200 px-2 py-0.5 rounded uppercase">
                  {userCase.stage.replace('_', ' ')}
                </span>
              </div>
              <div className="text-xs text-slate-600">
                Next Proceeding: <strong className="text-slate-800">{userCase.nextEventTitle}</strong>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5 font-mono">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Date: {userCase.nextHearingDate}</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Courtroom support and witness assistance are coordinated automatically with your Protection Officer.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab('case')}
              className="text-xs font-semibold text-teal-800 hover:text-teal-950 flex items-center gap-1"
            >
              <span>{t.viewCase} Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Bar */}
      <div className="bg-slate-100 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-slate-600 font-medium">
          Quick Actions:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('checkin')}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded font-medium hover:bg-slate-50 text-slate-800"
          >
            {t.startCheckIn}
          </button>
          <button
            onClick={() => onNavigateTab('support')}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded font-medium hover:bg-slate-50 text-slate-800"
          >
            {t.requestSupport}
          </button>
          <button
            onClick={() => onNavigateTab('case')}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded font-medium hover:bg-slate-50 text-slate-800"
          >
            {t.viewCase}
          </button>
          <button
            onClick={() => onNavigateTab('appointments')}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded font-medium hover:bg-slate-50 text-slate-800"
          >
            {t.myAppointments}
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
