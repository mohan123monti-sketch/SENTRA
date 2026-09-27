import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, BrainCircuit, Loader2 } from 'lucide-react';
import { sendChatMessage, ChatMessage } from '../../services/aiChat';

export const AuraWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-widget-welcome',
      sender: 'aura',
      text: 'Hello. I am the SENTRA Guide. I can answer questions about how this platform works, login, privacy, and AI transparency.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Use "Guest" and no case ID since they might be anywhere in the app
      const replyText = await sendChatMessage(messages, text, "Guest", "General");
      const auraMsg: ChatMessage = {
        id: `msg-aura-${Date.now()}`,
        sender: 'aura',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, auraMsg]);
    } catch {
      setMessages(prev => [...prev, {
        id: `msg-err-${Date.now()}`,
        sender: 'aura',
        text: "I am having trouble connecting. Please take a deep breath, or call the 112 helpline if it is an emergency.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-teal-600 to-indigo-700 text-white shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        aria-label="Open SENTRA Guide"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Widget Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 z-50 w-[350px] h-[500px] max-h-[80vh] flex flex-col bg-white dark:bg-slate-900/90 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-indigo-800 p-4 flex items-center justify-between text-white shrink-0 shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900/20 flex items-center justify-center">
              <BrainCircuit className="w-4 h-4 text-teal-100" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">SENTRA Guide</h3>
              <p className="text-[10px] text-teal-100">Informational Assistant</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white dark:bg-slate-900/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950/50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'aura' && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-600 to-indigo-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <BrainCircuit className="w-3 h-3 text-teal-100" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-xl p-3 text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-teal-700 text-white rounded-br-none' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-sm'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-2 justify-start items-center">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-600 to-indigo-700 text-white flex items-center justify-center shrink-0">
                <BrainCircuit className="w-3 h-3 text-teal-100" />
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2">
                <Loader2 className="w-4 h-4 text-teal-600 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700/80 shrink-0">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              placeholder="Type your message..."
              className="flex-1 text-xs px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 focus:border-teal-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2.5 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-300 text-white rounded-lg transition-colors flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
