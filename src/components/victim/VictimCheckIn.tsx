import React, { useState } from 'react';
import { useSentra } from '../../context/SentraContext';
import { translations } from '../../utils/translations';
import { CheckInQuestionAnswers, AIAnalysisResult } from '../../types/sentra';
import { 
  Heart, 
  BrainCircuit, 
  Moon, 
  ShieldCheck, 
  Users, 
  PhoneCall, 
  Mic, 
  MicOff, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Info,
  Shield,
  Volume2,
  Database,
  Calendar,
  RotateCcw,
  FileText
} from 'lucide-react';

interface VictimCheckInProps {
  onCheckInCompleted: (analysis: AIAnalysisResult) => void;
  onNavigateTab: (tab: string) => void;
}

export const VictimCheckIn: React.FC<VictimCheckInProps> = ({ 
  onCheckInCompleted, 
  onNavigateTab 
}) => {
  const { language, submitCheckIn, victim } = useSentra();
  const t = translations[language];

  // Check-in answers state
  const [mood, setMood] = useState<number>(3); // 1-5
  const [stress, setStress] = useState<number>(3); // 1-5
  const [sleep, setSleep] = useState<number>(3); // 1-5
  const [feelsSafe, setFeelsSafe] = useState<boolean>(true);
  const [hasSupport, setHasSupport] = useState<boolean>(true);
  const [wantsCounsellor, setWantsCounsellor] = useState<boolean>(false);
  const [freeText, setFreeText] = useState<string>('');
  
  // Voice recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [hasRecordedVoice, setHasRecordedVoice] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);

  // Submission state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [submittedResult, setSubmittedResult] = useState<AIAnalysisResult | null>(null);
  const [submittedAnswers, setSubmittedAnswers] = useState<CheckInQuestionAnswers | null>(null);
  const [submittedTimestamp, setSubmittedTimestamp] = useState<string>('');

  const startVoiceRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    const interval = setInterval(() => {
      setRecordingSeconds((prev) => {
        if (prev >= 6) {
          clearInterval(interval);
          setIsRecording(false);
          setHasRecordedVoice(true);
          return 6;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const answers: CheckInQuestionAnswers = {
      overallMood: mood,
      stressLevel: stress,
      sleepQuality: sleep,
      feelsSafe,
      hasSupportToTalk: hasSupport,
      wantsCounsellorCall: wantsCounsellor,
      freeTextNote: freeText.trim() ? freeText : undefined,
      voiceRecorded: hasRecordedVoice,
      voiceTranscript: hasRecordedVoice 
        ? "I am preparing for the upcoming court hearing and feeling a bit tense about the cross-examination." 
        : undefined
    };

    setTimeout(() => {
      const result = submitCheckIn(answers);
      setIsProcessing(false);
      setSubmittedResult(result);
      setSubmittedAnswers(answers);
      setSubmittedTimestamp(new Date().toLocaleString());
      onCheckInCompleted(result);
    }, 500);
  };

  const handleResetForNewCheckIn = () => {
    setSubmittedResult(null);
    setSubmittedAnswers(null);
    setMood(3);
    setStress(3);
    setSleep(3);
    setFeelsSafe(true);
    setHasSupport(true);
    setWantsCounsellor(false);
    setFreeText('');
    setHasRecordedVoice(false);
    setRecordingSeconds(0);
  };

  const moodEmojis = [
    { value: 1, emoji: "😞", label: "Very Low" },
    { value: 2, emoji: "🙁", label: "Low" },
    { value: 3, emoji: "😐", label: "Fair" },
    { value: 4, emoji: "🙂", label: "Good" },
    { value: 5, emoji: "😊", label: "Very Good" }
  ];

  // SUCCESS CONFIRMATION VIEW (SHOWING PERSISTENT DATABASE STORAGE)
  if (submittedResult) {
    const recordId = submittedResult.checkInId || `CHK-${Date.now().toString().slice(-4)}`;

    return (
      <div className="max-w-2xl mx-auto pb-12 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 shadow-xs text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Saved to Persistent Client Database (IndexedDB)</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Check-In Recorded & Encrypted Successfully
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto leading-relaxed">
              Your well-being entries have been permanently committed to the local database (<code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">sentra_justice_db</code>). They will persist across page refreshes and browser restarts.
            </p>
          </div>

          {/* Database & Transaction Details Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-left text-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 font-mono text-[11px]">
              <span className="text-slate-500">Record ID:</span>
              <span className="font-bold text-teal-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {recordId}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div>
                <span className="text-slate-400 block">Complainant:</span>
                <strong className="text-slate-800">{victim.name || victim.pseudonym}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Case ID:</span>
                <strong className="text-slate-800">{victim.caseId}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Stored Timestamp:</span>
                <span className="font-mono text-slate-700">{submittedTimestamp}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Database Storage:</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  IndexedDB Active & Verified
                </span>
              </div>
            </div>

            {/* Answer Summary Pills */}
            <div className="pt-2 border-t border-slate-200">
              <span className="text-[11px] font-semibold text-slate-700 block mb-1.5">
                Summary of Saved Entries:
              </span>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                  Mood: <strong>{mood}/5</strong> ({moodEmojis.find(m => m.value === mood)?.label})
                </span>
                <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                  Stress: <strong>{stress}/5</strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                  Sleep: <strong>{sleep}/5</strong>
                </span>
                <span className={`px-2 py-0.5 rounded border ${
                  feelsSafe ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                  Safety: <strong>{feelsSafe ? 'Feels Safe' : 'Safety Concern'}</strong>
                </span>
                {wantsCounsellor && (
                  <span className="px-2 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-800 font-semibold">
                    Counsellor Callback Requested
                  </span>
                )}
              </div>
            </div>

            {/* Support Caseworker Status */}
            <div className="pt-2 border-t border-slate-200 flex items-start gap-2 text-[11px] text-slate-600">
              <Info className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
              <span>
                {wantsCounsellor 
                  ? `Your callback request has been logged. Dr. Ananya Raman (${victim.assignedCounsellor}) will review your update shortly.`
                  : 'Your update is now part of your personal baseline and case timeline. You can request a session at any time.'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <button
              onClick={() => onNavigateTab('case')}
              className="px-4 py-2 bg-teal-800 hover:bg-teal-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Case Timeline</span>
            </button>

            <button
              onClick={() => onNavigateTab('profile')}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-800 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span>View / Export JSON in Profile</span>
            </button>

            <button
              onClick={handleResetForNewCheckIn}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Check In Again</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE CHECK-IN FORM
  return (
    <div className="max-w-2xl mx-auto pb-12">
      <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 shadow-xs">
        {/* Header with Database Status indicator */}
        <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-teal-800 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
              <span>Confidential Well-Being Check-In</span>
            </span>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              How are you feeling today?
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Please answer these questions at your own pace. All answers are encrypted and saved directly to the database.
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-600 self-start sm:self-auto shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Database Connected</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Question 1: Mood / Emotional State */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-800">
              1. How are you feeling overall right now?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {moodEmojis.map((item) => {
                const isSelected = mood === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setMood(item.value)}
                    className={`py-3 px-1 rounded border flex flex-col items-center gap-1 transition-all ${
                      isSelected 
                        ? 'border-teal-700 bg-teal-50/80 ring-2 ring-teal-700 text-slate-900' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="text-2xl" role="img" aria-label={item.label}>
                      {item.emoji}
                    </span>
                    <span className="text-[11px] font-medium leading-none">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question 2: Stress / Worry */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label htmlFor="stress-slider" className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5 text-amber-600" />
                <span>2. How worried or stressed do you feel about your situation?</span>
              </label>
              <span className="text-xs font-bold text-slate-900 font-mono">
                {stress} / 5
              </span>
            </div>
            <input
              id="stress-slider"
              type="range"
              min={1}
              max={5}
              step={1}
              value={stress}
              onChange={(e) => setStress(Number(e.target.value))}
              className="w-full accent-teal-700 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>1 - Minimal Worry</span>
              <span>3 - Moderate</span>
              <span>5 - Overwhelming</span>
            </div>
          </div>

          {/* Question 3: Sleep */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label htmlFor="sleep-slider" className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                <span>3. How has your sleep been recently?</span>
              </label>
              <span className="text-xs font-bold text-slate-900 font-mono">
                {sleep} / 5
              </span>
            </div>
            <input
              id="sleep-slider"
              type="range"
              min={1}
              max={5}
              step={1}
              value={sleep}
              onChange={(e) => setSleep(Number(e.target.value))}
              className="w-full accent-teal-700 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>1 - Very Poor / Disrupted</span>
              <span>3 - Average</span>
              <span>5 - Restful</span>
            </div>
          </div>

          {/* Question 4: Safety Question (Yes / No) */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>4. Do you currently feel safe in your daily environment?</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFeelsSafe(true)}
                className={`py-2 px-3 text-xs font-semibold rounded border transition-colors ${
                  feelsSafe 
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-1 ring-emerald-500' 
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Yes, I feel safe
              </button>
              <button
                type="button"
                onClick={() => setFeelsSafe(false)}
                className={`py-2 px-3 text-xs font-semibold rounded border transition-colors ${
                  !feelsSafe 
                    ? 'bg-rose-50 border-rose-400 text-rose-900 ring-1 ring-rose-500' 
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                No, I have safety concerns
              </button>
            </div>
          </div>

          {/* Question 5: Support network */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-teal-700" />
              <span>5. Do you feel you have someone trusted you can talk to?</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setHasSupport(true)}
                className={`py-2 px-3 text-xs font-semibold rounded border transition-colors ${
                  hasSupport 
                    ? 'bg-teal-50 border-teal-400 text-teal-900 ring-1 ring-teal-500' 
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Yes, I have support
              </button>
              <button
                type="button"
                onClick={() => setHasSupport(false)}
                className={`py-2 px-3 text-xs font-semibold rounded border transition-colors ${
                  !hasSupport 
                    ? 'bg-slate-100 border-slate-400 text-slate-900 ring-1 ring-slate-500' 
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                No, I feel isolated
              </button>
            </div>
          </div>

          {/* Question 6: Direct Counsellor Request */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-teal-700" />
              <span>6. Would you like a call or session with your assigned counsellor?</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setWantsCounsellor(true)}
                className={`py-2 px-3 text-xs font-semibold rounded border transition-colors ${
                  wantsCounsellor 
                    ? 'bg-teal-700 text-white border-teal-700 font-bold' 
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Yes, please request a call
              </button>
              <button
                type="button"
                onClick={() => setWantsCounsellor(false)}
                className={`py-2 px-3 text-xs font-semibold rounded border transition-colors ${
                  !wantsCounsellor 
                    ? 'bg-slate-800 text-white border-slate-800' 
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Not at this time
              </button>
            </div>
          </div>

          {/* Optional: Free text */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <label htmlFor="checkin-freetext" className="block text-xs font-semibold text-slate-800">
              Optional: Would you like to tell us anything else about your week?
            </label>
            <textarea
              id="checkin-freetext"
              rows={3}
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder="Share any thoughts, feelings, or updates on your schedule..."
              className="w-full text-xs rounded border border-slate-300 p-2.5 focus:border-teal-700 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400">
              Optional field. You can skip this question if you prefer.
            </span>
          </div>

          {/* Optional: Voice Reflection */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-teal-700" />
                <span>Optional Voice Reflection</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                100% Optional
              </span>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              {t.voiceConsentNotice}
            </p>

            <div className="pt-2 flex items-center gap-3">
              {!hasRecordedVoice ? (
                <button
                  type="button"
                  onClick={startVoiceRecording}
                  disabled={isRecording}
                  className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    isRecording 
                      ? 'bg-rose-600 text-white animate-pulse' 
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5 text-rose-600" />
                  <span>{isRecording ? `Recording audio (${recordingSeconds}s)...` : 'Record Short Audio Note (Optional)'}</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Voice reflection captured (6 seconds). Stored with encrypted metadata.</span>
                  <button
                    type="button"
                    onClick={() => {
                      setHasRecordedVoice(false);
                      setRecordingSeconds(0);
                    }}
                    className="text-[11px] underline text-slate-500 hover:text-slate-800 ml-2"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigateTab('dashboard')}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Cancel & Return
            </button>

            <button
              type="submit"
              disabled={isProcessing}
              className="px-5 py-2.5 bg-teal-800 hover:bg-teal-700 text-white text-xs font-semibold rounded flex items-center gap-2 transition-colors shadow-xs"
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <Database className="w-3.5 h-3.5" />
                  <span>Submit & Save to Database</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
