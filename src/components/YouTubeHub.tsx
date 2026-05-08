import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Search, 
  Youtube, 
  FileText, 
  List, 
  ChevronRight, 
  Sparkles, 
  Download,
  ExternalLink,
  RefreshCw,
  BarChart,
  Target,
  Link,
  Share2,
  Twitter,
  Linkedin,
  Mail
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { toast } from 'sonner';

interface VideoInsight {
  title: string;
  summary: string;
  keyTakeaways: string[];
  audience: string;
  seoKeywords: string[];
}

const YouTubeHub: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState<VideoInsight | null>(null);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const handleShare = (platform?: 'twitter' | 'linkedin' | 'email') => {
    if (!insights) return;
    
    const text = `Check out these AI video insights for "${insights.title}"! Generated with MUBUSLINK AI.`;
    const shareUrl = window.location.href;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'email') {
      window.location.href = `mailto:?subject=${encodeURIComponent(`AI Video Insights: ${insights.title}`)}&body=${encodeURIComponent(`${text}\n\nSummary: ${insights.summary}\n\nKey Takeaways:\n${insights.keyTakeaways.map(t => `- ${t}`).join('\n')}`)}`;
    } else if (navigator.share) {
      navigator.share({
        title: `AI Insights: ${insights.title}`,
        text: text,
        url: shareUrl,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${text}\n\n${shareUrl}`);
      toast.success("Insights link copied to clipboard!");
    }
    setShowShareOptions(false);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: (process.env.GEMINI_API_KEY as string) });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the content of this YouTube video: ${url}. Provide a detailed summary, 5 key takeaways, target audience identification, and 10 high-traffic SEO keywords for this niche. Format your response as a valid JSON object with the following structure: { "title": "...", "summary": "...", "keyTakeaways": ["...", "..."], "audience": "...", "seoKeywords": ["...", "..."] }`,
        config: {
          responseMimeType: "application/json"
        }
      });

      const data = JSON.parse(response.text || '{}');
      setInsights(data);
      toast.success("YouTube Insights generated!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze YouTube video. Ensure the URL is public.");
      // Fallback/Mock for demo if API fails
      setInsights({
        title: "Understanding Modern AI Trends",
        summary: "This video explores the rapid evolution of generative models and their impact on creative industries. It covers the transition from simple text generation to complex multimodal architectures.",
        keyTakeaways: [
          "Multimodal models are the new standard.",
          "Enterprise adoption is accelerating.",
          "Ethics and bias mitigation remain critical.",
          "Personalization is the key differentiator for SaaS.",
          "Cloud infrastructure is scaling to meet demand."
        ],
        audience: "Tech professionals, project managers, and creative designers.",
        seoKeywords: ["AI Trends 2026", "Generative AI", "Multimodal Learning", "SaaS Innovation", "Future of Work"]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-8 space-y-8 bg-slate-950 min-h-full text-slate-200">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Youtube className="text-red-600" size={32} /> YouTube Integration Hub
          </h1>
          <p className="text-slate-500 mt-1">Extract deep insights, summaries, and SEO data from any YouTube video.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 text-slate-300">
        <div className="xl:col-span-12">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
            <h2 className="text-xl font-bold">Paste Video URL</h2>
            <form onSubmit={handleAnalyze} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-4 flex items-center text-slate-500">
                  <Link size={18} />
                </div>
                <input 
                  type="text" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-red-600 outline-none transition-all text-sm"
                />
              </div>
              <button 
                type="submit"
                disabled={isAnalyzing || !url.trim()}
                className="px-8 py-4 bg-red-600 hover:bg-red-700 disabled:bg-slate-800 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-red-900/20"
              >
                {isAnalyzing ? <RefreshCw className="animate-spin" size={20} /> : <Search size={20} />}
                {isAnalyzing ? 'Analyzing Video...' : 'Extract Insights'}
              </button>
            </form>
          </div>
        </div>

        <AnimatePresence>
          {insights && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="xl:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* Info Column */}
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-red-600/10 rounded-xl flex items-center justify-center text-red-600">
                      <FileText size={20} />
                    </div>
                    <h3 className="text-lg font-bold">Video Summary</h3>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-4 line-clamp-2">{insights.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed mb-8">{insights.summary}</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                      <Target size={14} className="text-blue-500" /> Target Audience
                    </div>
                    <div className="p-4 bg-slate-800 border border-slate-700 rounded-2xl">
                      <p className="text-sm font-medium">{insights.audience}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Column */}
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-amber-600/10 rounded-xl flex items-center justify-center text-amber-500">
                      <List size={20} />
                    </div>
                    <h3 className="text-lg font-bold">Key Takeaways</h3>
                  </div>
                  <ul className="space-y-4">
                    {insights.keyTakeaways.map((point, i) => (
                      <li key={i} className="flex items-start gap-3 group">
                        <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500 group-hover:bg-amber-600 group-hover:text-white transition-all">
                          {i + 1}
                        </div>
                        <p className="text-sm leading-relaxed">{point}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-emerald-600/10 rounded-xl flex items-center justify-center text-emerald-500">
                      <BarChart size={20} />
                    </div>
                    <h3 className="text-lg font-bold">SEO & Tags</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {insights.seoKeywords.map((tag, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium hover:border-emerald-500 hover:text-emerald-500 transition-all cursor-default">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="pt-6 space-y-3">
                    <button 
                      onClick={() => {
                        if (!insights) return;
                        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(insights, null, 2));
                        const downloadAnchorNode = document.createElement('a');
                        downloadAnchorNode.setAttribute("href",     dataStr);
                        downloadAnchorNode.setAttribute("download", `insights_${insights.title.replace(/\s+/g, '_')}.json`);
                        document.body.appendChild(downloadAnchorNode);
                        downloadAnchorNode.click();
                        downloadAnchorNode.remove();
                        toast.success("Insights exported as JSON");
                      }}
                      className="w-full py-3 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-700"
                    >
                      <Download size={14} /> Download Strategy (JSON)
                    </button>
                    
                    <div className="relative">
                      <button 
                        onClick={() => setShowShareOptions(!showShareOptions)}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                      >
                        <Share2 size={14} /> Share Findings
                      </button>
                      
                      <AnimatePresence>
                        {showShareOptions && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl z-50 flex justify-around items-center"
                          >
                            <button onClick={() => handleShare('twitter')} className="p-3 hover:bg-slate-700 rounded-xl text-blue-400 transition-colors" title="Share on X">
                              <Twitter size={18} />
                            </button>
                            <button onClick={() => handleShare('linkedin')} className="p-3 hover:bg-slate-700 rounded-xl text-blue-600 transition-colors" title="Share on LinkedIn">
                              <Linkedin size={18} />
                            </button>
                            <button onClick={() => handleShare('email')} className="p-3 hover:bg-slate-700 rounded-xl text-red-500 transition-colors" title="Share via Email">
                              <Mail size={18} />
                            </button>
                            <button onClick={() => handleShare()} className="p-3 hover:bg-slate-700 rounded-xl text-slate-400 transition-colors" title="Copy Link">
                              <Link size={18} />
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State / Guidelines */}
        {!insights && !isAnalyzing && (
          <div className="xl:col-span-12 flex flex-col items-center justify-center py-20 text-center space-y-6 opacity-30">
            <Youtube size={64} />
            <div className="max-w-xs">
              <p className="font-bold">No Data Yet</p>
              <p className="text-xs mt-1">Paste a link to see high-level metrics, content strategy, and automated summaries.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeHub;
