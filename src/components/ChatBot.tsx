import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Bot, 
  Send, 
  User, 
  Settings, 
  Plus, 
  Trash2, 
  Zap, 
  Mic,
  Loader2,
  FileText,
  Mail,
  PenTool,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import TranscriptionButton from './TranscriptionButton';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'bot';
  text: string;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: "Hello! I'm your AI assistant. I can help you generate content, letters, and applications. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [tone, setTone] = useState<'Professional' | 'Friendly'>('Professional');
  const [welcomeMessage, setWelcomeMessage] = useState("Hello! I'm your AI assistant. How can I help you today?");
  const [kbFile, setKbFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setKbFile(file);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (overrideInput?: string) => {
    const messageText = overrideInput || input;
    if (!messageText.trim()) return;

    const newMessages: Message[] = [...messages, { role: 'user', text: messageText }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const contents: any[] = newMessages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      // If there's a knowledge base file, add it to the first message or as a separate part
      if (kbFile) {
        const base64Data = await fileToBase64(kbFile);
        // We add the file context to the latest message to ensure the model sees it
        const lastMessage = contents[contents.length - 1];
        lastMessage.parts.push({
          inlineData: {
            data: base64Data,
            mimeType: kbFile.type || "application/pdf"
          }
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents,
        config: {
          systemInstruction: `You are the Mubus Assistant, a highly capable AI within the AI Chatbot Builder. 
          Your primary goal is to help users generate high-quality content, professional letters, and detailed applications. 
          Current Tone: ${tone}. 
          ${kbFile ? "A knowledge base document has been provided. Use its information to answer the user's questions accurately." : ""}
          When asked to generate a letter or application, provide a well-structured, ready-to-use draft. 
          Be concise but thorough. If the user asks for "content", provide creative and engaging text.`,
          temperature: tone === 'Friendly' ? 0.9 : 0.7,
        },
      });

      const botResponse = response.text || "I'm sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'bot', text: "I encountered an error. Please check your connection and try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    { label: 'Write a Letter', icon: Mail, prompt: 'Can you help me write a professional letter?' },
    { label: 'Job Application', icon: FileText, prompt: 'I need help drafting a job application letter for a software engineer position.' },
    { label: 'Create Content', icon: PenTool, prompt: 'Generate some engaging social media content for a new AI startup.' },
  ];

  return (
    <div className="p-8 space-y-8 bg-slate-950 min-h-full text-slate-200">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Chatbot Builder</h1>
          <p className="text-slate-500 mt-1">Configure and train intelligent bots for your websites.</p>
        </div>
        <button 
          onClick={() => setMessages([{ role: 'bot', text: welcomeMessage }])}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20"
        >
          <Plus size={20} /> Reset Chat
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col h-[650px]">
            <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Bot className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-bold">Mubus Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] text-emerald-500 font-bold uppercase">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400"><Settings size={18} /></button>
                <button 
                  onClick={() => setMessages([{ role: 'bot', text: welcomeMessage }])}
                  className="p-2 hover:bg-red-900/20 text-slate-400 hover:text-red-400 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl flex gap-3 shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                  }`}>
                    <div className="shrink-0 mt-1">
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 text-slate-400 p-4 rounded-2xl rounded-tl-none border border-slate-700 flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-xs font-medium">Mubus is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-900/50 space-y-4">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(action.prompt)}
                    className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-[10px] font-bold text-slate-300 transition-all"
                  >
                    <action.icon size={12} className="text-blue-500" />
                    {action.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Mic size={12} /> Voice Input Available
                </span>
                <TranscriptionButton 
                  onTranscriptionComplete={(text) => setInput(prev => prev ? `${prev} ${text}` : text)}
                  className="flex-row items-center"
                />
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me to write a letter, application, or content..." 
                  className="w-full pl-4 pr-12 py-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={isTyping || !input.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 rounded-xl text-white transition-all shadow-lg shadow-blue-900/20"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6 shadow-xl">
            <h3 className="font-bold flex items-center gap-2">
              <Zap className="text-amber-500" size={18} /> Training & Logic
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-2 block uppercase tracking-wider">Bot Tone</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setTone('Professional')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${tone === 'Professional' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                  >
                    Professional
                  </button>
                  <button 
                    onClick={() => setTone('Friendly')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${tone === 'Friendly' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                  >
                    Friendly
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-2 block uppercase tracking-wider">Knowledge Base</label>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                />
                {!kbFile ? (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 border-2 border-dashed border-slate-800 rounded-xl text-slate-600 hover:border-blue-500 hover:text-blue-500 transition-all text-xs font-medium flex items-center justify-center gap-2"
                  >
                    <Plus size={14} /> Upload PDF or Docs
                  </button>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-slate-800 border border-slate-700 rounded-xl">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText size={14} className="text-blue-500 shrink-0" />
                      <span className="text-xs text-slate-300 truncate">{kbFile.name}</span>
                    </div>
                    <button 
                      onClick={() => setKbFile(null)}
                      className="p-1 hover:bg-slate-700 rounded-md text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-2 block uppercase tracking-wider">Welcome Message</label>
                <textarea 
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500 h-24 resize-none"
                />
              </div>
            </div>
            <button 
              onClick={() => {
                setSaveStatus('saving');
                setTimeout(() => {
                  setSaveStatus('success');
                  setTimeout(() => setSaveStatus('idle'), 2000);
                }, 1500);
              }}
              disabled={saveStatus === 'saving'}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
            >
              {saveStatus === 'saving' ? (
                <Loader2 size={16} className="animate-spin" />
              ) : saveStatus === 'success' ? (
                <CheckCircle2 size={16} className="text-emerald-400" />
              ) : (
                <Sparkles size={16} />
              )}
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'success' ? 'Configuration Saved' : 'Save Configuration'}
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <h3 className="font-bold flex items-center gap-2">
              <Settings size={18} className="text-slate-400" /> Embed Code
            </h3>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[10px] text-slate-500 break-all">
              {`<script src="https://mubuslink.ai/bot.js" data-id="bot_123"></script>`}
            </div>
            <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all">
              Copy Snippet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
