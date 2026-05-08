import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Search, 
  Target, 
  Zap, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  BarChart,
  Sparkles,
  Copy,
  Download,
  ChevronRight,
  ShieldAlert,
  Globe
} from 'lucide-react';
import { generateSEOSalesContent, getPerformanceScore, runSEOAudit } from '../services/geminiService';
import Markdown from 'react-markdown';

interface PerformanceScore {
  overallScore: number;
  seoScore: number;
  conversionScore: number;
  readabilityScore: number;
  suggestions: string[];
}

const SEOSalesContent: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('SEO Blog Post');
  const [tone, setTone] = useState('Professional');
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState('');
  const [score, setScore] = useState<PerformanceScore | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'audit'>('create');
  const [auditTarget, setAuditTarget] = useState('');
  const [auditResults, setAuditResults] = useState<any>(null);
  const [lastParams, setLastParams] = useState<{topic: string, type: string, tone: string, keywords: string} | null>(null);

  const handleSEOAudit = async () => {
    if (!auditTarget.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await runSEOAudit(auditTarget);
      setAuditResults(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const contentTypes = [
    'SEO Blog Post',
    'Sales Landing Page',
    'Product Description',
    'Ad Copy',
    'Email Campaign',
    'Social Media Post'
  ];

  const tones = [
    'Professional',
    'Persuasive',
    'Informative',
    'Casual',
    'Exciting',
    'Urgent'
  ];

  const handleGenerate = async (useLastParams = false) => {
    const paramsToUse = useLastParams && lastParams ? lastParams : { topic, type, tone, keywords };
    if (!paramsToUse.topic.trim()) return;
    
    setIsGenerating(true);
    try {
      const generated = await generateSEOSalesContent(
        paramsToUse.topic, 
        paramsToUse.type, 
        paramsToUse.tone, 
        paramsToUse.keywords
      );
      setContent(generated || '');
      setLastParams(paramsToUse);
      handleAnalyze(generated || '');
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyze = async (textToAnalyze: string) => {
    if (!textToAnalyze.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await getPerformanceScore(textToAnalyze);
      setScore(result);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadContent = () => {
    if (!content) return;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${topic.replace(/\s+/g, '-').toLowerCase()}-${type.replace(/\s+/g, '-').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const [copied, setCopied] = useState(false);

  return (
    <div className="p-8 space-y-8 bg-slate-950 min-h-full text-slate-200">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <TrendingUp className="text-blue-500" size={24} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">SEO & Sales Content</h1>
          </div>
          
          <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button 
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'create' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Content Creator
            </button>
            <button 
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'audit' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              SEO Expert Audit
            </button>
          </div>
        </div>
        <p className="text-slate-500 max-w-2xl">
          Generate high-converting sales copy and SEO-optimized content with real-time performance scoring.
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {activeTab === 'create' ? (
          <>
            <div className="xl:col-span-4 space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-slate-400 mb-2 block">Topic or Product Name</label>
                    <input 
                      type="text" 
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., AI Writing Assistant"
                      className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-slate-400 mb-2 block">Content Type</label>
                      <select 
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                      >
                        {contentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-400 mb-2 block">Tone</label>
                      <select 
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                      >
                        {tones.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-400 mb-2 block">Target Keywords (Optional)</label>
                    <input 
                      type="text" 
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="e.g., SEO, AI, content marketing"
                      className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleGenerate(false)}
                    disabled={isGenerating || !topic.trim()}
                    className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20"
                  >
                    {isGenerating ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} />}
                    {isGenerating ? 'Generating...' : 'Generate Content'}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {score && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold flex items-center gap-2">
                        <BarChart className="text-emerald-500" size={20} /> Performance Score
                      </h3>
                    </div>
                    <div className="flex items-center justify-center py-4">
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                          <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * score.overallScore) / 100} className="text-emerald-500 transition-all duration-1000 ease-out" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-bold">{score.overallScore}</span>
                          <span className="text-[10px] text-slate-500 uppercase font-bold">Overall</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">SEO</p>
                        <p className="text-lg font-bold text-blue-400">{score.seoScore}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Conv.</p>
                        <p className="text-lg font-bold text-purple-400">{score.conversionScore}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Read.</p>
                        <p className="text-lg font-bold text-amber-400">{score.readabilityScore}%</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="xl:col-span-8 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex flex-col min-h-[600px]">
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-blue-500" />
                    <h3 className="font-bold">Content Preview</h3>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={copyToClipboard} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
                      {copied ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Copy size={18} />}
                    </button>
                    <button onClick={downloadContent} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
                      <Download size={18} />
                    </button>
                  </div>
                </div>
                <div className="flex-1 p-8 overflow-y-auto prose prose-invert max-w-none">
                  {isGenerating ? <div className="text-center py-20 animate-pulse text-slate-500">Generating optimized content...</div> : content ? <div className="markdown-body"><Markdown>{content}</Markdown></div> : <div className="text-center py-20 text-slate-700">Topic on the left to begin...</div>}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="xl:col-span-12 space-y-8 max-w-4xl mx-auto w-full">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Globe className="text-blue-500" size={24} />
                <h2 className="text-xl font-bold">Expert SEO Audit</h2>
              </div>
              <textarea 
                value={auditTarget}
                onChange={(e) => setAuditTarget(e.target.value)}
                placeholder="https://example.com or paste your article text here..."
                className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none h-40 font-mono text-sm"
              />
              <button 
                onClick={handleSEOAudit}
                disabled={isAnalyzing || !auditTarget.trim()}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold transition-all flex items-center justify-center gap-3"
              >
                {isAnalyzing ? <RefreshCw className="animate-spin" size={20} /> : <Search size={20} />}
                Run Comprehensive Audit
              </button>
            </div>
            {auditResults && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Score</p>
                    <p className="text-4xl font-bold text-emerald-500">{auditResults.healthScore}</p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl col-span-2">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Expert Strategy</p>
                    <p className="text-sm text-slate-300">{auditResults.metaOptimizations.title}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const FileText = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

export default SEOSalesContent;
