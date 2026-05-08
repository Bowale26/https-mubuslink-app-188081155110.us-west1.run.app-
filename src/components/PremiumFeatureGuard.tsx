import React from 'react';
import { useSubscription } from '../hooks/useSubscription';
import { Lock, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface PremiumFeatureGuardProps {
  children: React.ReactNode;
  onNavigateToPricing?: () => void;
}

const PremiumFeatureGuard: React.FC<PremiumFeatureGuardProps> = ({ children, onNavigateToPricing }) => {
  const { isPaid, loading } = useSubscription();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4 text-slate-500">
        <RefreshCw className="animate-spin" size={32} />
        <p className="font-medium animate-pulse">Verifying your access...</p>
      </div>
    );
  }

  if (!isPaid) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-12 text-center space-y-8 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-sm"
      >
        <div className="w-20 h-20 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500 shadow-xl shadow-blue-900/10">
          <Lock size={40} />
        </div>
        
        <div className="max-w-md space-y-4">
          <h2 className="text-3xl font-bold text-white tracking-tight">Unlock Premium Features</h2>
          <p className="text-slate-400 leading-relaxed">
            Your 7-day free trial is waiting. Choose a plan to continue building with the full power of MUBUSLINK AI.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <button 
            onClick={onNavigateToPricing}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20 group"
          >
            View Plans <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Sparkles size={14} className="text-amber-500" />
          Includes 7-day free trial • Cancel anytime
        </div>
      </motion.div>
    );
  }

  return <>{children}</>;
};

export default PremiumFeatureGuard;
