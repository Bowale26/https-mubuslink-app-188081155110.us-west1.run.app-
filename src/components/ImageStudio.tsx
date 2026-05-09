import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Download, 
  RefreshCw, 
  Layers, 
  Maximize, 
  Wand2, 
  CloudUpload,
  Eraser,
  PenTool,
  Search,
  Ratio,
  Monitor,
  Scissors,
  Palette,
  Sun,
  Contrast,
  RotateCcw
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { toast } from 'sonner';

const ImageStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  const [quality, setQuality] = useState<'Standard' | 'High' | 'Ultra'>('High');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('1:1');
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturate: 100,
    grayscale: 0,
    invert: 0,
    blur: 0
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturate: 100,
      grayscale: 0,
      invert: 0,
      blur: 0
    });
  };

  const handleFilterChange = (name: keyof typeof filters, value: number) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filterStyle = {
    filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) grayscale(${filters.grayscale}%) invert(${filters.invert}%) blur(${filters.blur}px)`
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setEditMode(false);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      // Use gemini-3.1-flash-image-preview for high-quality images
      const model = quality === 'Ultra' ? 'gemini-3.1-flash-image-preview' : 'gemini-2.5-flash-image';
      
      const response = await ai.models.generateContent({
        model,
        contents: {
          parts: [{ text: `${prompt}. Style: high resolution, masterwork, professional, ${quality.toLowerCase()} detail.` }]
        },
        config: {
          imageConfig: {
            aspectRatio,
            imageSize: quality === 'Ultra' ? '2K' : '1K'
          }
        }
      });

      let newImageUrl = '';
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          newImageUrl = `data:image/png;base64,${part.inlineData.data}`;
        }
      }

      if (newImageUrl) {
        setGeneratedImages(prev => [newImageUrl, ...prev]);
        setSelectedImage(newImageUrl);
        toast.success("Image generated successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate image. Please check your API usage.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedImage || !editPrompt.trim()) return;
    setIsGenerating(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const base64Data = selectedImage.split(',')[1];
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: 'image/png' } },
            { text: editPrompt }
          ]
        }
      });

      let editedImageUrl = '';
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          editedImageUrl = `data:image/png;base64,${part.inlineData.data}`;
        }
      }

      if (editedImageUrl) {
        setGeneratedImages(prev => [editedImageUrl, ...prev]);
        setSelectedImage(editedImageUrl);
        setEditMode(false);
        setEditPrompt('');
        toast.success("Image edited successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to edit image.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!selectedImage) return;
    const link = document.createElement('a');
    link.href = selectedImage;
    link.download = `mubuslink-ai-image-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="p-8 space-y-8 bg-slate-950 min-h-full text-slate-200">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <ImageIcon className="text-blue-500" /> Image Studio
          </h1>
          <p className="text-slate-500 mt-1">Generate high-quality visuals and edit them with precision AI.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-400">Describe your vision</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A futuristic city with flying cars and neon lights, cyberpunk aesthetic, rainy night..."
                className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl h-40 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  <Ratio size={10} /> Aspect Ratio
                </span>
                <select 
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as any)}
                  className="w-full p-2 bg-slate-850 border border-slate-700 rounded-xl text-xs font-bold outline-none"
                >
                  <option value="1:1">Square (1:1)</option>
                  <option value="16:9">Wide (16:9)</option>
                  <option value="9:16">Portrait (9:16)</option>
                  <option value="4:3">Card (4:3)</option>
                </select>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  <Maximize size={10} /> Quality
                </span>
                <select 
                  value={quality}
                  onChange={(e) => setQuality(e.target.value as any)}
                  className="w-full p-2 bg-slate-850 border border-slate-700 rounded-xl text-xs font-bold outline-none"
                >
                  <option value="Standard">Standard</option>
                  <option value="High">High (HD)</option>
                  <option value="Ultra">Ultra (2K/4K)</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20"
            >
              {isGenerating ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
              {isGenerating ? 'Synthesizing...' : 'Generate Masterpiece'}
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-300">History</h4>
            <div className="grid grid-cols-3 gap-2">
              {generatedImages.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-blue-500 scale-95' : 'border-transparent hover:border-slate-700'}`}
                >
                  <img src={img} alt={`Generated ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
              {generatedImages.length === 0 && (
                <div className="col-span-3 h-20 border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                  No History
                </div>
              )}
            </div>
          </div>

          {selectedImage && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-6 animate-in fade-in slide-in-from-left duration-300">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                  <Palette size={16} className="text-amber-500" /> Adjustments
                </h4>
                <button 
                  onClick={resetFilters}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-200 transition-all"
                  title="Reset Filters"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: 'brightness', label: 'Brightness', min: 0, max: 200, icon: Sun },
                  { name: 'contrast', label: 'Contrast', min: 0, max: 200, icon: Contrast },
                  { name: 'saturate', label: 'Saturation', min: 0, max: 200, icon: Palette },
                  { name: 'blur', label: 'Softness', min: 0, max: 10, icon: Wand2 }
                ].map((f) => (
                  <div key={f.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <f.icon size={10} /> {f.label}
                      </label>
                      <span className="text-[10px] font-bold text-blue-500">{(filters as any)[f.name]}</span>
                    </div>
                    <input 
                      type="range" 
                      min={f.min} 
                      max={f.max} 
                      value={(filters as any)[f.name]}
                      onChange={(e) => handleFilterChange(f.name as any, parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button 
                  onClick={() => handleFilterChange('grayscale', filters.grayscale === 0 ? 100 : 0)}
                  className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${filters.grayscale > 0 ? 'bg-slate-200 text-slate-900 border-white' : 'bg-slate-800 text-slate-500 border-slate-700 hover:border-slate-600'}`}
                >
                  B&W
                </button>
                <button 
                  onClick={() => handleFilterChange('invert', filters.invert === 0 ? 100 : 0)}
                  className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${filters.invert > 0 ? 'bg-slate-100/10 text-white border-blue-500' : 'bg-slate-800 text-slate-500 border-slate-700 hover:border-slate-600'}`}
                >
                  Invert
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="xl:col-span-8 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden min-h-[600px] flex flex-col relative group">
            {selectedImage ? (
              <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditMode(!editMode)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${editMode ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-900/20' : 'bg-slate-800 hover:bg-slate-700'}`}
                    >
                      <Wand2 size={14} /> {editMode ? 'Cancel Edit' : 'Edit with AI'}
                    </button>
                    <button 
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all"
                    >
                      <Download size={14} /> Export
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{quality} Mode</span>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>

                <div className="flex-1 p-8 flex items-center justify-center relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={selectedImage}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="max-w-full max-h-[70vh] shadow-2xl rounded-2xl overflow-hidden border border-slate-800"
                      style={filterStyle}
                    >
                      <img src={selectedImage} alt="Focused render" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    </motion.div>
                  </AnimatePresence>

                  {editMode && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-8 left-8 right-8 p-6 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl space-y-4"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Wand2 className="text-amber-500" size={18} />
                        <h4 className="font-bold text-white">AI Image Editor</h4>
                      </div>
                      <div className="flex gap-4">
                        <input 
                          type="text" 
                          value={editPrompt}
                          onChange={(e) => setEditPrompt(e.target.value)}
                          placeholder="e.g., 'Change the sky to a sunset' or 'Add a cat sitting on the table'..."
                          className="flex-1 p-4 bg-slate-800 border border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm"
                        />
                        <button 
                          onClick={handleEdit}
                          disabled={isGenerating || !editPrompt.trim()}
                          className="px-8 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-700 text-slate-950 font-black rounded-2xl transition-all shadow-lg shadow-amber-900/20"
                        >
                          {isGenerating ? <RefreshCw className="animate-spin" size={20} /> : 'Apply'}
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Supports adding, removing, or modifying elements within the scene.</p>
                    </motion.div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-6">
                <div className="w-24 h-24 bg-slate-850 rounded-full flex items-center justify-center border-2 border-dashed border-slate-800">
                  <ImageIcon className="text-slate-700" size={48} />
                </div>
                <div className="max-w-xs">
                  <h3 className="text-xl font-bold text-slate-300">Ready to Create?</h3>
                  <p className="text-sm text-slate-500 mt-2">Enter a prompt on the left to start generating high-quality AI visuals.</p>
                </div>
              </div>
            )}

            {isGenerating && (
              <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="text-center space-y-6">
                  <motion.div 
                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                    transition={{ rotate: { duration: 2, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity } }}
                    className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
                  />
                  <div className="space-y-2">
                    <p className="font-bold text-xl text-white">Quantum Synthesis...</p>
                    <p className="text-sm text-slate-400">Aligning pixels with neural weights...</p>
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

export default ImageStudio;
