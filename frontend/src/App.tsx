import React, { useState } from 'react';
import { SentraProvider, useSentra } from './context/SentraContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { EmergencyHelpModal } from './components/common/EmergencyHelpModal';
import { LegalModal, LegalPageType } from './components/common/LegalModal';
import { CookieBanner } from './components/common/CookieBanner';
import { AuraWidget } from './components/common/AuraWidget';
import { Sidebar } from './components/common/Sidebar';
import { motion, AnimatePresence } from 'motion/react';


// Authentication
import { LoginPortal } from './components/auth/LoginPortal';

// Victim components
import { VictimDashboard } from './components/victim/VictimDashboard';
import { VictimCheckIn } from './components/victim/VictimCheckIn';
import { VictimCase } from './components/victim/VictimCase';
import { VictimSupport } from './components/victim/VictimSupport';
import { VictimAppointments } from './components/victim/VictimAppointments';
import { VictimNotifications } from './components/victim/VictimNotifications';
import { VictimProfileConsent } from './components/victim/VictimProfileConsent';
import { VictimChatAI } from './components/victim/VictimChatAI';
import { VictimCalmingGames } from './components/victim/VictimCalmingGames';

// Staff & Public portals
import { CounsellorPortal } from './components/counsellor/CounsellorPortal';
import { DistrictOfficerPortal } from './components/officer/DistrictOfficerPortal';
import { LegalOfficerPortal } from './components/legal/LegalOfficerPortal';
import { StateNationalPortal } from './components/state/StateNationalPortal';
import { SystemAdminPortal } from './components/admin/SystemAdminPortal';
import { PublicLanding } from './components/public/PublicLanding';
import { AIAnalysisResult, UserRole } from './types/sentra';

