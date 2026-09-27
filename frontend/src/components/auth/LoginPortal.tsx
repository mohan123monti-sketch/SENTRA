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
  const [mobileNumber, setMobileNumber] = useState('');
  const [victimName, setVictimName] = useState('');
  const [caseType, setCaseType] = useState('General Support');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('123456');
  const [victimVerifying, setVictimVerifying] = useState(false);
  const [victimError, setVictimError] = useState('');

  // Staff Login State
  const [selectedStaffRole, setSelectedStaffRole] = useState<UserRole>('counsellor');
  const [staffName, setStaffName] = useState('');
  const [staffId, setStaffId] = useState('');
  const [staffDesignation, setStaffDesignation] = useState('');
  const [staffPin, setStaffPin] = useState('');
  const [staffVerifying, setStaffVerifying] = useState(false);
  const [staffError, setStaffError] = useState('');

  const handleRoleChange = (roleKey: string) => {
    setSelectedStaffRole(roleKey as UserRole);
  };

  // Victim OTP Handlers
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber.trim() || !victimName.trim()) {
      setVictimError('Please enter a valid name and mobile number');
      return;
    }
    setVictimError('');
    setOtpSent(true);
    setOtpCode('');
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
      const useMockId = victimName.toLowerCase().includes('priya') || victimName.toLowerCase().includes('mock');
      loginAsVictim({
        id: useMockId ? "V-9042" : undefined,
        caseId: useMockId ? "CASE-2026-0819" : undefined,
        name: victimName,
        mobileNumber: mobileNumber,
        caseType: caseType
      });
      onLoginSuccess('victim');
    }, 400);
  };

  // Staff Credentials Handler
  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim() || !staffId.trim()) {
      setStaffError('Please enter staff name and ID');
      return;
    }
    setStaffVerifying(true);
    setTimeout(() => {
      setStaffVerifying(false);
      loginAsStaff(selectedStaffRole, staffName, staffId, staffDesignation || 'Authorized Official');
      onLoginSuccess(selectedStaffRole);
    }, 400);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-8 px-4 sm:px-6">
      {/* Back to Public Site Header Link */}
      <div className="max-w-xl w-full mb-4 flex items-center justify-between">
        <button
          onClick={onBackToPublic}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Platform Overview</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
          <span>TLS 1.3 End-to-End Encrypted</span>
        </div>
      </div>

      {/* Main Authentication Box */}
      <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-sm overflow-hidden">
        {/* Top Official Seal & Header */}
        <div className="p-6 sm:p-7 border-b border-slate-100 dark:border-slate-800/50 bg-slate-900 text-white text-center">
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
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700/80 text-xs font-semibold">
          <button
            onClick={() => setAuthMode('victim')}
            className={`py-2.5 px-3 rounded flex items-center justify-center gap-2 transition-all ${
              authMode === 'victim' 
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${authMode === 'victim' ? 'text-teal-700' : 'text-slate-400'}`} />
            <span>Victim / Complainant Portal</span>
          </button>

          <button
            onClick={() => setAuthMode('staff')}
            className={`py-2.5 px-3 rounded flex items-center justify-center gap-2 transition-all ${
              authMode === 'staff' 
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white'
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
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Complainant & Witness Login
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
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
                  <label htmlFor="victim-name" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Complainant Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <input
                      id="victim-name"
                      type="text"
                      value={victimName}
                      onChange={(e) => setVictimName(e.target.value)}
                      placeholder="Enter full name"
                      className="w-full pl-9 pr-3 py-2.5 text-sm rounded border border-slate-300 dark:border-slate-700 focus:border-teal-700 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="victim-mobile" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
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
                      className="w-full pl-9 pr-3 py-2.5 text-sm rounded border border-slate-300 dark:border-slate-700 focus:border-teal-700 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="case-type" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Case Category
                  </label>
                  <select
                    id="case-type"
                    value={caseType}
                    onChange={(e) => setCaseType(e.target.value)}
                    className="w-full pl-3 pr-3 py-2.5 text-sm rounded border border-slate-300 dark:border-slate-700 focus:border-teal-700 focus:outline-none bg-white dark:bg-slate-900"
                  >
                    <option value="General Support">General Support</option>
                    <option value="Special Offence & Intimidation">Special Offence & Intimidation</option>
                    <option value="Domestic Harassment">Domestic Harassment</option>
                    <option value="Aggravated Assault">Aggravated Assault</option>
                  </select>
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
                <div className="p-3 bg-teal-50 dark:bg-teal-900/30 border border-teal-200 rounded text-xs text-teal-950">
                  A 6-digit one-time verification password was dispatched to <strong className="font-mono">{mobileNumber}</strong>. (Any pin works for registration in demo)
                </div>

                <div>
                  <label htmlFor="victim-otp" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
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
                      className="w-full pl-9 pr-3 py-2 text-base font-mono tracking-widest rounded border border-slate-300 dark:border-slate-700 focus:border-teal-700 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="w-1/3 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-950 text-xs font-semibold rounded transition-colors"
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
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/50 flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <span>{t.privacyNotice}</span>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal('privacy')}
                  className="text-teal-800 dark:text-teal-300 font-semibold hover:underline block mt-0.5"
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
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Official Staff & Judicial Caseworker Access
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Single sign-on gateway for licensed clinical counsellors, protection officers, and administrative officials.
              </p>
            </div>

            {staffError && (
              <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {staffError}
              </div>
            )}

            <form onSubmit={handleStaffLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Role & Service Division:
                </label>
                <select
                  value={selectedStaffRole}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full text-xs rounded border border-slate-300 dark:border-slate-700 p-2.5 focus:border-teal-700 focus:outline-none cursor-pointer bg-slate-50 dark:bg-slate-950 font-medium"
                >
                  <option value="counsellor">1. Clinical Counsellor</option>
                  <option value="district_officer">2. District Case Officer</option>
                  <option value="legal_officer">3. Legal Protection Officer</option>
                  <option value="state_admin">4. State / National Administrator</option>
                  <option value="system_admin">5. System Administrator</option>
                </select>
              </div>

              <div>
                <label htmlFor="staff-name" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name:
                </label>
                <input
                  id="staff-name"
                  type="text"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className="w-full text-xs rounded border border-slate-300 dark:border-slate-700 p-2 focus:border-teal-700 focus:outline-none"
                  placeholder="e.g. Dr. Ananya Raman"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="staff-id" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Officer / Badge ID:
                  </label>
                  <input
                    id="staff-id"
                    type="text"
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    className="w-full text-xs rounded border border-slate-300 dark:border-slate-700 p-2 focus:border-teal-700 focus:outline-none font-mono"
                    placeholder="e.g. DLSA-TN-408"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="staff-designation" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Designation:
                  </label>
                  <input
                    id="staff-designation"
                    type="text"
                    value={staffDesignation}
                    onChange={(e) => setStaffDesignation(e.target.value)}
                    className="w-full text-xs rounded border border-slate-300 dark:border-slate-700 p-2 focus:border-teal-700 focus:outline-none"
                    placeholder="e.g. Senior Clinical Counsellor"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="staff-pin" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Security Token / 2FA PIN (Demo):
                </label>
                <input
                  id="staff-pin"
                  type="password"
                  value={staffPin}
                  onChange={(e) => setStaffPin(e.target.value)}
                  className="w-full text-xs rounded border border-slate-300 dark:border-slate-700 p-2 focus:border-teal-700 focus:outline-none font-mono"
                  placeholder="Any pin will work"
                  required
                />
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
            <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-500 dark:text-slate-400 leading-snug flex items-start gap-1.5">
              <BadgeAlert className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0 mt-0.5" />
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
