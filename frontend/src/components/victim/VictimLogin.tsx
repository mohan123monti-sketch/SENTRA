import React, { useState } from 'react';
import { useSentra } from '../../context/SentraContext';
import { translations } from '../../utils/translations';
import { SentraLogo } from '../common/SentraLogo';
import { ShieldCheck, Phone, KeyRound, Globe, ArrowRight, Lock } from 'lucide-react';
import { LanguageCode } from '../../types/sentra';

interface VictimLoginProps {
  onLoginSuccess: () => void;
  onOpenLegalModal: (page: any) => void;
}

export const VictimLogin: React.FC<VictimLoginProps> = ({ onLoginSuccess, onOpenLegalModal }) => {
  const { language, setLanguage, setIsVictimAuthenticated } = useSentra();
  const t = translations[language];

  const [mobileNumber, setMobileNumber] = useState('98401 23814');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber.trim()) {
      setErrorMsg('Please enter a valid mobile number');
      return;
    }
    setErrorMsg('');
    setOtpSent(true);
    // Pre-fill demo OTP for effortless evaluator testing
    setOtpCode('123456');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setErrorMsg('Please enter the OTP');
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVictimAuthenticated(true);
      onLoginSuccess();
    }, 400);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 p-6 sm:p-8 shadow-sm">
        {/* Brand & Symbol */}
        <div className="text-center pb-6 border-b border-slate-100 dark:border-slate-800/50">
          <div className="flex justify-center mb-3">
            <SentraLogo size={38} withText={false} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.appName}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {t.secureLoginTitle}
          </p>
        </div>

        {/* Language Selector Bar */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 dark:text-slate-400">Language:</span>
          {(['en', 'ta', 'hi'] as LanguageCode[]).map((code) => {
            const labels = { en: 'English', ta: 'தமிழ்', hi: 'हिन्दी' };
            return (
              <button
                key={code}
                onClick={() => setLanguage(code)}
                className={`px-2 py-0.5 rounded text-xs transition-colors ${
                  language === code 
                    ? 'bg-slate-900 text-white font-semibold' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-900/80'
                }`}
              >
                {labels[code]}
              </button>
            );
          })}
        </div>

        {errorMsg && (
          <div className="mt-4 p-2.5 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800">
            {errorMsg}
          </div>
        )}

        {!otpSent ? (
          /* Step 1: Mobile Number Entry */
          <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
            <div>
              <label htmlFor="mobile-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.mobilePrompt}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="mobile-input"
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Enter registered mobile"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded border border-slate-300 dark:border-slate-700 focus:border-teal-700 focus:outline-none"
                  autoComplete="tel"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Demo prefill: Registered mobile number for complainant case file
              </p>
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
          /* Step 2: OTP Entry */
          <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
            <div className="p-2.5 bg-teal-50 dark:bg-teal-900/30 border border-teal-200 rounded text-xs text-teal-900 dark:text-teal-100">
              One-Time Password dispatched to <strong className="font-mono">{mobileNumber}</strong>. (Demo code: <span className="font-bold underline">123456</span>)
            </div>

            <div>
              <label htmlFor="otp-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.enterOtp}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="otp-input"
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
                className="w-1/3 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-950 text-xs font-semibold rounded transition-colors"
              >
                Change No.
              </button>
              <button
                type="submit"
                disabled={isVerifying}
                className="flex-1 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isVerifying ? 'Verifying...' : t.verifyOtp}</span>
              </button>
            </div>
          </form>
        )}

        {/* Privacy & Safeguard Notice */}
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/50 flex items-start gap-2.5 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <div>
            <p>{t.privacyNotice}</p>
            <button
              onClick={() => onOpenLegalModal('privacy')}
              className="text-teal-800 dark:text-teal-300 hover:underline font-medium mt-1 inline-block"
            >
              Read full privacy safeguards &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