const SentraAppContent: React.FC = () => {
  const { 
    role, 
    isAuthenticated,
    isVictimAuthenticated 
  } = useSentra();

  // Screen management: 'public' | 'login' | 'portal'
  const getInitialView = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlView = params.get('view');
      if (urlView === 'public' || urlView === 'login' || urlView === 'portal') return urlView;
    }
    return (localStorage.getItem('sentra_current_view') as any) || (isAuthenticated ? 'portal' : 'public');
  };

  const getInitialTab = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlTab = params.get('tab');
      if (urlTab) return urlTab;
    }
    return localStorage.getItem('sentra_active_tab') || 'dashboard';
  };

  const [currentView, setCurrentView] = useState<'public' | 'login' | 'portal'>(getInitialView);
  const [loginTab, setLoginTab] = useState<'victim' | 'staff'>('victim');
  const [activeTab, setActiveTab] = useState<string>(getInitialTab);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [legalModalPage, setLegalModalPage] = useState<LegalPageType | null>(null);

  // When check-in is completed by the victim, notify and allow seamless review
  const handleCheckInCompleted = (analysis: AIAnalysisResult) => {
    // The analysis and new risk level are already saved into global context!
  };

  // Browser History integration
  React.useEffect(() => {
    // Replace initial state so the first popstate has state data
    window.history.replaceState({ view: currentView, tab: activeTab }, '', `?view=${currentView}&tab=${activeTab}`);

    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        if (event.state.view) {
          setCurrentView(event.state.view);
          localStorage.setItem('sentra_current_view', event.state.view);
        }
        if (event.state.tab) {
          setActiveTab(event.state.tab);
          localStorage.setItem('sentra_active_tab', event.state.tab);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNavigateView = (view: 'public' | 'login' | 'portal', tab?: 'victim' | 'staff', replace = false) => {
    if (tab) setLoginTab(tab);
    setCurrentView(view);
    localStorage.setItem('sentra_current_view', view);
    
    const url = `?view=${view}&tab=${activeTab}`;
    if (replace) {
      window.history.replaceState({ view, tab: activeTab }, '', url);
    } else {
      window.history.pushState({ view, tab: activeTab }, '', url);
    }
  };

  const handleSetActiveTab = (tab: string, replace = false) => {
    setActiveTab(tab);
    localStorage.setItem('sentra_active_tab', tab);
    
    const url = `?view=${currentView}&tab=${tab}`;
    if (replace) {
      window.history.replaceState({ view: currentView, tab }, '', url);
    } else {
      window.history.pushState({ view: currentView, tab }, '', url);
    }
  };

  const renderContent = () => {
    // 1. Separate Login Screen
    if (currentView === 'login') {
      return (
        <LoginPortal
          initialTab={loginTab}
          onLoginSuccess={(loggedInRole: UserRole) => {
            handleNavigateView('portal');
            handleSetActiveTab('dashboard');
          }}
          onBackToPublic={() => handleNavigateView('public')}
          onOpenLegalModal={(page) => setLegalModalPage(page)}
        />
      );
    }

    // 2. Public Landing Screen
    if (currentView === 'public' || !isAuthenticated) {
      return (
        <PublicLanding
          onStartLogin={(tab = 'victim') => {
            handleNavigateView('login', tab);
          }}
          onOpenLegalModal={(page) => setLegalModalPage(page)}
        />
      );
    }

    // 3. Authenticated Portals (Victim, Counsellor, District Officer, Legal Officer, State Admin, System Admin)
    if (role === 'victim') {
      switch (activeTab) {
        case 'checkin':
          return (
            <VictimCheckIn
              onCheckInCompleted={handleCheckInCompleted}
              onNavigateTab={(tab) => handleSetActiveTab(tab)}
            />
          );
        case 'chatai':
          return <VictimChatAI onNavigateTab={(tab) => handleSetActiveTab(tab)} />;
        case 'games':
          return <VictimCalmingGames onNavigateTab={(tab) => handleSetActiveTab(tab)} />;
        case 'case':
          return <VictimCase />;
        case 'support':
          return <VictimSupport />;
        case 'appointments':
          return <VictimAppointments />;
        case 'notifications':
          return <VictimNotifications />;
        case 'profile':
          return (
            <VictimProfileConsent
              onOpenLegalModal={(page) => setLegalModalPage(page)}
            />
          );
        case 'dashboard':
        default:
          return (
            <VictimDashboard
              onNavigateTab={(tab) => handleSetActiveTab(tab)}
              onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
            />
          );
      }
    }

    if (role === 'counsellor') {
      return <CounsellorPortal activeTab={activeTab} setActiveTab={handleSetActiveTab} />;
    }

    if (role === 'district_officer') {
      return <DistrictOfficerPortal />;
    }

    if (role === 'legal_officer') {
      return <LegalOfficerPortal />;
    }

    if (role === 'state_admin') {
      return <StateNationalPortal />;
    }

    if (role === 'system_admin') {
      return <SystemAdminPortal />;
    }

    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-teal-700 selection:text-white">
      {/* Top Navigation Bar with Role Switcher & Accessibility */}
      <Header
        currentView={currentView}
        onNavigateView={handleNavigateView}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
      />

      {/* Main Layout Area */}
      {currentView === 'portal' ? (
        <div className="flex flex-1 w-full max-w-[1600px] mx-auto">
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={handleSetActiveTab} 
            onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)} 
          />
          <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 w-full max-w-7xl mx-auto overflow-x-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentView}-${role}-${activeTab}`}
                initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="h-full"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentView}-${role}-${activeTab}`}
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      )}

      {/* Footer with Legal, Trust, AI Transparency and Accessibility Links */}
      {currentView !== 'portal' && (
        <Footer
          onOpenLegalModal={(page) => setLegalModalPage(page)}
          onNavigateView={handleNavigateView}
        />
      )}

      {/* Immediate Danger / Emergency Support Modal */}
      <EmergencyHelpModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      {/* Statutory Legal & Transparency Modals */}
      <LegalModal
        isOpen={legalModalPage !== null}
        page={legalModalPage}
        onClose={() => setLegalModalPage(null)}
      />

      {/* Local Storage & Cookie Notice */}
      <CookieBanner />

      {/* Floating Aura Widget */}
      <AuraWidget />
    </div>
  );
};

export default function App() {
  return (
    <SentraProvider>
      <SentraAppContent />
    </SentraProvider>
  );
}
