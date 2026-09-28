import React, { useState } from 'react';
import { useSentra } from '../../context/SentraContext';
import { translations } from '../../utils/translations';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle2, 
  CalendarX,
  CalendarCheck
} from 'lucide-react';

export const VictimAppointments: React.FC = () => {
  const { 
    language, 
    appointments, 
    confirmAppointment, 
    requestRescheduleAppointment 
  } = useSentra();
  const t = translations[language];

  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleConfirm = (id: string) => {
    confirmAppointment(id);
    setActionNotice('Your attendance has been confirmed for this session.');
  };

  const handleReschedule = (id: string) => {
    requestRescheduleAppointment(id);
    setActionNotice('Reschedule request sent to your caseworker. They will provide alternate time slots.');
  };

  const statusStyles: Record<string, string> = {
    confirmed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    rescheduled: 'bg-amber-50 text-amber-800 border-amber-200',
    pending: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  };

  const upcomingAppointment = appointments.find(a => a.status === 'confirmed' || a.status === 'pending');
  const otherAppointments = appointments.filter(a => a !== upcomingAppointment);

  const AppointmentCard = ({ apt, isHero = false }: { apt: any, isHero?: boolean }) => {
    const dateObj = new Date(apt.scheduledAt);
    const isConfirmed = apt.status === 'confirmed';
    const isRescheduled = apt.status === 'rescheduled';
    const statusClass = statusStyles[apt.status] || statusStyles.pending;

    if (isHero) {
      return (
        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 md:items-center">
          <div className="bg-white dark:bg-slate-900 border border-teal-100 dark:border-teal-700/50 w-24 h-24 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-sm">
            <span className="text-sm font-bold text-teal-700 dark:text-teal-400 uppercase">
              {dateObj.toLocaleDateString(undefined, { month: 'short' })}
            </span>
            <span className="text-3xl font-bold text-slate-900 dark:text-white leading-none">
              {dateObj.getDate()}
            </span>
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${statusClass}`}>
                {apt.status}
              </span>
              <span className="text-[10px] font-mono text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/40 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                {apt.id}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {apt.serviceType}
            </h3>
            
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-700 dark:text-slate-300 pt-1">
              <span className="flex items-center gap-1.5 font-bold">
                <Clock className="w-4 h-4 text-teal-600" />
                {dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <User className="w-4 h-4 text-teal-600" />
                {apt.counsellorName}
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <MapPin className="w-4 h-4 text-slate-400" />
                {apt.location}
              </span>
            </div>
          </div>

          <div className="flex md:flex-col items-center justify-start gap-2 pt-4 md:pt-0 border-t border-teal-100 md:border-t-0 md:border-l md:pl-6 shrink-0">
            {!isConfirmed && (
              <button
                onClick={() => handleConfirm(apt.id)}
                className="w-full px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" /> Confirm
              </button>
            )}
            {!isRescheduled && (
              <button
                onClick={() => handleReschedule(apt.id)}
                className="w-full px-5 py-2.5 bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <CalendarX className="w-4 h-4 text-slate-500" /> Reschedule
              </button>
            )}
          </div>
        </div>
      );
    }

    // Standard list item layout
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/80 p-5 shadow-sm flex flex-col sm:flex-row gap-4 sm:items-center justify-between hover:border-slate-300 transition-colors">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${statusClass}`}>
              {apt.status}
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
            {apt.serviceType}
          </h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5 font-bold text-slate-800">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5 font-mono font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-teal-600" />
              {apt.counsellorName}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {apt.location}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 sm:border-l sm:pl-4 shrink-0">
          {!isConfirmed && (
            <button
              onClick={() => handleConfirm(apt.id)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Confirm
            </button>
          )}
          {!isRescheduled && (
            <button
              onClick={() => handleReschedule(apt.id)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <CalendarX className="w-3.5 h-3.5 text-slate-500" /> Reschedule
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">

      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 md:p-8 shadow-md text-white">
        <span className="text-[10px] font-mono uppercase tracking-wider text-teal-300 font-bold bg-teal-900/40 px-2.5 py-1 rounded-md border border-teal-800 inline-flex items-center gap-1.5 mb-3">
          <CalendarCheck className="w-3.5 h-3.5" />
          Scheduled Consultations
        </span>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          My Appointments
        </h1>
        <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
          Manage your upcoming counselling sessions, pre-trial briefings, and caseworker follow-ups in one place.
        </p>
      </div>

      {/* ── Action Notice ──────────────────────────────────────── */}
      {actionNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-sm text-emerald-950 shadow-sm animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span className="font-medium">{actionNotice}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-xs font-bold bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg text-emerald-800 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Upcoming & Past Appointments ───────────────────────── */}
      <div className="space-y-8">
        
        {upcomingAppointment ? (
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Upcoming Appointment</h2>
            <AppointmentCard apt={upcomingAppointment} isHero={true} />
          </div>
        ) : (
          <div className="p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-center shadow-sm">
            <Calendar className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              No active upcoming appointments scheduled.
            </p>
            <p className="text-xs text-slate-500 mt-1">You can request a session via the Support tab.</p>
          </div>
        )}

        {otherAppointments.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Other Appointments</h2>
            <div className="space-y-3">
              {otherAppointments.map(apt => (
                <AppointmentCard key={apt.id} apt={apt} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
