import React from 'react';
import { useSentra } from '../../context/SentraContext';
import { 
  Bell, 
  Calendar, 
  FileText, 
  HeartHandshake, 
  ShieldAlert, 
  Check, 
  Clock 
} from 'lucide-react';

export const VictimNotifications: React.FC = () => {
  const { notifications, markNotificationAsRead } = useSentra();

  // Filter only victim-relevant notifications (no marketing or unrelated telemetry)
  const victimNotifs = notifications.filter(n => n.recipientRole === 'victim');

  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment_reminder':
        return <Calendar className="w-4 h-4 text-teal-700" />;
      case 'case_update':
        return <FileText className="w-4 h-4 text-slate-700 dark:text-slate-300" />;
      case 'support_response':
        return <HeartHandshake className="w-4 h-4 text-indigo-700" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600 dark:text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 p-6 shadow-xs">
        <span className="text-xs font-mono uppercase tracking-wider text-teal-800 dark:text-teal-300 font-semibold">
          Official Communications
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
          Notifications & Case Alerts
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Statutory notifications, check-in reminders, and verified updates regarding your case and appointments.
        </p>
      </div>

      <div className="space-y-3">
        {victimNotifs.length === 0 ? (
          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-lg text-center text-xs text-slate-400">
            No official notifications at this time.
          </div>
        ) : (
          victimNotifs.map((n) => (
            <div 
              key={n.id}
              className={`p-4 rounded-lg border transition-all flex items-start justify-between gap-4 ${
                !n.read 
                  ? 'bg-teal-50 dark:bg-teal-900/30/40 border-teal-200 shadow-xs' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/80 opacity-90'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded mt-0.5 ${!n.read ? 'bg-teal-100/70' : 'bg-slate-100 dark:bg-slate-900/80'}`}>
                  {getIcon(n.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      {n.title}
                    </h3>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-teal-600 inline-block" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(n.date).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {!n.read && (
                <button
                  onClick={() => markNotificationAsRead(n.id)}
                  className="px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700/80 rounded bg-white dark:bg-slate-900 hover:bg-slate-50 dark:bg-slate-950 shrink-0"
                >
                  Mark as read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
