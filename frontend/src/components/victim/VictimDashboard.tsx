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
    { label: 'Mood', val: latestCheckIn?.answers.overallMood || 0, max: 5, color: 'bg-rose-500', icon: Sparkles },
    { label: 'Stress', val: latestCheckIn?.answers.stressLevel || 0, max: 5, color: 'bg-amber-500', icon: BrainCircuit },
    { label: 'Sleep', val: latestCheckIn?.answers.sleepQuality || 0, max: 5, color: 'bg-indigo-500', icon: Moon },
    { label: 'Happiness', val: latestCheckIn?.answers.happinessScore || 0, max: 5, color: 'bg-teal-500', icon: Heart }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">

      {/* ── 1. TOP AREA (GREETING & CTAs) ───────────────────────── */}
      <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-md text-white flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle decorative background elements could go here */}
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <ShieldCheck className="w-64 h-64 text-white transform rotate-12" />
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wellbeingData.map(item => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <item.icon className="w-4 h-4 text-slate-400" />
                  {item.label}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {item.val ? `${item.val}/${item.max}` : '—'}
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${item.color}`}
                  style={{ width: item.val ? `${(item.val / item.max) * 100}%` : '0%' }}
                />
              </div>
            </div>
          ))}
          
          {/* Safety Status added as a pill/badge */}
          <div className="lg:col-span-4 mt-2 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
             <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Safety Status:</span>
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
          
          <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-700/50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">Current Stage</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                  {userCase.stage.replace('_', ' ')}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">Next Hearing</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 justify-end">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  {userCase.nextHearingDate}
                </div>
              </div>
            </div>
            
            <div className="relative pt-4">
              <div className="absolute left-2.5 top-5 bottom-2 w-0.5 bg-teal-100 dark:bg-teal-900/50"></div>
              
              <div className="flex gap-4 relative mb-4">
                <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center shrink-0 border-4 border-slate-50 dark:border-slate-800 z-10"></div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">Upcoming: {userCase.nextEventTitle}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Please coordinate with Protection Officer</div>
                </div>
              </div>
              
              <div className="flex gap-4 relative">
                <div className="w-5 h-5 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center shrink-0 border-4 border-slate-50 dark:border-slate-800 z-10"></div>
                <div>
                  <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">Previous: FIR Filed</div>
                  <div className="text-xs text-slate-500 mt-0.5">{userCase.filingDate}</div>
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
