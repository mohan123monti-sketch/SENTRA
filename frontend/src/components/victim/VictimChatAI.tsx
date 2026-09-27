import React, { useState, useRef, useEffect } from 'react';
import { useSentra } from '../../context/SentraContext';
import { sendChatMessage, ChatMessage } from '../../services/aiChat';
import { 
  Sparkles, 
  Send, 
  ShieldCheck, 
  PhoneCall, 
  RotateCcw, 
  Copy, 
  Check, 
  Bot, 
  User, 
  AlertCircle, 
  Gamepad2, 
  HeartHandshake,
  HeartPulse,
  Scale,
  Smile,
  Mic,
  MicOff,
  Video,
  PhoneOff,
  BrainCircuit
} from 'lucide-react';

export const VictimChatAI: React.FC<{ onNavigateTab: (tab: string) => void }> = ({ onNavigateTab }) => {
  const { victim } = useSentra();
  const complainantName = victim.name || victim.pseudonym.split(' ')[0] || 'Priya';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'aura',
      text: `Hello ${complainantName}. I am AURA, your confidential, trauma-informed supportive AI companion in SENTRA.

I am here to offer a calm, judgment-free space to talk through hearing anxiety, explore grounding exercises, or understand court procedural rights at your own pace. Everything you share here is private.

How are you holding up today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'emotional_support'
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Live Call State
  const [isLiveCall, setIsLiveCall] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const isLiveCallRef = useRef(false);

  useEffect(() => {
    isLiveCallRef.current = isLiveCall;
  }, [isLiveCall]);

  const scrollToBottom = () => {
    if (!isLiveCall) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isLiveCall]);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleSend(transcript);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const speakResponse = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google UK English Female'));
      if (femaleVoice) utterance.voice = femaleVoice;
      utterance.pitch = 0.95;
      utterance.rate = 0.95; // Calmer, slightly slower
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const replyText = await sendChatMessage(messages, text, complainantName, victim.caseId);
      const auraMsg: ChatMessage = {
        id: `msg-aura-${Date.now()}`,
        sender: 'aura',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, auraMsg]);
      
      if (isLiveCallRef.current) {
        speakResponse(replyText);
      }
    } catch {
      const errorText = "I am right here with you. Please take a gentle, deep breath. If you are experiencing acute distress, please connect with Dr. Ananya Raman or call the 24/7 Helpline.";
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'aura',
        text: errorText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
      
      if (isLiveCallRef.current) {
        speakResponse(errorText);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error("Microphone access error:", e);
      }
    }
  };

  const startLiveCall = () => {
    setIsLiveCall(true);
    speakResponse(`Hello ${complainantName}. I am here. You can click the microphone button to speak with me.`);
  };

  const endCall = () => {
    setIsLiveCall(false);
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    window.speechSynthesis?.cancel();
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'aura',
        text: `Conversation cleared. I am right here whenever you need a grounding breath, procedural clarity, or someone to listen, ${complainantName}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const quickPromptChips = [
    {
      label: "Cross-Examination Dread",
      icon: <Scale className="w-3 h-3 text-teal-700" />,
      prompt: "I am terrified about facing cross-examination on my hearing date. What should I expect and how can I prepare?"
    },
    {
      label: "4-7-8 Calming Breath",
      icon: <HeartPulse className="w-3 h-3 text-rose-600" />,
      prompt: "Can you guide me through a slow 2-minute calming breathing exercise to ease my physical chest tension?"
    },
    {
      label: "Witness Protection Scheme",
      icon: <ShieldCheck className="w-3 h-3 text-indigo-600" />,
      prompt: "What statutory rights do I have under the Witness Protection Scheme regarding courtroom barriers and escorts?"
    },
    {
      label: "Sleepless Night Support",
      icon: <Smile className="w-3 h-3 text-amber-600" />,
      prompt: "I cannot sleep because my thoughts are spinning about court. Can you help me wind down?"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-12">
      {/* Top Banner */}
      <div className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-indigo-800 text-white flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-teal-200 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                AURA — Supportive AI Companion
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Confidential & Online
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Empathetic listening, court hearing preparation, grounding exercises, and procedural rights.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {!isLiveCall && (
            <button
              onClick={startLiveCall}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Live AI Call</span>
            </button>
          )}

          <button
            onClick={handleClearChat}
            className="px-3 py-2 border border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-950 rounded-lg text-xs flex items-center gap-1 transition-colors bg-white dark:bg-slate-900/50"
            title="Clear Chat History"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {isLiveCall ? (
        <div className="bg-slate-900 rounded-3xl h-[600px] flex flex-col items-center justify-center relative overflow-hidden shadow-2xl border border-slate-800">
          {/* Live Video/Voice Call UI */}
          {/* Ambient background animations */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/40 to-slate-950 z-0"></div>
          
          {/* Glowing Aura Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
          
          {/* AURA AI Avatar (Glowing Orb) */}
          <div className="z-10 flex flex-col items-center justify-center mb-12">
            <div className={`w-36 h-36 rounded-full bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center shadow-[0_0_80px_rgba(45,212,191,0.3)] transition-all duration-500 ${isTyping ? 'scale-110 shadow-[0_0_100px_rgba(99,102,241,0.6)] animate-pulse' : 'animate-bounce'}`}>
              <BrainCircuit className="w-16 h-16 text-white/90" />
            </div>
            <h2 className="text-white mt-8 text-2xl font-medium tracking-wide font-sans">AURA AI</h2>
            <p className="text-teal-400 text-sm mt-2 font-mono uppercase tracking-widest">
              {isTyping ? 'Speaking...' : isListening ? 'Listening to you...' : 'Connected'}
            </p>
          </div>

          {/* Transcript overlay */}
          {(isTyping || isListening) && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 w-3/4 max-w-lg">
              <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
                <p className="text-white/90 text-sm leading-relaxed italic">
                  {isTyping ? "Generating compassionate response..." : "Please speak now..."}
                </p>
              </div>
            </div>
          )}

          {/* Simulated User Video PIP */}
          <div className="absolute bottom-28 sm:bottom-8 sm:right-8 right-4 w-28 h-40 sm:w-36 sm:h-48 bg-slate-800 rounded-2xl border-2 border-slate-600/50 overflow-hidden z-10 flex items-center justify-center shadow-2xl">
            <User className="w-12 h-12 text-slate-500 dark:text-slate-400" />
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded-md backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
              <span className="text-[9px] text-white font-mono uppercase font-bold tracking-wider">Live</span>
            </div>
          </div>

          {/* Call Controls */}
          <div className="absolute bottom-8 z-10 flex items-center gap-4 sm:gap-6 px-6 py-4 rounded-full border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl">
            <button 
              onClick={toggleMic} 
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 ${isListening ? 'bg-teal-500 text-white shadow-[0_0_20px_rgba(20,184,166,0.5)] scale-110' : 'bg-slate-700/80 text-white hover:bg-slate-600'}`}
              title={isListening ? 'Mute' : 'Unmute & Speak'}
            >
              {isListening ? <Mic className="w-5 h-5 sm:w-6 sm:h-6" /> : <MicOff className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
            <button className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-700/80 text-white flex items-center justify-center hover:bg-slate-600 transition-colors">
              <Video className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="w-px h-8 bg-white dark:bg-slate-900/20 mx-1"></div>
            <button 
              onClick={endCall} 
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:scale-105"
              title="End Call"
            >
              <PhoneOff className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl flex flex-col h-[520px]">
          {/* Main Chat Box */}
          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-600 to-indigo-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                      <Bot className="w-4 h-4 text-teal-100" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 relative group shadow-sm ${
                      isUser
                        ? 'bg-gradient-to-r from-teal-700 to-teal-800 text-white rounded-br-sm'
                        : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 text-slate-800 dark:text-slate-200 rounded-bl-sm'
                    }`}
                  >
                    {/* Message body with preserved line breaks */}
                    <div className="whitespace-pre-wrap font-sans">
                      {msg.text}
                    </div>

                    {/* Metadata and copy button */}
                    <div
                      className={`flex items-center justify-between pt-1.5 border-t text-[10px] ${
                        isUser
                          ? 'border-teal-600/50 text-teal-200'
                          : 'border-slate-100 dark:border-slate-800/50 text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>

                      {!isUser && (
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="opacity-0 group-hover:opacity-100 hover:text-teal-700 transition-opacity flex items-center gap-1 text-[10px] font-semibold"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                      <User className="w-4 h-4 text-slate-200" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-600 to-indigo-700 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Bot className="w-4 h-4 text-teal-100" />
                </div>
                <div className="bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800/50 rounded-2xl px-4 py-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-[11px] ml-1 font-medium text-slate-600 dark:text-slate-400">AURA is reflecting...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-4 py-3 bg-white dark:bg-slate-900/60 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700/80/50 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono shrink-0 font-semibold">Prompts:</span>
            {quickPromptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.prompt)}
                disabled={isTyping}
                className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 hover:border-teal-400 hover:bg-teal-50 dark:bg-teal-900/30/50 text-slate-700 dark:text-slate-300 hover:text-teal-900 dark:text-teal-100 transition-colors shrink-0 flex items-center gap-1.5 shadow-sm font-medium"
              >
                {chip.icon}
                <span>{chip.label}</span>
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 sm:p-4 bg-white dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-700/80/50 flex items-center gap-2 rounded-b-2xl"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              placeholder={`Type a message to AURA (e.g. "I'm nervous about the judge", "Help me breathe")...`}
              className="flex-1 text-xs px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none shadow-inner"
            />

            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-5 py-3 bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-600 hover:to-teal-700 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shrink-0"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Safety & Emergency Notice */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-950 shadow-sm">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-semibold text-amber-900">Safety & Support Safeguard:</strong> AURA is a supportive AI companion and does not provide formal judicial rulings. If you are experiencing acute danger, immediate intimidation, or medical emergency, call <strong>112 (National Emergency)</strong>, <strong>1091 (Women Helpline)</strong>, or <strong>14416 (Tele-MANAS Mental Health Support)</strong>. Your caseworker Dr. Ananya Raman is notified on priority review triggers.
        </div>
      </div>
    </div>
  );
};

