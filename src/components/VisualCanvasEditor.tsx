import React, { useState } from 'react';
import { motion, Reorder } from 'motion/react';
import { 
  Type, 
  Image as ImageIcon, 
  Square, 
  MousePointer2, 
  Settings2, 
  Plus, 
  Trash2, 
  ChevronLeft,
  Save,
  Monitor,
  Smartphone,
  Tablet,
  Layers
} from 'lucide-react';

interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'button' | 'section';
  content: string;
  styles: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    padding?: string;
    borderRadius?: string;
    textAlign?: 'left' | 'center' | 'right';
  };
}

interface VisualCanvasEditorProps {
  onClose: () => void;
  initialData?: any;
}

const VisualCanvasEditor: React.FC<VisualCanvasEditorProps> = ({ onClose, initialData }) => {
  const [elements, setElements] = useState<CanvasElement[]>([
    { 
      id: '1', 
      type: 'section', 
      content: 'Hero Section', 
      styles: { backgroundColor: '#1e293b', padding: '60px' } 
    },
    { 
      id: '2', 
      type: 'text', 
      content: 'Welcome to Our SaaS', 
      styles: { fontSize: '48px', fontWeight: '800', color: '#ffffff', textAlign: 'center' } 
    },
    { 
      id: '3', 
      type: 'text', 
      content: 'The ultimate platform for modern builders.', 
      styles: { fontSize: '18px', color: '#94a3b8', textAlign: 'center' } 
    },
    { 
      id: '4', 
      type: 'button', 
      content: 'Get Started', 
      styles: { backgroundColor: '#2563eb', color: '#ffffff', padding: '12px 24px', borderRadius: '12px' } 
    }
  ]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const selectedElement = elements.find(el => el.id === selectedId);

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const addElement = (type: CanvasElement['type']) => {
    const newElement: CanvasElement = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: type === 'text' ? 'New Text' : type === 'button' ? 'Click Me' : 'New Section',
      styles: type === 'button' ? { backgroundColor: '#2563eb', color: '#ffffff', padding: '10px 20px', borderRadius: '8px' } : {}
    };
    setElements([...elements, newElement]);
  };

  const removeElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col h-screen overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="h-6 w-px bg-slate-800" />
          <h2 className="font-bold text-slate-200">Visual Canvas Editor</h2>
        </div>

        <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button 
            onClick={() => setViewMode('desktop')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'desktop' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Monitor size={18} />
          </button>
          <button 
            onClick={() => setViewMode('tablet')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'tablet' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Tablet size={18} />
          </button>
          <button 
            onClick={() => setViewMode('mobile')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'mobile' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Smartphone size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-bold transition-all">
            Preview
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
            <Save size={16} /> Save Changes
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Elements */}
        <aside className="w-72 border-r border-slate-800 bg-slate-900 p-6 space-y-8 overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Add Elements</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => addElement('text')}
                className="flex flex-col items-center gap-2 p-4 bg-slate-800 border border-slate-700 rounded-2xl hover:border-blue-500 transition-all group"
              >
                <Type size={20} className="text-slate-400 group-hover:text-blue-500" />
                <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-300">Text</span>
              </button>
              <button 
                onClick={() => addElement('image')}
                className="flex flex-col items-center gap-2 p-4 bg-slate-800 border border-slate-700 rounded-2xl hover:border-blue-500 transition-all group"
              >
                <ImageIcon size={20} className="text-slate-400 group-hover:text-blue-500" />
                <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-300">Image</span>
              </button>
              <button 
                onClick={() => addElement('button')}
                className="flex flex-col items-center gap-2 p-4 bg-slate-800 border border-slate-700 rounded-2xl hover:border-blue-500 transition-all group"
              >
                <Square size={20} className="text-slate-400 group-hover:text-blue-500" />
                <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-300">Button</span>
              </button>
              <button 
                onClick={() => addElement('section')}
                className="flex flex-col items-center gap-2 p-4 bg-slate-800 border border-slate-700 rounded-2xl hover:border-blue-500 transition-all group"
              >
                <Layers size={20} className="text-slate-400 group-hover:text-blue-500" />
                <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-300">Section</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Layers</h3>
            <Reorder.Group axis="y" values={elements} onReorder={setElements} className="space-y-2">
              {elements.map(el => (
                <Reorder.Item 
                  key={el.id} 
                  value={el}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-grab active:cursor-grabbing ${selectedId === el.id ? 'bg-blue-600/10 border-blue-500/50 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                  onClick={() => setSelectedId(el.id)}
                >
                  <div className="flex items-center gap-3">
                    {el.type === 'text' && <Type size={14} />}
                    {el.type === 'image' && <ImageIcon size={14} />}
                    {el.type === 'button' && <Square size={14} />}
                    {el.type === 'section' && <Layers size={14} />}
                    <span className="text-xs font-bold truncate max-w-[120px]">{el.content}</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeElement(el.id); }}
                    className="p-1 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 bg-slate-950 p-12 overflow-y-auto flex justify-center">
          <div 
            className={`bg-white rounded-2xl shadow-2xl transition-all duration-500 overflow-hidden ${
              viewMode === 'desktop' ? 'w-full max-w-5xl' : 
              viewMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'
            }`}
          >
            <div className="min-h-[800px] p-8 space-y-6">
              {elements.map(el => (
                <motion.div
                  key={el.id}
                  layout
                  onClick={() => setSelectedId(el.id)}
                  className={`relative group cursor-pointer rounded-lg transition-all ${selectedId === el.id ? 'ring-2 ring-blue-500 ring-offset-4 ring-offset-white' : 'hover:ring-1 hover:ring-slate-200'}`}
                >
                  {el.type === 'text' && (
                    <div 
                      style={{ 
                        fontSize: el.styles.fontSize, 
                        fontWeight: el.styles.fontWeight, 
                        color: el.styles.color,
                        textAlign: el.styles.textAlign
                      }}
                      className="p-2"
                    >
                      {el.content}
                    </div>
                  )}
                  {el.type === 'button' && (
                    <div className={`flex justify-${el.styles.textAlign === 'center' ? 'center' : el.styles.textAlign === 'right' ? 'end' : 'start'}`}>
                      <button 
                        style={{ 
                          backgroundColor: el.styles.backgroundColor, 
                          color: el.styles.color,
                          padding: el.styles.padding,
                          borderRadius: el.styles.borderRadius
                        }}
                        className="font-bold shadow-lg"
                      >
                        {el.content}
                      </button>
                    </div>
                  )}
                  {el.type === 'section' && (
                    <div 
                      style={{ 
                        backgroundColor: el.styles.backgroundColor, 
                        padding: el.styles.padding 
                      }}
                      className="rounded-xl flex items-center justify-center text-white/20 font-bold uppercase tracking-widest"
                    >
                      {el.content}
                    </div>
                  )}
                  {el.type === 'image' && (
                    <div className="w-full h-48 bg-slate-100 rounded-xl flex items-center justify-center text-slate-300">
                      <ImageIcon size={48} />
                    </div>
                  )}

                  {selectedId === el.id && (
                    <div className="absolute -top-10 left-0 flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded-lg text-[10px] font-bold shadow-lg">
                      <MousePointer2 size={10} /> {el.type.toUpperCase()}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </main>

        {/* Right Sidebar - Properties */}
        <aside className="w-80 border-l border-slate-800 bg-slate-900 p-6 space-y-8 overflow-y-auto">
          {selectedElement ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-200 flex items-center gap-2">
                  <Settings2 size={18} className="text-blue-500" /> Properties
                </h3>
                <span className="text-[10px] bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full font-bold uppercase">{selectedElement.type}</span>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Content</label>
                  <input 
                    type="text" 
                    value={selectedElement.content}
                    onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-200 outline-none focus:border-blue-500 transition-all"
                  />
                </div>

                {selectedElement.type === 'text' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Font Size</label>
                      <select 
                        value={selectedElement.styles.fontSize}
                        onChange={(e) => updateElement(selectedElement.id, { styles: { ...selectedElement.styles, fontSize: e.target.value } })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-200 outline-none focus:border-blue-500 transition-all"
                      >
                        <option value="14px">Small (14px)</option>
                        <option value="18px">Medium (18px)</option>
                        <option value="24px">Large (24px)</option>
                        <option value="32px">X-Large (32px)</option>
                        <option value="48px">Huge (48px)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Alignment</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['left', 'center', 'right'].map(align => (
                          <button
                            key={align}
                            onClick={() => updateElement(selectedElement.id, { styles: { ...selectedElement.styles, textAlign: align as any } })}
                            className={`p-2 rounded-lg border transition-all text-xs font-bold capitalize ${selectedElement.styles.textAlign === align ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                          >
                            {align}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {(selectedElement.type === 'button' || selectedElement.type === 'section') && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Background Color</label>
                    <div className="grid grid-cols-5 gap-2">
                      {['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#1e293b'].map(color => (
                        <button
                          key={color}
                          onClick={() => updateElement(selectedElement.id, { styles: { ...selectedElement.styles, backgroundColor: color } })}
                          className={`w-8 h-8 rounded-lg border-2 transition-all ${selectedElement.styles.backgroundColor === color ? 'border-white scale-110' : 'border-transparent'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-600">
                <MousePointer2 size={32} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-400">No element selected</p>
                <p className="text-xs text-slate-600">Click on an element in the canvas to edit its properties.</p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default VisualCanvasEditor;
