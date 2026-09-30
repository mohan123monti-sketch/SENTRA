import React, { useState, useEffect, useRef } from 'react';
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
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Info,
  Database,
  Calendar,
  RotateCcw,
  FileText,
  Volume2,
  Smile,
  Zap,
  Coffee,
  Loader2
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

  // Steps
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 7;

  // Check-in answers state
  const [mood, setMood] = useState<number>(3); // 1-5
  const [stress, setStress] = useState<number>(3); // 1-5
  const [sleep, setSleep] = useState<number>(3); // 1-5
  const [concentration, setConcentration] = useState<number>(3); // 1-5
  const [productivity, setProductivity] = useState<number>(3); // 1-5
  const [happiness, setHappiness] = useState<number>(3); // 1-5
  const [physicalWellbeing, setPhysicalWellbeing] = useState<number>(3); // 1-5
  const [eatingHabits, setEatingHabits] = useState<number>(3); // 1-5
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

  const [realTranscript, setRealTranscript] = useState<string>('');
  const [acousticFeatures, setAcousticFeatures] = useState<any>(null);
  const [isAnalyzingAudio, setIsAnalyzingAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = React.useRef<any>(null);

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setIsAnalyzingAudio(true);
        
        try {
          const formData = new FormData();
          formData.append('audio', audioBlob);
          
          const response = await fetch('http://127.0.0.1:5000/analyze_audio', {
            method: 'POST',
            body: formData
          });
          
          if (response.ok) {
            const data = await response.json();
            setAcousticFeatures(data.acousticFeatures);
            console.log("Audio ML Analysis:", data);
          }
        } catch (err) {
          console.warn("Failed to analyze audio", err);
        } finally {
          setIsAnalyzingAudio(false);
        }
        
        // Stop all tracks to release mic
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
    } catch (err) {
      console.error("Microphone access denied or error:", err);
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support real-time speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    let secondsInterval: ReturnType<typeof setInterval>;

    recognition.onstart = () => {
      setIsRecording(true);
      setRecordingSeconds(0);
      setRealTranscript('');
      secondsInterval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setRealTranscript(transcript);
      setHasRecordedVoice(true);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === 'network') {
        alert("Network error: Browser cannot reach the speech recognition cloud service. Falling back to simulated text.");
        setRealTranscript("[Simulated offline fallback] I am feeling very anxious and my voice is trembling slightly as I think about the cross-examination.");
        setHasRecordedVoice(true);
      } else {
        alert("Microphone error: " + event.error + ". Please check permissions.");
      }
      setIsRecording(false);
      clearInterval(secondsInterval);
    };

    recognition.onend = () => {
      setIsRecording(false);
      clearInterval(secondsInterval);
    };

    try {
      recognition.start();
    } catch (err) {
      console.error(err);
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e){}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if(e) e.preventDefault();
    setIsProcessing(true);

    const answers: CheckInQuestionAnswers = {
      overallMood: mood,
      stressLevel: stress,
      sleepQuality: sleep,
      concentrationScore: concentration,
      productivityScore: productivity,
      happinessScore: happiness,
      physicalWellbeing,
      eatingHabits,
      feelsSafe,
      hasSupportToTalk: hasSupport,
      wantsCounsellorCall: wantsCounsellor,
      freeTextNote: freeText.trim() ? freeText : undefined,
      acousticFeatures: acousticFeatures,
      voiceRecorded: hasRecordedVoice,
      voiceTranscript: hasRecordedVoice 
        ? (realTranscript || "Voice note captured without clear transcript.")
        : undefined
    };

    submitCheckIn(answers).then(result => {
      setIsProcessing(false);
      setSubmittedResult(result);
      setSubmittedAnswers(answers);
      setSubmittedTimestamp(new Date().toLocaleString());
      onCheckInCompleted(result);
    });
  };

  const handleResetForNewCheckIn = () => {
    setSubmittedResult(null);
    setSubmittedAnswers(null);
    setMood(3);
    setStress(3);
    setSleep(3);
    setConcentration(3);
    setProductivity(3);
    setHappiness(3);
    setPhysicalWellbeing(3);
    setEatingHabits(3);
    setFeelsSafe(true);
    setHasSupport(true);
    setWantsCounsellor(false);
    setFreeText('');
    setHasRecordedVoice(false);
    setRecordingSeconds(0);
    setRealTranscript('');
    setCurrentStep(0);
  };

  const moodEmojis = [
    { value: 1, emoji: "😞", label: "Very Low" },
    { value: 2, emoji: "🙁", label: "Low" },
    { value: 3, emoji: "😐", label: "Fair" },
    { value: 4, emoji: "🙂", label: "Good" },
    { value: 5, emoji: "😊", label: "Very Good" }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(curr => curr - 1);
  };

  // SUCCESS VIEW
  if (submittedResult) {
    const recordId = submittedResult.checkInId || `CHK-${Date.now().toString().slice(-4)}`;

    return (
      <div className="max-w-2xl mx-auto pb-12 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-8 shadow-md text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-3">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Saved to Encrypted Registry</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Check-In Recorded Successfully
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
              Your well-being entries have been permanently committed to your timeline. They will persist securely across sessions.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700/80 font-mono text-xs">
              <span className="text-slate-500">Record ID:</span>
              <span className="font-bold text-teal-900 dark:text-teal-100 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700/80">
                {recordId}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-400">
              <div>
                <span className="text-slate-400 block mb-0.5">Complainant:</span>
                <strong className="text-slate-800 dark:text-slate-200 text-sm">{victim.name || victim.pseudonym}</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Timestamp:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{submittedTimestamp}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-700/80">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Summary of Saved Entries:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 shadow-sm font-medium">
                  Mood: <strong>{mood}/5</strong>
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 shadow-sm font-medium">
                  Stress: <strong>{stress}/5</strong>
                </span>
                <span className={`px-2.5 py-1 rounded-md border shadow-sm font-bold ${
                  feelsSafe ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                  Safety: {feelsSafe ? 'Feels Safe' : 'Safety Concern'}
                </span>
                {wantsCounsellor && (
                  <span className="px-2.5 py-1 rounded-md bg-teal-50 border border-teal-200 text-teal-800 font-bold shadow-sm">
                    Counsellor Callback Requested
                  </span>
                )}
              </div>
            </div>

            {submittedResult.aiResponse && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700/80">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2 flex items-center gap-1.5">
                  ✨ AURA Analysis:
                </span>
                <p className="text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-lg leading-relaxed shadow-sm">
                  {submittedResult.aiResponse}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('case')}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4" />
              <span>View Case Timeline</span>
            </button>
            <button
              onClick={handleResetForNewCheckIn}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Check In Again</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Helper for sliders
  const renderSlider = (label: string, icon: any, value: number, onChange: (v: number) => void, labels: string[]) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg border border-teal-100 dark:border-teal-900/50">
        <label className="text-sm font-bold text-teal-900 dark:text-teal-100 flex items-center gap-2">
          {icon}
          {label}
        </label>
        <span className="text-sm font-bold text-teal-700 dark:text-teal-400 bg-white dark:bg-slate-900 px-3 py-1 rounded-md shadow-sm border border-teal-100">
          {value} / 5
        </span>
      </div>
      <div className="px-2">
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
        />
        <div className="flex justify-between text-xs font-medium text-slate-500 mt-3">
          <span>{labels[0]}</span>
          <span>{labels[1]}</span>
          <span>{labels[2]}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto pb-12">
      {/* HEADER & PROGRESS */}
      <div className="mb-6 space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-teal-700 font-bold bg-teal-50 px-3 py-1 rounded-full border border-teal-200 inline-flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          Confidential Well-Being Check-In
        </span>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Checking in with you.
        </h1>
        
        {/* Progress Bar */}
        <div className="flex items-center gap-3 pt-2">
          <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-teal-500 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${((currentStep) / (totalSteps - 1)) * 100}%` }}
            />
          </div>
          <span className="text-xs font-mono text-slate-400 font-medium w-12 text-right">
            {currentStep + 1} / {totalSteps}
          </span>
        </div>
      </div>

      {/* CARD CONTENT */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-md overflow-hidden">
        
        <div className="p-6 sm:p-8 min-h-[320px] flex flex-col justify-center">
          
          {/* STEP 0: MOOD */}
          {currentStep === 0 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
              <div className="text-center space-y-2 mb-8">
                <Heart className="w-8 h-8 text-rose-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">How are you feeling overall right now?</h2>
                <p className="text-sm text-slate-500">Take a deep breath and select the option that best matches your mood.</p>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {moodEmojis.map((item) => {
                  const isSelected = mood === item.value;
                  return (
                    <button
                      key={item.value}
                      onClick={() => {
                        setMood(item.value);
                        setTimeout(handleNext, 400); // Auto-advance
                      }}
                      className={`py-4 px-2 rounded-xl border-2 flex flex-col items-center gap-2 transition-all transform hover:scale-105 ${
                        isSelected 
                          ? 'border-teal-500 bg-teal-50 shadow-md ring-2 ring-teal-200' 
                          : 'border-slate-100 hover:border-teal-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-3xl" role="img" aria-label={item.label}>{item.emoji}</span>
                      <span className={`text-xs font-bold ${isSelected ? 'text-teal-800' : 'text-slate-600'}`}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 1: STRESS & SLEEP */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Rest & Anxiety</h2>
              {renderSlider(
                "How worried or stressed do you feel?",
                <BrainCircuit className="w-4 h-4 text-amber-600" />,
                stress,
                setStress,
                ["1 - Minimal", "3 - Moderate", "5 - Overwhelming"]
              )}
              <hr className="border-slate-100 dark:border-slate-800" />
              {renderSlider(
                "How has your sleep been recently?",
                <Moon className="w-4 h-4 text-indigo-600" />,
                sleep,
                setSleep,
                ["1 - Very Poor", "3 - Average", "5 - Restful"]
              )}
            </div>
          )}

          {/* STEP 2: CONCENTRATION & PRODUCTIVITY */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Focus & Daily Tasks</h2>
              {renderSlider(
                "How is your concentration and focus?",
                <Sparkles className="w-4 h-4 text-blue-600" />,
                concentration,
                setConcentration,
                ["1 - Can't Focus", "3 - Average", "5 - Highly Focused"]
              )}
              <hr className="border-slate-100 dark:border-slate-800" />
              {renderSlider(
                "How productive did you feel?",
                <Zap className="w-4 h-4 text-orange-600" />,
                productivity,
                setProductivity,
                ["1 - Unproductive", "3 - Moderate", "5 - Highly Productive"]
              )}
            </div>
          )}

          {/* STEP 3: HAPPINESS & PHYSICAL */}
          {currentStep === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Well-being & Health</h2>
              {renderSlider(
                "How happy did you feel overall?",
                <Smile className="w-4 h-4 text-rose-500" />,
                happiness,
                setHappiness,
                ["1 - Very Unhappy", "3 - Neutral", "5 - Very Happy"]
              )}
              <hr className="border-slate-100 dark:border-slate-800" />
              {renderSlider(
                "How is your physical health/energy?",
                <Heart className="w-4 h-4 text-emerald-600" />,
                physicalWellbeing,
                setPhysicalWellbeing,
                ["1 - Exhausted", "3 - Okay", "5 - Excellent"]
              )}
            </div>
          )}

          {/* STEP 4: EATING & SAFETY */}
          {currentStep === 4 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Habits & Environment</h2>
              {renderSlider(
                "How have your eating habits been?",
                <Coffee className="w-4 h-4 text-amber-700" />,
                eatingHabits,
                setEatingHabits,
                ["1 - Skipped Meals", "3 - Average", "5 - Healthy"]
              )}
              
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                <label className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Do you currently feel safe in your daily environment?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setFeelsSafe(true)} className={`py-3 px-4 rounded-xl font-bold border-2 transition-all ${feelsSafe ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm' : 'border-slate-200 text-slate-500 bg-white hover:border-slate-300'}`}>
                    Yes, I feel safe
                  </button>
                  <button onClick={() => setFeelsSafe(false)} className={`py-3 px-4 rounded-xl font-bold border-2 transition-all ${!feelsSafe ? 'bg-rose-50 border-rose-500 text-rose-900 shadow-sm' : 'border-slate-200 text-slate-500 bg-white hover:border-slate-300'}`}>
                    No, I have concerns
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: SUPPORT NETWORK */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Support & Connection</h2>
              
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-600" />
                  Do you feel you have someone trusted you can talk to?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setHasSupport(true)} className={`py-3 px-4 rounded-xl font-bold border-2 transition-all ${hasSupport ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-sm' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                    Yes, I have support
                  </button>
                  <button onClick={() => setHasSupport(false)} className={`py-3 px-4 rounded-xl font-bold border-2 transition-all ${!hasSupport ? 'bg-slate-100 border-slate-500 text-slate-900 shadow-sm' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                    No, I feel isolated
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-teal-600" />
                  Would you like a call or session with your counsellor?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setWantsCounsellor(true)} className={`py-3 px-4 rounded-xl font-bold border-2 transition-all ${wantsCounsellor ? 'bg-teal-700 border-teal-700 text-white shadow-md' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                    Yes, request a call
                  </button>
                  <button onClick={() => setWantsCounsellor(false)} className={`py-3 px-4 rounded-xl font-bold border-2 transition-all ${!wantsCounsellor ? 'bg-slate-800 border-slate-800 text-white shadow-md' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                    Not at this time
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: FREE TEXT & VOICE */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Anything else to share?</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Write a note (Optional)</label>
                <textarea
                  rows={4}
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  placeholder="Share any thoughts, feelings, or updates..."
                  className="w-full text-sm rounded-xl border border-slate-300 p-4 focus:border-teal-500 focus:ring-4 focus:ring-teal-50 outline-none transition-all resize-none shadow-sm"
                />
              </div>

              <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-teal-600" /> Optional Voice Reflection
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">{t.voiceConsentNotice}</p>
                
                {!hasRecordedVoice ? (
                  <button
                    onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                    className={`px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 w-full transition-all shadow-sm ${
                      isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <div className="w-3 h-3 bg-white rounded-sm"></div>
                        Stop Recording ({recordingSeconds}s)
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 text-rose-500" />
                        Record Audio Note
                      </>
                    )}
                  </button>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <div className="flex items-center justify-between text-emerald-800 mb-2">
                      <div className="flex items-center gap-2 text-sm font-bold">
                        {isAnalyzingAudio ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} {isAnalyzingAudio ? 'Analyzing pitch & stress...' : `Audio captured (${recordingSeconds}s)`}
                      </div>
                      <button onClick={() => { setHasRecordedVoice(false); setRealTranscript(''); }} className="text-xs underline">Remove</button>
                    </div>
                    {acousticFeatures && !isAnalyzingAudio && (
                      <div className="mt-3 p-3 bg-white/50 rounded-lg text-xs flex gap-3 flex-wrap">
                        <span className="font-semibold text-slate-700">Acoustic ML Flags:</span>
                        <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Pitch: {acousticFeatures.pitchVariability}</span>
                        <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">Energy: {acousticFeatures.energyLevel}</span>
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">Rate: {acousticFeatures.speechRate}</span>
                      </div>
                    )}
                    {realTranscript && (
                      <div className="p-3 bg-white/60 rounded-lg text-xs italic text-emerald-900 border border-emerald-100">
                        "{realTranscript}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* BOTTOM NAVIGATION BAR */}
        <div className="p-4 sm:px-8 sm:py-5 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
          <button
            onClick={currentStep === 0 ? () => onNavigateTab('dashboard') : handlePrev}
            className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {currentStep === 0 ? 'Cancel' : 'Back'}
          </button>
          
          <button
            onClick={handleNext}
            disabled={isProcessing}
            className="px-8 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-md transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : currentStep === totalSteps - 1 ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Submit Check-in
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

