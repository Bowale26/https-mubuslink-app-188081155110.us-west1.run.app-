import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Layout, Sparkles, ArrowRight, RefreshCw, Eye, Download, Code, Copy, Check } from 'lucide-react';
import { exportWebsiteZip } from '../lib/exportUtils';
import VisualCanvasEditor from './VisualCanvasEditor';
import { GoogleGenAI, Type } from "@google/genai";

interface GeneratedWebsite {
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  features: Array<{
    title: string;
    description: string;
  }>;
  about: {
    title: string;
    content: string;
  };
}

import { FeatureGate } from './FeatureGate';

const WebsiteBuilder: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('Technology');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [brandColor, setBrandColor] = useState('blue');
  const [showCanvasEditor, setShowCanvasEditor] = useState(false);
  const [generatedData, setGeneratedData] = useState<GeneratedWebsite | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!businessName || !description) {
      alert('Please fill in the business name and description.');
      return;
    }
    
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Generate a website structure and copy for a business named "${businessName}" in the "${industry}" industry. 
      Description: ${description}. 
      Target Audience: ${targetAudience}. 
      Brand Color Focus: ${brandColor}. 
      Provide a hero section (title, subtitle, cta), 3 key features (title, description), and an about section (title, content).`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hero: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  subtitle: { type: Type.STRING },
                  cta: { type: Type.STRING }
                },
                required: ["title", "subtitle", "cta"]
              },
              features: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["title", "description"]
                }
              },
              about: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING }
                },
                required: ["title", "content"]
              }
            },
            required: ["hero", "features", "about"]
          }
        }
      });

      const data = JSON.parse(response.text);
      setGeneratedData(data);
      setStep(2);
    } catch (error) {
      console.error('Generation Error:', error);
      alert('Failed to generate website. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedData) return;
    navigator.clipboard.writeText(JSON.stringify(generatedData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    exportWebsiteZip({ businessName, industry, description });
  };

  return (
    <FeatureGate featureName="Website Builder">
      <div className="p-8 space-y-8 bg-slate-950 min-h-full text-slate-200">
      <header>
        <h1 className="text-3xl font-bold">AI Website Builder</h1>
        <p className="text-slate-500 mt-1">Generate a professional multi-page website in seconds.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-400 mb-2 block">Business Name</label>
              <input 
                type="text" 
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Acme SaaS" 
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400 mb-2 block">Industry</label>
              <select 
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                <option>Technology</option>
                <option>Retail</option>
                <option>Healthcare</option>
                <option>Education</option>
                <option>Real Estate</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400 mb-2 block">Business Description</label>
              <textarea 
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what your business does..." 
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-400 mb-2 block">Target Audience</label>
                <input 
                  type="text" 
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. Small Businesses" 
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-400 mb-2 block">Brand Color</label>
                <div className="flex gap-2">
                  <div 
                    onClick={() => setBrandColor('blue')}
                    className={`w-12 h-12 rounded-xl bg-blue-600 cursor-pointer border-2 transition-all ${brandColor === 'blue' ? 'border-white scale-110' : 'border-transparent opacity-50'}`} 
                  />
                  <div 
                    onClick={() => setBrandColor('emerald')}
                    className={`w-12 h-12 rounded-xl bg-emerald-600 cursor-pointer border-2 transition-all ${brandColor === 'emerald' ? 'border-white scale-110' : 'border-transparent opacity-50'}`} 
                  />
                  <div 
                    onClick={() => setBrandColor('purple')}
                    className={`w-12 h-12 rounded-xl bg-purple-600 cursor-pointer border-2 transition-all ${brandColor === 'purple' ? 'border-white scale-110' : 'border-transparent opacity-50'}`} 
                  />
                  <div 
                    onClick={() => setBrandColor('amber')}
                    className={`w-12 h-12 rounded-xl bg-amber-600 cursor-pointer border-2 transition-all ${brandColor === 'amber' ? 'border-white scale-110' : 'border-transparent opacity-50'}`} 
                  />
                </div>
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
                Generating Site Structure...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Website
              </>
            )}
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden relative min-h-[500px] flex flex-col">
          <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-amber-500/50" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
            </div>
            <div className="px-3 py-1 bg-slate-800 rounded-lg text-[10px] font-mono text-slate-500">
              preview.mubuslink.ai
            </div>
            <Eye size={16} className="text-slate-500" />
          </div>
          
          <div className="flex-1 flex items-center justify-center p-12 text-center">
            {step === 1 ? (
              <div className="space-y-4 max-w-xs">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-600">
                  <Layout size={32} />
                </div>
                <h3 className="text-lg font-bold">Your Preview Awaits</h3>
                <p className="text-sm text-slate-500">Fill in the details on the left to generate your AI-powered website structure.</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full space-y-6 p-6 text-left"
              >
                {generatedData && (
                  <>
                    <div className="space-y-2 text-center">
                      <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Inter' }}>{generatedData.hero.title}</h2>
                      <p className="text-slate-400 text-sm">{generatedData.hero.subtitle}</p>
                      <button className={`px-4 py-2 rounded-lg text-xs font-bold mt-2 ${
                        brandColor === 'blue' ? 'bg-blue-600' :
                        brandColor === 'emerald' ? 'bg-emerald-600' :
                        brandColor === 'purple' ? 'bg-purple-600' : 'bg-amber-600'
                      }`}>
                        {generatedData.hero.cta}
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {generatedData.features.map((feature, i) => (
                        <div key={i} className="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-1">
                          <h4 className="text-xs font-bold text-blue-400">{feature.title}</h4>
                          <p className="text-[10px] text-slate-500 leading-tight">{feature.description}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-2">
                      <h4 className="text-sm font-bold text-white">{generatedData.about.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{generatedData.about.content}</p>
                    </div>
                  </>
                )}

                <div className="flex justify-center gap-3 pt-4">
                  <button 
                    onClick={() => setShowCanvasEditor(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-bold flex items-center gap-2 transition-all"
                  >
                    <Code size={14} /> Edit in Canvas
                  </button>
                  <button 
                    onClick={handleCopy}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold flex items-center gap-2 transition-all"
                  >
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    {copied ? 'Copied' : 'Copy Content'}
                  </button>
                  <button 
                    onClick={handleExport}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-xs font-bold flex items-center gap-2 transition-all"
                  >
                    <Download size={14} /> Export
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {showCanvasEditor && (
        <VisualCanvasEditor 
          onClose={() => setShowCanvasEditor(false)} 
          initialData={{ businessName, industry, description }}
        />
      )}
      </div>
    </FeatureGate>
  );
};

export default WebsiteBuilder;
