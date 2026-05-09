import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ChevronRight, X, Layout, Zap, Brain, ImageIcon } from 'lucide-react';

interface Step {
  title: string;
  description: string;
  icon: React.ElementType;
  targetId?: string;
}

const steps: Step[] = [
  {
    title: "Welcome to MUBUS AI",
    description: "Your all-in-one platform for high-order reasoning, creative studio, and business intelligence.",
    icon: Sparkles
  },
  {
    title: "AI SuperLab",
    description: "Explore the limit of intelligence with High Reasoning and Real-Time Multimodal Voice sessions.",
    icon: Brain,
    targetId: "ai-lab"
  },
  {
    title: "Image Studio",
    description: "Generate 4K masterpieces and edit them directly with our pixel-perfect AI editor.",
    icon: ImageIcon,
    targetId: "image-studio"
  },
  {
    title: "SEO & Sales",
    description: "Turn your ideas into marketing gold with our performance-scored content generator.",
    icon: Zap,
    targetId: "seo-sales"
  }
];

const OnboardingTour: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('mubus_tour_seen');
    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setCurrentStep(0);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('mubus_tour_seen', 'true');
  };

  if (!isVisible) return null;

  const step = steps[currentStep];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] preserve-3d flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          onClick={handleClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500">
                  <Layout size={20} />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Onboarding Guide</span>
              </div>
              <button 
                onClick={handleClose}
                className="p-2 hover:bg-slate-800 rounded-full text-slate-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-900/40 transform -rotate-3 hover:rotate-0 transition-transform">
                  <step.icon className="text-white" size={40} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-white tracking-tight">{step.title}</h2>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">{step.description}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex gap-1">
                {steps.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-blue-500' : 'w-2 bg-slate-800'}`}
                  />
                ))}
              </div>
              
              <button 
                onClick={handleNext}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95"
              >
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next Step'} <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="h-2 w-full bg-slate-800">
            <motion.div 
              className="h-full bg-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ type: 'spring', damping: 20 }}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OnboardingTour;
