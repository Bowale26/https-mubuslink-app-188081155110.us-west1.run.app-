import React from 'react';
import { motion } from 'motion/react';
import { Folder, Plus, Users, Settings, MoreHorizontal, Shield, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PremiumFeatureGuard from './PremiumFeatureGuard';

interface WorkspaceManagerProps {
  onNavigateToPricing?: () => void;
}

const WorkspaceManager: React.FC<WorkspaceManagerProps> = ({ onNavigateToPricing }) => {
  const { profile } = useAuth();

  const members = [
    { name: 'John Doe', email: 'john@example.com', role: 'Owner', avatar: 'https://picsum.photos/seed/john/100/100' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'Admin', avatar: 'https://picsum.photos/seed/jane/100/100' },
    { name: 'Mike Ross', email: 'mike@example.com', role: 'Editor', avatar: 'https://picsum.photos/seed/mike/100/100' },
  ];

  return (
    <div className="p-8 space-y-8 bg-slate-950 min-h-full text-slate-200">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workspaces Manager</h1>
          <p className="text-slate-500 mt-1">Organize your projects and collaborate with your team.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20">
          <Plus size={20} /> New Workspace
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Folder className="text-blue-500" size={24} /> Active Workspaces
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Personal Projects', 'Client: Acme Corp', 'Side Hustle', 'Design Lab'].map((name, i) => (
                <div key={i} className="p-6 bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-blue-500/50 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-blue-500">
                      <Folder size={20} />
                    </div>
                    <MoreHorizontal className="text-slate-600" size={18} />
                  </div>
                  <h4 className="font-bold mb-1">{name}</h4>
                  <p className="text-xs text-slate-500">12 projects • 3 members</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Users className="text-purple-500" size={24} /> Team Members
              </h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all">
                <UserPlus size={16} /> Invite
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="pb-4 text-xs font-bold text-slate-500 uppercase">Member</th>
                    <th className="pb-4 text-xs font-bold text-slate-500 uppercase">Role</th>
                    <th className="pb-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {members.map((member, i) => (
                    <tr key={i}>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full" />
                          <div>
                            <p className="text-sm font-bold">{member.name}</p>
                            <p className="text-[10px] text-slate-500">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          member.role === 'Owner' ? 'bg-blue-900/20 text-blue-500' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400"><Settings size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6">
            <h3 className="font-bold flex items-center gap-2">
              <Shield className="text-amber-500" size={18} /> Workspace Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-2 block">Workspace Name</label>
                <input 
                  type="text" 
                  defaultValue="Personal Projects" 
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-2 block">Visibility</label>
                <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm outline-none">
                  <option>Private</option>
                  <option>Team Only</option>
                  <option>Public</option>
                </select>
              </div>
            </div>
            <button className="w-full py-3 bg-blue-600 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20">
              Update Settings
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
            <h3 className="font-bold">Storage Usage</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>1.2 GB of 5 GB used</span>
                <span>24%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full w-[24%] bg-blue-500" />
              </div>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              You are currently on the Free plan. Upgrade to Pro for 50GB storage and unlimited workspaces.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceManager;
