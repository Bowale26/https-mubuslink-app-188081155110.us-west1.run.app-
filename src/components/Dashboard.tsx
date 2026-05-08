import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Search, 
  ArrowUpRight, 
  Clock, 
  MoreHorizontal,
  Layout,
  Globe,
  MessageSquare,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../hooks/useSubscription';

interface DashboardStats {
  activeWebsites: number | string;
  totalVisitors: string;
  aiWordsWritten: string;
  botConversations: string;
}

interface Project {
  id: number;
  name: string;
  type: string;
  lastUpdated: string;
  url: string;
}

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { profile } = useAuth();
  const { subscription } = useSubscription();
  const [statsData, setStatsData] = useState<DashboardStats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState<'online' | 'offline'>('offline');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, projectsRes, healthRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/projects'),
          fetch('/api/health')
        ]);
        const stats = await statsRes.json();
        const projectsData = await projectsRes.json();
        const health = await healthRes.json();
        
        setStatsData(stats);
        setProjects(projectsData);
        if (health.status === 'ok') setBackendStatus('online');
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setBackendStatus('offline');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Active Websites', value: statsData?.activeWebsites || '0', icon: Layout, color: 'text-blue-500' },
    { label: 'Total Visitors', value: statsData?.totalVisitors || '0', icon: BarChart3, color: 'text-emerald-500' },
    { label: 'AI Words Written', value: statsData?.aiWordsWritten || '0', icon: Globe, color: 'text-purple-500' },
    { label: 'Bot Conversations', value: statsData?.botConversations || '0', icon: MessageSquare, color: 'text-amber-500' },
  ];

  const isExpired = subscription?.status === 'canceled' || subscription?.status === 'unpaid' || subscription?.status === 'past_due';

  return (
    <div className="p-8 space-y-8 bg-slate-950 min-h-full text-slate-200">
      {isExpired && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <RefreshCw className="text-amber-500 animate-spin-slow" size={20} />
            </div>
            <div>
              <p className="font-bold text-amber-500">Your trial has expired!</p>
              <p className="text-sm text-slate-400">Subscribe now to keep access to all premium tools and your live projects.</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('pricing')}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-xl font-bold transition-all shadow-lg shadow-amber-900/20 whitespace-nowrap"
          >
            Upgrade Plan
          </button>
        </motion.div>
      )}

      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {profile?.displayName || 'Builder'}</h1>
          <p className="text-slate-500 mt-1">Here's what's happening with your projects today.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-64"
            />
          </div>
          <button 
            onClick={() => onNavigate('website-builder')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20"
          >
            <Plus size={20} /> New Project
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-slate-800 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <ArrowUpRight className="text-slate-600 group-hover:text-slate-300 transition-colors" size={20} />
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Projects</h2>
            <button 
              onClick={() => onNavigate('hosting')}
              className="text-sm text-blue-500 hover:underline"
            >
              View all
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group cursor-pointer hover:border-slate-700 transition-all">
                <div className="h-40 bg-slate-800 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
                  <div className="absolute bottom-4 left-4">
                    <span className="px-2 py-1 bg-blue-600 text-[10px] font-bold rounded uppercase tracking-wider">{project.type}</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold">{project.name}</h4>
                    <MoreHorizontal size={18} className="text-slate-600" />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock size={12} /> {project.lastUpdated}</span>
                    <span className="flex items-center gap-1"><Globe size={12} /> {project.url}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold">System Health</h2>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full animate-pulse ${backendStatus === 'online' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <span className="text-sm font-medium">Backend API</span>
              </div>
              <span className={`text-xs font-bold uppercase ${backendStatus === 'online' ? 'text-emerald-500' : 'text-red-500'}`}>
                {backendStatus}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Security Scan</span>
                <span>100%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full w-full bg-emerald-500" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>API Performance</span>
                <span>98%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full w-[98%] bg-blue-500" />
              </div>
            </div>
            <button 
              onClick={() => onNavigate('maintenance')}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all mt-4"
            >
              Run Full Audit
            </button>
          </div>

          <h2 className="text-xl font-bold">AI Credits</h2>
          <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white shadow-xl shadow-blue-900/20">
            <p className="text-blue-100 text-sm opacity-80">Monthly Usage</p>
            <h3 className="text-3xl font-bold mt-1">8,420 / 10,000</h3>
            <div className="h-2 w-full bg-white/20 rounded-full mt-4 overflow-hidden">
              <div className="h-full w-[84%] bg-white" />
            </div>
            <button 
              onClick={() => onNavigate('pricing')}
              className="w-full py-2 bg-white text-blue-600 rounded-xl text-xs font-bold transition-all mt-6"
            >
              Upgrade Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
