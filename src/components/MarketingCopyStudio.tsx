import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Megaphone, 
  Target, 
  MessageSquare, 
  Zap, 
  Copy, 
  RefreshCw, 
  CheckCircle2,
  Share2,
  TrendingUp,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import { toast } from 'sonner';

const MarketingCopyStudio: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [goal, setGoal] = useState('Brand Awareness');
  const [platform, setPlatform] = useState('Instagram');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCopy, setGeneratedCopy] = useState<string | null>(null);

  const platforms = ['Instagram', 'LinkedIn', 'Twitter/X', 'Facebook Ad', 'Landing Page', 'Email Subject Line'];
  const goals = ['Brand Awareness', 'Lead Generation', 'Direct Sales', 'Event Traffic', 'Product Launch'];

  const handleGenerate = async () => {
    if (!productName.trim() || !targetAudience.trim()) return;
    setIsGenerating(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = 'gemini-3.1-pro-preview';
      
      const prompt = `
        As a world-class growth marketer and copywriter, generate high-converting marketing copy for:
        Product: ${productName}
        Target Audience: ${targetAudience}
        Goal: ${goal}
        Platform: ${platform}
        
        Requirements:
        - Use psychological triggers (scarcity, social proof, etc. where appropriate)
        - Format in Markdown with bold headers and bullet points
        - Include 3 variations: Hook-focused, Benefit-focused, and Story-focused.
        - Add a section for suggested hashtags or CTA buttons.
      `;

      const response = await ai.models.generateContent({
        model,
        contents: [{ parts: [{ text: prompt }] }]
      });

      setGeneratedCopy(response.text || '');
      toast.success("Marketing copy engineered!");
    } catch (error) {
      console.error(error);
      toast.error("Generation failed. Check your network or API limits.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedCopy) return;
    navigator.clipboard.writeText(generatedCopy);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="p-8 space-y-8 bg-slate-950 min-h-full text-slate-200">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Megaphone className="text-orange-500" /> Marketing Copy Studio
          </h1>
          <p className="text-slate-500 mt-1">Transform concepts into high-converting revenue engines.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles size={10} /> Product/Service Name
                </label>
                <input 
                  type="text" 
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g., MUBUS AI Builder"
                  className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  <Target size={10} /> Target Audience
                </label>
                <input 
                  type="text" 
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g., Early-stage startup founders"
                  className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Platform</label>
                  <select 
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full p-3 bg-slate-850 border border-slate-700 rounded-xl text-xs font-bold outline-none"
                  >
                    {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Campaign Goal</label>
                  <select 
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full p-3 bg-slate-850 border border-slate-700 rounded-xl text-xs font-bold outline-none"
                  >
                    {goals.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !productName.trim() || !targetAudience.trim()}
              className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-orange-900/20"
            >
              {isGenerating ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} />}
              {isGenerating ? 'Engineering Copy...' : 'Generate High-Conversion Copy'}
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-orange-500">
               <TrendingUp size={20} />
               <h4 className="font-bold text-sm">Growth Insights</h4>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-wider font-bold">
              AI-driven insights suggest that for {targetAudience}, focusing on "Efficiency" and "Automation" results in a 42% higher conversion rate.
            </p>
          </div>
        </div>

        <div className="xl:col-span-8 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl min-h-[600px] flex flex-col overflow-hidden relative">
            {generatedCopy ? (
              <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-emerald-500" size={18} />
                    <span className="text-xs font-bold text-slate-300">Copy Ready for Deployment</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={copyToClipboard}
                      className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 transition-colors"
                      title="Copy to Clipboard"
                    >
                      <Copy size={18} />
                    </button>
                    <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 transition-colors">
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="flex-1 p-8 overflow-y-auto markdown-body prose prose-invert max-w-none">
                  <Markdown>{generatedCopy}</Markdown>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-6">
                <div className="w-32 h-32 bg-slate-850 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-800 rotate-3">
                  <Megaphone className="text-slate-700 -rotate-12" size={64} />
                </div>
                <div className="max-w-xs space-y-2">
                  <h3 className="text-2xl font-black text-white">Copy Intelligence</h3>
                  <p className="text-sm text-slate-500">Configure your campaign parameters to generate copy that sells.</p>
                </div>
              </div>
            )}

            {isGenerating && (
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center">
                 <div className="text-center space-y-6">
                  <div className="relative w-20 h-20 mx-auto">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full"
                    />
                    <div className="absolute inset-4 bg-orange-500/20 rounded-full flex items-center justify-center">
                      <Zap className="text-orange-500" size={24} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-xl text-white">Applying Sales Psychology</p>
                    <p className="text-sm text-slate-400">Crafting irresistible hooks...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingCopyStudio;
