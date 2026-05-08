import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Languages, Check, RefreshCw, AlertCircle, Search, Settings, Shield, Zap, FileText, Sparkles } from 'lucide-react';
import { translateContent, TranslationResult } from '../services/translationService';
import { toast } from 'sonner';

interface MultilingualAIProps {
  onNavigate?: (tab: string) => void;
}

const MultilingualAI: React.FC<MultilingualAIProps> = ({ onNavigate }) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedLangs, setSelectedLangs] = useState(['Spanish', 'French']);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<TranslationResult[]>([]);
  
  // Settings State
  const [settings, setSettings] = useState({
    autoTranslate: true,
    seoMetaTranslation: true,
    audioVideoTranscription: false,
    neuralQuality: true
  });

  const languages = [
    'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
    'Chinese', 'Japanese', 'Arabic', 'Hindi', 'Russian',
    'Korean', 'Dutch', 'Turkish', 'Vietnamese', 'Polish'
  ];

  const filteredLanguages = languages.filter(lang => 
    lang.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTranslate = async () => {
    if (selectedLangs.length === 0) {
      toast.error("Please select at least one target language.");
      return;
    }

    setIsTranslating(true);
    try {
      // In a real app, this would be the current page content
      const sampleContent = "Welcome to MUBUSLINK AI. We provide the ultimate SaaS dashboard for modern builders and writers. Our platform empowers you to create, manage, and scale your digital presence with ease.";
      
      const translationResults = await translateContent(
        sampleContent, 
        selectedLangs, 
        settings.seoMetaTranslation
      );
      
      setResults(translationResults);
      toast.success(`Successfully translated into ${selectedLangs.length} languages!`);
    } catch (error) {
      console.error("Translation failed:", error);
      toast.error("Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  const toggleLang = (lang: string) => {
    if (selectedLangs.includes(lang)) {
      setSelectedLangs(selectedLangs.filter(l => l !== lang));
    } else {
      setSelectedLangs([...selectedLangs, lang]);
    }
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    toast.info(`${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} ${!settings[key] ? 'Enabled' : 'Disabled'}`);
  };

  return (
    <div className="p-8 space-y-8 bg-slate-950 min-h-full text-slate-200">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Globe className="text-blue-500" size={32} />
            Multilingual AI System
          </h1>
          <p className="text-slate-500 mt-1">Globalize your digital presence with neural machine translation.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
          <Shield className="text-blue-500" size={16} />
          <span className="text-xs font-bold text-blue-200 uppercase tracking-widest">Enterprise Grade</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Languages className="text-blue-500" size={24} /> Target Languages
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Search languages..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {filteredLanguages.map(lang => (
                <button
                  key={lang}
                  onClick={() => toggleLang(lang)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    selectedLangs.includes(lang)
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/20'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {selectedLangs.includes(lang) && <Check size={12} />}
                  {lang}
                </button>
              ))}
            </div>

            <div className="p-6 bg-blue-900/10 border border-blue-500/20 rounded-2xl flex items-start gap-4">
              <AlertCircle className="text-blue-500 shrink-0" size={20} />
              <div>
                <h4 className="text-sm font-bold text-blue-100">AI-Powered Translation</h4>
                <p className="text-xs text-blue-200/60 mt-1 leading-relaxed">
                  Our system uses advanced neural machine translation to ensure context-aware and culturally 
                  relevant translations. You can manually review and edit any translated content later.
                </p>
              </div>
            </div>

            <button 
              onClick={handleTranslate}
              disabled={isTranslating || selectedLangs.length === 0}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20 active:scale-[0.98]"
            >
              {isTranslating ? (
                <>
                  <RefreshCw className="animate-spin" size={20} />
                  Translating {selectedLangs.length} Languages...
                </>
              ) : (
                <>
                  <Globe size={20} />
                  Start Global Translation
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <RefreshCw size={20} className="text-slate-400" />
              Translation Status & Results
            </h2>
            <div className="space-y-4">
              {selectedLangs.map(lang => {
                const result = results.find(r => r.language === lang);
                return (
                  <div key={lang} className="p-6 bg-slate-800/50 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-xs font-bold border border-slate-700">
                          {lang.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{lang}</p>
                          <p className="text-[10px] text-slate-500">
                            {result ? 'Last updated: Just now' : 'Last updated: Never'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-400">{result ? '100%' : '0%'}</p>
                          <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden mt-1">
                            <div className={`h-full transition-all duration-1000 ${result ? 'w-full bg-emerald-500' : 'w-0 bg-blue-500'}`} />
                          </div>
                        </div>
                        <button className="text-xs text-blue-500 hover:underline font-bold">Edit</button>
                      </div>
                    </div>
                    
                    {result && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="pt-4 border-t border-slate-700 space-y-4"
                      >
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Translated Content</p>
                          <p className="text-sm text-slate-300 leading-relaxed italic">"{result.content}"</p>
                        </div>
                        
                        {result.seoMeta && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                            <div className="space-y-1">
                              <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">SEO Title</p>
                              <p className="text-xs text-slate-400 truncate">{result.seoMeta.title}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">SEO Keywords</p>
                              <p className="text-xs text-slate-400 truncate">{result.seoMeta.keywords.join(', ')}</p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-8 shadow-xl">
            <div className="flex items-center gap-3">
              <Settings className="text-slate-400" size={20} />
              <h3 className="font-bold">Translation Settings</h3>
            </div>
            
            <div className="space-y-6">
              {[
                { id: 'autoTranslate', label: 'Auto-Translate New Pages', icon: Zap },
                { id: 'seoMetaTranslation', label: 'SEO Meta Translation', icon: Search },
                { id: 'audioVideoTranscription', label: 'Audio/Video Transcription', icon: RefreshCw },
                { id: 'neuralQuality', label: 'Neural Quality Boost', icon: Sparkles }
              ].map((setting) => (
                <div key={setting.id} className="space-y-3">
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <setting.icon size={16} className="text-slate-500 group-hover:text-blue-500 transition-colors" />
                      <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">{setting.label}</span>
                    </div>
                    <button 
                      onClick={() => toggleSetting(setting.id as keyof typeof settings)}
                      className={`w-12 h-6 rounded-full relative transition-colors ${settings[setting.id as keyof typeof settings] ? 'bg-blue-600' : 'bg-slate-800'}`}
                    >
                      <motion.div 
                        animate={{ x: settings[setting.id as keyof typeof settings] ? 24 : 4 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                      />
                    </button>
                  </div>
                  {setting.id === 'audioVideoTranscription' && settings.audioVideoTranscription && (
                    <motion.button
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      onClick={() => onNavigate?.('transcription')}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-bold text-blue-400 flex items-center justify-center gap-2 border border-blue-500/20"
                    >
                      <RefreshCw size={12} />
                      Go to Transcription Studio
                    </motion.button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <Zap size={18} />
              Global Reach
            </h3>
            <p className="text-xs text-indigo-100 opacity-80 leading-relaxed">
              Your website is currently accessible to 1.2 billion people. With the selected languages, 
              you'll reach an additional 2.8 billion potential customers.
            </p>
            <div className="mt-6 flex -space-x-2">
              {['ES', 'FR', 'DE', 'ZH', 'JA'].map((code, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-slate-800 flex items-center justify-center text-[10px] font-bold shadow-lg">
                  {code}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4 shadow-xl">
            <h3 className="font-bold flex items-center gap-2">
              <FileText className="text-blue-500" size={18} />
              Translation History
            </h3>
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl border border-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-[10px] font-bold">
                      DOC
                    </div>
                    <span className="text-xs text-slate-400">index_v{i}.json</span>
                  </div>
                  <span className="text-[10px] text-slate-600">2h ago</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultilingualAI;
