import React, { useState, useEffect } from 'react';
import { ShieldCheck, Settings2 } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    security: true,
    performanceMetrics: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('sentra_cookie_consent');
    if (!consent) {
      // Delay display slightly so it doesn't jarringly block the viewport on first frame
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('sentra_cookie_consent', JSON.stringify({ essential: true, security: true, performanceMetrics: true }));
    setVisible(false);
  };

  const handleRejectNonEssential = () => {
    localStorage.setItem('sentra_cookie_consent', JSON.stringify({ essential: true, security: true, performanceMetrics: false }));
    setVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('sentra_cookie_consent', JSON.stringify(preferences));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 p-4 shadow-xl text-xs text-slate-700 dark:text-slate-300 animate-in slide-in-from-bottom duration-200">
      <div className="flex items-start gap-2.5">
        <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white">Privacy & Essential Storage Notice</h4>
          <p className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
            SENTRA utilizes strictly necessary authentication cookies and secure local storage for session management and accessibility preferences. No third-party commercial ad trackers are deployed.
          </p>
        </div>
      </div>

      {showPreferences && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/80 space-y-2 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-800 dark:text-slate-200">Essential Authentication</span>
            <span className="text-slate-400 font-mono">Always Active</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-800 dark:text-slate-200">Security & Tamper Audit Tokens</span>
            <span className="text-slate-400 font-mono">Always Active</span>
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="pref-perf" className="font-medium text-slate-800 dark:text-slate-200 cursor-pointer">
              Anonymized System Reliability Metrics
            </label>
            <input
              id="pref-perf"
              type="checkbox"
              checked={preferences.performanceMetrics}
              onChange={(e) => setPreferences(prev => ({ ...prev, performanceMetrics: e.target.checked }))}
              className="rounded text-teal-700 focus:ring-teal-700"
            />
          </div>
        </div>
      )}

      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/50 flex flex-wrap items-center justify-end gap-2">
        <button
          onClick={() => setShowPreferences(!showPreferences)}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 text-[11px] underline mr-auto flex items-center gap-1"
        >
          <Settings2 className="w-3 h-3" />
          <span>{showPreferences ? 'Hide Options' : 'Manage Preferences'}</span>
        </button>

        {showPreferences ? (
          <button
            onClick={handleSavePreferences}
            className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800"
          >
            Save Choices
          </button>
        ) : (
          <>
            <button
              onClick={handleRejectNonEssential}
              className="px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700/80 rounded text-xs font-medium"
            >
              Reject Non-Essential
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800"
            >
              Accept All
            </button>
          </>
        )}
      </div>
    </div>
  );
};
