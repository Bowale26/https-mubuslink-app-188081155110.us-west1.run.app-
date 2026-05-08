import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Editor from './components/Editor';
import WebsiteBuilder from './components/WebsiteBuilder';
import Templates from './components/Templates';
import ImageFinder from './components/ImageFinder';
import FontsAnimations from './components/FontsAnimations';
import ChatBot from './components/ChatBot';
import MultilingualAI from './components/MultilingualAI';
import ContentWriter from './components/ContentWriter';
import Hosting from './components/Hosting';
import Integrations from './components/Integrations';
import WorkspaceManager from './components/WorkspaceManager';
import PremiumFeatureGuard from './components/PremiumFeatureGuard';
import Analytics from './components/Analytics';
import Transcription from './components/Transcription';
import SEOSalesContent from './components/SEOSalesContent';
import CreativeStudio from './components/CreativeStudio';
import YouTubeHub from './components/YouTubeHub';
import AccountHub from './components/AccountHub';
import MaintenanceAgent from './components/MaintenanceAgent';
import ErrorBoundary from './components/ErrorBoundary';
import { MubuslinkPricing } from './components/MubuslinkPricing';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useSubscription } from './hooks/useSubscription';
import { createSubscription } from './services/billingService';
import { LogIn, Sparkles, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import { auth } from './firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { Toaster } from 'sonner';

const AppContent: React.FC = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { isPaid, loading: subLoading } = useSubscription();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (authLoading || subLoading) {
    return (
      <div className="h-screen w-full bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Sparkles className="text-blue-500 animate-pulse" size={48} />
          <p className="text-slate-500 font-medium animate-pulse">Initializing MUBUSLINK AI...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    // Check Stripe redirect routes
    const path = window.location.pathname;
    if (path === '/success') {
      return (
        <div className="h-full w-full flex items-center justify-center p-6 bg-slate-950">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center space-y-8 shadow-2xl">
            <div className="w-20 h-20 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-900/20">
              <CheckCircle2 className="text-white" size={40} />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white">Subscription Successful!</h1>
              <p className="text-slate-400">Thank you for subscribing. Your account is being updated.</p>
            </div>
            <button
              onClick={() => window.location.assign('/')}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }

    if (path === '/cancel') {
      return (
        <div className="h-full w-full flex items-center justify-center p-6 bg-slate-950">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center space-y-8 shadow-2xl">
            <div className="w-20 h-20 bg-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-amber-900/20">
              <AlertCircle className="text-white" size={40} />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white">Subscription Cancelled</h1>
              <p className="text-slate-400">The checkout process was cancelled. No charges were made.</p>
            </div>
            <button
              onClick={() => window.location.assign('/')}
              className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700 transition-all"
            >
              Back to Pricing
            </button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={(tab) => setActiveTab(tab)} />;
      case 'website-builder':
        return <WebsiteBuilder />;
      case 'templates':
        return <Templates onNavigate={(tab) => setActiveTab(tab)} />;
      case 'image-finder':
        return <ImageFinder />;
      case 'fonts-animations':
        return <FontsAnimations />;
      case 'chatbot':
        return <ChatBot />;
      case 'editor':
        return <Editor />;
      case 'multilingual':
        return <MultilingualAI onNavigate={(tab) => setActiveTab(tab)} />;
      case 'content-writer':
        return <ContentWriter />;
      case 'hosting':
        return <Hosting />;
      case 'integrations':
        return <Integrations />;
      case 'workspaces':
        return (
          <PremiumFeatureGuard onNavigateToPricing={() => setActiveTab('pricing')}>
            <WorkspaceManager onNavigateToPricing={() => setActiveTab('pricing')} />
          </PremiumFeatureGuard>
        );
      case 'analytics':
        return <Analytics />;
      case 'transcription':
        return <Transcription />;
      case 'seo-sales':
        return <SEOSalesContent />;
      case 'creative-studio':
        return <CreativeStudio />;
      case 'youtube-hub':
        return <YouTubeHub />;
      case 'account-hub':
        return <AccountHub />;
      case 'maintenance':
        return profile?.role === 'admin' ? <MaintenanceAgent /> : <Dashboard onNavigate={(tab) => setActiveTab(tab)} />;
      case 'pricing':
        return <MubuslinkPricing />;
      default:
        return <Dashboard onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto">
        {!user ? (
          <div className="h-full w-full flex items-center justify-center p-6 bg-slate-950">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center space-y-8 shadow-2xl">
              <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-blue-900/20">
                <Sparkles className="text-white" size={40} />
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-black text-white tracking-tighter">MUBUSLINK AI</h1>
                <p className="text-slate-400 text-lg">The ultimate SaaS ecosystem for modern builders.</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600/10 text-emerald-500 rounded-full text-xs font-bold border border-emerald-600/20 uppercase tracking-widest mx-auto">
                    <Sparkles size={14} /> 7-Day Free Trial Included
                </div>
              </div>
              <button
                onClick={handleLogin}
                className="w-full flex items-center justify-center gap-3 py-4 bg-white text-slate-950 rounded-2xl font-bold hover:bg-slate-100 transition-all active:scale-95"
              >
                <LogIn size={20} /> Sign in with Google
              </button>
              <p className="text-xs text-slate-500">
                By signing in, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        ) : (
          renderContent()
        )}
      </main>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}
