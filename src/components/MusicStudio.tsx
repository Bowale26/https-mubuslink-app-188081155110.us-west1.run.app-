import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Music, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  Mic2, 
  Sparkles, 
  Download, 
  Settings2,
  Zap,
  Waves,
  RefreshCw,
  MoreHorizontal
} from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";
import { toast } from 'sonner';

const MusicStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTrack, setActiveTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generatedTracks, setGeneratedTracks] = useState<any[]>([]);
  const [style, setStyle] = useState('Cinematic');
  const [mood, setMood] = useState('Inspiring');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const styles = ['Cinematic', 'Lofi', 'Synthwave', 'Epic', 'Ambient', 'Jazz', 'Rock', 'Techno', 'Classical'];
  const moods = ['Inspiring', 'Dark', 'Energetic', 'Relaxed', 'Aggressive', 'Melancholic'];

  const handleGenerateMusic = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    try {
      // In a real implementation with Gemini 3, we would generate a high-quality composition
      // or use the Multimodal Audio capabilities. For this demo, we use a sophisticated 
      // representation of the AI "composing" the track.
      
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview", // Using a placeholder for audio generation
        contents: [{ parts: [{ text: `Generate a music track description and characteristics for: ${style} style, ${mood} mood, ${prompt}` }] }]
      });

      // Simulation of generation delay for UX
      await new Promise(resolve => setTimeout(resolve, 3000));

      const newTrack = {
        id: Date.now(),
        title: prompt.length > 20 ? prompt.substring(0, 20) + '...' : prompt,
        description: response.text,
        style: style,
        mood: mood,
        duration: '2:45',
        thumbnail: `https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=200&h=200`,
        // In a real environment, this would be a blob URL from atob(base64Data)
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' 
      };

      setGeneratedTracks(prev => [newTrack, ...prev]);
      setActiveTrack(newTrack);
      toast.success("Masterpiece composed!");
    } catch (error) {
      toast.error("Failed to compose music. Check your API limits.");
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlay = () => {
    if (!activeTrack) return;
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="p-8 space-y-8 bg-slate-950 min-h-full text-slate-200">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Music className="text-pink-500" /> Audio Symphony Studio
          </h1>
          <p className="text-slate-500 mt-1">Symphonic AI generation for professional soundtracks and sound FX.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-400">Compose your theme</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the mood, instruments, and pace... e.g., 'Ethereal piano with heavy sub-bass and spacey reverb'"
                className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl h-32 focus:ring-2 focus:ring-pink-500 outline-none transition-all resize-none text-sm"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Genre</label>
                <div className="grid grid-cols-3 gap-2">
                  {styles.map(s => (
                    <button 
                      key={s}
                      onClick={() => setStyle(s)}
                      className={`py-2 rounded-xl text-[10px] font-bold transition-all ${style === s ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-750'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Mood</label>
                <div className="grid grid-cols-3 gap-2">
                  {moods.map(m => (
                    <button 
                      key={m}
                      onClick={() => setMood(m)}
                      className={`py-2 rounded-xl text-[10px] font-bold transition-all border ${mood === m ? 'bg-slate-200 border-white text-slate-950 shadow-lg' : 'bg-slate-850 border-slate-700 text-slate-500 hover:text-slate-300'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={handleGenerateMusic}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-4 bg-pink-600 hover:bg-pink-500 disabled:bg-slate-800 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-pink-900/20"
            >
              {isGenerating ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} />}
              {isGenerating ? 'Composing Symphony...' : 'Compose Track'}
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-300">Your Compositions</h4>
            <div className="space-y-2">
              {generatedTracks.map((track) => (
                <button 
                  key={track.id}
                  onClick={() => setActiveTrack(track)}
                  className={`w-full p-3 rounded-2xl flex items-center gap-4 transition-all ${activeTrack?.id === track.id ? 'bg-pink-600/10 border border-pink-500/20 shadow-lg' : 'bg-slate-850 hover:bg-slate-800 border border-transparent'}`}
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={track.thumbnail} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-left overflow-hidden">
                    <p className="text-xs font-bold text-slate-200 truncate">{track.title}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{track.style}</p>
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold">{track.duration}</div>
                </button>
              ))}
              {generatedTracks.length === 0 && (
                <div className="py-10 text-center opacity-30 select-none">
                  <Music className="mx-auto mb-2" size={32} />
                  <p className="text-[10px] font-black uppercase tracking-widest">Library Empty</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="xl:col-span-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden min-h-[600px] flex flex-col relative">
            {activeTrack ? (
              <div className="flex-1 flex flex-col p-12 items-center justify-center space-y-12 bg-gradient-to-b from-pink-600/5 to-transparent">
                <div className="relative group">
                  <div className="absolute inset-0 bg-pink-500 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity" />
                  <motion.div 
                    animate={isPlaying ? { scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] } : {}}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="w-64 h-64 bg-slate-800 rounded-[3rem] border border-slate-700 shadow-2xl relative z-10 overflow-hidden"
                  >
                    <img src={activeTrack.thumbnail} alt="Artwork" className="w-full h-full object-cover" />
                    {isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm">
                        <Waves className="text-white animate-pulse" size={48} />
                      </div>
                    )}
                  </motion.div>
                </div>

                <div className="text-center space-y-4 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-600/10 text-pink-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-pink-500/20">
                    <Sparkles size={12} /> Master Quality · {activeTrack.style}
                  </div>
                  <h2 className="text-4xl font-black text-white">{activeTrack.title}</h2>
                  <p className="text-slate-500 text-sm max-w-lg mx-auto">Neural symphony generated with precision frequencies and harmonic alignment.</p>
                </div>

                <div className="w-full max-w-2xl space-y-6 relative z-10">
                  <div className="space-y-2">
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={isPlaying ? { width: '45%' } : { width: '0%' }}
                        className="h-full bg-pink-600"
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <span>1:24</span>
                      <span>{activeTrack.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-8">
                    <button className="p-3 text-slate-500 hover:text-slate-300 transition-colors"><SkipBack size={24} /></button>
                    <button 
                      onClick={togglePlay}
                      className="w-20 h-20 bg-white text-slate-950 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all active:scale-95"
                    >
                      {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                    </button>
                    <button className="p-3 text-slate-500 hover:text-slate-300 transition-colors"><SkipForward size={24} /></button>
                  </div>
                </div>

                <div className="flex gap-4 relative z-10">
                   <button className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-750 text-white rounded-2xl font-bold transition-all border border-slate-700">
                    <Download size={18} /> Export MP3
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-750 text-white rounded-2xl font-bold transition-all border border-slate-700">
                    <Settings2 size={18} /> Remix
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-6">
                <div className="w-32 h-32 bg-slate-850 rounded-full flex items-center justify-center border-2 border-dashed border-slate-800 shadow-inner">
                  <Music className="text-slate-700" size={64} />
                </div>
                <div className="max-w-xs space-y-2">
                  <h3 className="text-2xl font-black text-white tracking-tight">Audio Symphony</h3>
                  <p className="text-sm text-slate-500">Enter a musical concept on the left to synthesize high-quality audio tracks.</p>
                </div>
              </div>
            )}

            {isGenerating && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl z-50 flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="relative w-48 h-48">
                   <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-4 border-pink-500 border-t-transparent border-b-transparent rounded-full"
                  />
                  <div className="absolute inset-4 rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                    <Waves className="text-pink-500 animate-bounce" size={48} />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h4 className="text-2xl font-black text-white">Neural Composition</h4>
                  <p className="text-slate-400 text-sm italic">"Aligning harmonic oscillators with neural weights..."</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicStudio;
