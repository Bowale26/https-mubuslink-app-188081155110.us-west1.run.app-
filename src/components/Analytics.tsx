import React from 'react';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, Users, Clock, Globe, ArrowUp, ArrowDown } from 'lucide-react';
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
  const data = [
    { name: 'Mon', visitors: 4000, views: 2400 },
    { name: 'Tue', visitors: 3000, views: 1398 },
    { name: 'Wed', visitors: 2000, views: 9800 },
    { name: 'Thu', visitors: 2780, views: 3908 },
    { name: 'Fri', visitors: 1890, views: 4800 },
    { name: 'Sat', visitors: 2390, views: 3800 },
    { name: 'Sun', visitors: 3490, views: 4300 },
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
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-slate-500 mt-1">Real-time insights on your website performance and user behavior.</p>
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm outline-none">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-900/20">
            Export Report
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Visitors', value: '45,231', change: '+12.5%', icon: Users, color: 'text-blue-500' },
          { label: 'Page Views', value: '128,432', change: '+8.2%', icon: Globe, color: 'text-emerald-500' },
          { label: 'Avg. Duration', value: '4m 32s', change: '-2.1%', icon: Clock, color: 'text-purple-500' },
          { label: 'Bounce Rate', value: '32.4%', change: '+1.4%', icon: TrendingUp, color: 'text-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl bg-slate-800 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                {stat.change.startsWith('+') ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
          <h3 className="font-bold flex items-center gap-2">
            <BarChart3 className="text-blue-500" size={20} /> Traffic Overview
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="visitors" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVisitors)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
          <h3 className="font-bold">Traffic Sources</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
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
          <div className="space-y-3">
            {pieData.map((entry, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-slate-400">{entry.name}</span>
                </div>
                <span className="font-bold">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
