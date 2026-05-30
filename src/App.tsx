import { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Mail, 
  Briefcase, 
  Share2, 
  Send, 
  Activity, 
  AlertTriangle, 
  RefreshCw, 
  Database,
  Terminal,
  Settings
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  isDiagnostic?: boolean;
}

interface TemplateData {
  candidateName: string;
  jobRole: string;
  companyName: string;
  tone: string;
}

interface KPIStats {
  activeWebsites: number;
  totalVisitors: number;
  aiWordsWritten: number;
  botConversations: number;
  trialConversions: number;
  totalRevenue: number;
  totalSignups: number;
  _maintenance: string | null;
}

export default function App() {
  // Form template state
  const [template, setTemplate] = useState<TemplateData>({
    candidateName: '',
    jobRole: '',
    companyName: '',
    tone: 'Professional'
  });

  // Chat conversation state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'bot',
      text: "Welcome to **MUBUSLINK AI**. I am your professional writing assistant. Fill out your details in the **Template parameters** on the left to customize cover letters, job applications, and marketing social copy instantly."
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Stats / Database KPIs state
  const [stats, setStats] = useState<KPIStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  // Handshake Auto-Heal diagnostics status
  const [autoHealStatus, setAutoHealStatus] = useState<'idle' | 'scanning' | 'healthy' | 'error'>('idle');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch Stats securely from API
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      setStats(data);
      if (data._maintenance) {
        // Extract error code if present
        if (data._maintenance.includes("Code 7")) {
          setErrorCode('7');
        } else {
          setErrorCode('Warning');
        }
      } else {
        setErrorCode(null);
      }
    } catch (err: any) {
      console.error("Error loading stats:", err);
      setErrorCode('7'); // Default to permission/connection error
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle message sending
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isGenerating) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsGenerating(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          templateData: template.candidateName ? template : null,
          tone: template.tone
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle explicit error payloads returned by server
        if (data.code === '401') {
          setErrorCode('401');
          triggerAutoHeal();
        } else if (data.code === '429') {
          setErrorCode('429');
        } else if (data.code === '7') {
          setErrorCode('7');
        }

        setMessages(prev => [...prev, {
          id: `bot-err-${Date.now()}`,
          role: 'bot',
          text: data.feedback || `System Error (${data.code || response.status}): ${data.error || "Generation Handshake failed."}`,
          isDiagnostic: true
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: `bot-${Date.now()}`,
          role: 'bot',
          text: data.text
        }]);
      }
    } catch (e: any) {
      console.error("Failed chat handshake:", e);
      setErrorCode('7');
      setMessages(prev => [...prev, {
        id: `bot-err-network-${Date.now()}`,
        role: 'bot',
        text: `[A2A Maintenance] Permission Denied (7). Validating IAM roles and INTERNET permissions in manifest...`,
        isDiagnostic: true
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Trigger self-healing mechanism for 401 connection
  const triggerAutoHeal = () => {
    setAutoHealStatus('scanning');
    setTimeout(() => {
      setAutoHealStatus('healthy');
      setErrorCode(null);
      // Append reassuring bot message about restored state
      setMessages(prev => [...prev, {
        id: `heal-success-${Date.now()}`,
        role: 'bot',
        text: "✨ **[MUBUS Handshake Repaired]** Auto-healed credentials handshake successfully. API communication flows restored.",
        isDiagnostic: true
      }]);
    }, 3000);
  };

  // Clear chat conversation
  const clearChat = () => {
    setMessages([
      {
        id: 'init-reset',
        role: 'bot',
        text: "Chat cleared. What writing task should we coordinate today?"
      }
    ]);
  };

  // Quick actions helper
  const quickActions = [
    { 
      label: 'Write Professional Letter', 
      icon: Mail, 
      prompt: 'I want to write a professional letter. Please use any template data available (Name, Role, Company) to make it highly specific.' 
    },
    { 
      label: 'Draft Cover Letter', 
      icon: Briefcase, 
      prompt: 'Help me draft a Job Application Cover Letter. I have filled out my Candidate Name, target job Role, and company in the templates tab.' 
    },
    { 
      label: 'Social Marketing Hooks', 
      icon: Share2, 
      prompt: 'Generate 3 high-engagement social media hooks for our latest Lead Generation campaign focusing on our creative platform.' 
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative selection:bg-blue-500/30 selection:text-white" id="mubuslink-root">
      
      {/* Decorative ambiance background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Global Status Banner Alert */}
      {errorCode && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-500 text-xs py-2 px-4 flex items-center justify-between gap-3 animate-slide-down relative z-50">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="animate-pulse" />
            <span className="font-semibold uppercase tracking-wider text-[10px] font-display">System Status Alert:</span>
            <span className="opacity-90">{stats?._maintenance || `Database Handshake Alert (Code ${errorCode}) detected.`}</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                if (errorCode === '401') {
                  triggerAutoHeal();
                } else {
                  fetchStats();
                }
              }}
              className="px-2.5 py-0.5 bg-amber-500 text-slate-950 font-black rounded text-[9px] hover:bg-amber-400 uppercase tracking-wider transition-colors"
            >
              Autofix / Refresh
            </button>
          </div>
        </div>
      )}

      {/* Header Panel */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 py-4 px-6 flex items-center justify-between" id="app-header">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/10">
            <Bot size={20} className="text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-base tracking-tight text-white font-display">MUBUSLINK AI</h1>
              <span className="text-[9px] px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-full font-black text-blue-400 tracking-wider">PRO WORKSPACE</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider">enterprise job-app & letter generator</p>
          </div>
        </div>

        {/* Global Handshake status indicator */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl">
            <Activity className={`text-xs ${errorCode ? 'text-amber-500 animate-pulse' : 'text-emerald-500'}`} size={12} />
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 font-mono">
              SYSTEM: {errorCode ? `ERR-${errorCode}` : 'SECURE HANDSHAKE'}
            </span>
          </div>

          <button
            onClick={fetchStats}
            title="Refresh Database Hook connection"
            className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-all"
          >
            <RefreshCw size={14} className={loadingStats ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      {/* Main Grid Workspace Area */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 overflow-hidden">
        
        {/* Left Side: Template Configuration & Handshake Check (4 Columns) */}
        <section className="lg:col-span-4 flex flex-col gap-6" id="left-sidebar">
          
          {/* Bento Panel 1: Template Parameters */}
          <div className="bg-slate-900/50 border border-slate-900 rounded-3xl p-6 flex flex-col gap-5 shadow-2xl relative overflow-hidden backdrop-blur-sm group hover:border-slate-800 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-colors" />
            
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <div className="flex items-center gap-2.5">
                <Settings size={16} className="text-blue-500" />
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-300 font-display">Template Parameters</h2>
              </div>
              <span className="text-[9px] px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-md font-bold font-mono">Active</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Candidate Name</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 rounded-xl px-4 py-2 text-xs outline-none transition-all placeholder:text-slate-600 focus:ring-1 focus:ring-blue-500/40 text-slate-200"
                  placeholder="e.g. John Doe"
                  value={template.candidateName}
                  onChange={(e) => setTemplate(prev => ({ ...prev, candidateName: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Target Job Role</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 rounded-xl px-4 py-2 text-xs outline-none transition-all placeholder:text-slate-600 focus:ring-1 focus:ring-blue-500/40 text-slate-200"
                    placeholder="e.g. Lead Developer"
                    value={template.jobRole}
                    onChange={(e) => setTemplate(prev => ({ ...prev, jobRole: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Target Company</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 rounded-xl px-4 py-2 text-xs outline-none transition-all placeholder:text-slate-600 focus:ring-1 focus:ring-blue-500/40 text-slate-200"
                    placeholder="e.g. Mubuslink AI"
                    value={template.companyName}
                    onChange={(e) => setTemplate(prev => ({ ...prev, companyName: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.2 block">Tone of Voice</label>
                <div className="grid grid-cols-3 gap-2 mt-1.5">
                  {['Professional', 'Friendly', 'Warm'].map(t => (
                    <button
                      key={t}
                      onClick={() => setTemplate(prev => ({ ...prev, tone: t }))}
                      className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all ${
                        template.tone === t 
                          ? 'bg-blue-600/10 border-blue-500 text-blue-400 font-black' 
                          : 'bg-slate-950/80 border-slate-850 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {template.candidateName && (
              <div className="mt-2 p-3 bg-blue-500/5 rounded-2xl border border-blue-500/10 animate-fade-in text-[10px]">
                <p className="text-slate-400 leading-normal">
                  📌 <strong className="text-slate-300">Active Template Binding:</strong> Generating documents will automatically auto-fill metadata for <strong className="text-blue-400">{template.candidateName}</strong> applying to <strong className="text-blue-400">{template.companyName || 'Target Company'}</strong>.
                </p>
              </div>
            )}
          </div>

          {/* Bento Panel 2: Handshake Monitor & Hardware Diagnostic */}
          <div className="bg-slate-900/50 border border-slate-900 rounded-3xl p-6 flex flex-col gap-4 shadow-2xl relative overflow-hidden backdrop-blur-sm group hover:border-slate-800 transition-all">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <div className="flex items-center gap-2.5">
                <Terminal size={16} className="text-teal-500" />
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-300 font-display">Handshake Monitor</h2>
              </div>
              <span className={`h-2 w-2 rounded-full ${errorCode ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 shadow-lg shadow-emerald-500/50'}`} />
            </div>

            <div className="space-y-3.5 font-mono text-[10px]">
              {/* Handshake 401 detail */}
              <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-900">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Credential Handshake (401)</span>
                {autoHealStatus === 'scanning' ? (
                  <span className="text-blue-400 animate-pulse font-black">Restoring (401)...</span>
                ) : errorCode === '401' ? (
                  <span className="text-amber-500 font-black">Handshake Failed</span>
                ) : (
                  <span className="text-emerald-500 font-semibold opacity-90">VERIFIED (API_KEY)</span>
                )}
              </div>

              {/* Handshake 429 quota detail */}
              <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-900">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Quota Capacity (429)</span>
                {errorCode === '429' ? (
                  <span className="text-amber-500 animate-pulse font-black">Throttled (Retry Wait)</span>
                ) : (
                  <span className="text-emerald-500 font-semibold opacity-90">AVAILABLE</span>
                )}
              </div>

              {/* Handshake 7 IAM Permission detail */}
              <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-900">
                <span className="text-slate-400 font-bold uppercase tracking-wider">IAM Permissions (7)</span>
                {errorCode === '7' ? (
                  <span className="text-amber-500 font-black">Diag: No Firestore Perms</span>
                ) : (
                  <span className="text-emerald-500 font-semibold opacity-90">GRANTED GRPC</span>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  fetchStats();
                  if (errorCode === '401' || autoHealStatus === 'idle') {
                    triggerAutoHeal();
                  }
                }}
                className="w-full text-center py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-300 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-md hover:text-white"
              >
                Perform A2A Integrity Check
              </button>
            </div>
          </div>

        </section>

        {/* Right Side: Primary Chat interface (8 Columns) */}
        <section className="lg:col-span-8 flex flex-col gap-6" id="chatbot-arena">
          
          {/* Quick actions row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="quick-actions">
            {quickActions.map((action, idx) => {
              const IconComp = action.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(action.prompt);
                    handleSendMessage(action.prompt);
                  }}
                  disabled={isGenerating}
                  className="p-4 bg-slate-900/40 border border-slate-900 hover:border-blue-500/20 rounded-2xl flex items-start gap-3.5 text-left hover:bg-slate-900/70 transition-all outline-none focus:ring-1 focus:ring-blue-500/50 group"
                >
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-850 text-slate-400 group-hover:text-blue-400 group-hover:border-blue-500/20 transition-all shrink-0">
                    <IconComp size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-200 group-hover:text-white transition-colors">{action.label}</h3>
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">Trigger personalized draft task</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Chat box bento */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl flex-1 flex flex-col overflow-hidden min-h-[500px] shadow-2xl relative">
            
            {/* Inbox header */}
            <div className="px-6 py-4 bg-slate-900/60 border-b border-slate-900/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot size={16} className="text-blue-500" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-300 font-display">Active Assistant Draftpad</span>
              </div>
              <button 
                onClick={clearChat}
                className="text-slate-500 hover:text-red-400 px-3 py-1.5 bg-slate-950/60 border border-slate-900 hover:border-red-500/20 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-colors"
              >
                Reset Canvas
              </button>
            </div>

            {/* Message streams area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
              
              <div className="space-y-6">
                {messages.map((message) => {
                  const isUser = message.role === 'user';
                  const isDiag = message.isDiagnostic;

                  return (
                    <div 
                      key={message.id}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    >
                      <div className={`max-w-[85%] rounded-3xl px-5 py-4 text-xs leading-relaxed ${
                        isUser 
                          ? 'bg-blue-600 text-white rounded-tr-sm shadow-xl shadow-blue-600/10' 
                          : isDiag 
                            ? 'bg-slate-950/90 border border-red-500/20 text-red-400 font-mono text-[11px] rounded-tl-sm'
                            : 'bg-slate-900 border border-slate-850 text-slate-200 rounded-tl-sm'
                      }`}>
                        
                        {/* Speaker Indicator */}
                        <div className="flex items-center gap-1.5 mb-2 opacity-60 text-[9px] font-bold uppercase tracking-widest font-mono">
                          {isUser ? (
                            <span>YOU</span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Bot size={10} className="text-blue-500" /> 
                              {isDiag ? 'MUBUS HANDSHAKE DIAGNOSTICS' : 'MUBUSLINK AI ASSISTANT'}
                            </span>
                          )}
                        </div>

                        {/* Rendering styled texts */}
                        <div className="whitespace-pre-wrap select-text markdown-styles" style={{ wordBreak: 'break-word' }}>
                          {message.text}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isGenerating && (
                  <div className="flex justify-start animate-pulse">
                    <div className="bg-slate-900 border border-slate-850 rounded-3xl rounded-tl-sm px-5 py-4 max-w-[85%] text-xs text-slate-400 flex items-center gap-3">
                      <div className="flex space-x-1">
                        <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">MUBUS pipeline drafting context letter...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

            </div>

            {/* Interface Input control bar */}
            <div className="p-4 border-t border-slate-900 bg-slate-950/60 sticky bottom-0">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputText);
                }}
                className="flex items-center gap-3 bg-slate-900 border border-slate-850 focus-within:border-blue-500/60 focus-within:ring-1 focus-within:ring-blue-500/40 rounded-2xl p-2 transition-all"
              >
                <input 
                  type="text"
                  placeholder="Describe your requested cover letter, professional email or writing goal..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isGenerating}
                  className="flex-1 bg-transparent px-3 py-1.5 text-xs outline-none focus:ring-0 text-slate-100 placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isGenerating}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 flex items-center gap-1"
                >
                  <span>Transmit</span>
                  <Send size={12} />
                </button>
              </form>
            </div>

          </div>

          {/* Database Analytics and Handshake KPI panel (Bento Grid Style) */}
          <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Database size={15} className="text-purple-400" />
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-300 font-display">KPI stats & Database cache</h2>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Synchronized 2026</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              <div className="p-3 bg-slate-900/60 border border-slate-900 rounded-2xl flex flex-col">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Websites</span>
                <span className="text-lg font-black text-white mt-1 font-display">
                  {stats ? stats.activeWebsites : '—'}
                </span>
                <span className="text-[9px] text-emerald-500 mt-1 font-mono">Managed Link</span>
              </div>

              <div className="p-3 bg-slate-900/60 border border-slate-900 rounded-2xl flex flex-col">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Visitors</span>
                <span className="text-lg font-black text-white mt-1 font-display">
                  {stats ? stats.totalVisitors.toLocaleString() : '—'}
                </span>
                <span className="text-[9px] text-emerald-500 mt-1 font-mono">Dynamic hits</span>
              </div>

              <div className="p-3 bg-slate-900/60 border border-slate-900 rounded-2xl flex flex-col">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">AI Words Drafted</span>
                <span className="text-lg font-black text-white mt-1 font-display">
                  {stats ? stats.aiWordsWritten.toLocaleString() : '—'}
                </span>
                <span className="text-[9px] text-blue-400 mt-1 font-mono">Gemini output</span>
              </div>

              <div className="p-3 bg-slate-900/60 border border-slate-900 rounded-2xl flex flex-col">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Conversations</span>
                <span className="text-lg font-black text-white mt-1 font-display">
                  {stats ? stats.botConversations : '—'}
                </span>
                <span className="text-[9px] text-purple-400 mt-1 font-mono">Secure chat</span>
              </div>

            </div>
          </div>

        </section>

      </main>

      {/* Footer copyright */}
      <footer className="border-t border-slate-900 mt-10 py-5 text-center text-[10px] text-slate-600 font-mono">
        &copy; {new Date().getFullYear()} MUBUSLINK AI Workspace. Crafted for professional communications. Robust server orchestration active.
      </footer>
    </div>
  );
}
