import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  Settings, 
  User as UserIcon, 
  Sparkles,
  LogIn,
  UserPlus,
  CreditCard,
  Calendar
} from 'lucide-react';
import { NAV_ITEMS, APP_NAME } from '../constants';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { usePricingPlans } from '../hooks/usePricingPlans';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { createSubscription } from '../services/billingService';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { profile, user } = useAuth();
  const { subscription, isPaid } = useSubscription();
  const { plans, loading: plansLoading } = usePricingPlans();

  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const handleSubscribe = (priceId: string) => {
    createSubscription(priceId);
  };

  const isTrialing = subscription?.status === 'trialing';

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="h-screen bg-slate-900 border-r border-slate-800 flex flex-col relative z-50"
    >
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex flex-col">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-blue-500 truncate"
            >
              {APP_NAME}
            </motion.h1>
            {isTrialing && (
              <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1 uppercase tracking-widest">
                <Sparkles size={10} /> 7-Day Free Trial
              </span>
            )}
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-slate-800 rounded-lg text-slate-400"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide py-4">
        {NAV_ITEMS.filter(item => item.id !== 'maintenance' || profile?.role === 'admin').map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
              activeTab === item.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <item.icon size={22} />
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium whitespace-nowrap"
              >
                {item.title}
              </motion.span>
            )}
          </button>
        ))}

        <div className="pt-6 pb-2">
          {!isCollapsed && (
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-3">
              Account & Billing
            </p>
          )}
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('account-hub')}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
                activeTab === 'account-hub'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
              title="Manage Account"
            >
              <UserIcon size={22} />
              {!isCollapsed && <span className="font-medium">Manage Account</span>}
            </button>
            {!isPaid && !isCollapsed && (
              <button
                onClick={() => setActiveTab('account-hub')}
                className="w-full flex items-center gap-4 p-3 mt-2 rounded-xl bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600/20 transition-all border border-emerald-600/20"
              >
                <Sparkles size={20} />
                <span className="text-xs font-black uppercase tracking-tighter">7-Day Free Trial</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className={`flex items-center gap-4 p-3 rounded-xl ${isCollapsed ? 'justify-center' : ''}`}>
          {profile?.photoURL ? (
            <img src={profile.photoURL} alt="Avatar" className="w-10 h-10 rounded-full border border-slate-700" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
              <UserIcon size={20} />
            </div>
          )}
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-slate-200 truncate">{profile?.displayName || 'User'}</p>
              <p className="text-xs text-slate-500 truncate">{profile?.email}</p>
            </div>
          )}
        </div>
        <div className="mt-2 flex gap-2">
          {!isCollapsed && (
            <>
            <button 
              onClick={() => setActiveTab('account-hub')}
              className="flex-1 p-2 hover:bg-slate-800 rounded-lg text-slate-400 flex items-center justify-center gap-2 text-sm"
            >
              <Settings size={16} /> Settings
            </button>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-900/20 hover:text-red-400 rounded-lg text-slate-400"
              >
                <LogOut size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
