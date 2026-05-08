import React from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  CreditCard, 
  Calendar, 
  Sparkles, 
  LogIn, 
  LogOut, 
  UserPlus, 
  CheckCircle2, 
  ShieldCheck,
  Star,
  Zap,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { createSubscription } from '../services/billingService';
import { toast } from 'sonner';

const SUBSCRIPTION_PLANS = {
  MONTHLY: "price_1TFLdKBMbxh6jv0C0MIn4aU5",
  YEARLY: "price_1TFLeCBMbxh6jv0Clh2Evj4b"
};

const AccountHub: React.FC = () => {
  const { user, profile } = useAuth();
  const { subscription, isPaid } = useSubscription();

  const handleLogin = (type: 'signin' | 'signup') => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(() => {
        toast.success(type === 'signin' ? "Welcome back!" : "Account created successfully!");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Authentication failed. Please try again.");
      });
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      toast.info("Signed out successfully");
    });
  };

  const handleSubscribe = (priceId: string, planName: string) => {
    if (!user) {
      toast.error("Please sign in to subscribe");
      handleLogin('signin');
      return;
    }
    toast.loading(`Navigating to secure check-out for ${planName}...`);
    createSubscription(priceId);
  };

  const isTrialing = subscription?.status === 'trialing';

  return (
    <div className="p-8 space-y-12 bg-slate-950 min-h-full text-slate-200">
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
            <User className="text-blue-500" size={36} /> Account Hub
          </h1>
          <p className="text-slate-500 mt-2 text-lg italic">Manage your profile, identity, and premium subscriptions.</p>
        </div>
        
        <div className="flex bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
          {!user ? (
            <div className="flex gap-2">
              <button 
                onClick={() => handleLogin('signin')}
                className="px-6 py-2.5 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition font-bold flex items-center gap-2 border border-slate-700 active:scale-95"
              >
                <LogIn size={18} /> Sign In
              </button>
              <button 
                onClick={() => handleLogin('signup')}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition font-bold flex items-center gap-2 shadow-lg shadow-blue-900/30 active:scale-95"
              >
                <UserPlus size={18} /> Sign Up
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 px-4">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Authenticated</p>
                <p className="text-sm font-bold text-white truncate max-w-[150px]">{user.email}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2.5 bg-red-900/20 text-red-400 rounded-xl hover:bg-red-900/30 transition border border-red-900/20 active:scale-95"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Profile Card if Logged In */}
      {user && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
          
          <div className="relative">
            {profile?.photoURL ? (
              <img src={profile.photoURL} alt="Avatar" className="w-24 h-24 rounded-3xl border-2 border-blue-500 shadow-lg" />
            ) : (
              <div className="w-24 h-24 rounded-3xl bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-700">
                <User size={48} />
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl border-4 border-slate-900">
              <ShieldCheck size={16} />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-white mb-1">{profile?.displayName || 'Active Member'}</h2>
            <p className="text-slate-400 font-medium mb-4">{user.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <span className="px-3 py-1 bg-blue-900/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-900/30">
                Cloud Authenticated
              </span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                isPaid ? 'bg-emerald-900/20 text-emerald-400 border-emerald-900/30' : 'bg-slate-800 text-slate-500 border-slate-700'
              }`}>
                {isPaid ? 'Premium Rank' : 'Free Rank'}
              </span>
              {isTrialing && (
                <span className="px-3 py-1 bg-amber-900/20 text-amber-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-900/30 flex items-center gap-1">
                  <Clock size={10} /> Trial Active
                </span>
              )}
            </div>
          </div>

          <div className="w-full md:w-auto grid grid-cols-2 gap-3">
             <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-800 text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Joined</p>
                <p className="text-sm font-bold text-white">Apr 2026</p>
             </div>
             <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-800 text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Member ID</p>
                <p className="text-sm font-bold text-white">#{user.uid.slice(0, 5).toUpperCase()}</p>
             </div>
          </div>
        </motion.div>
      )}

      {/* Subscription Section */}
      <div className="space-y-8">
        <div className="text-center md:text-left space-y-2">
           <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Choose Your Tier</h2>
           <p className="text-slate-500">Upgrade to unlock the full potential of MUBUSLINK AI. Cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Trial Card */}
          <div className="bg-slate-900 border-2 border-emerald-500/20 hover:border-emerald-500 rounded-3xl p-8 flex flex-col transition-all group overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Star size={64} className="text-emerald-500" />
            </div>
            <div className="mb-8">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 text-emerald-500">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Full Access Trial</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">Experience every single pro tool for 7 days. No initial charge.</p>
            </div>
            
            <div className="mb-10">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">$0</span>
                <span className="text-sm text-slate-500 font-bold">/7 DAYS</span>
              </div>
            </div>

            <ul className="space-y-4 mb-10">
              {['Full AI Ecosystem', 'Unlimited Workspaces', '24/7 Priority Support'].map(f => (
                <li key={f} className="flex items-center gap-3 text-xs text-slate-300">
                  <CheckCircle2 size={16} className="text-emerald-500" /> {f}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handleSubscribe(SUBSCRIPTION_PLANS.MONTHLY, "7-Day Trial")}
              className="mt-auto w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
            >
              Start 7-Day Free Trial
            </button>
          </div>

          {/* Monthly Card */}
          <div className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-3xl p-8 flex flex-col transition-all shadow-xl">
            <div className="mb-8">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500">
                <Calendar size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Monthly Pro</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">Flexibility for creators scaling fast. Billed monthly.</p>
            </div>

            <div className="mb-10">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">$6.99</span>
                <span className="text-sm text-slate-500 font-bold">/MONTH</span>
              </div>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-2 italic">Follows 7-day free trial</p>
            </div>

            <ul className="space-y-4 mb-10">
              {['Everything in Trial', 'Stable Pro Badge', 'No Ad Placements'].map(f => (
                <li key={f} className="flex items-center gap-3 text-xs text-slate-300">
                  <CheckCircle2 size={16} className="text-blue-500" /> {f}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handleSubscribe(SUBSCRIPTION_PLANS.MONTHLY, "Monthly Pro")}
              className="mt-auto w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black transition-all shadow-lg shadow-blue-900/20 active:scale-95"
            >
              Subscribe Monthly
            </button>
          </div>

          {/* Yearly Card */}
          <div className="bg-slate-900 border-2 border-blue-500 rounded-3xl p-8 flex flex-col transition-all relative shadow-2xl scale-105 z-10">
            <div className="absolute top-0 right-0 p-4">
               <span className="bg-blue-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">BEST VALUE</span>
            </div>
            <div className="mb-8">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Yearly Elite</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">The ultimate commitment. Huge savings for teams.</p>
            </div>

            <div className="mb-10">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">$69.99</span>
                <span className="text-sm text-slate-500 font-bold">/YEAR</span>
              </div>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-2">Saves Over $13/Year</p>
            </div>

            <ul className="space-y-4 mb-10">
              {['Enterprise Storage', 'Elite Support Hub', 'Beta Access Pass'].map(f => (
                <li key={f} className="flex items-center gap-3 text-xs text-slate-300">
                  <CheckCircle2 size={16} className="text-emerald-500" /> {f}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handleSubscribe(SUBSCRIPTION_PLANS.YEARLY, "Yearly Elite")}
              className="mt-auto w-full py-4 bg-white text-slate-950 hover:bg-slate-100 rounded-2xl font-black transition-all shadow-xl active:scale-95"
            >
              Subscribe Yearly
            </button>
          </div>

        </div>
      </div>

      {/* Footer Info */}
      <div className="p-8 bg-slate-900/30 border border-slate-800 rounded-3xl text-center space-y-4">
         <p className="text-xs text-slate-500 max-w-2xl mx-auto">
           All subscriptions are handled through Stripe's secure infrastructure. MUBUSLINK AI does not store your credit card information. You can manage or cancel your subscription at any time through the customer portal.
         </p>
      </div>
    </div>
  );
};

export default AccountHub;
