import React, { useState } from 'react';
import { useSentra } from '../../context/SentraContext';
import { translations } from '../../utils/translations';
import { SentraLogo } from '../common/SentraLogo';
import { 
  ShieldCheck, 
  Phone, 
  KeyRound, 
  Globe, 
  ArrowRight, 
  Lock, 
  UserCheck, 
  Scale, 
  Building2, 
  CheckCircle2, 
  ArrowLeft,
  AlertTriangle,
  BadgeAlert
} from 'lucide-react';
import { LanguageCode, UserRole } from '../../types/sentra';

interface LoginPortalProps {
  initialTab?: 'victim' | 'staff';
  onLoginSuccess: (role: UserRole) => void;
  onBackToPublic: () => void;
  onOpenLegalModal: (page: any) => void;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({
  initialTab = 'victim',
  onLoginSuccess,
  onBackToPublic,
  onOpenLegalModal
}) => {
  const { 
    language, 
    setLanguage, 
    loginAsVictim, 
    loginAsStaff,
    victim 
  } = useSentra();
  
  const t = translations[language];

  const [authMode, setAuthMode] = useState<'victim' | 'staff'>(initialTab);

  // Victim Login State
  const [mobileNumber, setMobileNumber] = useState('98401 23814');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('123456');
  const [victimVerifying, setVictimVerifying] = useState(false);
  const [victimError, setVictimError] = useState('');

  // Staff Login State
  const [selectedStaffRole, setSelectedStaffRole] = useState<UserRole>('counsellor');
  const [staffId, setStaffId] = useState('DLSA-TN-408');
  const [staffPin, setStaffPin] = useState('••••••••');
  const [staffVerifying, setStaffVerifying] = useState(false);
  const [staffError, setStaffError] = useState('');

  const staffProfiles: Record<string, { role: UserRole; name: string; id: string; title: string }> = {
    counsellor: {
      role: 'counsellor',
      name: "Dr. Ananya Raman",
      id: "DLSA-TN-408",
      title: "Senior Clinical Counsellor (Mental Health Support Unit)"
    },
    district_officer: {
      role: 'district_officer',
      name: "Inspector M. Kumar",
      id: "TN-POL-CH-882",
      title: "District Support & Case Officer (Chennai South)"
    },
    legal_officer: {
      role: 'legal_officer',
      name: "Adv. Rajeshwari Sen",
      id: "DLSA-LEG-091",
      title: "Legal & Protection Officer (Sessions Court Liaison)"
    },
    state_admin: {
      role: 'state_admin',
      name: "Dr. S. Meenakshi, IAS",
      id: "TN-DIR-SD-004",
      title: "State Director (Department of Social Defence)"
    },
    system_admin: {
      role: 'system_admin',
      name: "Security Officer A. Verma",
      id: "SENTRA-SYS-01",
      title: "System Administrator (Cyber Security & Audit)"
    }
  };

  const handleRoleChange = (roleKey: string) => {
    const profile = staffProfiles[roleKey];
    if (profile) {
      setSelectedStaffRole(profile.role);
      setStaffId(profile.id);
    }
  };

  // Victim OTP Handlers
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber.trim()) {
      setVictimError('Please enter a valid mobile number');
      return;
    }
    setVictimError('');
    setOtpSent(true);
    setOtpCode('123456');
  };

  const handleVerifyVictimOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setVictimError('Please enter the verification code');
      return;
    }
    setVictimVerifying(true);
    setTimeout(() => {
      setVictimVerifying(false);
      loginAsVictim();
      onLoginSuccess('victim');
    }, 400);
  };

  // Staff Credentials Handler
  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStaffVerifying(true);
    setTimeout(() => {
      setStaffVerifying(false);
      const profile = staffProfiles[selectedStaffRole];
      loginAsStaff(selectedStaffRole, profile?.name, profile?.id, profile?.title);
      onLoginSuccess(selectedStaffRole);
    }, 400);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-8 px-4 sm:px-6">
      {/* Back to Public Site Header Link */}
      <div className="max-w-xl w-full mb-4 flex items-center justify-between">
        <button
          onClick={onBackToPublic}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Platform Overview</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
          <span>TLS 1.3 End-to-End Encrypted</span>
        </div>
      </div>

      {/* Main Authentication Box */}
      <div className="max-w-xl w-full bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {/* Top Official Seal & Header */}
        <div className="p-6 sm:p-7 border-b border-slate-100 bg-slate-900 text-white text-center">
          <div className="flex justify-center mb-3">
            <SentraLogo size={36} light={true} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Secure Authentication Gateway
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto leading-relaxed">
            Sentiment and Emotional Tracking Risk & Analysis. Role-isolated access for registered complainants and designated public officials.
          </p>
        </div>

        {/* Dedicated Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setAuthMode('victim')}
            className={`py-2.5 px-3 rounded flex items-center justify-center gap-2 transition-all ${
              authMode === 'victim' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${authMode === 'victim' ? 'text-teal-700' : 'text-slate-400'}`} />
            <span>Victim / Complainant Portal</span>
          </button>

          <button
            onClick={() => setAuthMode('staff')}
            className={`py-2.5 px-3 rounded flex items-center justify-center gap-2 transition-all ${
              authMode === 'staff' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className={`w-4 h-4 ${authMode === 'staff' ? 'text-teal-700' : 'text-slate-400'}`} />
            <span>Authorized Official / Caseworker</span>
          </button>
        </div>

        {/* TAB 1: VICTIM / COMPLAINANT LOGIN (OTP-BASED) */}
        {authMode === 'victim' && (
          <div className="p-6 sm:p-7 space-y-5 animate-in fade-in duration-150">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900">
                  Complainant & Witness Login
                </h2>
                {/* Multilingual Selector */}
                <div className="flex items-center gap-1.5 text-xs">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  {(['en', 'ta', 'hi'] as LanguageCode[]).map((code) => {
                    const labels = { en: 'EN', ta: 'தமிழ்', hi: 'हिन्दी' };
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setLanguage(code)}
                        className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition-colors ${
                          language === code 
                            ? 'bg-slate-900 text-white font-bold' 
                            : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {labels[code]}
                      </button>
                    );
                  })}
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Log in using your mobile number registered with your case file. No password required.
              </p>
            </div>

            {victimError && (
              <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {victimError}
              </div>
            )}

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
                <div>
                  <label htmlFor="victim-mobile" className="block font-semibold text-slate-700 mb-1.5">
                    {t.mobilePrompt}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      id="victim-mobile"
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="Enter registered mobile number"
                      className="w-full pl-9 pr-3 py-2.5 text-sm rounded border border-slate-300 focus:border-teal-700 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Registered complainant: Priya S. (Case CASE-2026-0819)</span>
                    <span className="font-mono text-teal-700 font-semibold">Demo prefilled</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>{t.sendOtp}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyVictimOtp} className="space-y-4 text-xs">
                <div className="p-3 bg-teal-50 border border-teal-200 rounded text-xs text-teal-950">
                  A 6-digit one-time verification password was dispatched to <strong className="font-mono">{mobileNumber}</strong>. (Fictional demo passkey: <span className="font-bold underline">123456</span>)
                </div>

                <div>
                  <label htmlFor="victim-otp" className="block font-semibold text-slate-700 mb-1.5">
                    {t.enterOtp}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      id="victim-otp"
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full pl-9 pr-3 py-2 text-base font-mono tracking-widest rounded border border-slate-300 focus:border-teal-700 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="w-1/3 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded transition-colors"
                  >
                    Change No.
                  </button>
                  <button
                    type="submit"
                    disabled={victimVerifying}
                    className="flex-1 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{victimVerifying ? 'Verifying...' : t.verifyOtp}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Privacy Protection Notice */}
            <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <span>{t.privacyNotice}</span>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal('privacy')}
                  className="text-teal-800 font-semibold hover:underline block mt-0.5"
                >
                  View full privacy and statutory data rights &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AUTHORIZED OFFICIAL / CASEWORKER LOGIN */}
        {authMode === 'staff' && (
          <div className="p-6 sm:p-7 space-y-5 animate-in fade-in duration-150">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Official Staff & Judicial Caseworker Access
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Single sign-on gateway for licensed clinical counsellors, protection officers, and administrative officials.
              </p>
            </div>

            <form onSubmit={handleStaffLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Select Role & Service Division:
                </label>
                <select
                  value={selectedStaffRole}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full text-xs rounded border border-slate-300 p-2.5 focus:border-teal-700 focus:outline-none cursor-pointer bg-slate-50 font-medium"
                >
                  <option value="counsellor">1. Clinical Counsellor (Dr. Ananya Raman - DLSA Unit)</option>
                  <option value="district_officer">2. District Case Officer (Inspector M. Kumar - Chennai South)</option>
                  <option value="legal_officer">3. Legal Protection Officer (Adv. Rajeshwari Sen - DLSA)</option>
                  <option value="state_admin">4. State / National Administrator (Dr. S. Meenakshi, IAS)</option>
                  <option value="system_admin">5. System Administrator (Security Officer A. Verma)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="staff-id" className="block font-semibold text-slate-700 mb-1">
                    Officer / Badge ID:
                  </label>
                  <input
                    id="staff-id"
                    type="text"
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    className="w-full text-xs rounded border border-slate-300 p-2 focus:border-teal-700 focus:outline-none font-mono"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="staff-pin" className="block font-semibold text-slate-700 mb-1">
                    Security Token / 2FA PIN:
                  </label>
                  <input
                    id="staff-pin"
                    type="password"
                    value={staffPin}
                    onChange={(e) => setStaffPin(e.target.value)}
                    className="w-full text-xs rounded border border-slate-300 p-2 focus:border-teal-700 focus:outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={staffVerifying}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Lock className="w-3.5 h-3.5 text-teal-400" />
                <span>{staffVerifying ? 'Verifying 2FA Credentials...' : 'Authenticate & Open Official Console'}</span>
              </button>
            </form>

            {/* Official Warning Notice */}
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-500 leading-snug flex items-start gap-1.5">
              <BadgeAlert className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <span>
                Authorized government personnel access only. Every authentication attempt and record query is logged to the immutable security audit trail.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
