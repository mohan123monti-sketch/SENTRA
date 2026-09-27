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
  PhoneCall,
  AlertCircle 
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

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 p-6 shadow-xs">
        <span className="text-xs font-mono uppercase tracking-wider text-teal-800 dark:text-teal-300 font-semibold">
          Scheduled Consultations
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
          {t.myAppointments}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Review upcoming trauma-informed counselling sessions, pre-trial familiarization briefings, and caseworker follow-ups.
        </p>
      </div>

      {actionNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-950">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-[11px] underline text-emerald-800 ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-lg text-center text-xs text-slate-500 dark:text-slate-400">
            No active appointments scheduled. You can request a session via the Support tab.
          </div>
        ) : (
          appointments.map((apt) => {
            const dateObj = new Date(apt.scheduledAt);
            const isConfirmed = apt.status === 'confirmed';
            const isRescheduled = apt.status === 'rescheduled';

            return (
              <div 
                key={apt.id}
                className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase px-2 py-0.5 rounded border font-medium bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80">
                      {apt.id}
                    </span>
                    <span className={`text-[11px] font-mono uppercase px-2 py-0.5 rounded border font-semibold ${
                      isConfirmed 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                        : isRescheduled 
                        ? 'bg-amber-50 text-amber-800 border-amber-200' 
                        : 'bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80'
                    }`}>
                      {apt.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {apt.serviceType}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} at {dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-teal-700" />
                      <span>{apt.counsellorName}</span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:col-span-2 text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>Location: {apt.location}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap md:flex-col items-end gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800/50">
                  {!isConfirmed && (
                    <button
                      onClick={() => handleConfirm(apt.id)}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t.confirmAppointment}</span>
                    </button>
                  )}

                  {!isRescheduled && (
                    <button
                      onClick={() => handleReschedule(apt.id)}
                      className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-950 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <CalendarX className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span>{t.requestReschedule}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
