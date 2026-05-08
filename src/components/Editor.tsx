import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, RefreshCw, Check, X, Wand2, MessageSquare, Plus, Edit3, Download, ChevronDown, Mic, Eraser, Type, ZoomIn, ZoomOut } from 'lucide-react';
import { getAIWritingFeedback, iterateOnText, proactiveSuggestion, aiWritingTool } from '../services/geminiService';
import { exportFile, ExportFormat } from '../lib/exportUtils';
import TranscriptionButton from './TranscriptionButton';

const Editor: React.FC = () => {
  const [content, setContent] = useState('');
  const [selection, setSelection] = useState<{ text: string; start: number; end: number } | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [proactiveTip, setProactiveTip] = useState<string | null>(null);
  const [lastProactiveCheck, setLastProactiveCheck] = useState(0);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const handleWritingTool = async (tool: 'summarize' | 'grammar' | 'expand' | 'shorten' | 'tone', extra?: string) => {
    const textToProcess = selection?.text || content;
    if (!textToProcess.trim()) return;
    
    setIsGenerating(true);
    try {
      const result = await aiWritingTool(textToProcess, tool, extra);
      if (selection) {
        const newContent = content.substring(0, selection.start) + result + content.substring(selection.end);
        setContent(newContent);
        setSelection(null);
      } else {
        setContent(result || '');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = (format: ExportFormat) => {
    exportFile(content, 'my-masterpiece', format);
    setIsExportOpen(false);
  };

  // Proactive AI suggestions
  useEffect(() => {
    if (content.length > 50 && Date.now() - lastProactiveCheck > 15000) {
      const timer = setTimeout(async () => {
        const tip = await proactiveSuggestion(content.slice(-200));
        setProactiveTip(tip);
        setLastProactiveCheck(Date.now());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [content, lastProactiveCheck]);

  const handleSelection = () => {
    if (editorRef.current) {
      const start = editorRef.current.selectionStart;
      const end = editorRef.current.selectionEnd;
      const text = content.substring(start, end);
      if (text.trim().length > 0) {
        setSelection({ text, start, end });
      } else {
        setSelection(null);
      }
    }
  };

  const handleAIFeedback = async () => {
    if (!selection) return;
    setIsGenerating(true);
    try {
      const feedback = await getAIWritingFeedback(selection.text);
      setAiFeedback(feedback);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRewrite = async () => {
    if (!selection || !aiFeedback) return;
    setIsGenerating(true);
    try {
      const rewritten = await iterateOnText(selection.text, aiFeedback);
      const newContent = content.substring(0, selection.start) + rewritten + content.substring(selection.end);
      setContent(newContent);
      setAiFeedback(null);
      setSelection(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200">
      <header className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Sparkles className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold">Magic Editor</h2>
            <p className="text-xs text-slate-500">AI Thought Partner Active</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Download size={16} /> Export <ChevronDown size={14} />
            </button>
            <AnimatePresence>
              {isExportOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-40 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 p-1"
                >
                  <button onClick={() => handleExport('md')} className="w-full text-left px-4 py-2 hover:bg-slate-800 rounded-lg text-sm">Markdown (.md)</button>
                  <button onClick={() => handleExport('html')} className="w-full text-left px-4 py-2 hover:bg-slate-800 rounded-lg text-sm">HTML (.html)</button>
                  <button onClick={() => handleExport('pdf')} className="w-full text-left px-4 py-2 hover:bg-slate-800 rounded-lg text-sm">PDF (Printable)</button>
                  <button onClick={() => handleExport('txt')} className="w-full text-left px-4 py-2 hover:bg-slate-800 rounded-lg text-sm">Plain Text (.txt)</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20">
            Publish
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative p-8 overflow-y-auto">
          <textarea
            ref={editorRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onMouseUp={handleSelection}
            onKeyUp={handleSelection}
            placeholder="Start writing your masterpiece..."
            className="w-full h-full bg-transparent border-none focus:ring-0 text-xl leading-relaxed resize-none placeholder:text-slate-700 font-serif"
          />
          
          <AnimatePresence>
            {selection && !aiFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bg-slate-800 border border-slate-700 rounded-xl p-2 shadow-2xl flex gap-2"
                style={{
                  top: editorRef.current ? editorRef.current.offsetTop + 40 : 100,
                  left: '50%',
                  transform: 'translateX(-50%)'
                }}
              >
                <button
                  onClick={handleAIFeedback}
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-blue-600 rounded-lg text-sm transition-colors"
                >
                  <Sparkles size={14} /> Ask AI
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-700 rounded-lg text-sm transition-colors">
                  <Wand2 size={14} /> Improve
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <aside className="w-96 border-l border-slate-800 bg-slate-900/30 p-6 flex flex-col gap-6 overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Magic Writing Tools</h3>
            
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'summarize', label: 'Summarize', icon: ZoomOut, color: 'text-amber-400' },
                { id: 'grammar', label: 'Fix Grammar', icon: Check, color: 'text-emerald-400' },
                { id: 'expand', label: 'Expand', icon: ZoomIn, color: 'text-blue-400' },
                { id: 'shorten', label: 'Shorten', icon: ZoomOut, color: 'text-purple-400' },
              ].map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleWritingTool(tool.id as any)}
                  disabled={isGenerating}
                  className="flex items-center gap-2 p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-700/50 hover:border-blue-500/50 disabled:opacity-50"
                >
                  <tool.icon size={14} className={tool.color} />
                  {tool.label}
                </button>
              ))}
            </div>

            <div className="relative group">
              <button 
                className="w-full flex items-center justify-between p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-700/50"
              >
                <div className="flex items-center gap-2">
                  <Type size={14} className="text-pink-400" />
                  Change Tone
                </div>
                <ChevronDown size={14} className="text-slate-500" />
              </button>
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-1">
                {['Professional', 'Casual', 'Exciting', 'Empathetic', 'Bold'].map(tone => (
                  <button 
                    key={tone}
                    onClick={() => handleWritingTool('tone', tone)}
                    className="w-full text-left px-3 py-2 hover:bg-slate-700 rounded-lg text-[10px] font-bold"
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-slate-800 my-4" />

            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">AI Thought Partner</h3>
            
            {isGenerating && (
              <div className="flex items-center gap-3 text-blue-400 animate-pulse">
                <RefreshCw className="animate-spin" size={18} />
                <span className="text-sm">Gemini is thinking...</span>
              </div>
            )}

            <AnimatePresence mode="wait">
              {aiFeedback ? (
                <motion.div
                  key="feedback"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-5 space-y-4 shadow-xl"
                >
                  <div className="flex items-center gap-2 text-blue-400">
                    <MessageSquare size={18} />
                    <span className="font-bold text-sm">Suggestion</span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-300 italic">
                    "{selection?.text}"
                  </p>
                  <p className="text-sm leading-relaxed text-blue-100">
                    {aiFeedback}
                  </p>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleRewrite}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <Check size={14} /> Apply Changes
                    </button>
                    <button
                      onClick={() => setAiFeedback(null)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </motion.div>
              ) : proactiveTip ? (
                <motion.div
                  key="proactive"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 space-y-3"
                >
                  <div className="flex items-center gap-2 text-amber-400">
                    <Wand2 size={18} />
                    <span className="font-bold text-sm">Proactive Tip</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    {proactiveTip}
                  </p>
                  <button
                    onClick={() => setProactiveTip(null)}
                    className="text-xs text-slate-500 hover:text-slate-300 underline"
                  >
                    Dismiss
                  </button>
                </motion.div>
              ) : (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-600">
                    <Edit3 size={32} />
                  </div>
                  <p className="text-sm text-slate-500">
                    Highlight text to get AI feedback or start writing for proactive suggestions.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-auto border-t border-slate-800 pt-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                <Mic size={14} className="text-blue-500" /> Voice to Text
              </h3>
              <TranscriptionButton 
                onTranscriptionComplete={(text) => setContent(prev => prev ? `${prev}\n\n${text}` : text)}
                className="w-full"
              />
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Attachments</h3>
              <button className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl text-slate-600 hover:border-blue-500 hover:text-blue-500 transition-all flex flex-col items-center gap-2">
                <Plus size={24} />
                <span className="text-xs font-medium">Add Context Files</span>
              </button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Editor;
