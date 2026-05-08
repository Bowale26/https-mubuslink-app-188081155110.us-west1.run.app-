import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  Globe, 
  Shield, 
  Activity, 
  Clock, 
  ExternalLink, 
  RefreshCw, 
  MoreVertical, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Settings,
  X,
  Pause,
  Play
} from 'lucide-react';
import { toast } from 'sonner';

interface Site {
  id: string;
  name: string;
  domain: string;
  status: 'Live' | 'Building' | 'Error' | 'Offline';
  visitors: string;
  lastDeployed: string;
}

const Hosting: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([
    { id: '1', name: 'Mubus Portfolio', domain: 'mubus-portfolio.run.app', status: 'Live', visitors: '1.2k', lastDeployed: '2h ago' },
    { id: '2', name: 'Acme SaaS', domain: 'acme-saas.run.app', status: 'Building', visitors: '0', lastDeployed: 'Just now' },
    { id: '3', name: 'Blog Engine', domain: 'blog-engine.run.app', status: 'Live', visitors: '450', lastDeployed: '1d ago' },
    { id: '4', name: 'E-commerce Store', domain: 'shop-123.run.app', status: 'Error', visitors: '12', lastDeployed: '3h ago' },
  ]);

  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [selectedSiteForManagement, setSelectedSiteForManagement] = useState<Site | null>(null);
  const [newSiteName, setNewSiteName] = useState('');
  const [newDomain, setNewDomain] = useState('');

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteName) return;

    const newSite: Site = {
      id: Math.random().toString(36).substr(2, 9),
      name: newSiteName,
      domain: `${newSiteName.toLowerCase().replace(/\s+/g, '-')}.run.app`,
      status: 'Building',
      visitors: '0',
      lastDeployed: 'Just now',
    };

    setSites([newSite, ...sites]);
    setNewSiteName('');
    setIsDeployModalOpen(false);
    toast.success(`Deployment started for ${newSiteName}`);

    // Simulate deployment completion
    setTimeout(() => {
      setSites(prev => prev.map(s => s.id === newSite.id ? { ...s, status: 'Live' } : s));
      toast.success(`${newSiteName} is now live!`);
    }, 5000);
  };

  const handleRedeploy = (siteId: string, siteName: string) => {
    setSites(prev => prev.map(s => s.id === siteId ? { ...s, status: 'Building' } : s));
    toast.info(`Redeploying ${siteName}...`);

    setTimeout(() => {
      setSites(prev => prev.map(s => s.id === siteId ? { ...s, status: 'Live' } : s));
      toast.success(`${siteName} redeployed successfully`);
    }, 3000);
  };

  const handleDeleteSite = (siteId: string, siteName: string) => {
    if (confirm(`Are you sure you want to delete ${siteName}?`)) {
      setSites(prev => prev.filter(s => s.id !== siteId));
      toast.error(`${siteName} has been removed`);
    }
  };

  const handleToggleStatus = (siteId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Offline' ? 'Live' : 'Offline';
    setSites(prev => prev.map(s => s.id === siteId ? { ...s, status: newStatus as any } : s));
    toast.info(`${newStatus === 'Live' ? 'Resuming' : 'Pausing'} site...`);
  };

  return (
    <div className="p-8 space-y-8 bg-slate-950 min-h-full text-slate-200">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Website Hosting</h1>
          <p className="text-slate-500 mt-1">Manage your live deployments and domain configurations.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsDomainModalOpen(true)}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition-all border border-slate-700 flex items-center gap-2"
          >
            <Globe size={18} />
            Domains
          </button>
          <button 
            onClick={() => setIsDeployModalOpen(true)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
          >
            <Plus size={18} />
            Deploy New Site
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
          <div className="flex items-center gap-2 text-blue-500 mb-2">
            <Globe size={18} />
            <span className="text-xs font-bold uppercase">Total Domains</span>
          </div>
          <h3 className="text-3xl font-bold">{sites.length + 2}</h3>
          <p className="text-xs text-slate-500">{sites.filter(s => s.status === 'Live').length} active, {sites.filter(s => s.status === 'Building').length} pending</p>
        </div>
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
          <div className="flex items-center gap-2 text-emerald-500 mb-2">
            <Shield size={18} />
            <span className="text-xs font-bold uppercase">SSL Certificates</span>
          </div>
          <h3 className="text-3xl font-bold">100%</h3>
          <p className="text-xs text-slate-500">All sites secured with HTTPS</p>
        </div>
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
          <div className="flex items-center gap-2 text-purple-500 mb-2">
            <Activity size={18} />
            <span className="text-xs font-bold uppercase">Average Uptime</span>
          </div>
          <h3 className="text-3xl font-bold">99.99%</h3>
          <p className="text-xs text-slate-500">Last 30 days performance</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">Active Deployments</h2>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock size={14} />
            Auto-refresh enabled
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Site Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Domain</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Visitors</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Last Deployed</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sites.map((site) => (
                <tr key={site.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                        <Rocket size={16} className={site.status === 'Error' ? 'text-red-500' : 'text-blue-500'} />
                      </div>
                      <span className="text-sm font-bold">{site.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      {site.domain}
                      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 w-fit ${
                      site.status === 'Live' ? 'bg-emerald-900/20 text-emerald-500' :
                      site.status === 'Building' ? 'bg-blue-900/20 text-blue-500 animate-pulse' :
                      site.status === 'Offline' ? 'bg-slate-800 text-slate-500' :
                      'bg-red-900/20 text-red-500'
                    }`}>
                      {site.status === 'Live' && <CheckCircle2 size={10} />}
                      {site.status === 'Error' && <AlertCircle size={10} />}
                      {site.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{site.visitors}</td>
                  <td className="px-6 py-4 text-xs text-slate-500">{site.lastDeployed}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => handleToggleStatus(site.id, site.status)}
                        className={`p-2 rounded-lg transition-all ${
                          site.status === 'Offline' 
                            ? 'hover:bg-emerald-900/20 text-emerald-500' 
                            : 'hover:bg-amber-900/20 text-amber-500'
                        }`}
                        title={site.status === 'Offline' ? 'Resume' : 'Pause'}
                      >
                        {site.status === 'Offline' ? <Play size={14} /> : <Pause size={14} />}
                      </button>
                      <button 
                        onClick={() => handleRedeploy(site.id, site.name)}
                        className="p-2 hover:bg-blue-600/10 hover:text-blue-500 rounded-lg text-slate-400 transition-all"
                        title="Redeploy"
                      >
                        <RefreshCw size={14} className={site.status === 'Building' ? 'animate-spin' : ''} />
                      </button>
                      <button 
                        onClick={() => setSelectedSiteForManagement(site)}
                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-all"
                        title="Settings"
                      >
                        <Settings size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteSite(site.id, site.name)}
                        className="p-2 hover:bg-red-900/20 hover:text-red-500 rounded-lg text-slate-400 transition-all"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Site Management Modal */}
      <AnimatePresence>
        {selectedSiteForManagement && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSiteForManagement(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500">
                    <Rocket size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedSiteForManagement.name}</h2>
                    <p className="text-sm text-slate-500">{selectedSiteForManagement.domain}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedSiteForManagement(null)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Environment Variables */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Environment Variables</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'API_KEY', value: 'sk_test_••••••••' },
                        { key: 'DATABASE_URL', value: 'postgresql://user:pass@host:5432/db' },
                        { key: 'NODE_ENV', value: 'production' },
                      ].map((env, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-800">
                          <input 
                            type="text" 
                            readOnly 
                            value={env.key}
                            className="bg-transparent text-xs font-mono text-blue-400 w-1/3 outline-none"
                          />
                          <input 
                            type="text" 
                            readOnly 
                            value={env.value}
                            className="bg-transparent text-xs font-mono text-slate-300 flex-1 outline-none truncate"
                          />
                          <button className="text-slate-500 hover:text-white transition-colors">
                            <Settings size={14} />
                          </button>
                        </div>
                      ))}
                      <button className="w-full py-3 border-2 border-dashed border-slate-800 rounded-xl text-xs font-bold text-slate-500 hover:border-blue-500/50 hover:text-blue-500 transition-all flex items-center justify-center gap-2">
                        <Plus size={14} /> Add Environment Variable
                      </button>
                    </div>
                  </div>

                  {/* Deployment History */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Recent Activity</h3>
                    <div className="space-y-3">
                      {[
                        { event: 'Production Deployment', time: '2 hours ago', status: 'Success' },
                        { event: 'Manual Redeploy', time: '5 hours ago', status: 'Success' },
                        { event: 'Auto-Scaling Triggered', time: '1 day ago', status: 'Info' },
                        { event: 'Domain mapped: example.com', time: '2 days ago', status: 'Success' },
                      ].map((activity, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 hover:bg-slate-800/30 rounded-xl transition-all">
                          <div className={`w-2 h-2 rounded-full mt-1.5 ${
                            activity.status === 'Success' ? 'bg-emerald-500' : 'bg-blue-500'
                          }`} />
                          <div>
                            <p className="text-sm font-bold">{activity.event}</p>
                            <p className="text-[10px] text-slate-500 italic">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Advanced Build Settings */}
                <div className="p-6 bg-slate-800/30 border border-slate-800 rounded-3xl space-y-6">
                  <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                    <RefreshCw size={16} className="text-blue-500" /> Build & Output Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Build Command</label>
                      <input 
                        type="text" 
                        defaultValue="npm run build"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Output Directory</label>
                      <input 
                        type="text" 
                        defaultValue="dist"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="p-6 border border-red-900/20 bg-red-950/5 rounded-3xl space-y-4">
                  <h3 className="text-sm font-bold text-red-500 flex items-center gap-2">
                    <AlertCircle size={16} /> Danger Zone
                  </h3>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold">Delete this site</p>
                      <p className="text-xs text-slate-500">Once you delete a site, there is no going back. Please be certain.</p>
                    </div>
                    <button 
                      onClick={() => {
                        handleDeleteSite(selectedSiteForManagement.id, selectedSiteForManagement.name);
                        setSelectedSiteForManagement(null);
                      }}
                      className="px-4 py-2 border border-red-500/50 text-red-500 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-all whitespace-nowrap"
                    >
                      Delete Project
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end gap-3">
                <button 
                  onClick={() => setSelectedSiteForManagement(null)}
                  className="px-6 py-3 text-slate-400 hover:text-white font-bold transition-all text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    toast.success('Changes saved successfully');
                    setSelectedSiteForManagement(null);
                  }}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 text-sm"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isDeployModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeployModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Deploy New Site</h2>
                <button onClick={() => setIsDeployModalOpen(false)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleDeploy} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Site Name</label>
                  <input 
                    type="text" 
                    value={newSiteName}
                    onChange={(e) => setNewSiteName(e.target.value)}
                    placeholder="e.g. My Awesome Project"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    autoFocus
                  />
                </div>
                <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-xl">
                  <p className="text-xs text-blue-400 leading-relaxed">
                    Your site will be automatically assigned a <span className="font-bold">.run.app</span> subdomain. You can configure custom domains later.
                  </p>
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20"
                >
                  Start Deployment
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Domain Modal */}
      <AnimatePresence>
        {isDomainModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDomainModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Domain Configuration</h2>
                <button onClick={() => setIsDomainModalOpen(false)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter custom domain (e.g. example.com)"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                  <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all">
                    Add Domain
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-500 uppercase">Configured Domains</h3>
                  <div className="space-y-2">
                    {[
                      { domain: 'mubuslink.ai', type: 'Primary', status: 'Active' },
                      { domain: 'app.mubuslink.ai', type: 'Subdomain', status: 'Active' },
                      { domain: 'staging.mubuslink.ai', type: 'Subdomain', status: 'Pending' },
                    ].map((d, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-800 rounded-xl">
                        <div>
                          <p className="font-bold text-sm">{d.domain}</p>
                          <p className="text-xs text-slate-500">{d.type}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                            d.status === 'Active' ? 'bg-emerald-900/20 text-emerald-500' : 'bg-amber-900/20 text-amber-500'
                          }`}>
                            {d.status}
                          </span>
                          <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">DNS Settings</h4>
                  <div className="grid grid-cols-3 gap-4 text-[10px] font-mono">
                    <div className="space-y-1">
                      <p className="text-slate-500">TYPE</p>
                      <p className="text-white">A</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-500">NAME</p>
                      <p className="text-white">@</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-500">VALUE</p>
                      <p className="text-white">76.76.21.21</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Hosting;
