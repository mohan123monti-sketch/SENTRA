import React from 'react';
import { useSentra } from '../../context/SentraContext';
import { translations } from '../../utils/translations';
import { 
  Heart, 
  Moon, 
  ShieldCheck, 
  BrainCircuit, 
  Calendar, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  PhoneCall, 
  FileText,
  AlertCircle,
  Sparkles,
  MessageCircle,
  Bell,
  BookOpen
} from 'lucide-react';

interface VictimDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenEmergencyModal: () => void;
}

export const VictimDashboard: React.FC<VictimDashboardProps> = ({ 
  onNavigateTab, 
  onOpenEmergencyModal 
}) => {
  const { language, victim, checkIns, appointments, cases, notifications } = useSentra();
  const t = translations[language];

  const latestCheckIn = checkIns[0];
  const userCase = cases.find(c => c.id === victim.caseId) || cases[0];
  const nextAppointment = appointments.find(a => a.status === 'confirmed');
  const recentNotifications = notifications.filter(n => n.recipientRole === 'victim').slice(0, 2);

  const hasRecentDistress = latestCheckIn && (latestCheckIn.analysis.distressIndicator >= 45 || !latestCheckIn.answers.feelsSafe);

  // Wellbeing indicators
  const wellbeingData = [
    { label: 'Mood', val: latestCheckIn?.answers.overallMood || 0, max: 5, color: 'bg-rose-500', lightColor: 'bg-rose-100 text-rose-600', icon: Sparkles },
    { label: 'Stress', val: latestCheckIn?.answers.stressLevel || 0, max: 5, color: 'bg-amber-500', lightColor: 'bg-amber-100 text-amber-600', icon: BrainCircuit },
    { label: 'Sleep', val: latestCheckIn?.answers.sleepQuality || 0, max: 5, color: 'bg-indigo-500', lightColor: 'bg-indigo-100 text-indigo-600', icon: Moon },
    { label: 'Happiness', val: latestCheckIn?.answers.happinessScore || 0, max: 5, color: 'bg-teal-500', lightColor: 'bg-teal-100 text-teal-600', icon: Heart }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">

      {/* ── 1. TOP AREA (GREETING & CTAs) ───────────────────────── */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 rounded-3xl p-8 sm:p-10 shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden border border-slate-700/50">
        {/* Subtle decorative background elements could go here */}
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <ShieldCheck className="w-72 h-72 text-white transform rotate-12 translate-x-12 -translate-y-12" />
        </div>
        
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-3 text-xs font-mono text-teal-200">
            <span className="px-2.5 py-1 rounded-md bg-white/10 border border-white/20">
              ID: {victim.id}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/10 border border-white/20">
              Case: {victim.caseId}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            How are you feeling today, {victim.name || victim.pseudonym}?
          </h1>
          <p className="text-slate-300 max-w-xl text-sm leading-relaxed">
            Your well-being matters. Check in regularly so your support team can stay connected. Remember, you are not alone in this journey.
          </p>
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigateTab('checkin')}
            className="w-full sm:w-auto px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Heart className="w-4 h-4" />
            <span>Start Check-In</span>
          </button>
          <button
            onClick={() => onNavigateTab('support')}
            className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-semibold transition-colors flex justify-center"
          >
            Request Support
          </button>
        </div>
      </div>

      {/* Status Warning Banner (if applicable) */}
      {hasRecentDistress && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-amber-900">Caseworker Notified</h3>
            <p className="text-sm text-amber-800 mt-1">
              Your recent check-in indicated elevated distress. Your assigned counsellor ({victim.assignedCounsellor}) has been notified and will reach out soon.
            </p>
          </div>
        </div>
      )}

      {/* ── 2. UNIFIED WELL-BEING OVERVIEW ──────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-teal-600" />
            Current Well-being Status
          </h2>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
            Last check-in: {latestCheckIn ? new Date(latestCheckIn.timestamp).toLocaleDateString() : 'Never'}
          </span>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {wellbeingData.map(item => (
            <div key={item.label} className="flex flex-col justify-between h-36 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.lightColor} group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                  {item.val ? `${item.val}/${item.max}` : '—'}
                </span>
              </div>
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
                  {item.label}
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${item.color}`}
                    style={{ width: item.val ? `${(item.val / item.max) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            </div>
          ))}
          
          {/* Safety Status added as a pill/badge */}
          <div className="col-span-2 lg:col-span-4 mt-2 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
             <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Safety Status:</span>
             {latestCheckIn?.answers.feelsSafe ? (
               <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-emerald-200">
                 <ShieldCheck className="w-3.5 h-3.5" /> Feels Safe
               </span>
             ) : latestCheckIn ? (
               <span className="px-3 py-1 bg-rose-50 text-rose-700 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-rose-200">
                 <AlertCircle className="w-3.5 h-3.5" /> Needs Review
               </span>
             ) : (
               <span className="text-xs text-slate-400">Pending</span>
             )}
          </div>
        </div>
      </div>

      {/* ── 3. MAIN CONTENT (TWO COLUMNS) ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT: Case Progress */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600" />
              Case Progress
            </h2>
            <button 
              onClick={() => onNavigateTab('case')}
              className="text-sm font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              Full Timeline <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 lg:p-8 border border-slate-100 dark:border-slate-700/50 flex flex-col justify-center">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
              <div>
                <div className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-1.5">Current Stage</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white capitalize">
                  {userCase?.stage ? userCase.stage.replace('_', ' ') : 'Review Pending'}
                </div>
              </div>
              <div className="sm:text-right bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Next Hearing</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  {userCase?.nextHearingDate || 'TBD'}
                </div>
              </div>
            </div>
            
            <div className="relative pt-2 pb-2">
              <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-teal-400 to-slate-200 dark:from-teal-600 dark:to-slate-700"></div>
              
              <div className="flex gap-5 relative mb-8 group">
                <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center shrink-0 border-4 border-slate-50 dark:border-slate-800 z-10 shadow-sm group-hover:scale-110 transition-transform"></div>
                <div>
                  <div className="text-base font-bold text-slate-900 dark:text-white">Upcoming: {userCase?.nextEventTitle || 'TBD'}</div>
                  <div className="text-sm text-slate-500 mt-1 font-medium">Please coordinate with Protection Officer</div>
                </div>
              </div>
              
              <div className="flex gap-5 relative group opacity-60 hover:opacity-100 transition-opacity">
                <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center shrink-0 border-4 border-slate-50 dark:border-slate-800 z-10 group-hover:scale-110 transition-transform"></div>
                <div>
                  <div className="text-base font-bold text-slate-600 dark:text-slate-400">Previous: FIR Filed</div>
                  <div className="text-sm text-slate-500 mt-1 font-medium">{userCase?.filingDate || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Upcoming Appointment & Notifications */}
        <div className="space-y-6">
          {/* Appointment */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                Upcoming Support
              </h2>
              <button 
                onClick={() => onNavigateTab('appointments')}
                className="text-sm font-semibold text-teal-700 hover:text-teal-800"
              >
                Manage
              </button>
            </div>
            
            {nextAppointment ? (
              <div className="bg-teal-50/50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-800/50 rounded-xl p-4 flex gap-4 items-center">
                <div className="bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-700 w-14 h-14 rounded-lg flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase">
                    {new Date(nextAppointment.scheduledAt).toLocaleString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white leading-none">
                    {new Date(nextAppointment.scheduledAt).getDate()}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-white">{nextAppointment.serviceType}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-1">
                    <Clock className="w-3.5 h-3.5" /> 
                    {new Date(nextAppointment.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    <span className="mx-1">•</span>
                    {nextAppointment.counsellorName}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-xl p-4 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">No upcoming appointments.</p>
                <button 
                  onClick={() => onNavigateTab('support')}
                  className="mt-2 text-sm font-semibold text-teal-600 hover:text-teal-700"
                >
                  Request a session
                </button>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 shadow-sm">
             <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-teal-600" />
                Recent Alerts
              </h2>
              <button 
                onClick={() => onNavigateTab('notifications')}
                className="text-sm font-semibold text-teal-700 hover:text-teal-800"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-3">
              {recentNotifications.length > 0 ? (
                recentNotifications.map(n => (
                  <div key={n.id} className="flex gap-3 items-start pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                    <div className={`p-1.5 rounded-full mt-0.5 shrink-0 ${!n.read ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500'}`}>
                      <Bell className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className={`text-sm ${!n.read ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                        {n.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{n.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-2">No recent alerts</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. RESOURCES & WELLNESS ─────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          onClick={() => onNavigateTab('chatai')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:border-teal-300 transition-colors shadow-sm group"
        >
          <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Talk to AURA (AI Companion)</h3>
            <p className="text-xs text-slate-500 mt-1">Chat anytime for guided breathing and grounding techniques.</p>
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('games')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:border-teal-300 transition-colors shadow-sm group"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Mindful Calming Games</h3>
            <p className="text-xs text-slate-500 mt-1">Simple soothing activities to lower anxiety and restore calm.</p>
          </div>
        </div>
      </div>
      
    </div>
  );
};
