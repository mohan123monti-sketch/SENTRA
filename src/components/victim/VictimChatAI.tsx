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
  Smile
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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
    } catch {
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'aura',
        text: "I am right here with you. Please take a gentle, deep breath. If you are experiencing acute distress, please connect with Dr. Ananya Raman or call the 24/7 Helpline at 112 / 1091.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
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
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-700 to-slate-800 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5 text-teal-200 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900">
                AURA — Supportive AI Companion
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Confidential & Online
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Empathetic listening, court hearing preparation, grounding exercises, and procedural rights.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onNavigateTab('games')}
            className="px-3 py-1.5 border border-teal-200 bg-teal-50/70 hover:bg-teal-100 text-teal-900 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-teal-700" />
            <span>Calming Games</span>
          </button>

          <button
            onClick={handleClearChat}
            className="px-2.5 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded text-xs flex items-center gap-1 transition-colors"
            title="Clear Chat History"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col h-[520px]">
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
                  <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Bot className="w-4 h-4 text-teal-100" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 relative group shadow-2xs ${
                    isUser
                      ? 'bg-teal-800 text-white rounded-br-xs'
                      : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-bl-xs'
                  }`}
                >
                  {/* Message body with preserved line breaks */}
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.text}
                  </div>

                  {/* Metadata and copy button */}
                  <div
                    className={`flex items-center justify-between pt-1 border-t text-[10px] ${
                      isUser
                        ? 'border-teal-700/50 text-teal-200'
                        : 'border-slate-200/80 text-slate-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>

                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="opacity-0 group-hover:opacity-100 hover:text-slate-700 transition-opacity flex items-center gap-1 text-[10px]"
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
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-slate-200" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-teal-100" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[11px] ml-1 font-medium text-slate-600">AURA is reflecting...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2.5 bg-slate-50/70 border-t border-slate-200/80 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[11px] text-slate-400 font-mono shrink-0">Prompts:</span>
          {quickPromptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip.prompt)}
              disabled={isTyping}
              className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-teal-700 hover:bg-teal-50/50 text-slate-700 hover:text-teal-900 transition-colors shrink-0 flex items-center gap-1.5 shadow-2xs font-medium"
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
          className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            placeholder={`Type a message to AURA (e.g. "I'm nervous about the judge", "Help me breathe")...`}
            className="flex-1 text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-teal-700 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="px-4 py-2.5 bg-teal-800 hover:bg-teal-700 disabled:bg-slate-300 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Safety & Emergency Notice */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-3.5 flex items-start gap-3 text-xs text-amber-950">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-semibold text-amber-900">Safety & Support Safeguard:</strong> AURA is a supportive AI companion and does not provide formal judicial rulings. If you are experiencing acute danger, immediate intimidation, or medical emergency, call <strong>112 (National Emergency)</strong>, <strong>1091 (Women Helpline)</strong>, or <strong>14416 (Tele-MANAS Mental Health Support)</strong>. Your caseworker Dr. Ananya Raman is notified on priority review triggers.
        </div>
      </div>
    </div>
  );
};
