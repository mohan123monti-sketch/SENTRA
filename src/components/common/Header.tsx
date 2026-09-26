import React, { useState } from 'react';
import { useSentra } from '../../context/SentraContext';
import { UserRole, LanguageCode } from '../../types/sentra';
import { SentraLogo } from './SentraLogo';
import { 
  ShieldCheck, 
  Globe, 
  Eye, 
  Type, 
  LogOut, 
  UserCheck, 
  Menu, 
  X,
  PhoneCall,
  Lock,
  LogIn,
  KeyRound
} from 'lucide-react';
import { translations } from '../../utils/translations';

interface HeaderProps {
  currentView: 'public' | 'login' | 'portal';
  onNavigateView: (view: 'public' | 'login' | 'portal', loginTab?: 'victim' | 'staff') => void;
  onOpenEmergencyModal?: () => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentView,
  onNavigateView,
  onOpenEmergencyModal,
  activeTab = 'dashboard',
  setActiveTab 
}) => {
  const { 
    role, 
    setRole, 
    language, 
    setLanguage, 
    accessibility, 
    setAccessibility,
    isAuthenticated,
    activeUser,
    logout,
    notifications,
    victim
  } = useSentra();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[language];

  const unreadVictimNotifs = notifications.filter(n => n.recipientRole === 'victim' && !n.read).length;
  const unreadStaffNotifs = notifications.filter(n => n.recipientRole === role && !n.read).length;

  const roleLabels: Record<UserRole, string> = {
    public: "Public Overview",
    victim: "Victim / Complainant Portal",
    counsellor: "Clinical Counsellor Portal",
    district_officer: "District Support Officer Console",
    legal_officer: "Legal Protection Officer Console",
    state_admin: "State / National Oversight",
    system_admin: "System Administrator Console"
  };

  const navLinksForRole = () => {
    if (currentView !== 'portal') {
      return [
        { id: 'interactive-simulator', label: 'Live Simulator' },
        { id: 'operating-model', label: 'How It Works' },
        { id: 'multimodal-engine', label: 'Multimodal AI' },
        { id: 'explainable-ai', label: 'Explainable AI' },
        { id: 'rbac-governance', label: '6-Tier RBAC' },
        { id: 'faq-section', label: 'FAQ' }
      ];
    }

    switch (role) {
      case 'victim':
        return [
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'checkin', label: 'Check-in' },
          { id: 'chatai', label: 'Chat AI' },
          { id: 'games', label: 'Calming Games' },
          { id: 'case', label: 'My Case' },
          { id: 'support', label: 'My Support' },
          { id: 'appointments', label: 'Appointments' },
          { id: 'notifications', label: `Notifications${unreadVictimNotifs > 0 ? ` (${unreadVictimNotifs})` : ''}` },
          { id: 'profile', label: 'My Profile & Details' }
        ];
      case 'counsellor':
        return [
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'cases', label: 'Assigned Cases' },
          { id: 'alerts', label: `Alerts${unreadStaffNotifs > 0 ? ` (${unreadStaffNotifs})` : ''}` },
          { id: 'casedetail', label: 'Case V-9042' },
          { id: 'interventions', label: 'Interventions' }
        ];
      case 'district_officer':
        return [
          { id: 'dashboard', label: 'Overview' },
          { id: 'priority_cases', label: 'Priority Cases' },
          { id: 'interventions', label: 'Interventions' },
          { id: 'workload', label: 'Caseworker Load' },
          { id: 'analytics', label: 'District Analytics' },
          { id: 'reports', label: 'Official Reports' }
        ];
      case 'legal_officer':
        return [
          { id: 'dashboard', label: 'Overview' },
          { id: 'safety_alerts', label: 'Safety & Protection' },
          { id: 'cases', label: 'Proceedings Cases' },
          { id: 'requests', label: 'Assistance Requests' },
          { id: 'followups', label: 'Legal Follow-ups' }
        ];
      case 'state_admin':
        return [
          { id: 'overview', label: 'Executive Overview' },
          { id: 'analytics', label: 'State & District Analytics' },
          { id: 'trends', label: 'Longitudinal Trends' },
          { id: 'interventions', label: 'Intervention Turnaround' },
          { id: 'reports', label: 'Parliamentary Reports' }
        ];
      case 'system_admin':
        return [
          { id: 'overview', label: 'System Health' },
          { id: 'users', label: 'User Directory' },
          { id: 'roles', label: 'RBAC Policy Matrix' },
          { id: 'audit_logs', label: 'Audit Trail' },
          { id: 'configuration', label: 'Retention & Security' },
          { id: 'ai_model', label: 'AI Model Registry' }
        ];
      default:
        return [];
    }
  };

  const currentLinks = navLinksForRole();

  const handleSignOut = () => {
    logout();
    onNavigateView('login', 'victim');
  };

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40 transition-colors">
      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-slate-100 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-end gap-3">
          <div className="flex items-center gap-3">
            {/* Session Status & Quick Switch Affordance */}
            {isAuthenticated ? (
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="text-slate-400">Session:</span>
                <span className="font-bold text-emerald-400 font-mono truncate max-w-[140px]">
                  {activeUser?.name || role}
                </span>
                <button
                  onClick={() => {
                    logout();
                    onNavigateView('login', 'victim');
                  }}
                  className="ml-1 text-[11px] text-amber-300 underline hover:text-white"
                >
                  Switch Role / Re-login
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-slate-400 hidden sm:inline">Session:</span>
                <span className="text-amber-300 font-mono">Unauthenticated</span>
                <button
                  onClick={() => onNavigateView('login', 'victim')}
                  className="px-2 py-0.5 rounded bg-teal-800 hover:bg-teal-700 text-white font-medium text-[10px] uppercase font-mono tracking-wider ml-1"
                >
                  Open Login
                </button>
              </div>
            )}

            {/* Language Selection */}
            <div className="flex items-center gap-1 border-l border-slate-700 pl-2">
              <Globe className="w-3 h-3 text-slate-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="bg-transparent text-slate-200 text-xs border-none focus:outline-none cursor-pointer pr-1"
                aria-label="Language selector"
              >
                <option value="en" className="bg-slate-900 text-white">English</option>
                <option value="ta" className="bg-slate-900 text-white">தமிழ்</option>
                <option value="hi" className="bg-slate-900 text-white">हिन्दी</option>
              </select>
            </div>

            {/* Accessibility Controls */}
            <div className="flex items-center gap-1.5 border-l border-slate-700 pl-2">
              <button
                onClick={() => setAccessibility(prev => ({ ...prev, highContrast: !prev.highContrast }))}
                className={`p-1 rounded text-xs transition-colors ${accessibility.highContrast ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                title="Toggle High Contrast"
                aria-label="Toggle High Contrast"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setAccessibility(prev => ({ ...prev, largeText: !prev.largeText }))}
                className={`p-1 rounded text-xs transition-colors ${accessibility.largeText ? 'bg-teal-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                title="Toggle Larger Text"
                aria-label="Toggle Larger Text"
              >
                <Type className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: Zone 1 (Brand) — Zone 2 (Nav Links) — Zone 3 (Primary Actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button 
          onClick={() => {
            if (currentView === 'portal') {
              if (setActiveTab) setActiveTab('dashboard');
            } else {
              onNavigateView('public');
            }
          }}
          className="flex items-center text-left focus:outline-none"
        >
          <SentraLogo size={32} />
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          {currentLinks.map((item) => {
            const isActive = currentView === 'portal' && activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (currentView === 'portal') {
                    if (setActiveTab) setActiveTab(item.id);
                  } else {
                    onNavigateView('public');
                    setTimeout(() => {
                      const el = document.getElementById(item.id);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 60);
                  }
                }}
                className={`whitespace-nowrap transition-colors py-1 border-b-2 text-sm ${
                  isActive 
                    ? 'border-teal-700 text-teal-900 font-semibold' 
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          {/* If authenticated in portal */}
          {currentView === 'portal' && (
            <>
              {role === 'victim' && onOpenEmergencyModal && (
                <button
                  onClick={onOpenEmergencyModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-300 rounded hover:bg-rose-100 transition-colors whitespace-nowrap"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-rose-700" />
                  <span>{t.emergencyTitle}</span>
                </button>
              )}

              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-mono text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span className="font-semibold">{activeUser?.badge || victim.id}</span>
              </div>

              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200 transition-colors whitespace-nowrap"
                title="Sign Out of Session"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-500" />
                <span>Sign Out</span>
              </button>
            </>
          )}

          {/* If on Public Landing */}
          {currentView === 'public' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateView('login', 'victim')}
                className="px-3.5 py-1.5 text-xs font-semibold text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                <span>Victim Login</span>
              </button>

              <button
                onClick={() => onNavigateView('login', 'staff')}
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <Lock className="w-3 h-3 text-slate-300" />
                <span>Staff Login</span>
              </button>
            </div>
          )}

          {/* If on Login Portal page */}
          {currentView === 'login' && (
            <button
              onClick={() => onNavigateView('public')}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 border border-slate-200 rounded hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              &larr; Public Platform
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-700 hover:bg-slate-100 rounded focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2">
          <div className="text-xs text-slate-400 font-mono mb-2 uppercase">
            {currentView === 'portal' ? roleLabels[role] : 'Navigation'}
          </div>

          {currentLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (currentView === 'portal') {
                  if (setActiveTab) setActiveTab(item.id);
                } else {
                  onNavigateView('public');
                  setTimeout(() => {
                    const el = document.getElementById(item.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 60);
                }
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 text-sm rounded ${
                activeTab === item.id 
                  ? 'bg-slate-100 text-teal-900 font-semibold' 
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}

          {currentView === 'portal' && role === 'victim' && onOpenEmergencyModal && (
            <button
              onClick={() => {
                onOpenEmergencyModal();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-center px-3 py-2 mt-2 text-sm font-semibold text-rose-800 bg-rose-50 border border-rose-300 rounded"
            >
              {t.emergencyTitle} (Immediate Support)
            </button>
          )}

          {currentView === 'portal' && (
            <button
              onClick={() => {
                handleSignOut();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-center px-3 py-2 mt-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded"
            >
              Sign Out
            </button>
          )}

          {currentView !== 'portal' && (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  onNavigateView('login', 'victim');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-center px-3 py-2 text-sm font-semibold text-teal-900 bg-teal-50 border border-teal-200 rounded"
              >
                Victim Portal Login
              </button>
              <button
                onClick={() => {
                  onNavigateView('login', 'staff');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-center px-3 py-2 text-sm font-semibold text-white bg-slate-900 rounded"
              >
                Caseworker & Officer Login
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
