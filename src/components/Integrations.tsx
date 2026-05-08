import React from 'react';
import { motion } from 'motion/react';
import { Link, Zap, Check, Plus, Search, ExternalLink } from 'lucide-react';

const Integrations: React.FC = () => {
  const integrations = [
    { name: 'Stripe', category: 'Payments', icon: '💳', status: 'Connected' },
    { name: 'SendGrid', category: 'Email', icon: '📧', status: 'Not Connected' },
    { name: 'Google Analytics', category: 'Analytics', icon: '📊', status: 'Connected' },
    { name: 'Zapier', category: 'Automation', icon: '⚡', status: 'Not Connected' },
    { name: 'HubSpot', category: 'CRM', icon: '🤝', status: 'Not Connected' },
    { name: 'Mailchimp', category: 'Marketing', icon: '🐵', status: 'Connected' },
    { name: 'Slack', category: 'Communication', icon: '💬', status: 'Not Connected' },
    { name: 'Discord', category: 'Community', icon: '🎮', status: 'Not Connected' },
  ];

  return (
    <div className="p-8 space-y-8 bg-slate-950 min-h-full text-slate-200">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Integrations Hub</h1>
          <p className="text-slate-500 mt-1">Connect your favorite tools and automate your workflow.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search integrations..." 
            className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-64"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {integrations.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:border-blue-500/50 transition-all group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-2xl">
                {item.icon}
              </div>
              <div className={`px-2 py-1 rounded-full text-[8px] font-bold uppercase ${
                item.status === 'Connected' ? 'bg-emerald-900/20 text-emerald-500' : 'bg-slate-800 text-slate-500'
              }`}>
                {item.status}
              </div>
            </div>
            <h3 className="font-bold text-lg">{item.name}</h3>
            <p className="text-xs text-slate-500 mb-6">{item.category}</p>
            <button className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              item.status === 'Connected' 
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}>
              {item.status === 'Connected' ? (
                <>Configure <ExternalLink size={12} /></>
              ) : (
                <>Connect <Zap size={12} /></>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Link className="text-blue-500" size={24} /> Webhooks
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all">
            <Plus size={16} /> Create Webhook
          </button>
        </div>
        <div className="p-12 border-2 border-dashed border-slate-800 rounded-2xl text-center space-y-4">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-600">
            <Zap size={32} />
          </div>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            No webhooks configured yet. Create one to receive real-time updates from external services.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
