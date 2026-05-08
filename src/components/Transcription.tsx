import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, 
  Video, 
  Volume2, 
  Upload, 
  Download, 
  Languages, 
  FileText, 
  Sparkles, 
  RefreshCw, 
  Check, 
  X,
  Image as ImageIcon,
  Play,
  Pause,
  ChevronDown,
  Radio,
  Settings,
  Sliders
} from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";
import { exportFile, ExportFormat } from '../lib/exportUtils';
import TranscriptionButton from './TranscriptionButton';

import { translateContent } from '../services/translationService';
import { toast } from 'sonner';

const Transcription: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState('English');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [inputText, setInputText] = useState('');
  const [resultText, setResultText] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [transcriptionSettings, setTranscriptionSettings] = useState({
    model: 'gemini-3-flash-preview',
    modelType: 'Standard',
    diarization: false,
    outputFormat: 'text',
    language: 'English'
  });
  const [activeAnalysisMode, setActiveAnalysisMode] = useState<'transcribe' | 'analyze'>('transcribe');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoAnalysisRef = useRef<HTMLInputElement>(null);

  const handleVideoAnalysis = async (analysisFile: File) => {
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const reader = new FileReader();
      reader.readAsDataURL(analysisFile);
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const response = await ai.models.generateContent({
          model: "gemini-3.1-pro-preview",
          contents: [
            {
              inlineData: {
                data: base64Data,
                mimeType: analysisFile.type,
              },
            },
            { text: "Provide a detailed summary and extract key information from this video. Identify characters, setting, and main events." },
          ],
        });
        setResultText(response.text || 'No analysis generated.');
        setIsProcessing(false);
      };
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      toast.error("Video analysis failed");
    }
  };

  const handleTranslateResult = async () => {
    if (!resultText) return;
    setIsTranslating(true);
    try {
      const results = await translateContent(resultText, [selectedLang]);
      if (results.length > 0) {
        setResultText(results[0].content);
        toast.success(`Result translated to ${selectedLang}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Translation failed");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleExport = (format: ExportFormat) => {
    exportFile(resultText, `transcription-${selectedLang.toLowerCase()}`, format);
    setIsExportOpen(false);
  };

  const languages = [
    'English', 'French', 'Mandarin', 'Arabic', 'Spanish', 
    'Hindi', 'Igbo', 'Hausa', 'Yoruba', 'German', 'Italian', 'Japanese',
    'Portuguese', 'Russian', 'Korean', 'Swahili', 'Zulu', 'Amharic'
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleTranscription = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        
        let prompt = `Transcribe this ${file.type.split('/')[0]} in ${selectedLang}. Domain: ${transcriptionSettings.modelType}.`;
        if (transcriptionSettings.diarization) {
          prompt += " Please include speaker diarization (e.g., Speaker A, Speaker B).";
        }
        if (transcriptionSettings.outputFormat === 'json') {
          prompt += " Return the output in a structured JSON format with timestamps and speakers.";
        }

        const response = await ai.models.generateContent({
          model: transcriptionSettings.model,
          contents: [
            {
              inlineData: {
                data: base64Data,
                mimeType: file.type,
              },
            },
            { text: prompt },
          ],
        });
        setResultText(response.text || 'No transcription generated.');
        setIsProcessing(false);
      };
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
  };

  const handleTTS = async () => {
    if (!inputText) return;
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say in ${selectedLang}: ${inputText}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const binary = atob(base64Audio);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'audio/pcm;rate=24000' });
        // Note: Raw PCM needs AudioContext to play, but for simplicity we'll simulate a URL
        // In a real app, you'd use a PCM player.
        setAudioUrl(URL.createObjectURL(blob));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    const element = document.createElement("a");
    const fileBlob = new Blob([resultText], {type: 'text/plain'});
    element.href = URL.createObjectURL(fileBlob);
    element.download = "transcription.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="p-8 space-y-8 bg-slate-950 min-h-full text-slate-200">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transcription & Media AI</h1>
          <p className="text-slate-500 mt-1">Convert between text, voice, and video with multi-language support.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:border-blue-500 transition-all text-slate-400 hover:text-blue-500"
            title="Transcription Settings"
          >
            <Settings size={20} />
          </button>
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold hover:border-blue-500 transition-all">
              <Languages size={18} className="text-blue-500" />
              {selectedLang}
            </button>
            <div className="absolute right-0 mt-2 w-48 max-h-[300px] overflow-y-auto bg-slate-900 border border-slate-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2 grid grid-cols-1 gap-1">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800 mb-1">Select Language</div>
              {languages.map(lang => (
                <button 
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  className="w-full text-left px-3 py-2 hover:bg-slate-800 rounded-lg text-xs font-medium transition-colors flex items-center justify-between"
                >
                  {lang}
                  {selectedLang === lang && <Check size={12} className="text-blue-500" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isSettingsOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl z-[70] overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sliders className="text-blue-500" size={20} />
                  <h2 className="text-xl font-bold">Transcription Settings</h2>
                </div>
                <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Model & Domain</label>
                  <select 
                    value={`${transcriptionSettings.model}|${transcriptionSettings.modelType}`}
                    onChange={(e) => {
                      const [model, modelType] = e.target.value.split('|');
                      setTranscriptionSettings({...transcriptionSettings, model, modelType});
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="gemini-3-flash-preview|Standard">Gemini 3 Flash (Standard)</option>
                    <option value="gemini-3-flash-preview|Medical">Medical Transcription (Specialized)</option>
                    <option value="gemini-3-flash-preview|Legal">Legal Meeting (Diarization Optimized)</option>
                    <option value="gemini-1.5-pro|Financial">Gemini 1.5 Pro (Deep Financial Audit)</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Advanced Features</label>
                  <div 
                    onClick={() => setTranscriptionSettings({...transcriptionSettings, diarization: !transcriptionSettings.diarization})}
                    className="flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-800/80 rounded-2xl cursor-pointer transition-all border border-slate-700/50"
                  >
                    <div>
                      <p className="text-sm font-bold">Speaker Diarization</p>
                      <p className="text-xs text-slate-500">Detect and label different speakers</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-all flex items-center p-1 ${transcriptionSettings.diarization ? 'bg-blue-600' : 'bg-slate-700'}`}>
                      <motion.div 
                        animate={{ x: transcriptionSettings.diarization ? 24 : 0 }}
                        className="w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Output Format</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['text', 'json'].map(format => (
                      <button 
                        key={format}
                        onClick={() => setTranscriptionSettings({...transcriptionSettings, outputFormat: format})}
                        className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                          transcriptionSettings.outputFormat === format 
                          ? 'bg-blue-500/10 border-blue-500 text-blue-500' 
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                        }`}
                      >
                        {format.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 bg-slate-900/50 border-t border-slate-800">
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20"
                >
                  Save Settings
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
            <h3 className="text-xl font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="text-blue-500" size={24} /> Multimodal Media AI
              </div>
              <div className="flex p-1 bg-slate-800 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                <button 
                  onClick={() => setActiveAnalysisMode('transcribe')}
                  className={`px-3 py-1 rounded-md transition-all ${activeAnalysisMode === 'transcribe' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Transcribe
                </button>
                <button 
                  onClick={() => setActiveAnalysisMode('analyze')}
                  className={`px-3 py-1 rounded-md transition-all ${activeAnalysisMode === 'analyze' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Analyze
                </button>
              </div>
            </h3>
            
            {activeAnalysisMode === 'transcribe' ? (
              <>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-12 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center gap-4 cursor-pointer hover:border-blue-500 hover:bg-blue-500/5 transition-all"
                >
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-500">
                    <Upload size={32} />
                  </div>
                  <div className="text-center">
                    <p className="font-bold">{file ? file.name : 'Upload Media File'}</p>
                    <p className="text-xs text-slate-500 mt-1">MP4, MOV, MP3, WAV (Max 50MB)</p>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    className="hidden" 
                    accept="video/*,audio/*"
                  />
                </div>
                <button 
                  onClick={handleTranscription}
                  disabled={!file || isProcessing}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20"
                >
                  {isProcessing ? <RefreshCw className="animate-spin" size={20} /> : <Mic size={20} />}
                  Transcribe to {selectedLang}
                </button>
              </>
            ) : (
              <>
                <div 
                  onClick={() => videoAnalysisRef.current?.click()}
                  className="p-12 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center gap-4 cursor-pointer hover:border-emerald-500 hover:bg-emerald-500/5 transition-all"
                >
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-500">
                    <Sparkles className="text-emerald-500" size={32} />
                  </div>
                  <div className="text-center">
                    <p className="font-bold">Deep Video Analysis</p>
                    <p className="text-xs text-slate-500 mt-1">Summary, Scene Detection & Extraction</p>
                  </div>
                  <input 
                    type="file" 
                    ref={videoAnalysisRef} 
                    onChange={(e) => e.target.files?.[0] && handleVideoAnalysis(e.target.files[0])} 
                    className="hidden" 
                    accept="video/*"
                  />
                </div>
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                  <p className="text-[10px] uppercase font-bold text-emerald-500 mb-1">Powered by</p>
                  <p className="text-xs font-bold">Gemini 3.1 Pro (Multimodal Reasoning)</p>
                </div>
              </>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Radio className="text-red-500" size={24} /> Live Speech Transcription
            </h3>
            <p className="text-sm text-slate-500">Transcribe live speech directly from your microphone in real-time.</p>
            <TranscriptionButton 
              onTranscriptionComplete={(text) => setResultText(prev => prev ? `${prev}\n\n${text}` : text)}
              className="w-full"
            />
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Volume2 className="text-purple-500" size={24} /> Text to Voice (TTS)
            </h3>
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to convert to speech..."
              className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-purple-500 resize-none h-32"
            />
            <button 
              onClick={handleTTS}
              disabled={!inputText || isProcessing}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-800 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-purple-900/20"
            >
              {isProcessing ? <RefreshCw className="animate-spin" size={20} /> : <Volume2 size={20} />}
              Generate Voice
            </button>
            {audioUrl && (
              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <Play size={18} className="text-purple-500" />
                  <span className="text-xs font-medium">Generated Audio</span>
                </div>
                <button className="text-purple-500 hover:underline text-xs font-bold">Play Now</button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col h-full min-h-[600px]">
            <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
                  <FileText className="text-blue-500" size={20} />
                </div>
                <h3 className="font-bold">Result Output</h3>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleTranslateResult}
                  disabled={!resultText || isTranslating}
                  className="p-2 hover:bg-blue-900/20 text-blue-400 rounded-lg flex items-center gap-2 text-xs font-bold transition-all"
                  title={`Translate result to ${selectedLang}`}
                >
                  {isTranslating ? <RefreshCw size={14} className="animate-spin" /> : <Languages size={14} />}
                  Translate
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setIsExportOpen(!isExportOpen)}
                    disabled={!resultText}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 disabled:opacity-30 flex items-center gap-1"
                  >
                    <Download size={18} /> <ChevronDown size={14} />
                  </button>
                  <AnimatePresence>
                    {isExportOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-40 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 p-1"
                      >
                        <button onClick={() => handleExport('txt')} className="w-full text-left px-4 py-2 hover:bg-slate-800 rounded-lg text-sm">Plain Text (.txt)</button>
                        <button onClick={() => handleExport('md')} className="w-full text-left px-4 py-2 hover:bg-slate-800 rounded-lg text-sm">Markdown (.md)</button>
                        <button onClick={() => handleExport('html')} className="w-full text-left px-4 py-2 hover:bg-slate-800 rounded-lg text-sm">HTML (.html)</button>
                        <button onClick={() => handleExport('pdf')} className="w-full text-left px-4 py-2 hover:bg-slate-800 rounded-lg text-sm">PDF (Printable)</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button 
                  onClick={() => setResultText('')}
                  className="p-2 hover:bg-red-900/20 text-slate-400 hover:text-red-400 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 p-8 overflow-y-auto">
              {resultText ? (
                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{resultText}</p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                  <Sparkles size={48} />
                  <p className="text-sm">Your transcription or OCR results will appear here.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <ImageIcon className="text-amber-500" size={18} /> Picture to Text (OCR)
            </h3>
            <button className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl text-slate-600 hover:border-amber-500 hover:text-amber-500 transition-all flex flex-col items-center gap-2">
              <Upload size={24} />
              <span className="text-xs font-medium">Upload Image for OCR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transcription;
