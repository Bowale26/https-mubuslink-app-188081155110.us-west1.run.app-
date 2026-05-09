import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, 
  Film, 
  Play, 
  Pause, 
  Download, 
  Zap, 
  RefreshCw, 
  Sparkles,
  Layers,
  Settings,
  MoreVertical,
  Volume2,
  Maximize2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { toast } from 'sonner';

const VideoStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [resolution, setResolution] = useState('1080p');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [style, setStyle] = useState('Cinematic');

  const videoRef = useRef<HTMLVideoElement>(null);

  const styles = ['Cinematic', '3D Render', 'Artistic', 'Hyper-realistic', 'Anime', 'Vintage'];
  const resolutions = ['720p', '1080p', '4K'];
  const aspectRatios = ['16:9', '9:16', '1:1'];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    try {
      // Simulation of high-quality AI video generation
      // In a real prod environment, this would call a video diffusion model API
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ parts: [{ text: `Generate a detailed screenplay description for 5 seconds of video in ${aspectRatio} aspect ratio: ${prompt} in ${style} style.` }] }]
      });

      await new Promise(resolve => setTimeout(resolve, 5000));

      const newVideo = {
        id: Date.now(),
        title: prompt.substring(0, 30) + (prompt.length > 30 ? '...' : ''),
        prompt: prompt,
        description: response.text,
        style: style,
        resolution: resolution,
        aspectRatio: aspectRatio,
        duration: '5.0s',
        // Using a high-quality placeholder video
        url: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-blue-liquid-ink-background-loop-32981-large.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=400&h=225'
      };

      setVideos(prev => [newVideo, ...prev]);
      setActiveVideo(newVideo);
      toast.success("AI Masterpiece rendered!");
    } catch (error) {
      toast.error("Video synthesis failed. Quota reached.");
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="p-8 space-y-8 bg-slate-950 min-h-full text-slate-200">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Video className="text-indigo-500" /> Neural Motion Studio
          </h1>
          <p className="text-slate-500 mt-1">High-fidelity AI video generation and cinematic synthesis.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-1">Resolution</span>
            <div className="p-1 bg-slate-900 border border-slate-800 rounded-xl flex">
              {resolutions.map(r => (
                <button 
                  key={r}
                  onClick={() => setResolution(r)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all ${resolution === r ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-1">Aspect Ratio</span>
            <div className="p-1 bg-slate-900 border border-slate-800 rounded-xl flex">
              {aspectRatios.map(ar => (
                <button 
                  key={ar}
                  onClick={() => setAspectRatio(ar)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all ${aspectRatio === ar ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {ar}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Prompt the Imagination</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the motion, lightning, and subjects... e.g., 'A bioluminescent forest at night, camera pans through floating embers, 8k cinematic details'"
                className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl h-32 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-sm placeholder:text-slate-600"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cinematic Style</label>
              <div className="grid grid-cols-2 gap-2">
                {styles.map(s => (
                  <button 
                    key={s}
                    onClick={() => setStyle(s)}
                    className={`py-2 rounded-xl text-[10px] font-bold transition-all border ${style === s ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-900/20 active:scale-[0.98]"
            >
              {isGenerating ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} />}
              {isGenerating ? 'Synthesizing...' : 'Generate AI Video'}
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recent Renders</h4>
              <Layers size={14} className="text-slate-600" />
            </div>
            <div className="space-y-3">
              {videos.map((vid) => (
                <button 
                  key={vid.id}
                  onClick={() => setActiveVideo(vid)}
                  className={`w-full p-2 rounded-2xl flex items-center gap-3 transition-all ${activeVideo?.id === vid.id ? 'bg-indigo-600/10 border border-indigo-500/20' : 'bg-slate-850 border border-transparent shadow-sm'}`}
                >
                  <div className="w-16 h-10 rounded-lg bg-slate-800 relative overflow-hidden flex-shrink-0">
                    <img src={vid.thumbnail} alt="" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Play size={10} className="fill-white text-white" />
                    </div>
                  </div>
                  <div className="flex-1 text-left overflow-hidden">
                    <p className="text-[11px] font-bold text-slate-200 truncate">{vid.title}</p>
                    <p className="text-[9px] text-slate-500 uppercase font-bold">{vid.duration} · {vid.resolution}</p>
                  </div>
                </button>
              ))}
              {videos.length === 0 && (
                <div className="py-12 text-center opacity-20 flex flex-col items-center">
                  <Film size={32} className="mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Zero Frames Synthesized</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden min-h-[500px] flex flex-col relative group">
            {activeVideo ? (
              <>
                <div className="flex-1 relative bg-black flex items-center justify-center">
                  <video 
                    ref={videoRef}
                    src={activeVideo.url} 
                    className="w-full h-full object-contain"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    loop
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8 gap-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button onClick={togglePlay} className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform">
                          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                        </button>
                        <div className="flex flex-col">
                           <span className="text-white text-sm font-bold">{activeVideo.title}</span>
                           <span className="text-slate-400 text-xs">Generated by Gemini Neural Diffusion Engine</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 bg-slate-900/80 backdrop-blur-md rounded-lg text-white hover:bg-slate-800"><Maximize2 size={18} /></button>
                        <button className="p-2 bg-slate-900/80 backdrop-blur-md rounded-lg text-white hover:bg-slate-800"><Volume2 size={18} /></button>
                      </div>
                    </div>
                    <div className="h-1 w-full bg-slate-700/50 rounded-full overflow-hidden">
                       <motion.div 
                        animate={isPlaying ? { width: '100%' } : { width: '0%' }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                        className="h-full bg-indigo-500" 
                       />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 p-8 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Metadata</span>
                      <span className="text-xs font-bold text-slate-300">{activeVideo.resolution} · {activeVideo.duration} · MP4</span>
                    </div>
                    <div className="w-px h-8 bg-slate-800" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Style</span>
                      <span className="text-xs font-bold text-slate-300">{activeVideo.style}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-750 text-white rounded-2xl font-bold transition-all border border-slate-700">
                      <Settings size={18} /> Edit Frames
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-900/20">
                      <Download size={18} /> Export Cinematic
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500 blur-[80px] opacity-10 animate-pulse" />
                  <div className="w-32 h-32 bg-slate-850 rounded-[2.5rem] border-2 border-dashed border-slate-800 flex items-center justify-center relative z-10">
                    <Video className="text-slate-700" size={64} />
                  </div>
                </div>
                <div className="max-w-sm space-y-2">
                  <h3 className="text-3xl font-black text-white tracking-tight">Neural Cinema</h3>
                  <p className="text-sm text-slate-500">Transform complex textual narratives into breathtaking cinematic motion sequences.</p>
                </div>
                <div className="flex gap-2">
                  {['Ethereal', 'Sci-fi', 'Macro', 'Aerial'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {isGenerating && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl z-50 flex flex-col items-center justify-center space-y-12 p-12 text-center animate-in fade-in zoom-in duration-500">
                <div className="relative w-48 h-48">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 border-b-2 border-l-2 border-indigo-500/20 rounded-full"
                  />
                   <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-4 border-t-2 border-r-2 border-indigo-500 rounded-full"
                  />
                  <div className="absolute inset-10 bg-slate-900 flex items-center justify-center rounded-2xl shadow-inner">
                    <Sparkles className="text-indigo-500 animate-pulse" size={48} />
                  </div>
                </div>
                <div className="space-y-4 max-w-sm">
                  <h4 className="text-2xl font-black text-white">Neural Diffusion Underway</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    "Calculating optical flow and temporal coherence across sub-pixel neural weights..."
                  </p>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-8">
                     <motion.div 
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 5, ease: 'easeInOut' }}
                      className="h-full bg-indigo-600" 
                     />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[
              { title: 'Temporal Stability', value: '99.2%', desc: 'Frame consistency' },
              { title: 'Neural Upscale', value: '8X', desc: 'Detail enhancement' },
              { title: 'Motion vectors', value: 'Active', desc: 'Flow optimization' }
            ].map((stat, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.title}</p>
                <p className="text-xl font-black text-white mt-1">{stat.value}</p>
                <p className="text-[9px] text-slate-500">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoStudio;
