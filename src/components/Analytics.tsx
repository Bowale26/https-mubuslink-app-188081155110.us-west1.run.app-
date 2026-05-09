import React from 'react';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, Users, Clock, Globe, ArrowUp, ArrowDown, Zap, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Analytics: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoadingStats(false);
      })
      .catch(err => {
        console.error("Failed to fetch stats:", err);
        setLoadingStats(false);
      });
  }, []);

  const trialConversionRate = stats?.totalSignups 
    ? ((stats.trialConversions / stats.totalSignups) * 100).toFixed(1) 
    : '0.0';

  // Mock ad spend for ROAS calculation ($500 for demo)
  const mockAdSpend = 500;
  const roas = stats?.totalRevenue 
    ? (stats.totalRevenue / mockAdSpend).toFixed(2) 
    : '0.00';

  const statsCards = [
    { label: 'Active Sessions', value: stats?.activeWebsites ? (stats.activeWebsites * 350).toLocaleString() : '45,231', change: '+12.5%', icon: Users, color: 'text-blue-500' },
    { label: 'Trial Conversion', value: `${trialConversionRate}%`, change: '+8.2%', icon: Zap, color: 'text-emerald-500' },
    { label: 'Total Revenue', value: stats?.totalRevenue ? `$${stats.totalRevenue.toLocaleString()}` : '$0', change: '+1.4%', icon: TrendingUp, color: 'text-amber-500' },
    { label: 'ROAS', value: `${roas}x`, change: '+4.1%', icon: BarChart3, color: 'text-indigo-500' },
  ];

  const data = [
    { name: 'Mon', visitors: 4000, views: 2400, bounce: 32 },
    { name: 'Tue', visitors: 3000, views: 1398, bounce: 28 },
    { name: 'Wed', visitors: 2000, views: 9800, bounce: 35 },
    { name: 'Thu', visitors: 2780, views: 3908, bounce: 27 },
    { name: 'Fri', visitors: 1890, views: 4800, bounce: 31 },
    { name: 'Sat', visitors: 2390, views: 3800, bounce: 29 },
    { name: 'Sun', visitors: 3490, views: 4300, bounce: 30 },
  ];

  const regionalData = [
    { territory: 'North America', traffic: 45, conversion: 12 },
    { territory: 'Europe', traffic: 30, conversion: 10 },
    { territory: 'Asia Pacific', traffic: 15, conversion: 8 },
    { territory: 'Others', traffic: 10, conversion: 5 },
  ];

  const sessionData = [
    { sessions: 100, depth: 2.1, revenue: 400 },
    { sessions: 200, depth: 3.4, revenue: 1200 },
    { sessions: 300, depth: 1.8, revenue: 600 },
    { sessions: 400, depth: 4.2, revenue: 2500 },
    { sessions: 500, depth: 5.1, revenue: 3800 },
  ];

  const pieData = [
    { name: 'Direct', value: 400 },
    { name: 'Social', value: 300 },
    { name: 'Search', value: 300 },
    { name: 'Referral', value: 200 },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

  return (
    <div className="p-8 space-y-8 bg-slate-950 min-h-full text-slate-200">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <BarChart3 className="text-blue-500" /> Intelligence Dashboard
          </h1>
          <p className="text-slate-500 mt-1">Cross-platform performance matrix and behavioral heuristics.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <Globe size={14} /> Global Node: US-West
          </button>
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            100% AOS Uptime
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-900/20">
            Export BI Report
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, i) => (
          <div key={i} className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 group hover:border-blue-500/30 transition-all relative overflow-hidden">
             {loadingStats && (
              <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-10">
                <RefreshCw className="animate-spin text-blue-500" size={20} />
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl bg-slate-800 ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={20} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stat.change.startsWith('+') ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-black mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <TrendingUp className="text-emerald-500" size={20} /> Traffic & Engagement Flux
            </h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Visitors</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Neural Load</span>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#f8fafc', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" />
                <Area type="monotone" dataKey="views" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl flex flex-col justify-between space-y-6">
          <h3 className="font-bold flex items-center gap-2">
            <Globe className="text-blue-500" size={18} /> Acquisition Nodes
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {pieData.map((entry, i) => (
              <div key={i} className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-lg" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-slate-400 font-bold uppercase tracking-widest">{entry.name}</span>
                </div>
                <span className="font-black text-slate-200">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
             <h3 className="font-bold text-sm tracking-tight">Regional Conversion Velocity</h3>
             <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionalData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="territory" type="category" stroke="#64748b" fontSize={10} fontWeight="bold" width={100} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                    <Bar dataKey="traffic" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={12} />
                    <Bar dataKey="conversion" fill="#ec4899" radius={[0, 4, 4, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
           </div>

           <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
             <h3 className="font-bold text-sm tracking-tight">Neural Optimization Heuristics</h3>
             <div className="grid grid-cols-2 gap-4">
               {[
                 { label: 'LLM Efficiency', value: '98.2%', detail: 'Token reuse ratio' },
                 { label: 'Vector Cache', value: '840ms', detail: 'Avg query response' },
                 { label: 'Synthetic Load', value: '1.2TB', detail: 'Daily data generation' },
                 { label: 'Node Health', value: 'Optimal', detail: '99.99% system uptime' }
               ].map((item, i) => (
                 <div key={i} className="p-4 bg-slate-850 rounded-2xl border border-slate-700/50">
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{item.label}</p>
                    <p className="text-xl font-black text-white mt-1">{item.value}</p>
                    <p className="text-[8px] text-slate-500 mt-0.5">{item.detail}</p>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
