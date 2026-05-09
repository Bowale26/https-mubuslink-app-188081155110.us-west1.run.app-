import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface FeatureGateProps {
  children: React.ReactNode;
  featureName: string;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({ children, featureName }) => {
  const { profile } = useAuth();

  // Allow admins always
  if (profile?.role === 'admin') {
    return <>{children}</>;
  }

  const isSubscribed = 
    profile?.subscriptionStatus === 'active' || 
    profile?.subscriptionStatus === 'trialing';

  // Support 7-Day Soft Trial for new users
  const isWithinSoftTrial = React.useMemo(() => {
    if (!profile?.createdAt) return false;
    const createdAt = new Date(profile.createdAt).getTime();
    const now = new Date().getTime();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    return (now - createdAt) < sevenDaysMs;
  }, [profile?.createdAt]);

  if (!isSubscribed && !isWithinSoftTrial) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-800">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20" />
          <div className="relative w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 shadow-2xl">
            <Lock className="text-blue-500" size={40} />
          </div>
        </motion.div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Premium Feature Locked</h2>
        <p className="text-slate-400 max-w-sm mb-8">
          Access to <strong>{featureName}</strong> requires an active subscription or a valid 7-day trial.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => window.location.href = '/pricing'}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={18} /> Upgrade Now
          </button>
          <button 
             onClick={() => window.location.reload()}
             className="px-8 py-3 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl font-bold transition-all border border-slate-700"
          >
            Refresh Status
          </button>
        </div>
        
        <p className="mt-8 text-xs text-slate-500 uppercase tracking-widest font-black">
          MUBUSLINK AI Deployment Enforced
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
