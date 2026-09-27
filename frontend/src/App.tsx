import React, { useState } from 'react';
import { SentraProvider, useSentra } from './context/SentraContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { EmergencyHelpModal } from './components/common/EmergencyHelpModal';
import { LegalModal, LegalPageType } from './components/common/LegalModal';
import { CookieBanner } from './components/common/CookieBanner';
import { AuraWidget } from './components/common/AuraWidget';
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

  // Screen management: 'public' (landing page) | 'login' (separate login portal) | 'portal' (authenticated dashboard)
  const [currentView, setCurrentView] = useState<'public' | 'login' | 'portal'>('public');
  const [loginTab, setLoginTab] = useState<'victim' | 'staff'>('victim');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [legalModalPage, setLegalModalPage] = useState<LegalPageType | null>(null);

  // When check-in is completed by the victim, notify and allow seamless review
  const handleCheckInCompleted = (analysis: AIAnalysisResult) => {
    // The analysis and new risk level are already saved into global context!
  };

  const handleNavigateView = (view: 'public' | 'login' | 'portal', tab?: 'victim' | 'staff') => {
    if (tab) setLoginTab(tab);
    setCurrentView(view);
  };

  const renderContent = () => {
    // 1. Separate Login Screen
    if (currentView === 'login') {
      return (
        <LoginPortal
          initialTab={loginTab}
          onLoginSuccess={(loggedInRole: UserRole) => {
            setCurrentView('portal');
            setActiveTab('dashboard');
          }}
          onBackToPublic={() => setCurrentView('public')}
          onOpenLegalModal={(page) => setLegalModalPage(page)}
        />
      );
    }

    // 2. Public Landing Screen
    if (currentView === 'public' || !isAuthenticated) {
      return (
        <PublicLanding
          onStartLogin={(tab = 'victim') => {
            setLoginTab(tab);
            setCurrentView('login');
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
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          );
        case 'chatai':
          return <VictimChatAI onNavigateTab={(tab) => setActiveTab(tab)} />;
        case 'games':
          return <VictimCalmingGames onNavigateTab={(tab) => setActiveTab(tab)} />;
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
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
            />
          );
      }
    }

    if (role === 'counsellor') {
      return <CounsellorPortal activeTab={activeTab} setActiveTab={setActiveTab} />;
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
        setActiveTab={(tab) => setActiveTab(tab)}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentView}-${role}-${activeTab}`}
            initial={{ opacity: 0, scale: 0.95, rotateX: 15, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.05, rotateX: -15, y: -30, filter: 'blur(8px)' }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
            className="h-full origin-bottom"
            style={{ perspective: 1200 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer with Legal, Trust, AI Transparency and Accessibility Links */}
      <Footer
        onOpenLegalModal={(page) => setLegalModalPage(page)}
        onNavigateView={handleNavigateView}
      />

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
