import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Type, 
  Play, 
  MousePointer2, 
  Settings2, 
  Check, 
  Sparkles,
  Loader2,
  CheckCircle2,
  RefreshCw,
  Search,
  X,
  ChevronRight,
  Layout,
  CreditCard,
  Square
} from 'lucide-react';

const FontsAnimations: React.FC = () => {
  const [selectedFont, setSelectedFont] = useState('Inter');
  const [selectedAnimation, setSelectedAnimation] = useState('Fade In');
  const [lineHeight, setLineHeight] = useState(1.5);
  const [letterSpacing, setLetterSpacing] = useState(-0.02);
  const [fontWeight, setFontWeight] = useState(700);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');
  
  // New States
  const [isFontModalOpen, setIsFontModalOpen] = useState(false);
  const [fontSearch, setFontSearch] = useState('');
  const [previewMode, setPreviewMode] = useState<'hero' | 'card' | 'button'>('hero');
  const [animDuration, setAnimDuration] = useState(0.5);
  const [animEasing, setAnimEasing] = useState('spring');

  const fonts = [
    'Inter', 
    'Plus Jakarta Sans', 
    'Space Grotesk', 
    'Playfair Display', 
    'JetBrains Mono', 
    'Outfit',
    'Montserrat',
    'Libre Baskerville',
    'Cormorant Garamond'
  ];
  
  const animations = ['Fade In', 'Slide Up', 'Zoom In', 'Bounce', 'Rotate', 'Slam In'];

  const presets = [
    { name: 'H1 - Display', weight: 800, leading: 1.1, tracking: -0.04 },
    { name: 'H2 - Section', weight: 700, leading: 1.2, tracking: -0.02 },
    { name: 'Body - Regular', weight: 400, leading: 1.6, tracking: 0 },
    { name: 'Button - Label', weight: 600, leading: 1, tracking: 0.05 },
  ];

  const allGoogleFonts = [
    'Inter', 'Plus Jakarta Sans', 'Space Grotesk', 'Playfair Display', 
    'JetBrains Mono', 'Outfit', 'Montserrat', 'Libre Baskerville', 
    'Cormorant Garamond', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 
    'Raleway', 'Ubuntu', 'Merriweather', 'Oswald', 'Quicksand'
  ];

  const filteredFonts = allGoogleFonts.filter(f => 
    f.toLowerCase().includes(fontSearch.toLowerCase())
  );

  // Dynamically load Google Fonts
  useEffect(() => {
    const fontId = 'google-fonts-preview';
    let link = document.getElementById(fontId) as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    const fontQuery = allGoogleFonts.map(f => f.replace(/ /g, '+')).join('|');
    link.href = `https://fonts.googleapis.com/css2?family=${fontQuery}:wght@400;500;600;700;800&display=swap`;
  }, []);

  const handleApplyStyles = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1500);
  };

  const applyPreset = (preset: typeof presets[0]) => {
    setFontWeight(preset.weight);
    setLineHeight(preset.leading);
    setLetterSpacing(preset.tracking);
  };

  return (
    <div className="p-8 space-y-8 bg-slate-950 min-h-full text-slate-200">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Fonts & Animations</h1>
          <p className="text-slate-500 mt-1">Customize your site's global typography and motion system.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-400">
          <RefreshCw size={14} className="text-blue-500" /> Auto-Sync Enabled
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Type className="text-blue-500" size={24} /> Typography
              </h2>
              <button 
                onClick={() => setIsFontModalOpen(true)}
                className="text-xs text-blue-500 hover:underline font-bold uppercase tracking-wider flex items-center gap-1"
              >
                <Search size={12} /> Browse Google Fonts
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {fonts.slice(0, 6).map(font => (
                <button
                  key={font}
                  onClick={() => setSelectedFont(font)}
                  className={`p-4 rounded-2xl border text-left transition-all group ${
                    selectedFont === font 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/20' 
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <p className="text-[10px] opacity-60 mb-2 uppercase font-bold tracking-widest">Heading Font</p>
                  <p className="text-lg font-bold truncate" style={{ fontFamily: font }}>{font}</p>
                </button>
              ))}
            </div>

            <div className="p-8 bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden group">
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                  <button 
                    onClick={() => setPreviewMode('hero')}
                    className={`p-1.5 rounded-md transition-colors ${previewMode === 'hero' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <Layout size={14} />
                  </button>
                  <button 
                    onClick={() => setPreviewMode('card')}
                    className={`p-1.5 rounded-md transition-colors ${previewMode === 'card' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <CreditCard size={14} />
                  </button>
                  <button 
                    onClick={() => setPreviewMode('button')}
                    className={`p-1.5 rounded-md transition-colors ${previewMode === 'button' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <Square size={14} />
                  </button>
                </div>
                <span className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full text-[10px] font-bold uppercase">Live Preview</span>
              </div>
              <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-6 font-bold">Preview Canvas</p>
              
              <AnimatePresence mode="wait">
                {previewMode === 'hero' && (
                  <motion.div
                    key="hero"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h3 
                      className="text-5xl font-bold mb-6 transition-all duration-300" 
                      style={{ 
                        fontFamily: selectedFont,
                        lineHeight: lineHeight,
                        letterSpacing: `${letterSpacing}em`,
                        fontWeight: fontWeight
                      }}
                    >
                      The future of web design is here.
                    </h3>
                    <p className="text-slate-400 leading-relaxed max-w-xl text-lg">
                      Experience the most advanced AI-powered website builder. Create, customize, and deploy 
                      with unprecedented speed and precision.
                    </p>
                  </motion.div>
                )}

                {previewMode === 'card' && (
                  <motion.div
                    key="card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="max-w-sm bg-slate-900 border border-slate-800 p-6 rounded-2xl"
                  >
                    <div className="w-full h-32 bg-slate-800 rounded-xl mb-4" />
                    <h3 
                      className="text-2xl font-bold mb-2" 
                      style={{ 
                        fontFamily: selectedFont,
                        lineHeight: lineHeight,
                        letterSpacing: `${letterSpacing}em`,
                        fontWeight: fontWeight
                      }}
                    >
                      Feature Title
                    </h3>
                    <p className="text-slate-400 text-sm">
                      This is how your typography looks in a standard content card component.
                    </p>
                  </motion.div>
                )}

                {previewMode === 'button' && (
                  <motion.div
                    key="button"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex justify-center"
                  >
                    <button 
                      className="px-8 py-4 bg-blue-600 text-white rounded-xl shadow-xl shadow-blue-900/20"
                      style={{ 
                        fontFamily: selectedFont,
                        letterSpacing: `${letterSpacing}em`,
                        fontWeight: fontWeight
                      }}
                    >
                      Get Started Now
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Play className="text-purple-500" size={24} /> Motion System
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Duration</span>
                  <input 
                    type="range" min="0.1" max="2" step="0.1" 
                    value={animDuration} onChange={(e) => setAnimDuration(parseFloat(e.target.value))}
                    className="w-16 h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-purple-500"
                  />
                </div>
                <select 
                  value={animEasing}
                  onChange={(e) => setAnimEasing(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-400 outline-none"
                >
                  <option value="spring">Spring</option>
                  <option value="linear">Linear</option>
                  <option value="easeIn">Ease In</option>
                  <option value="easeOut">Ease Out</option>
                  <option value="easeInOut">Ease In Out</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {animations.map(anim => (
                <button
                  key={anim}
                  onClick={() => setSelectedAnimation(anim)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedAnimation === anim 
                      ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-900/20' 
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <p className="text-[10px] opacity-60 mb-2 uppercase font-bold tracking-widest">Entrance Effect</p>
                  <p className="text-lg font-bold truncate">{anim}</p>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center p-16 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative">
              <div className="absolute top-4 left-4 text-[10px] text-slate-600 uppercase tracking-widest font-bold">Animation Preview</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedAnimation}
                  initial={
                    selectedAnimation === 'Fade In' ? { opacity: 0 } :
                    selectedAnimation === 'Slide Up' ? { opacity: 0, y: 50 } :
                    selectedAnimation === 'Zoom In' ? { opacity: 0, scale: 0.5 } :
                    selectedAnimation === 'Bounce' ? { y: -100 } :
                    selectedAnimation === 'Rotate' ? { opacity: 0, rotate: -180 } :
                    { scale: 2, opacity: 0 }
                  }
                  animate={
                    selectedAnimation === 'Bounce' ? { y: [0, -20, 0] } :
                    { opacity: 1, y: 0, scale: 1, rotate: 0 }
                  }
                  transition={
                    selectedAnimation === 'Bounce' ? { repeat: Infinity, duration: animDuration } :
                    { 
                      duration: animDuration, 
                      type: animEasing === 'spring' ? 'spring' : 'tween', 
                      ease: animEasing !== 'spring' ? (animEasing as any) : undefined 
                    }
                  }
                  className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl shadow-2xl flex items-center justify-center"
                >
                  <Sparkles className="text-white" size={48} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6 shadow-xl">
            <h3 className="font-bold flex items-center gap-2">
              <Settings2 size={18} className="text-blue-500" /> Global Styles
            </h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Heading Weight</span>
                  <span className="text-xs font-bold text-blue-400">{fontWeight}</span>
                </div>
                <input 
                  type="range" 
                  min="400" 
                  max="900" 
                  step="100"
                  value={fontWeight}
                  onChange={(e) => setFontWeight(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-500"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Line Height</span>
                  <span className="text-xs font-bold text-blue-400">{lineHeight}</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="2" 
                  step="0.1"
                  value={lineHeight}
                  onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Letter Spacing</span>
                  <span className="text-xs font-bold text-blue-400">{letterSpacing}em</span>
                </div>
                <input 
                  type="range" 
                  min="-0.1" 
                  max="0.2" 
                  step="0.01"
                  value={letterSpacing}
                  onChange={(e) => setLetterSpacing(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </div>
            <button 
              onClick={handleApplyStyles}
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
              {saveStatus === 'saving' ? 'Applying...' : saveStatus === 'success' ? 'Styles Applied' : 'Apply to All Pages'}
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <h3 className="font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check size={18} className="text-emerald-500" /> Active Presets
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Click to Apply</span>
            </h3>
            <div className="space-y-2">
              {presets.map(preset => (
                <button 
                  key={preset.name} 
                  onClick={() => applyPreset(preset)}
                  className="w-full flex items-center justify-between p-3 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors group"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-200">{preset.name}</span>
                  <ChevronRight size={12} className="text-slate-600 group-hover:text-blue-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Font Browser Modal */}
      <AnimatePresence>
        {isFontModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFontModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-bottom border-slate-800 flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Search size={20} className="text-blue-500" /> Browse Google Fonts
                </h3>
                <button 
                  onClick={() => setIsFontModalOpen(false)}
                  className="p-2 hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="text"
                    placeholder="Search fonts..."
                    value={fontSearch}
                    onChange={(e) => setFontSearch(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredFonts.map(font => (
                    <button
                      key={font}
                      onClick={() => {
                        setSelectedFont(font);
                        setIsFontModalOpen(false);
                      }}
                      className="p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl text-left transition-all group"
                    >
                      <p className="text-lg font-bold" style={{ fontFamily: font }}>{font}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Preview Text</p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FontsAnimations;
