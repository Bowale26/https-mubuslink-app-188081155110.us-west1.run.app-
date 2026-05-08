import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PenTool, Sparkles, FileText, Mail, Share2, Hash, RefreshCw, Check, Download } from 'lucide-react';

const ContentWriter: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentType, setContentType] = useState('Blog Post');
  const [generatedContent, setGeneratedContent] = useState('');

  const contentTypes = [
    { name: 'Blog Post', icon: FileText },
    { name: 'Landing Page', icon: Sparkles },
    { name: 'Email Sequence', icon: Mail },
    { name: 'Social Media', icon: Share2 },
    { name: 'Meta Data', icon: Hash },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedContent("This is a preview of the AI-generated content based on your topic. In a production environment, this would be a full, SEO-optimized article or copy tailored to your target audience and tone of voice.");
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="p-8 space-y-8 bg-slate-950 min-h-full text-slate-200">
      <header>
        <h1 className="text-3xl font-bold">AI Content Writer</h1>
        <p className="text-slate-500 mt-1">Generate high-converting copy and SEO-optimized articles.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-6">
            <h3 className="font-bold">Content Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-2 block">Content Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {contentTypes.map(type => (
                    <button
                      key={type.name}
                      onClick={() => setContentType(type.name)}
                      className={`p-3 rounded-xl border text-[10px] font-bold transition-all flex items-center gap-2 ${
                        contentType === type.name 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <type.icon size={14} />
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 mb-2 block">Topic or Keywords</label>
                <input 
                  type="text" 
                  placeholder="e.g. Benefits of AI in SaaS" 
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-2 block">Word Count</label>
                  <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm outline-none">
                    <option>~500 words</option>
                    <option>~1000 words</option>
                    <option>~2000 words</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-2 block">Tone</label>
                  <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm outline-none">
                    <option>Professional</option>
                    <option>Witty</option>
                    <option>Persuasive</option>
                    <option>Educational</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="animate-spin" size={20} />
                  Writing...
                </>
              ) : (
                <>
                  <PenTool size={20} />
                  Generate Content
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
            <h3 className="font-bold">SEO Score</h3>
            <div className="flex items-center justify-center py-6">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path className="text-slate-800" strokeDasharray="100, 100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-blue-500" strokeDasharray="85, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">85</span>
                  <span className="text-[8px] text-slate-500 uppercase font-bold">Excellent</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Keyword Density</span>
                <Check size={12} className="text-emerald-500" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Readability</span>
                <Check size={12} className="text-emerald-500" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Meta Tags</span>
                <Check size={12} className="text-emerald-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col min-h-[600px]">
            <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
                  <FileText className="text-blue-500" size={20} />
                </div>
                <h3 className="font-bold">{contentType} Draft</h3>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400"><Download size={18} /></button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold transition-all">Copy to Editor</button>
              </div>
            </div>
            <div className="flex-1 p-8 overflow-y-auto">
              {generatedContent ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="prose prose-invert max-w-none"
                >
                  <p className="text-lg leading-relaxed text-slate-300">{generatedContent}</p>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                  <PenTool size={48} />
                  <p className="text-sm">Configure your content and click generate to see the magic.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentWriter;
