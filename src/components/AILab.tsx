import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Brain, 
  Mic, 
  MicOff, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles,
  Volume2,
  Settings2,
  ChevronRight,
  Info,
  Clock,
  CheckCircle2,
  RefreshCw,
  MoreVertical
} from 'lucide-react';
import { GoogleGenAI, ThinkingLevel, Modality } from "@google/genai";
import { toast } from 'sonner';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  thinking?: string;
}

const AILab: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'reasoning' | 'live-voice'>('reasoning');
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  
  // High Thinking Config
  const [thinkingConfig, setThinkingConfig] = useState({
    level: ThinkingLevel.HIGH,
    model: 'gemini-3.1-pro-preview'
  });

  // Live Voice State
  const [isCallActive, setIsCallActive] = useState(false);
  const [voiceModel, setVoiceModel] = useState('gemini-3.1-flash-live-preview');
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleReasoningFlow = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);
    setIsThinking(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: thinkingConfig.model as any,
        contents: [
          ...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
          { role: 'user', parts: [{ text: input }] }
        ],
        config: {
          thinkingConfig: {
            thinkingLevel: thinkingConfig.level
          }
        }
      });

      const botMsg: ChatMessage = { 
        role: 'model', 
        text: response.text || "I processed your request but have no textual response.",
        thinking: (response as any).thought // Some models return thought in a specific field if enabled
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      toast.error("Reasoning engine encountered an error.");
    } finally {
      setIsProcessing(false);
      setIsThinking(false);
    }
  };

  const toggleVoiceCall = async () => {
    if (isCallActive) {
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
      setAudioStream(null);
      setIsCallActive(false);
      toast.info("Voice session ended.");
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setAudioStream(stream);
        setIsCallActive(true);
        toast.success("Voice session active. MUBUS AI is listening...");
        
        // This is a simplified UI representation. 
        // Real Live API implementation involves WebSocket connection to the multimodal endpoint
        // For this demo, we use a placeholder or simulated response pattern if no backend proxy exists
      } catch (err) {
        toast.error("Microphone access denied.");
      }
    }
  };

  return (
    <div className="p-8 space-y-8 bg-slate-950 min-h-full text-slate-200">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Brain className="text-purple-500" /> AI Research Lab
          </h1>
          <p className="text-slate-500 mt-1">High-order reasoning and real-time multimodal intelligence.</p>
        </div>
        <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800">
          <button 
            onClick={() => setActiveTool('reasoning')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTool === 'reasoning' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            High Reasoning
          </button>
          <button 
            onClick={() => setActiveTool('live-voice')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTool === 'live-voice' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Live Voice
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {activeTool === 'reasoning' ? (
          <>
            {/* Reasoning Sidebar */}
            <div className="xl:col-span-4 space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-6">
                <h3 className="font-bold flex items-center gap-2">
                  <Settings2 className="text-slate-500" size={18} /> Engine Config
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Reasoning Model</label>
                    <select 
                      value={thinkingConfig.model}
                      onChange={(e) => setThinkingConfig({...thinkingConfig, model: e.target.value})}
                      className="w-full p-3 bg-slate-850 border border-slate-700 rounded-xl text-xs font-bold outline-none"
                    >
                      <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Reasoning+)</option>
                      <option value="gemini-3-flash-preview">Gemini 3 Flash (Fast Reasoning)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Thinking Intensity</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setThinkingConfig({...thinkingConfig, level: ThinkingLevel.HIGH})}
                        className={`py-2 rounded-lg text-xs font-bold transition-all ${thinkingConfig.level === ThinkingLevel.HIGH ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                      >
                        Deep Thinking
                      </button>
                      <button 
                        onClick={() => setThinkingConfig({...thinkingConfig, level: ThinkingLevel.LOW})}
                        className={`py-2 rounded-lg text-xs font-bold transition-all ${thinkingConfig.level === ThinkingLevel.LOW ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                      >
                        Standard
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-600/10 border border-purple-600/20 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-[10px] uppercase tracking-widest">
                    <Sparkles size={12} /> Pro Capabilities
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    This engine uses advanced chain-of-thought processing to solve complex logic, coding, and mathematical problems.
                  </p>
                </div>
              </div>
            </div>

            {/* Reasoning Interface */}
            <div className="xl:col-span-8 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex flex-col h-[650px] overflow-hidden">
                <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-900/20">
                      <Brain className="text-white" size={28} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Reasoning Engine v3.1</h3>
                      <p className="text-[10px] text-purple-500 font-black uppercase tracking-widest">Thinking Level: {thinkingConfig.level}</p>
                    </div>
                  </div>
                  <button onClick={() => setMessages([])} className="p-2 hover:bg-slate-800 rounded-xl text-slate-500"><RefreshCw size={18} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                  {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                      <Bot size={64} />
                      <div className="max-w-xs">
                        <p className="font-bold text-lg text-white">Ask anything complex</p>
                        <p className="text-sm">From architectural design to code optimization, I will think through the solution.</p>
                      </div>
                    </div>
                  )}
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[90%] space-y-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`p-5 rounded-3xl ${
                          msg.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-tr-none shadow-xl shadow-blue-900/10' 
                            : 'bg-slate-850 text-slate-200 rounded-tl-none border border-slate-700 shadow-xl'
                        }`}>
                          <div className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isThinking && (
                    <div className="flex justify-start">
                      <div className="bg-slate-850 border border-slate-700 p-6 rounded-3xl rounded-tl-none space-y-4 max-w-[80%]">
                        <div className="flex items-center gap-3">
                          <Loader2 size={18} className="animate-spin text-purple-500" />
                          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Reasoning in progress...</span>
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <motion.div 
                              animate={{ x: [-100, 300] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="h-full w-24 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
                            />
                          </div>
                          <p className="text-[10px] text-slate-500 italic">"Exploring multiple solution paths and validating edge cases..."</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-6 border-t border-slate-800 bg-slate-900 sm:flex items-center gap-4">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleReasoningFlow()}
                      placeholder="Start a complex reasoning thread..." 
                      className="w-full pl-6 pr-14 py-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                    />
                    <button 
                      onClick={handleReasoningFlow}
                      disabled={isProcessing || !input.trim()}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 rounded-xl text-white transition-all shadow-lg"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="xl:col-span-12 flex flex-col items-center justify-center space-y-12 py-12 text-center">
            <div className="relative">
              <div className="w-48 h-48 bg-emerald-600/10 rounded-full border-2 border-emerald-500/20 flex items-center justify-center p-8">
                <motion.div 
                   animate={isCallActive ? { scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] } : {}}
                   transition={{ duration: 2, repeat: Infinity }}
                   className="absolute inset-0 bg-emerald-500 rounded-full blur-3xl opacity-10"
                />
                <div className={`w-full h-full rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${isCallActive ? 'bg-emerald-600 scale-110' : 'bg-slate-800'}`}>
                  {isCallActive ? <Mic className="text-white" size={64} /> : <MicOff className="text-slate-500" size={64} />}
                </div>
              </div>
              {isCallActive && (
                <motion.div 
                  className="absolute -top-4 -right-4 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  Live
                </motion.div>
              )}
            </div>

            <div className="max-w-lg space-y-4">
              <h2 className="text-4xl font-black text-white">Multimodal Live Session</h2>
              <p className="text-slate-500 leading-relaxed">
                Connect your microphone for a low-latency voice conversation. MUBUS AI can hear you and respond in real-time using advanced neural TTS.
              </p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={toggleVoiceCall}
                className={`flex items-center gap-3 px-10 py-5 rounded-2xl font-black transition-all shadow-2xl ${isCallActive ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'}`}
              >
                {isCallActive ? 'End Live Session' : 'Start Live Conversation'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl pt-8">
              {[
                { icon: Clock, label: 'Low Latency', desc: 'Sub-second response times' },
                { icon: Volume2, label: 'Neural Voice', desc: 'Natural humanoid speech patterns' },
                { icon: Zap, label: 'Flash 3.1', desc: 'Powered by the latest Live engine' }
              ].map((feature, i) => (
                <div key={i} className="p-6 bg-slate-900 border border-slate-800 rounded-3xl text-left space-y-2">
                  <div className="w-10 h-10 bg-slate-850 rounded-xl flex items-center justify-center text-emerald-500 mb-4">
                    <feature.icon size={20} />
                  </div>
                  <h4 className="font-bold text-white">{feature.label}</h4>
                  <p className="text-xs text-slate-500">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AILab;
