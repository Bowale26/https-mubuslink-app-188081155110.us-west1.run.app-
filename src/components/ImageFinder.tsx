import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Sparkles, 
  Download, 
  Plus, 
  Image as ImageIcon, 
  Grid, 
  List, 
  FileText, 
  Upload, 
  X, 
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Video,
  Play,
  Key
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { FeatureGate } from './FeatureGate';

interface GeneratedAsset {
  id: string;
  url: string;
  prompt: string;
  type: 'AI Image' | 'AI Video' | 'Stock';
  timestamp: number;
  thumbnail?: string;
}

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const ImageFinder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[]>([]);
  const [selectedStyle, setSelectedStyle] = useState('Photorealistic');
  const [error, setError] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<string>('');
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check for API key on mount
  React.useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(hasKey);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setPdfFile(file);
        setError(null);
      } else {
        setError('Please upload a PDF file.');
      }
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim() && !pdfFile) return;
    setIsGenerating(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      let finalPrompt = prompt;

      if (pdfFile) {
        const base64Pdf = await fileToBase64(pdfFile);
        const promptGenResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [
            {
              inlineData: {
                data: base64Pdf,
                mimeType: "application/pdf",
              },
            },
            { text: "Describe a high-quality, artistic visual representation of the content in this PDF in one concise sentence. Focus on key themes and imagery." },
          ],
        });
        finalPrompt = promptGenResponse.text || prompt;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `${selectedStyle} style: ${finalPrompt}` }],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          },
        },
      });

      let imageUrl = '';
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        const newAsset: GeneratedAsset = {
          id: Date.now().toString(),
          url: imageUrl,
          prompt: finalPrompt,
          type: 'AI Image',
          timestamp: Date.now(),
        };
        setGeneratedAssets(prev => [newAsset, ...prev]);
        setPrompt('');
        setPdfFile(null);
      } else {
        setError('Failed to generate image. Please try again.');
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError('An error occurred during generation. Please check your API key and connection.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!prompt.trim()) return;
    if (!hasApiKey) {
      setError('Please select a Gemini API key to generate videos.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setVideoStatus('Initializing video generation...');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-lite-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      setVideoStatus('AI is dreaming up your video... (this may take a minute)');

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
        
        // Update status based on progress if available
        if (!operation.done) {
          setVideoStatus('Still processing... perfection takes time.');
        }
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        // Fetch the video with the API key
        const response = await fetch(downloadLink, {
          method: 'GET',
          headers: {
            'x-goog-api-key': process.env.API_KEY || '',
          },
        });

        if (!response.ok) throw new Error('Failed to download generated video');

        const blob = await response.blob();
        const videoUrl = URL.createObjectURL(blob);

        const newAsset: GeneratedAsset = {
          id: Date.now().toString(),
          url: videoUrl,
          prompt: prompt,
          type: 'AI Video',
          timestamp: Date.now(),
        };
        setGeneratedAssets(prev => [newAsset, ...prev]);
        setPrompt('');
      } else {
        setError('Video generation failed to return a result.');
      }
    } catch (err: any) {
      console.error('Video generation error:', err);
      if (err.message?.includes('Requested entity was not found')) {
        setHasApiKey(false);
        setError('API Key session expired. Please select your key again.');
      } else {
        setError('An error occurred during video generation. Please try again.');
      }
    } finally {
      setIsGenerating(false);
      setVideoStatus('');
    }
  };

  const downloadAsset = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <FeatureGate featureName="AI Image Finder">
      <div className="p-8 space-y-8 bg-slate-950 min-h-full text-slate-200">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">AI Image Finder & Assets</h1>
          <p className="text-slate-500 mt-1">Generate high-quality images and videos from text descriptions.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button 
              onClick={() => setActiveTab('image')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'image' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <ImageIcon size={16} /> Images
            </button>
            <button 
              onClick={() => setActiveTab('video')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'video' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Video size={16} /> Videos
            </button>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setView('grid')}
              className={`p-2 rounded-xl border ${view === 'grid' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
            >
              <Grid size={20} />
            </button>
            <button 
              onClick={() => setView('list')}
              className={`p-2 rounded-xl border ${view === 'list' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-8">
        {activeTab === 'video' && !hasApiKey && (
          <div className="p-6 bg-amber-900/20 border border-amber-500/30 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/20 rounded-xl">
                <Key className="text-amber-500" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-amber-200">API Key Required for Video</h3>
                <p className="text-sm text-amber-500/80">Video generation requires a paid Gemini API key. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline">Learn more about billing</a>.</p>
              </div>
            </div>
            <button 
              onClick={handleSelectKey}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition-all shadow-lg"
            >
              Select API Key
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Text Prompt */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
              {activeTab === 'image' ? <ImageIcon size={16} className="text-blue-500" /> : <Video size={16} className="text-purple-500" />} 
              {activeTab === 'image' ? 'Image Description' : 'Video Scene Description'}
            </label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={activeTab === 'image' ? "Describe the image you want to generate..." : "Describe the video scene you want to generate (e.g., 'A cinematic shot of a majestic eagle soaring over snow-capped mountains at sunrise')..."} 
              className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all h-32 resize-none"
            />
          </div>

          {/* PDF Upload / Video Settings */}
          {activeTab === 'image' ? (
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" /> Artistic Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Photorealistic', 'Cinematic', 'Digital Art', 'Oil Painting', 'Neon Punk', 'Sketch'].map(style => (
                  <button 
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={`py-3 rounded-xl text-[10px] font-bold border transition-all ${
                      selectedStyle === style 
                      ? 'bg-amber-500/10 border-amber-500 text-amber-500' 
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
              
              <label className="text-sm font-bold text-slate-400 flex items-center gap-2 mt-4">
                <FileText size={16} className="text-purple-500" /> Generate from PDF
              </label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  pdfFile ? 'border-purple-500 bg-purple-500/5' : 'border-slate-800 hover:border-purple-500 hover:bg-purple-500/5'
                }`}
              >
                <Upload size={24} className={pdfFile ? 'text-purple-500' : 'text-slate-500'} />
                <div className="text-center px-4">
                  <p className="text-xs font-bold truncate max-w-[200px]">
                    {pdfFile ? pdfFile.name : 'Upload PDF for visual inspiration'}
                  </p>
                  {!pdfFile && <p className="text-[10px] text-slate-500 mt-1">AI will analyze content to generate imagery</p>}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept="application/pdf"
                />
                {pdfFile && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setPdfFile(null); }}
                    className="absolute top-2 right-2 p-1 hover:bg-slate-800 rounded-full"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" /> Video Settings
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800 border border-slate-700 rounded-2xl">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Resolution</p>
                  <p className="text-sm font-bold text-slate-200">720p HD</p>
                </div>
                <div className="p-4 bg-slate-800 border border-slate-700 rounded-2xl">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Aspect Ratio</p>
                  <p className="text-sm font-bold text-slate-200">16:9 Landscape</p>
                </div>
              </div>
              <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-2xl">
                <p className="text-xs text-blue-400 leading-relaxed">
                  <Sparkles size={12} className="inline mr-1" />
                  AI Video generation creates high-quality cinematic clips. Processing may take up to 60 seconds.
                </p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {isGenerating && videoStatus && (
          <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl flex items-center gap-3 text-blue-400 text-sm animate-pulse">
            <RefreshCw className="animate-spin" size={18} />
            {videoStatus}
          </div>
        )}

        <button 
          onClick={activeTab === 'image' ? handleGenerateImage : handleGenerateVideo}
          disabled={isGenerating || (!prompt.trim() && !pdfFile) || (activeTab === 'video' && !hasApiKey)}
          className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg ${
            activeTab === 'image' 
              ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-900/20' 
              : 'bg-purple-600 hover:bg-purple-700 shadow-purple-900/20'
          } disabled:bg-slate-800 disabled:shadow-none`}
        >
          {isGenerating ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
          {isGenerating 
            ? (activeTab === 'image' ? 'AI is crafting your image...' : 'AI is generating your video...') 
            : (activeTab === 'image' ? 'Generate AI Image' : 'Generate AI Video')}
        </button>
      </div>

      {/* Results Gallery */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Grid size={20} className="text-blue-500" /> Generated Assets
        </h3>
        
        {generatedAssets.length === 0 ? (
          <div className="h-64 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-600 gap-4">
            <ImageIcon size={48} className="opacity-20" />
            <p className="text-sm">No assets generated yet. Start by entering a prompt above.</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            <AnimatePresence>
              {generatedAssets.map((asset) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative aspect-video bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all shadow-xl"
                >
                  {asset.type === 'AI Video' ? (
                    <video 
                      src={asset.url} 
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <img 
                      src={asset.url} 
                      alt={asset.prompt} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end gap-3 pointer-events-none">
                    <p className="text-xs font-medium text-slate-300 line-clamp-2 italic pointer-events-auto">"{asset.prompt}"</p>
                    <div className="flex gap-2 pointer-events-auto">
                      <button 
                        onClick={() => downloadAsset(asset.url, `ai-asset-${asset.id}.${asset.type === 'AI Video' ? 'mp4' : 'png'}`)}
                        className="flex-1 py-2 bg-white text-slate-950 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors font-bold text-xs gap-2"
                      >
                        <Download size={14} /> Download
                      </button>
                      <button className="p-2 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-500 transition-colors">
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 ${asset.type === 'AI Video' ? 'bg-purple-600' : 'bg-blue-600'} text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1`}>
                      {asset.type === 'AI Video' ? <Video size={10} /> : <ImageIcon size={10} />}
                      {asset.type}
                    </span>
                  </div>
                  {asset.type === 'AI Video' && (
                    <div className="absolute top-3 right-3 p-1.5 bg-black/50 backdrop-blur-sm rounded-lg text-white">
                      <Play size={14} />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      </div>
    </FeatureGate>
  );
};

export default ImageFinder;
