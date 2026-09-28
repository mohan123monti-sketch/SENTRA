import React from 'react';
import { useSentra } from '../../context/SentraContext';
import { 
  Bell, 
  Calendar, 
  FileText, 
  HeartHandshake, 
  Check, 
  Clock 
} from 'lucide-react';

export const VictimNotifications: React.FC = () => {
  const { notifications, markNotificationAsRead } = useSentra();

  const victimNotifs = notifications.filter(n => n.recipientRole === 'victim');
  
  // Group by date (simplified for mock data - using exact date string for grouping here)
  const groupedNotifs: { [key: string]: typeof victimNotifs } = {};
  
  victimNotifs.forEach(n => {
    const d = new Date(n.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    if (!groupedNotifs[d]) groupedNotifs[d] = [];
    groupedNotifs[d].push(n);
  });

  const getIconAndColor = (type: string, isRead: boolean) => {
    if (!isRead) {
      return { 
        icon: <Bell className="w-5 h-5" />, 
        bg: 'bg-teal-500 text-white', 
        border: 'border-teal-500 ring-4 ring-teal-50' 
      };
    }
    switch (type) {
      case 'appointment_reminder':
        return { icon: <Calendar className="w-4 h-4" />, bg: 'bg-white text-slate-500', border: 'border-slate-200' };
      case 'case_update':
        return { icon: <FileText className="w-4 h-4" />, bg: 'bg-white text-slate-500', border: 'border-slate-200' };
      case 'support_response':
        return { icon: <HeartHandshake className="w-4 h-4" />, bg: 'bg-white text-slate-500', border: 'border-slate-200' };
      default:
        return { icon: <Bell className="w-4 h-4" />, bg: 'bg-white text-slate-500', border: 'border-slate-200' };
    }
  };

  const unreadCount = victimNotifs.filter(n => !n.read).length;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">

      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 md:p-8 shadow-md text-white flex flex-col sm:flex-row justify-between sm:items-center gap-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-teal-300 font-bold bg-teal-900/40 px-2.5 py-1 rounded-md border border-teal-800 inline-flex items-center gap-1.5 mb-3">
            <Bell className="w-3.5 h-3.5" />
            Official Communications
          </span>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Notifications & Alerts
          </h1>
          <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
            Statutory notifications, check-in reminders, and case updates from your support team.
          </p>
        </div>
        
        {unreadCount > 0 && (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 min-w-[120px] text-center shrink-0">
            <div className="text-3xl font-bold text-teal-300 mb-1">{unreadCount}</div>
            <div className="text-xs uppercase font-bold tracking-wider text-slate-300">New Alerts</div>
          </div>
        )}
      </div>

      {/* ── Timeline ───────────────────────────────────────────── */}
      {victimNotifs.length === 0 ? (
        <div className="p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-center shadow-sm">
          <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            No official notifications at this time.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 md:p-8 shadow-sm">
          
          <div className="relative">
            <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-slate-100 dark:bg-slate-800"></div>

            <div className="space-y-10">
              {Object.entries(groupedNotifs).map(([dateLabel, notifs]) => (
                <div key={dateLabel}>
                  
                  {/* Date Header */}
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-14 bg-white dark:bg-slate-900 flex justify-center">
                      <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                    </div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                      {dateLabel}
                    </h2>
                  </div>

                  {/* Notifications for Date */}
                  <div className="space-y-4">
                    {notifs.map(n => {
                      const style = getIconAndColor(n.type, n.read);
                      
                      return (
                        <div key={n.id} className="flex items-start gap-4 sm:gap-6 relative z-10 group">
                          
                          {/* Icon Node */}
                          <div className={`w-14 flex justify-center shrink-0`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-sm transition-transform group-hover:scale-105 ${style.bg} ${style.border}`}>
                              {style.icon}
                            </div>
                          </div>

                          {/* Card */}
                          <div className={`flex-1 rounded-xl p-4 sm:p-5 border transition-all ${
                            !n.read 
                              ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 shadow-sm' 
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                          }`}>
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                              
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className={`text-base font-bold ${!n.read ? 'text-teal-900 dark:text-white' : 'text-slate-900 dark:text-white'}`}>
                                    {n.title}
                                  </h3>
                                  {!n.read && (
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-rose-500 text-white">
                                      New
                                    </span>
                                  )}
                                </div>
                                <p className={`text-sm leading-relaxed ${!n.read ? 'text-teal-800 dark:text-teal-100' : 'text-slate-600 dark:text-slate-400'}`}>
                                  {n.message}
                                </p>
                                <div className="mt-3 flex items-center gap-1.5 text-xs font-mono text-slate-500">
                                  <Clock className="w-3.5 h-3.5" />
                                  {new Date(n.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>

                              {!n.read && (
                                <button
                                  onClick={() => markNotificationAsRead(n.id)}
                                  className="self-start px-4 py-2 bg-white hover:bg-teal-100 border border-teal-200 text-teal-800 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shrink-0 shadow-sm"
                                >
                                  <Check className="w-4 h-4" />
                                  Mark Read
                                </button>
                              )}
                              
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
