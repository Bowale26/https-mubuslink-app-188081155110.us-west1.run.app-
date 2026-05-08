import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Eye, Copy, Star } from 'lucide-react';
import { toast } from 'sonner';

interface TemplatesProps {
  onNavigate: (tab: string) => void;
}

const Templates: React.FC<TemplatesProps> = ({ onNavigate }) => {
  const [category, setCategory] = useState('All');

  const categories = ['All', 'Landing Page', 'Portfolio', 'E-commerce', 'SaaS', 'Blog'];
  
  const templates = [
    { id: 1, name: 'Modern SaaS', category: 'SaaS', image: 'https://picsum.photos/seed/saas/400/300', premium: true },
    { id: 2, name: 'Creative Portfolio', category: 'Portfolio', image: 'https://picsum.photos/seed/portfolio/400/300', premium: false },
    { id: 3, name: 'Minimal Shop', category: 'E-commerce', image: 'https://picsum.photos/seed/shop/400/300', premium: true },
    { id: 4, name: 'Tech Blog', category: 'Blog', image: 'https://picsum.photos/seed/blog/400/300', premium: false },
    { id: 5, name: 'Startup Landing', category: 'Landing Page', image: 'https://picsum.photos/seed/startup/400/300', premium: false },
    { id: 6, name: 'Enterprise Dashboard', category: 'SaaS', image: 'https://picsum.photos/seed/dashboard/400/300', premium: true },
  ];

  const filteredTemplates = category === 'All' ? templates : templates.filter(t => t.category === category);

  return (
    <div className="p-8 space-y-8 bg-slate-950 min-h-full text-slate-200">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Template Library</h1>
          <p className="text-slate-500 mt-1">Choose from conversion-optimized designs.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search templates..." 
              className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-64"
            />
          </div>
          <button className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white">
            <Filter size={20} />
          </button>
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              category === cat 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTemplates.map((template, i) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all"
          >
            <div className="aspect-video bg-slate-800 relative overflow-hidden">
              <img 
                src={template.image} 
                alt={template.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button 
                  onClick={() => toast.info(`Previewing ${template.name}...`)}
                  className="p-3 bg-white text-slate-950 rounded-full hover:scale-110 transition-transform"
                  title="Preview"
                >
                  <Eye size={20} />
                </button>
                <button 
                  onClick={() => {
                    toast.success(`Template "${template.name}" selected! Opening builder...`);
                    onNavigate('website-builder');
                  }}
                  className="p-3 bg-blue-600 text-white rounded-full hover:scale-110 transition-transform"
                  title="Use Template"
                >
                  <Copy size={20} />
                </button>
              </div>
              {template.premium && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1 shadow-lg">
                  <Star size={10} fill="currentColor" /> PREMIUM
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg">{template.name}</h3>
                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-lg">{template.category}</span>
              </div>
              <p className="text-sm text-slate-500">Fully responsive and SEO optimized layout for your next project.</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Templates;
