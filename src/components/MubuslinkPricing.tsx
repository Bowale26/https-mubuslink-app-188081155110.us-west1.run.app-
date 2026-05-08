import { usePricingPlans } from '../hooks/usePricingPlans';
import { useAuth } from '../context/AuthContext';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { LogIn, LogOut, UserPlus, Sparkles } from 'lucide-react';
import { handleStripeCheckout } from '../lib/stripeClient';

/**
 * MubuslinkPricing component displays the pricing plans fetched from Stripe.
 * It allows users to select a plan and start their 7-day free trial.
 */
export const MubuslinkPricing = () => {
  const { plans, loading } = usePricingPlans();
  const { user } = useAuth();

  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (loading) return (
    <div className="text-center p-20 animate-pulse text-slate-400 min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      <Sparkles className="animate-spin mb-4 text-blue-500" size={32} />
      Syncing with our secure billing system...
    </div>
  );

  // Specific Price IDs provided by the user
  const SUBSCRIPTION_PLANS = {
    MONTHLY: "price_1TFLdKBMbxh6jv0C0MIn4aU5",
    YEARLY: "price_1TFLeCBMbxh6jv0Clh2Evj4b"
  };

  const monthlyPriceId = SUBSCRIPTION_PLANS.MONTHLY;
  const yearlyPriceId = SUBSCRIPTION_PLANS.YEARLY;

  return (
    <section className="bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 min-h-full">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 bg-slate-800/50 p-6 rounded-3xl border border-slate-700">
          <div className="text-left">
            <h2 className="text-3xl font-black text-white tracking-tight">
              Unlock Premium Access
            </h2>
            <p className="text-slate-400 mt-1">Start your journey with a 7-day no-risk trial.</p>
          </div>
          
          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <button 
                  onClick={handleLogin}
                  className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition font-bold flex items-center gap-2 shadow-lg shadow-blue-900/30 active:scale-95"
                >
                  <UserPlus size={18} /> Sign Up
                </button>
                <button 
                  onClick={handleLogin}
                  className="px-6 py-3 bg-slate-700 text-white rounded-2xl hover:bg-slate-600 transition font-bold flex items-center gap-2 border border-slate-600 active:scale-95"
                >
                  <LogIn size={18} /> Sign In
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-slate-500 uppercase font-black tracking-widest">Logged in as</p>
                  <p className="text-sm font-bold text-white truncate max-w-[200px]">{user.email}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="px-6 py-3 bg-red-900/20 text-red-400 border border-red-900/30 rounded-2xl hover:bg-red-900/40 transition font-bold flex items-center gap-2 active:scale-95"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:max-w-6xl mx-auto">
          
          {/* 7-Day Free Trial Focused Card */}
          <div className="border-2 border-emerald-500/30 rounded-3xl shadow-2xl bg-slate-800/50 p-8 flex flex-col justify-between transition-all hover:border-emerald-500 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-500" />
            <div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="text-emerald-500" size={24} />
              </div>
              <h3 className="text-2xl font-black text-white text-left">The Full Experience</h3>
              <p className="mt-2 text-sm text-slate-400 text-left">Try every premium feature for free. No credit card required to start.</p>
              <div className="mt-8 flex items-baseline gap-2">
                <span className="text-5xl font-black text-white">$0</span>
                <span className="text-base font-bold text-slate-500">/7 days</span>
              </div>
              <ul className="mt-8 space-y-4 text-left">
                {['Unlimited AI Tokens', 'Cloud Hosting', 'Pro Analytics'].map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
            <button 
              onClick={() => handleStripeCheckout('price_TRIAL_ID_HERE', user?.uid, user?.email || undefined)}
              className="mt-10 w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl py-4 font-black transition-all shadow-xl shadow-emerald-900/40 active:scale-[0.98]"
            >
              Start 7-Day Free Trial
            </button>
          </div>

          {/* Monthly Subscription */}
          <div className="border border-slate-700 rounded-3xl shadow-xl bg-slate-800/20 p-8 flex flex-col justify-between transition-all hover:bg-slate-800/40">
            <div>
              <h3 className="text-xl font-bold text-white text-left">Monthly Pro</h3>
              <p className="mt-2 text-sm text-slate-400 text-left">Perfect for scaling projects month-to-month.</p>
              <div className="mt-8 flex items-baseline gap-2">
                <span className="text-5xl font-black text-white">$6.99</span>
                <span className="text-base font-bold text-slate-500">/mo</span>
              </div>
              <p className="mt-4 text-xs text-slate-500 text-left bg-slate-900/50 p-3 rounded-lg border border-slate-700 italic">
                * Automatically transitions to $6.99/mo after your 7-day free trial.
              </p>
            </div>
            <button 
              onClick={() => monthlyPriceId && handleStripeCheckout(monthlyPriceId, user?.uid, user?.email || undefined)}
              className="mt-10 w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl py-4 font-black transition-all shadow-xl shadow-blue-900/30 active:scale-[0.98]"
            >
              Subscribe Monthly
            </button>
          </div>

          {/* Yearly Subscription */}
          <div className="border-2 border-blue-500 rounded-3xl shadow-2xl bg-slate-900 p-8 flex flex-col justify-between relative overflow-hidden transition-all hover:scale-[1.02]">
            <div className="absolute top-0 right-0">
              <div className="bg-blue-500 text-white px-8 py-1 rotate-45 translate-x-6 translate-y-4 text-[10px] font-black uppercase tracking-widest shadow-lg">
                SAVE 20%
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white text-left">Annual Pro</h3>
              <p className="mt-2 text-sm text-slate-400 text-left">The ultimate value for power builders and teams.</p>
              <div className="mt-8 flex items-baseline gap-2">
                <span className="text-5xl font-black text-white">$69.99</span>
                <span className="text-base font-bold text-slate-500">/yr</span>
              </div>
              <p className="mt-4 text-xs text-blue-400 text-left bg-blue-500/10 p-3 rounded-lg border border-blue-500/20 italic">
                * Automatically transitions to $69.99/yr after your 7-day free trial.
              </p>
            </div>
            <button 
              onClick={() => yearlyPriceId && handleStripeCheckout(yearlyPriceId, user?.uid, user?.email || undefined)}
              className="mt-10 w-full bg-white text-slate-900 hover:bg-blue-50 rounded-2xl py-4 font-black transition-all shadow-xl active:scale-[0.98]"
            >
              Subscribe Yearly
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
