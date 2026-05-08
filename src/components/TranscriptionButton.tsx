import React, { useState, useRef } from 'react';
import { Mic, RefreshCw, Languages, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

interface TranscriptionButtonProps {
  onTranscriptionComplete: (text: string) => void;
  className?: string;
}

const TranscriptionButton: React.FC<TranscriptionButtonProps> = ({ onTranscriptionComplete, className }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const languages = [
    'English', 'French', 'Mandarin', 'Arabic', 'Spanish', 
    'Hindi', 'Igbo', 'Hausa', 'Yoruba', 'German', 'Italian', 
    'Japanese', 'Korean', 'Russian', 'Portuguese', 'Turkish',
    'Vietnamese', 'Thai', 'Dutch', 'Polish'
  ];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleTranscription(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleTranscription = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [
            {
              inlineData: {
                data: base64Data,
                mimeType: "audio/webm",
              },
            },
            { text: `Transcribe this audio recording in ${selectedLang}. Return only the transcribed text.` },
          ],
        });

        const text = response.text || '';
        onTranscriptionComplete(text);
        setIsProcessing(false);
      };
    } catch (error) {
      console.error('Transcription error:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold hover:border-blue-500 transition-all"
          >
            <Languages size={14} className="text-blue-500" />
            {selectedLang}
            <ChevronDown size={12} />
          </button>
          
          <AnimatePresence>
            {isLangOpen && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute left-0 mt-2 w-40 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 p-1 max-h-48 overflow-y-auto"
              >
                {languages.map(lang => (
                  <button
                    key={lang}
                    onClick={() => {
                      setSelectedLang(lang);
                      setIsLangOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-800 rounded-lg text-xs font-medium transition-colors flex items-center justify-between"
                  >
                    {lang}
                    {selectedLang === lang && <Check size={12} className="text-blue-500" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-lg ${
            isRecording 
              ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
              : 'bg-blue-600 hover:bg-blue-700'
          } disabled:bg-slate-800`}
        >
          {isProcessing ? (
            <RefreshCw className="animate-spin" size={16} />
          ) : (
            <Mic size={16} />
          )}
          {isRecording ? 'Stop Recording' : isProcessing ? 'Transcribing...' : 'Record Voice'}
        </button>
      </div>
    </div>
  );
};

export default TranscriptionButton;
