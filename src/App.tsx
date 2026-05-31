import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Activity, 
  AlertTriangle, 
  RefreshCw, 
  Database,
  Terminal,
  LayoutDashboard,
  Globe,
  FileText,
  Code,
  Beaker,
  Image as ImageIcon,
  Music,
  Video,
  Megaphone,
  Search,
  Sparkles,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  FileCode,
  Copy,
  Bell,
  TrendingUp,
  Download,
  History,
  Trash2,
  Edit,
  X
} from 'lucide-react';

interface KPIStats {
  activeWebsites: number;
  totalVisitors: number;
  aiWordsWritten: number;
  botConversations: number;
  trialConversions: number;
  totalRevenue: number;
  totalSignups: number;
  _maintenance: string | null;
}

// Sparkline component to visualize KPI growth trajectory safely
const Sparkline = ({ points, color }: { points: number[], color: string }) => {
  if (!points || points.length === 0) return null;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const width = 80;
  const height = 22;
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - ((p - min) / range) * height * 0.8 - height * 0.1;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible select-none shrink-0">
      <polyline
        fill="none"
        stroke={
          color === 'emerald' ? '#10b981' : 
          color === 'blue' ? '#3b82f6' : 
          color === 'purple' ? '#a855f7' : 
          '#14b8a6'
        }
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={coords}
      />
    </svg>
  );
};

export default function App() {
  // Global View Navigation State
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [activeProject, setActiveProject] = useState<string>('general');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Stats KPI database state
  const [stats, setStats] = useState<KPIStats | null>(null);
  const [loadingStats, setLoadingStats] = useState<boolean>(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  // Shared Central Input bindings for Project Selector (to auto-inject parameters)
  const projectsPreset = {
    general: {
      businessName: "Mubuslink Central Law",
      jurisdictions: "EU, US, Canada",
      audience: "Legal Counsel & Chief Risk Officers",
      tone: "Authoritative",
      services: "Cross-Border Regulatory Checking & AI Contract Audits",
      brandStyle: "Deep Obsidian and Emerald"
    },
    fintech: {
      businessName: "VeloPay Compliance Corp",
      jurisdictions: "US (Delaware), United Kingdom",
      audience: "Fintech Startups & Venture Capitalists",
      tone: "Sleek & Protective",
      services: "Payment flow auditing and AML Policy drafting",
      brandStyle: "Midnight Blue and Platinum Accent"
    },
    ip_patent: {
      businessName: "Nova Patent Intelligence",
      jurisdictions: "Global WIPO, EU, China, Japan",
      audience: "DeepTech Researchers & Hardware Founders",
      tone: " Швейцарские (Swiss Modern) Precise",
      services: "Patent Prior Art Scrapes & Trade Secret Templates",
      brandStyle: "Monochrome Minimalist & Crimson Highlight"
    }
  };

  const getActiveParams = () => {
    return projectsPreset[activeProject as keyof typeof projectsPreset] || projectsPreset.general;
  };

  // --- Module State management ---
  
  // 1. Dashboard State
  const [systemLogs, setSystemLogs] = useState<string[]>([
    "[15:12:04] Mubuslink Core Orchestrator initialized.",
    "[15:12:05] Multi-Agent layers verified with 5 active endpoints.",
    "[15:12:06] Latency within server boundaries: 142ms."
  ]);

  // 2. Website Builder State
  const [siteParams, setSiteParams] = useState({
    businessName: "Mubuslink Central Law",
    jurisdictions: "EU, US, Canada",
    audience: "Legal Counsel & Chief Risk Officers",
    tone: "Authoritative",
    services: "Cross-Border Regulatory Checking & AI Contract Audits",
    brandStyle: "Deep Obsidian and Emerald",
    activeTab: "visual" as "visual" | "code"
  });
  const [siteOutput, setSiteOutput] = useState<any | null>(null);
  const [generatingSite, setGeneratingSite] = useState<boolean>(false);

  // Sync inputs on project change
  useEffect(() => {
    const params = getActiveParams();
    setSiteParams({
      businessName: params.businessName,
      jurisdictions: params.jurisdictions,
      audience: params.audience,
      tone: params.tone,
      services: params.services,
      brandStyle: params.brandStyle,
      activeTab: "visual"
    });
  }, [activeProject]);

  // 3. Templates Engine State
  const [templateParams, setTemplateParams] = useState({
    templateType: "Mutual Non-Disclosure Agreement",
    jurisdictions: "EU (GDPR Compliance) and US (Delaware General Corporation Law)",
    variables: "EffectiveDate, DisclosingParty, ReceivingParty, GoverningLaw, Arbitrator",
    tone: "Protective & Professional"
  });
  const [templateOutput, setTemplateOutput] = useState<any | null>(null);
  const [generatingTemplate, setGeneratingTemplate] = useState<boolean>(false);

  // 4. AI SuperLab State
  const [labParams, setLabParams] = useState({
    researchQuestion: "Under what conditions can biometric employee records be stored or processed for analytics in the EU, and how does this contrast with Texas Biometric Privacy rules (CIPA/PIPEDA)?",
    jurisdictions: "EU GDPR Art.9, State of Texas (CAPTCHA/CIPA), Canada (PIPEDA)",
    depth: "advanced" as "basic" | "intermediate" | "advanced"
  });
  const [labOutput, setLabOutput] = useState<any | null>(null);
  const [generatingLab, setGeneratingLab] = useState<boolean>(false);

  // 5. Image Studio State
  const [imageParams, setImageParams] = useState({
    description: "An isometric glass scale of justice sitting on top of modern, highly illuminated metallic liquid AI mainframe servers, dramatic volumetric teal lighting",
    style: "Cinematic Isometric Render, Octane Engine 3D",
    palette: "Emerald, Slate, Cyber Teal",
    useCase: "Website Landing Hero Image Illustration"
  });
  const [imageOutput, setImageOutput] = useState<any | null>(null);
  const [generatingImage, setGeneratingImage] = useState<boolean>(false);

  // 6. Audio Symphony State
  const [audioParams, setAudioParams] = useState({
    type: "voiceover",
    mood: "Sophisticated, authoritative, encouraging and trust-filled",
    voiceStyle: "British Executive Voice, deep timbre and subtle reverb",
    script: "Welcome to All Legal Matters AI. We provide automated, neutral, and globally consistent compliance checks to safeguard your cross-border enterprise."
  });
  const [audioOutput, setAudioOutput] = useState<any | null>(null);
  const [generatingAudio, setGeneratingAudio] = useState<boolean>(false);

  // 7. Neural Cinema State
  const [cinemaParams, setCinemaParams] = useState({
    goal: "Sleek trailer visualizing future legal risk scans happening instantly inside a holographic light cube",
    duration: "15s",
    style: "Hyperrealistic, 4K digital cinematography, slow dolly track shot, warm anamorphic flares",
    jurisdictions: "Global Jurisdictions"
  });
  const [cinemaOutput, setCinemaOutput] = useState<any | null>(null);
  const [generatingCinema, setGeneratingCinema] = useState<boolean>(false);

  // 8. Marketing Engine State
  const [marketingParams, setMarketingParams] = useState({
    audience: "In-House Legal, General Counsel, Chief Compliance Officers",
    jurisdictions: "Singapore, EU, United States",
    channel: "LinkedIn Sponsored Ad Copy",
    tone: "Wary yet Actionable",
    offer: "Complimentary Automated PDF Gap Analysis Audit for Cross-Border transfers"
  });
  const [marketingOutput, setMarketingOutput] = useState<any | null>(null);
  const [generatingMarketing, setGeneratingMarketing] = useState<boolean>(false);

  // 9. SEO & Sales Content State
  const [seoParams, setSeoParams] = useState({
    keyword: "cross border biometric data compliance standards 2026",
    jurisdictions: "Illinois (BIPA) & EU art 9",
    type: "blog",
    tone: "Informative"
  });
  const [seoOutput, setSeoOutput] = useState<any | null>(null);
  const [generatingSeo, setGeneratingSeo] = useState<boolean>(false);

  // 10. Fonts & Animations State
  const [fontParams, setFontParams] = useState({
    type: "css_animation",
    style: "Volumetric pulses radiating outward from the edges of custom interactive containers",
    brandPersonality: "Meticulous, futuristic, state-of-the-art corporate Swiss style",
    useCase: "Highlighting a pending compliance checklist on state change"
  });
  const [fontOutput, setFontOutput] = useState<any | null>(null);
  const [generatingFont, setGeneratingFont] = useState<boolean>(false);

  // Custom Global States for added specifications
  const [savedProjects, setSavedProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [updatingProject, setUpdatingProject] = useState<boolean>(false);
  const [activeChartTab, setActiveChartTab] = useState<'both' | 'visitors' | 'words'>('both');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showHistoricalTrend, setShowHistoricalTrend] = useState<boolean>(false);
  const [projectSearchQuery, setProjectSearchQuery] = useState<string>('');
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle');
  const [refreshingCache, setRefreshingCache] = useState<boolean>(false);

  // Global triggers
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const response = await fetch(`/api/stats?_t=${Date.now()}`);
      const data = await response.json();
      setStats(data);
      if (data._maintenance) {
        setErrorCode(data._maintenance.includes("Code 7") ? '7' : 'Warning');
      } else {
        setErrorCode(null);
      }
    } catch (err: any) {
      console.error("Error loading stats:", err);
      setErrorCode('7');
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchSavedProjects = async () => {
    setLoadingProjects(true);
    try {
      const response = await fetch(`/api/projects?_t=${Date.now()}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setSavedProjects(data);
      }
    } catch (err) {
      console.error("Failed to load saved projects:", err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleGeneralCacheRefresh = async () => {
    setRefreshingCache(true);
    try {
      // 1. Force fetch new statistics and project indices with absolute cache-busting
      await Promise.all([
        fetchStats(),
        fetchSavedProjects()
      ]);

      // 2. Clear out any potential draft local cache references to guarantee zero-state sync
      localStorage.removeItem('workspace_draft');

      // 3. Reset list filters to restore default visible state
      setProjectSearchQuery('');

      setSystemLogs(prev => [
        `[${new Date().toLocaleTimeString()}] Cache Sync: Purged system localStorage caches and synchronized live Firestore metrics successfully.`,
        ...prev
      ]);
    } catch (err: any) {
      console.warn("Failed to complete cache sync operation: ", err.message);
    } finally {
      setTimeout(() => {
        setRefreshingCache(false);
      }, 750);
    }
  };

  const handleDeleteProject = async (projId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent loading/editing when deleting
    
    if (!confirm("Are you sure you want to delete this project?")) return;

    setSystemLogs(prev => [
      `[${new Date().toLocaleTimeString()}] Requesting deletion of project ${projId} from Firestore...`,
      ...prev
    ]);

    try {
      const res = await fetch(`/api/projects/${projId}`, {
        method: 'DELETE'
      });
      const resData = await res.json();
      if (resData.success) {
        setSystemLogs(prev => [
          `[${new Date().toLocaleTimeString()}] Project ${projId} deleted successfully.`,
          ...prev
        ]);
        
        // If we are currently editing this project, exit edit mode
        if (editingProjectId === projId) {
          setEditingProjectId(null);
        }

        // Filter local state too
        setSavedProjects(prev => prev.filter(p => p.projectId !== projId));
      }
    } catch (err: any) {
      console.error("Failed to delete project:", err);
      setSystemLogs(prev => [
        `[${new Date().toLocaleTimeString()}] Error deleting project: ${err.message}`,
        ...prev
      ]);
    }
  };

  const handleUpdateProjectDetails = async () => {
    if (!editingProjectId) return;
    setUpdatingProject(true);
    
    const projectPayload = {
      projectId: editingProjectId,
      businessName: siteParams.businessName || "Untitled Legal Entity",
      jurisdictions: siteParams.jurisdictions || "Global Scope",
      audience: siteParams.audience || "Legal Operations",
      tone: siteParams.tone || "Authoritative",
      services: siteParams.services || "",
      brandStyle: siteParams.brandStyle || "",
      sitemap: siteOutput ? siteOutput.sitemap : [],
      pages: siteOutput ? siteOutput.pages : {},
      seo: siteOutput ? siteOutput.seo : {},
      createdAt: new Date().toISOString()
    };

    try {
      const saveRes = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectPayload)
      });
      const saveResult = await saveRes.json();
      if (saveResult.success) {
        setSystemLogs(prev => [
          `[${new Date().toLocaleTimeString()}] Successfully updated project '${projectPayload.businessName}' in Firestore (ID: ${editingProjectId})`,
          ...prev
        ]);
        if (saveResult.fallback) {
          setSavedProjects(prev => prev.map(p => p.projectId === editingProjectId ? projectPayload : p));
        }
      }
    } catch (err: any) {
      console.error("Updating project in Firestore failed:", err);
      setSystemLogs(prev => [
        `[${new Date().toLocaleTimeString()}] Error: Failed to update project details in Firestore: ${err.message}`,
        ...prev
      ]);
    } finally {
      setUpdatingProject(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Active real-time Firestore synchronization for generated user website projects
    setLoadingProjects(true);
    let unsubscribe = () => {};
    try {
      const q = query(collection(db, 'user_projects'), orderBy('createdAt', 'desc'));
      unsubscribe = onSnapshot(q, (snapshot) => {
        const projects: any[] = [];
        snapshot.forEach((doc) => {
          projects.push(doc.data());
        });
        setSavedProjects(projects);
        setLoadingProjects(false);
        setSystemLogs(prev => [
          `[${new Date().toLocaleTimeString()}] Live Cloud Sync: Refreshed ${projects.length} project(s) via real-time Firestore listener.`,
          ...prev
        ]);
      }, (err) => {
        console.warn("Firestore onSnapshot error, resorting to HTTP fetch:", err);
        fetchSavedProjects();
      });
    } catch (e: any) {
      console.warn("Could not bind real-time listener to Firestore: ", e.message);
      fetchSavedProjects();
    }

    return () => {
      unsubscribe();
    };
  }, []);

  // Serialized state key to safely track output updates without causing infinite rendering loops
  const siteOutputSerialized = siteOutput ? JSON.stringify(siteOutput) : "";

  // Debounced auto-save mechanism for Website Builder inputs
  useEffect(() => {
    if (!siteParams.businessName || siteParams.businessName === "Mubuslink Central Law" && !editingProjectId) {
      // Don't auto-save generic initially loaded values
      return;
    }

    const timer = setTimeout(async () => {
      const targetId = editingProjectId || 'workspace_draft';
      setAutoSaveStatus('saving');

      const projectPayload = {
        projectId: targetId,
        businessName: siteParams.businessName || "Workspace Draft",
        jurisdictions: siteParams.jurisdictions || "Global Scope",
        audience: siteParams.audience || "Legal Operations",
        tone: siteParams.tone || "Authoritative",
        services: siteParams.services || "",
        brandStyle: siteParams.brandStyle || "",
        sitemap: siteOutput ? siteOutput.sitemap : [],
        pages: siteOutput ? siteOutput.pages : {},
        seo: siteOutput ? siteOutput.seo : {},
        createdAt: new Date().toISOString()
      };

      try {
        const saveRes = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectPayload)
        });
        const saveResult = await saveRes.json();
        if (saveResult.success) {
          setAutoSaveStatus('saved');
          setSystemLogs(prev => [
            `[${new Date().toLocaleTimeString()}] Auto-save: Updated '${projectPayload.businessName}' automatically (ID: ${targetId}).`,
            ...prev
          ]);
        } else {
          setAutoSaveStatus('failed');
        }
      } catch (err: any) {
        console.warn("Auto-save mechanism failed:", err.message);
        setAutoSaveStatus('failed');
      }
    }, 1500); // 1.5 seconds debounce

    return () => clearTimeout(timer);
  }, [
    siteParams.businessName,
    siteParams.jurisdictions,
    siteParams.audience,
    siteParams.tone,
    siteParams.services,
    siteParams.brandStyle,
    editingProjectId,
    siteOutputSerialized
  ]);

  const handleDownloadProject = (format: 'json' | 'csv') => {
    if (!siteOutput) return;

    const exportData = {
      businessName: siteParams.businessName || "Mubuslink Central Law",
      jurisdictions: siteParams.jurisdictions,
      audience: siteParams.audience,
      tone: siteParams.tone,
      services: siteParams.services,
      brandStyle: siteParams.brandStyle,
      sitemap: siteOutput.sitemap || [],
      pages: siteOutput.pages || {},
      seo: siteOutput.seo || {}
    };

    let fileContent = '';
    let fileName = `project_${exportData.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
    let mimeType = '';

    if (format === 'json') {
      fileContent = JSON.stringify(exportData, null, 2);
      fileName += '.json';
      mimeType = 'application/json';
    } else {
      // Export as CSV structured data
      const rows = [
        ['Category', 'Property/Page', 'Details/Content'],
        ['Metadata', 'Business Name', exportData.businessName],
        ['Metadata', 'Jurisdictions', exportData.jurisdictions],
        ['Metadata', 'Audience', exportData.audience],
        ['Metadata', 'Tone', exportData.tone],
        ['Metadata', 'Services', exportData.services],
        ['Metadata', 'Brand Style', exportData.brandStyle],
      ];

      // Add Sitemap entries
      if (Array.isArray(exportData.sitemap)) {
        exportData.sitemap.forEach(page => {
          rows.push(['Sitemap', 'Page URL', page]);
        });
      }

      // Add SEO Data
      if (exportData.seo) {
        Object.entries(exportData.seo).forEach(([k, v]) => {
          rows.push(['SEO', k, typeof v === 'object' ? JSON.stringify(v) : String(v)]);
        });
      }

      // Add Page content entries
      if (exportData.pages) {
        Object.entries(exportData.pages).forEach(([pageName, pageContent]) => {
          rows.push(['Page Content', pageName, typeof pageContent === 'object' ? JSON.stringify(pageContent) : String(pageContent)]);
        });
      }

      fileContent = rows.map(r => r.map(val => {
        const cleanVal = String(val).replace(/"/g, '""');
        return `"${cleanVal}"`;
      }).join(',')).join('\n');

      fileName += '.csv';
      mimeType = 'text/csv';
    }

    const blob = new Blob([fileContent], { type: `${mimeType};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSystemLogs(prev => [
      `[${new Date().toLocaleTimeString()}] Download: Successfully exported project data to ${fileName}`,
      ...prev
    ]);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const downloadReport = (filename: string, contentText: string) => {
    try {
      const blob = new Blob([contentText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setSystemLogs(prev => [
        `[${new Date().toLocaleTimeString()}] Downloaded report successfully: ${filename}`,
        ...prev
      ]);
    } catch (err: any) {
      console.error("Report download failed:", err);
    }
  };

  // Central Generate Handler
  const handleGenerate = async (moduleName: string, inputsObj: any, setOutputFn: any, setLoadingFn: any) => {
    setLoadingFn(true);
    
    // Append simulated workflow step for user logs
    setSystemLogs(prev => [
      `[${new Date().toLocaleTimeString()}] Handshaking with Central AI Orchestrator: Generating ${moduleName} block...`,
      ...prev
    ]);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: moduleName,
          inputs: inputsObj
        })
      });
      const resData = await res.json();
      if (resData.success && resData.data) {
        setOutputFn(resData.data);
        setSystemLogs(prev => [
          `[${new Date().toLocaleTimeString()}] Successfully compiled ${moduleName} assets! Data streams populated.`,
          ...prev
        ]);

        // If it is the website builder module, persist structure to Firestore user_projects collection
        if (moduleName === 'website') {
          const uniqueProjId = editingProjectId || `site_${Date.now()}`;
          const projectPayload = {
            projectId: uniqueProjId,
            businessName: inputsObj.businessName || "Untitled Legal Entity",
            jurisdictions: inputsObj.jurisdictions || "Global Scope",
            audience: inputsObj.audience || "Legal Operations",
            tone: inputsObj.tone || "Authoritative",
            services: inputsObj.services || "",
            brandStyle: inputsObj.brandStyle || "",
            sitemap: resData.data.sitemap || [],
            pages: resData.data.pages || {},
            seo: resData.data.seo || {},
            createdAt: new Date().toISOString()
          };

          try {
            const saveRes = await fetch('/api/projects', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(projectPayload)
            });
            const saveResult = await saveRes.json();
            if (saveResult.success) {
              setSystemLogs(prev => [
                `[${new Date().toLocaleTimeString()}] Automatically saved project '${projectPayload.businessName}' to Firestore 'user_projects' (ID: ${uniqueProjId})`,
                ...prev
              ]);
              if (saveResult.fallback) {
                // Prepend manually if server bypassed DB setup
                setSavedProjects(prev => [projectPayload, ...prev]);
              } else {
                fetchSavedProjects();
              }
            }
          } catch (saveErr: any) {
            console.error("Auto-syncing to Firestore failed:", saveErr);
          }
        }

      } else {
        throw new Error(resData.error || "Handshake API error payload");
      }
    } catch (err: any) {
      console.error(`Gemini Generation on ${moduleName} failed:`, err);
      // Fallback fallback generator to keep things bulletproof
      setSystemLogs(prev => [
        `[${new Date().toLocaleTimeString()}] error: Unified generator failed (${err.message}). Activating local offline fallback fallback synthesis...`,
        ...prev
      ]);
      const fallbackData = getOfflineFallback(moduleName, inputsObj);
      setOutputFn(fallbackData);

      // Save offline fallback generation to user_projects in Firestore too so it adheres to intent
      if (moduleName === 'website') {
        const uniqueProjId = editingProjectId || `site_${Date.now()}`;
        const fallbackPayload = {
          projectId: uniqueProjId,
          businessName: inputsObj.businessName || "Local Fallback Entity",
          jurisdictions: inputsObj.jurisdictions || "Local Scope",
          audience: inputsObj.audience || "General",
          tone: inputsObj.tone || "Formal",
          services: inputsObj.services || "",
          brandStyle: inputsObj.brandStyle || "",
          sitemap: fallbackData.sitemap || [],
          pages: fallbackData.pages || {},
          seo: fallbackData.seo || {},
          createdAt: new Date().toISOString()
        };

        try {
          const saveRes = await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fallbackPayload)
          });
          const saveResult = await saveRes.json();
          if (saveResult.success) {
            if (saveResult.fallback) {
              setSavedProjects(prev => [fallbackPayload, ...prev]);
            } else {
              fetchSavedProjects();
            }
          }
        } catch (e: any) {
          console.warn("Auto-saving offline fallback project to Firestore failed:", e.message);
        }
      }

    } finally {
      setLoadingFn(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative selection:bg-emerald-500/30 selection:text-white" id="legaltech-workspace">
      
      {/* Decorative cybernetic light flows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[700px] h-[500px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Database Warning banner */}
      {errorCode && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-400 text-xs py-2 px-6 flex items-center justify-between gap-3 animate-slide-down relative z-50">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="animate-pulse" />
            <span className="font-semibold uppercase tracking-wider text-[10px] font-mono">System Balance:</span>
            <span className="opacity-95">{stats?._maintenance || `Database Handshake Alert (Permission Denied / Code ${errorCode}) resolved with fail-safe cache.`}</span>
          </div>
          <button 
            onClick={fetchStats}
            className="px-2.5 py-0.5 bg-amber-500 text-slate-950 font-black rounded text-[9px] hover:bg-amber-400 uppercase tracking-wider transition-colors"
          >
            Refresh Hook Connection
          </button>
        </div>
      )}

      {/* Sticky Global Topbar */}
      <header className="border-b border-slate-900 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 py-3.5 px-6 flex items-center justify-between shadow-sm" id="top-bar">
        <div className="flex items-center gap-3">
          <div className="h-8.5 w-8.5 bg-gradient-to-tr from-emerald-600 to-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-emerald-500/10">
            <Bot size={18} className="text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-sm tracking-tight text-white font-display">All Legal Matters</h1>
              <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md font-bold text-emerald-400 font-mono tracking-wider">SECURE OS</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">Google AI Studio • Universal Legal Tech Platform</p>
          </div>
        </div>

        {/* Central Top Selector: Project WorkspaceDropdown */}
        <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-slate-900/60 border border-slate-850 rounded-xl" id="project-combo">
          <span className="text-[9px] font-black uppercase text-slate-500 font-mono tracking-widest">Active Scope:</span>
          <select 
            value={activeProject}
            onChange={(e) => {
              setActiveProject(e.target.value);
              setSystemLogs(prev => [
                `[${new Date().toLocaleTimeString()}] Switched global system scope to project: [${e.target.value.toUpperCase()}]`,
                ...prev
              ]);
            }}
            className="bg-transparent text-slate-200 text-xs font-semibold outline-none border-none py-0.5 pr-2 cursor-pointer focus:ring-0 text-slate-100"
          >
            <option value="general" className="bg-slate-950 text-slate-200">mubuslink_central (EU-US Contract auditing)</option>
            <option value="fintech" className="bg-slate-950 text-slate-200">velopay_licensing (AML & Payment controls)</option>
            <option value="ip_patent" className="bg-slate-950 text-slate-200">nova_patent_intelligence (WIPO Trade Secrets)</option>
          </select>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-slate-900 border border-slate-850 rounded-lg font-mono text-[9px] text-slate-400">
            <Activity className="text-emerald-500 animate-pulse" size={12} />
            <span>LATENCY: 42ms</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-850 rounded-lg transition-colors relative" title="Notifications">
              <Bell size={14} />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-emerald-500 rounded-full" />
            </button>
            
            {/* User Avatar */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-850 py-1 px-2.5 rounded-xl">
              <div className="h-5 w-5 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                IM
              </div>
              <span className="text-[10px] text-slate-300 font-medium hidden lg:inline">isadewum@gmail.com</span>
            </div>
          </div>
        </div>
      </header>

      {/* Grid Layout Container */}
      <div className="flex-1 flex flex-col md:flex-row relative z-10">
        
        {/* Navigation Sidebar App Launcher */}
        <aside className="w-full md:w-64 border-r border-slate-900 bg-slate-950/70 p-4.5 flex flex-col gap-1 shrink-0" id="left-sidebar">
          
          <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-3 mb-2.5 font-mono">
            Orchestrator Modules
          </div>

          {[
            { id: "dashboard", label: "Dashboard Hub", icon: LayoutDashboard },
            { id: "website", label: "Website Builder", icon: Globe, highlight: true },
            { id: "templates", label: "Templates Engine", icon: FileText },
            { id: "superlab", label: "AI SuperLab", icon: Beaker },
            { id: "imagestudio", label: "Image Studio", icon: ImageIcon },
            { id: "audiosymphony", label: "Audio Symphony", icon: Music },
            { id: "neuralcinema", label: "Neural Cinema", icon: Video },
            { id: "marketing", label: "Marketing Engine", icon: Megaphone },
            { id: "seo", label: "SEO & Sales Content", icon: Search },
            { id: "fonts", label: "Fonts & Animations", icon: Code }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id);
                  setSystemLogs(prev => [
                    `[${new Date().toLocaleTimeString()}] Loaded screen module: [${item.label.toUpperCase()}]`,
                    ...prev
                  ]);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive 
                    ? 'bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 font-bold' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={15} className={isActive ? 'text-emerald-400' : 'text-slate-500'} />
                  <span>{item.label}</span>
                </div>
                {item.highlight && !isActive && (
                  <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                )}
                {isActive && (
                  <ChevronRight size={12} className="text-emerald-400 animate-fade-in" />
                )}
              </button>
            );
          })}

          <div className="mt-8 pt-4.5 border-t border-slate-900">
            <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-900/80 text-[10px]">
              <div className="flex items-center gap-1.5 font-bold text-slate-300 font-display">
                <Database size={11} className="text-emerald-400" />
                <span>Active Database ID:</span>
              </div>
              <p className="font-mono text-slate-500 mt-1 truncate">gen-lang-client-0352644080</p>
              <div className="mt-2 text-[9px] text-slate-400 leading-relaxed bg-slate-950 p-2 rounded border border-slate-850">
                ✔️ No legal advice policy locked. Global neutral baseline active.
              </div>
            </div>
          </div>
        </aside>

        {/* Central Workspace Canvas panel */}
        <main className="flex-1 p-5 md:p-7 overflow-y-auto max-w-[1400px] mx-auto w-full">
          
          {/* Active Title Banner */}
          <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-900 pb-5" id="section-meta-head">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-semibold">ALL LEGAL MATTERS PLATFORM</span>
                <span className="text-[10px] text-emerald-500">•</span>
                <span className="text-[10px] text-slate-400 uppercase font-mono font-medium">Orchestrated Layer API</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white font-display tracking-tight capitalize select-text">
                {activeMenu === 'dashboard' ? 'Universal Control Center' : `${activeMenu.replace('_', ' ')} Studio`}
              </h2>
            </div>

            {/* Visual configuration state helper & cache invalidator */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="p-2 bg-slate-900/60 border border-slate-850 rounded-xl text-[11px] flex items-center gap-3">
                <span className="font-mono text-slate-400">Project Context: <strong className="text-white font-semibold">{getActiveParams().businessName}</strong></span>
                <span className="h-3 w-px bg-slate-800" />
                <span className="font-mono text-slate-400">Tone Context: <strong className="text-emerald-400">{getActiveParams().tone}</strong></span>
              </div>
              <button
                onClick={handleGeneralCacheRefresh}
                className="p-2 text-[11px] bg-slate-900/80 hover:bg-emerald-950/40 text-slate-300 hover:text-emerald-400 border border-slate-850 hover:border-emerald-500/30 rounded-xl flex items-center gap-1.5 transition-all font-mono shadow-sm"
                title="Bypass client-side browser cache & force refresh database states manually"
                id="general-cache-refresh-btn"
              >
                <RefreshCw size={11} className={refreshingCache ? "animate-spin" : ""} />
                <span>Fix & Refresh Engine</span>
              </button>
            </div>
          </div>

          {/* 1. SECTION: DASHBOARD HUB */}
          {activeMenu === 'dashboard' && (
            <div className="space-y-6" id="view-dashboard">
              
              {/* Trend Analysis Toggle Bar */}
              <div className="flex items-center justify-between bg-slate-900/30 border border-slate-900/80 p-3.5 px-5 rounded-2xl animate-fade-in">
                <div className="flex items-center gap-2">
                  <History size={14} className="text-emerald-400" />
                  <span className="text-xs font-semibold text-slate-100 font-display">Historical KPI Trend Intelligence</span>
                  <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">(6-Month Trajectory Analysis)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className={`text-[10px] font-mono transition-colors ${showHistoricalTrend ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                    {showHistoricalTrend ? '6-Month History Active' : 'Show 6-Month Trend'}
                  </span>
                  <button
                    onClick={() => setShowHistoricalTrend(!showHistoricalTrend)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      showHistoricalTrend ? 'bg-emerald-600' : 'bg-slate-800'
                    }`}
                    id="historical-trend-toggle"
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        showHistoricalTrend ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* KPIs Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
                {[
                  { 
                    label: "Active Sites Map", 
                    val: stats ? stats.activeWebsites : 12, 
                    sub: showHistoricalTrend ? "6M Data Variance" : "Express hosted", 
                    color: "emerald",
                    trend: "+8.3% MoM",
                    points: showHistoricalTrend 
                      ? [5, 7, 8, 9, 10, stats ? stats.activeWebsites : 12] 
                      : [8, 9, 10, 11, stats ? stats.activeWebsites : 12]
                  },
                  { 
                    label: "Compliance Traffic", 
                    val: stats ? stats.totalVisitors.toLocaleString() : "45,200", 
                    sub: showHistoricalTrend ? "6M Traffic Wave" : "Globally Neutral", 
                    color: "blue",
                    trend: "+18.4% growth",
                    points: showHistoricalTrend
                      ? [3000, 8000, 15000, 24000, 36000, stats ? stats.totalVisitors : 45200]
                      : [12000, 18000, 26050, 35000, stats ? stats.totalVisitors : 45200]
                  },
                  { 
                    label: "AI Words Written", 
                    val: stats ? stats.aiWordsWritten.toLocaleString() : "128,500", 
                    sub: showHistoricalTrend ? "6M AI Expansion" : "Gemini Generated", 
                    color: "purple",
                    trend: "+34.2% spike",
                    points: showHistoricalTrend
                      ? [5000, 18000, 35000, 60000, 92000, stats ? stats.aiWordsWritten : 128500]
                      : [24000, 42000, 68000, 95000, stats ? stats.aiWordsWritten : 128500]
                  },
                  { 
                    label: "Bot Dialogs Cache", 
                    val: stats ? stats.botConversations : "1,240", 
                    sub: showHistoricalTrend ? "6M Active Logs" : "Secure Firestore", 
                    color: "teal",
                    trend: "+12.1% active",
                    points: showHistoricalTrend
                      ? [300, 600, 850, 1000, 1150, stats ? stats.botConversations : 1240]
                      : [800, 950, 1050, 1120, stats ? stats.botConversations : 1240]
                  }
                ].map((kpi, idx) => (
                  <div key={idx} className="p-4 bg-slate-900/40 border border-slate-900 rounded-2xl flex flex-col hover:border-slate-800 transition-all justify-between min-h-[135px]">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">{kpi.label}</span>
                        <span className={`text-[8.5px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5 ${
                          kpi.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' :
                          kpi.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
                          kpi.color === 'purple' ? 'bg-purple-500/10 text-purple-400' :
                          'bg-teal-500/10 text-teal-400'
                        }`}>
                          <TrendingUp size={9} />
                          <span>{kpi.trend}</span>
                        </span>
                      </div>
                      <span className="text-2xl font-black text-white font-display mt-2.5 block">{kpi.val}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 gap-2">
                      <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-mono">
                        <div className={`h-1.5 w-1.5 rounded-full ${
                          kpi.color === 'emerald' ? 'bg-emerald-500 animate-pulse' :
                          kpi.color === 'blue' ? 'bg-blue-500 animate-pulse' :
                          kpi.color === 'purple' ? 'bg-purple-500 animate-pulse' :
                          'bg-teal-500 animate-pulse'
                        }`} />
                        <span className="truncate max-w-[80px]">{kpi.sub}</span>
                      </div>
                      
                      <Sparkline points={kpi.points} color={kpi.color} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Detailed Trend and Growth Trajectory Chart Card */}
              <div className="p-6 bg-slate-900/30 border border-slate-900 rounded-3xl space-y-4 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <Activity size={16} className="text-blue-400" />
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-slate-100 font-display">KPI Growth Analytics Engine</h3>
                      <p className="text-[10px] text-slate-500 font-mono">Traversing monthly records correlation for neutral compliance audit metrics</p>
                    </div>
                  </div>

                  {/* Dual Series Legend and Tab selectors */}
                  <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-900 text-[10px]">
                    <button
                      onClick={() => setActiveChartTab('both')}
                      className={`px-2.5 py-1 font-bold rounded-md transition-all outline-none ${activeChartTab === 'both' ? 'bg-slate-900 text-emerald-400 border border-slate-850' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      Correlation
                    </button>
                    <button
                      onClick={() => setActiveChartTab('visitors')}
                      className={`px-2.5 py-1 font-bold rounded-md transition-all outline-none ${activeChartTab === 'visitors' ? 'bg-slate-900 text-blue-400 border border-slate-850' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      Traffic
                    </button>
                    <button
                      onClick={() => setActiveChartTab('words')}
                      className={`px-2.5 py-1 font-bold rounded-md transition-all outline-none ${activeChartTab === 'words' ? 'bg-slate-900 text-purple-400 border border-slate-850' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      AI Words
                    </button>
                  </div>
                </div>

                {/* SVG Graph visual drawing stage */}
                <div className="relative pt-6 pb-2 min-h-[220px]">
                  
                  {(() => {
                    const months = ["Jan", "Feb", "Mar", "Apr", "May"];
                    const vPoints = [12400, 18200, 26100, 35800, stats ? stats.totalVisitors : 45200];
                    const wPoints = [24500, 41200, 68100, 95400, stats ? stats.aiWordsWritten : 128500];

                    const maxV = Math.max(...vPoints);
                    const maxW = Math.max(...wPoints);

                    const graphWidth = 600;
                    const graphHeight = 160;

                    // Compute coordinate strings for line graphs
                    const vCoords = vPoints.map((v, i) => {
                      const x = (i / (vPoints.length - 1)) * graphWidth;
                      const y = graphHeight - (v / maxV) * graphHeight * 0.82 - graphHeight * 0.09;
                      return { x, y, value: v, label: months[i] };
                    });

                    const wCoords = wPoints.map((w, i) => {
                      const x = (i / (wPoints.length - 1)) * graphWidth;
                      const y = graphHeight - (w / maxW) * graphHeight * 0.82 - graphHeight * 0.09;
                      return { x, y, value: w, label: months[i] };
                    });

                    const vLinePath = vCoords.map(pt => `${pt.x},${pt.y}`).join(' ');
                    const wLinePath = wCoords.map(pt => `${pt.x},${pt.y}`).join(' ');

                    return (
                      <div className="w-full flex flex-col md:flex-row gap-6 items-center">
                        
                        {/* Interactive Responsive View container wrapper */}
                        <div className="flex-1 w-full relative">
                          
                          {/* Y-Axes Gridlines */}
                          <div className="absolute inset-x-0 top-0 h-[160px] flex flex-col justify-between pointer-events-none opacity-[0.04]">
                            {[0, 1, 2, 3, 4].map(idx => (
                              <div key={idx} className="w-full border-t border-slate-100" />
                            ))}
                          </div>

                          <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`} className="w-full h-[160px] overflow-visible">
                            
                            {/* Blue Line: Visitors */}
                            {(activeChartTab === 'both' || activeChartTab === 'visitors') && (
                              <>
                                <polyline
                                  fill="none"
                                  stroke="#3b82f6"
                                  strokeWidth="3.2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  points={vLinePath}
                                  className="transition-all duration-300"
                                />
                                <polyline
                                  fill="none"
                                  stroke="#3b82f6"
                                  strokeWidth="10"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  opacity="0.1"
                                  points={vLinePath}
                                />
                                {/* Blue circles */}
                                {vCoords.map((pt, i) => (
                                  <circle
                                    key={`vCircle-${i}`}
                                    cx={pt.x}
                                    cy={pt.y}
                                    r={hoveredIndex === i ? 6 : 4}
                                    className="fill-slate-950 stroke-blue-500 stroke-2 cursor-pointer transition-all duration-150"
                                    onMouseEnter={() => setHoveredIndex(i)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                  />
                                ))}
                              </>
                            )}

                            {/* Purple Line: AI Words */}
                            {(activeChartTab === 'both' || activeChartTab === 'words') && (
                              <>
                                <polyline
                                  fill="none"
                                  stroke="#a855f7"
                                  strokeWidth="3.2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  points={wLinePath}
                                  className="transition-all duration-300"
                                />
                                <polyline
                                  fill="none"
                                  stroke="#a855f7"
                                  strokeWidth="10"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  opacity="0.1"
                                  points={wLinePath}
                                />
                                {/* Purple circles */}
                                {wCoords.map((pt, i) => (
                                  <circle
                                    key={`wCircle-${i}`}
                                    cx={pt.x}
                                    cy={pt.y}
                                    r={hoveredIndex === i ? 6 : 4}
                                    className="fill-slate-950 stroke-purple-500 stroke-2 cursor-pointer transition-all duration-150"
                                    onMouseEnter={() => setHoveredIndex(i)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                  />
                                ))}
                              </>
                            )}
                          </svg>

                          {/* X-Axis labels */}
                          <div className="flex justify-between mt-2.5 px-1 text-[9px] font-mono font-semibold text-slate-500">
                            {months.map((m, idx) => (
                              <span key={idx} className={hoveredIndex === idx ? "text-emerald-400 font-bold transition-colors" : "transition-colors"}>
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Status sidebar panel detailing active index parameters */}
                        <div className="w-full md:w-[180px] p-4 bg-slate-1000/60 border border-slate-900 rounded-2xl shrink-0 flex flex-col justify-center gap-3">
                          <div className="text-center md:text-left">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block font-mono">Telemetry Node</span>
                            <span className="text-xs font-bold text-white mt-1 block">
                              {hoveredIndex !== null ? months[hoveredIndex] : "Average Aggregate"} 2026
                            </span>
                          </div>

                          <div className="space-y-2 text-[10px] font-mono">
                            <div className="flex items-center justify-between py-1 border-b border-slate-900">
                              <span className="text-blue-400 font-semibold">• Visitors</span>
                              <span className="text-white font-bold select-all">
                                {hoveredIndex !== null ? vPoints[hoveredIndex].toLocaleString() : "27,500"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between py-1">
                              <span className="text-purple-400 font-semibold">• AI Words</span>
                              <span className="text-white font-bold select-all">
                                {hoveredIndex !== null ? wPoints[hoveredIndex].toLocaleString() : "71,440"}
                              </span>
                            </div>
                          </div>

                          <p className="text-[9px] text-slate-500 leading-normal italic text-center md:text-left mt-1 font-sans">
                            {hoveredIndex !== null ? "Focus active." : "Hover points for telemetry metrics."}
                          </p>
                        </div>

                      </div>
                    );
                  })()}

                </div>
              </div>

              {/* Bento Grid layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Simulated Business Profile & Jurisdictions State (7 Columns) */}
                <div className="lg:col-span-7 bg-slate-900/30 border border-slate-900 rounded-3xl p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <Sparkles size={16} className="text-emerald-400" />
                      <h3 className="text-sm font-black uppercase tracking-wider text-slate-100 font-display">Target Client Demographics</h3>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 font-mono rounded border border-emerald-500/20">Preset Active</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed select-text">
                    This compliance profile is shared across Google AI Studio modules. You can switch scope in the top selector to automatically recalculate parameters:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Corporate Entity Name</span>
                      <span className="text-xs font-semibold text-white mt-1 block select-text">{getActiveParams().businessName}</span>
                    </div>
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Active Legal Scope</span>
                      <span className="text-xs font-semibold text-white mt-1 block select-text">{getActiveParams().jurisdictions}</span>
                    </div>
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Core Solutions</span>
                      <span className="text-xs font-semibold text-white mt-1 block select-text">{getActiveParams().services}</span>
                    </div>
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Selected Audience Focus</span>
                      <span className="text-xs font-semibold text-white mt-1 block select-text">{getActiveParams().audience}</span>
                    </div>
                  </div>

                  <div className="mt-2 p-3 bg-blue-500/5 rounded-2xl border border-blue-500/10 text-xs text-slate-400 leading-normal flex gap-2.5 items-start">
                    <AlertTriangle size={14} className="text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-slate-300">Statutory Restriction Warning:</strong> All Content, layouts, and assets produced by Gemini on this interface are strictly informational and do NOT constitute professional statutory advice.
                    </div>
                  </div>
                </div>

                {/* Simulated AI Agent Pipeline Status (5 Columns) */}
                <div className="lg:col-span-5 bg-slate-900/30 border border-slate-900 rounded-3xl p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <Terminal size={16} className="text-blue-400" />
                      <h3 className="text-sm font-black uppercase tracking-wider text-slate-100 font-display">System State Telemetry Logs</h3>
                    </div>
                    <button 
                      onClick={() => setSystemLogs([])}
                      className="text-[9px] text-slate-500 hover:text-slate-300 hover:underline"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="flex-1 bg-slate-950 rounded-2xl p-4 border border-slate-900 font-mono text-[10px] text-slate-400 space-y-2 max-h-[220px] overflow-y-auto">
                    {systemLogs.length === 0 ? (
                      <p className="text-slate-600 italic">No logs active.</p>
                    ) : (
                      systemLogs.map((log, idx) => (
                        <p key={idx} className="leading-relaxed hover:text-white transition-colors">{log}</p>
                      ))
                    )}
                  </div>

                  <div className="space-y-2 mt-1.5 text-[10px]">
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-900">
                      <span className="text-slate-500">1. Intake Agent Node</span>
                      <span className="text-emerald-500 font-bold">READY (INTENT OK)</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-900">
                      <span className="text-slate-500">2. Multi-Jurisdiction Researcher</span>
                      <span className="text-emerald-500 font-bold">READY (CACHED)</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-slate-500">3. Master Reviewer Agent</span>
                      <span className="text-emerald-500 font-bold">READY (DISCLAIMER ON)</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Fast Module Launcher Grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 font-mono">Quick Access Workspaces</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { title: "Generate Custom Website Content", path: "website", desc: "Build tailored Site Map, HTML layouts & metadata guides instantly with Gemini." },
                    { title: "AI SuperLab Research Lab", path: "superlab", desc: "Run state comparisons and simulated legal summaries." },
                    { title: "SEO Keyword Content Drafter", path: "seo", desc: "Formulate keyword outline text with JSON schemes." }
                  ].map((act, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveMenu(act.path)}
                      className="p-4 bg-slate-900/20 hover:bg-slate-900/60 border border-slate-900 hover:border-emerald-500/30 rounded-2xl text-left transition-all group shrink-0 outline-none"
                    >
                      <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 flex items-center gap-1.5">
                        <span>{act.title}</span>
                        <ArrowRight size={12} className="opacity-60 transition-transform group-hover:translate-x-1" />
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">{act.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* 2. SECTION: WEBSITE BUILDER */}
          {activeMenu === 'website' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="view-website">
              
              {/* Form Config Controls (5 Columns) */}
              <div className="lg:col-span-5 bg-slate-900/30 border border-slate-900 rounded-3xl p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Globe size={15} className="text-emerald-400" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">Generator Configuration</h3>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded font-mono font-bold">Dynamic Prompt</span>
                </div>

                <div className="space-y-3.5 text-xs">
                  {editingProjectId && (
                    <div className="p-3 bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 rounded-xl flex items-center justify-between mb-1">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-black uppercase font-mono tracking-wider text-indigo-400">Edit Mode Active</span>
                        <span className="text-xs truncate max-w-[180px] font-semibold text-white">ID: {editingProjectId}</span>
                      </div>
                      <button 
                        onClick={() => {
                          setEditingProjectId(null);
                          setSiteParams({
                            businessName: "Mubuslink Central Law",
                            jurisdictions: "EU, US, Canada",
                            audience: "Legal Counsel & Chief Risk Officers",
                            tone: "Authoritative",
                            services: "Cross-Border Regulatory Checking & AI Contract Audits",
                            brandStyle: "Deep Obsidian and Emerald",
                            activeTab: "visual"
                          });
                          setSiteOutput(null);
                          setSystemLogs(prev => [
                            `[${new Date().toLocaleTimeString()}] Exited Edit Mode and reverted to fresh parameters.`,
                            ...prev
                          ]);
                        }}
                        className="p-1 hover:bg-slate-900/50 rounded-lg text-indigo-400 hover:text-slate-100 transition-colors"
                        title="Cancel Editing"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Corporate Entity Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 outline-none transition-colors"
                      value={siteParams.businessName}
                      onChange={(e) => setSiteParams(prev => ({ ...prev, businessName: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Jurisdictions</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                        value={siteParams.jurisdictions}
                        onChange={(e) => setSiteParams(prev => ({ ...prev, jurisdictions: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Tone Preference</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                        value={siteParams.tone}
                        onChange={(e) => setSiteParams(prev => ({ ...prev, tone: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Target Audience Profile</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                      value={siteParams.audience}
                      onChange={(e) => setSiteParams(prev => ({ ...prev, audience: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Primary Services Offered</label>
                    <textarea 
                      rows={2}
                      className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none resize-none"
                      value={siteParams.services}
                      onChange={(e) => setSiteParams(prev => ({ ...prev, services: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Brand Style Guide</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                      value={siteParams.brandStyle}
                      onChange={(e) => setSiteParams(prev => ({ ...prev, brandStyle: e.target.value }))}
                    />
                  </div>

                  {editingProjectId ? (
                    <div className="flex flex-col gap-2 mt-2">
                      <button
                        onClick={handleUpdateProjectDetails}
                        disabled={updatingProject}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-505 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer select-none flex items-center justify-center gap-1.5"
                      >
                        {updatingProject ? 'Saving changes...' : 'Save Meta Edits in Cloud'}
                      </button>
                      <button
                        onClick={() => handleGenerate('website', siteParams, setSiteOutput, setGeneratingSite)}
                        disabled={generatingSite}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-black rounded-xl text-[11px] uppercase tracking-wider transition-all cursor-pointer select-none"
                      >
                        {generatingSite ? 'Synthesizing with Gemini...' : 'Re-Generate Site Layout'}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleGenerate('website', siteParams, setSiteOutput, setGeneratingSite)}
                      disabled={generatingSite}
                      className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer select-none"
                    >
                      {generatingSite ? 'Synthesizing with Gemini AI...' : 'Generate Live Website Structure'}
                    </button>
                  )}

                  {/* Saved Cloud Projects History section */}
                  <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <History size={13} className="text-emerald-400 font-bold" />
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">Firestore Saved Library</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {autoSaveStatus !== 'idle' && (
                          <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono font-bold flex items-center gap-1 border ${
                            autoSaveStatus === 'saving' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                            autoSaveStatus === 'saved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            <span className={`h-1 w-1 rounded-full ${autoSaveStatus === 'saving' ? 'bg-indigo-400 animate-pulse' : autoSaveStatus === 'saved' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                            {autoSaveStatus === 'saving' ? 'Auto-saving...' : autoSaveStatus === 'saved' ? 'Auto-saved' : 'Save Error'}
                          </span>
                        )}
                        <span className="text-[9px] text-emerald-500 animate-pulse">• Synced</span>
                      </div>
                    </div>

                    {/* Search Field */}
                    <div className="relative mt-0.5">
                      <Search size={11} className="absolute left-3 top-2.5 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Filter projects by business name..."
                        value={projectSearchQuery}
                        onChange={(e) => setProjectSearchQuery(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500/40 rounded-xl pl-8 pr-7 py-1.5 text-[10px] text-slate-200 outline-none transition-colors placeholder:text-slate-600 font-mono"
                      />
                      {projectSearchQuery && (
                        <button
                          onClick={() => setProjectSearchQuery('')}
                          className="absolute right-3 top-2 text-slate-500 hover:text-slate-300 focus:outline-none font-sans"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {(() => {
                      const filteredProjects = savedProjects.filter(p => 
                        (p.businessName || "").toLowerCase().includes(projectSearchQuery.toLowerCase())
                      );

                      if (loadingProjects) {
                        return <p className="text-[10px] text-slate-500 animate-pulse font-mono py-1">Syncing cloud directories...</p>;
                      }
                      
                      if (savedProjects.length === 0) {
                        return <p className="text-[10px] text-slate-600 italic leading-relaxed">No cloud-saved projects detected in Firestore.</p>;
                      }

                      if (filteredProjects.length === 0) {
                        return <p className="text-[10px] text-slate-650 italic leading-relaxed font-mono py-1">No projects match the business name.</p>;
                      }

                      return (
                        <div className="max-h-[160px] overflow-y-auto pr-1">
                          <motion.div 
                            className="space-y-1.5"
                            initial="hidden"
                            animate="visible"
                            variants={{
                              hidden: { opacity: 0 },
                              visible: {
                                opacity: 1,
                                transition: {
                                  staggerChildren: 0.05
                                }
                              }
                            }}
                          >
                            <AnimatePresence initial={false}>
                              {filteredProjects.map((proj, pi) => {
                                const isEditing = editingProjectId === proj.projectId;
                                return (
                                  <motion.div 
                                    key={proj.projectId || `site_${pi}`}
                                    variants={{
                                      hidden: { opacity: 0, y: 10 },
                                      visible: { opacity: 1, y: 0 }
                                    }}
                                    initial="hidden"
                                    animate="visible"
                                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className={`flex items-center justify-between p-2 rounded-xl border transition-all text-xs select-none bg-slate-950/60 ${isEditing ? 'border-indigo-500/50 shadow-indigo-500/5' : 'border-slate-900 hover:border-emerald-500/25'}`}
                                  >
                                    <button
                                      onClick={() => {
                                        setSiteParams({
                                          businessName: proj.businessName,
                                          jurisdictions: proj.jurisdictions,
                                          audience: proj.audience,
                                          tone: proj.tone,
                                          services: proj.services,
                                          brandStyle: proj.brandStyle,
                                          activeTab: "visual"
                                        });
                                        setSiteOutput({
                                          sitemap: proj.sitemap,
                                          pages: proj.pages,
                                          seo: proj.seo
                                        });
                                        setEditingProjectId(proj.projectId);
                                        setSystemLogs(prev => [
                                          `[${new Date().toLocaleTimeString()}] Restored and loaded project '${proj.businessName}' (ID: ${proj.projectId}) into Edit Mode.`,
                                          ...prev
                                        ]);
                                      }}
                                      className="flex-1 text-left min-w-0"
                                    >
                                      <h5 className={`font-bold truncate max-w-[140px] flex items-center gap-1 ${isEditing ? 'text-indigo-400' : 'text-slate-100 hover:text-emerald-400'}`}>
                                        <span className="truncate">{proj.businessName}</span>
                                        {proj.projectId === 'workspace_draft' && (
                                          <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[8px] font-mono font-bold px-1 rounded transform scale-90 origin-left shrink-0">DRAFT</span>
                                        )}
                                      </h5>
                                      <span className="text-[9px] text-slate-500 font-mono block truncate">{proj.createdAt ? new Date(proj.createdAt).toLocaleDateString() : 'N/A'} • {proj.jurisdictions}</span>
                                    </button>
                                    <div className="flex items-center gap-1 shrink-0 ml-2">
                                      <button
                                        onClick={() => {
                                          setSiteParams({
                                            businessName: proj.businessName,
                                            jurisdictions: proj.jurisdictions,
                                            audience: proj.audience,
                                            tone: proj.tone,
                                            services: proj.services,
                                            brandStyle: proj.brandStyle,
                                            activeTab: "visual"
                                          });
                                          setSiteOutput({
                                            sitemap: proj.sitemap,
                                            pages: proj.pages,
                                            seo: proj.seo
                                          });
                                          setEditingProjectId(proj.projectId);
                                          setSystemLogs(prev => [
                                            `[${new Date().toLocaleTimeString()}] Restored and loaded project '${proj.businessName}' (ID: ${proj.projectId}) into Edit Mode.`,
                                            ...prev
                                          ]);
                                        }}
                                        className={`p-1 rounded-md border transition-colors ${isEditing ? 'border-indigo-500/40 bg-indigo-950/40 text-indigo-400' : 'border-slate-800 bg-slate-900/60 hover:text-indigo-400 hover:border-indigo-500/30'} text-slate-400`}
                                        title="Load & Edit"
                                      >
                                        <Edit size={10} />
                                      </button>
                                      <button
                                        onClick={(e) => handleDeleteProject(proj.projectId, e)}
                                        className="p-1 rounded-md border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-rose-500 hover:border-rose-500/30 transition-colors"
                                        title="Delete Project"
                                      >
                                        <Trash2 size={10} />
                                      </button>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </AnimatePresence>
                          </motion.div>
                        </div>
                      );
                    })()}
                  </div>

                </div>
              </div>

              {/* Dynamic Design Canvas Workspace Output (7 Columns) */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                
                {/* Website Header */}
                <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 flex flex-col gap-4 flex-1 min-h-[450px]">
                  
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black uppercase text-slate-300 font-display">Generation Preview Viewport</span>
                      {siteOutput && (
                        <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-900">
                          <button 
                            onClick={() => setSiteParams(p => ({ ...p, activeTab: "visual" }))}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors ${siteParams.activeTab === 'visual' ? 'bg-slate-900 text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
                          >
                            Interactive Page
                          </button>
                          <button 
                            onClick={() => setSiteParams(p => ({ ...p, activeTab: "code" }))}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors ${siteParams.activeTab === 'code' ? 'bg-slate-900 text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
                          >
                            Raw Code (HTML/CSS)
                          </button>
                        </div>
                      )}
                    </div>

                    {siteOutput && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Copy JSON Button */}
                        <button 
                          onClick={() => copyToClipboard(JSON.stringify(siteOutput, null, 2), 'site')}
                          className="text-[10px] bg-slate-950 hover:bg-slate-900 px-2.5 py-1.5 rounded border border-slate-850 flex items-center gap-1.5 transition-colors text-slate-300 hover:text-white"
                        >
                          {copiedText === 'site' ? (
                            <>
                              <CheckCircle size={11} className="text-emerald-400" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={11} />
                              <span>Copy JSON Mapping</span>
                            </>
                          )}
                        </button>
                        
                        {/* JSON Export Option */}
                        <button
                          onClick={() => handleDownloadProject('json')}
                          className="text-[10px] bg-slate-950 hover:bg-indigo-950/40 px-2.5 py-1.5 rounded border border-indigo-900/30 flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors font-mono"
                          title="Download complete sitemap, pages, and SEO data as a structured JSON file"
                          id="export-project-json"
                        >
                          <Download size={11} />
                          <span>Download JSON</span>
                        </button>
                        
                        {/* CSV Export Option */}
                        <button
                          onClick={() => handleDownloadProject('csv')}
                          className="text-[10px] bg-slate-950 hover:bg-emerald-950/40 px-2.5 py-1.5 rounded border border-emerald-900/30 flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-mono"
                          title="Download sitemap, pages, and SEO data as a structured CSV spreadsheet file"
                          id="export-project-csv"
                        >
                          <Download size={11} />
                          <span>Download CSV</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {generatingSite ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 min-h-[300px]">
                      <Bot size={40} className="text-emerald-500 animate-bounce mb-3" />
                      <h4 className="text-sm font-black text-slate-100 font-display">Assembling Site Map & Web Layout Assets...</h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-1 max-w-[320px]">Coordinating intake agent with structural design layouts using real-time generative parameters.</p>
                    </div>
                  ) : siteOutput ? (
                    <div className="space-y-4 flex-1 flex flex-col">
                      
                      {/* Interactive Section */}
                      {siteParams.activeTab === 'visual' ? (
                        <div className="space-y-4 flex-1">
                          
                          {/* Metadata Card */}
                          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-900/60 text-xs">
                            <h4 className="text-emerald-400 font-black font-mono text-[9px] uppercase tracking-wider mb-2">Automated SEO Metadata Markup</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-mono">
                              <div><span className="text-slate-500">Title:</span> <span className="text-slate-300 select-text">{siteOutput.seo?.title || siteOutput.title || 'Neutral Meta Title'}</span></div>
                              <div><span className="text-slate-500">Description:</span> <span className="text-slate-300 select-text">{siteOutput.seo?.meta_description || 'Synthesized meta overview description.'}</span></div>
                            </div>
                            <div className="mt-2.5 pt-2.5 border-t border-slate-900 flex items-center gap-2">
                              <span className="text-slate-500 text-[10px]">Site Navigation Map:</span>
                              {(siteOutput.sitemap || []).map((page: string, pi: number) => (
                                <span key={pi} className="px-1.5 py-0.5 bg-slate-900 rounded text-[9px] text-slate-300 font-bold border border-slate-850 select-text">{page}</span>
                              ))}
                            </div>
                          </div>

                          {/* Interactive Page visual component block */}
                          <div className="rounded-2xl border border-slate-900 overflow-hidden bg-slate-950 p-5 min-h-[250px] relative">
                            {/* Rendering simulated dynamic UI preview */}
                            <div className="pb-4 mb-4 border-b border-slate-900 flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-red-400" />
                                <span className="h-2 w-2 rounded-full bg-yellow-400" />
                                <span className="h-2 w-2 rounded-full bg-green-400" />
                              </div>
                              <span className="text-[10px] font-mono text-slate-600">Secure Client-Side Sandboxed Frame</span>
                            </div>

                            {/* Home block visualization containing elegant styling based on generator prompt */}
                            <div className="space-y-4 text-center py-6 select-text">
                              <span className="text-[10px] px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-emerald-400 font-black font-display uppercase tracking-widest inline-block">
                                {siteParams.businessName}
                              </span>
                              <h1 className="text-lg md:text-2xl font-black text-white font-display tracking-tight leading-tight max-w-[480px] mx-auto">
                                Automated legal protection & regulatory checks mapped under {siteParams.jurisdictions} parameters
                              </h1>
                              <p className="text-slate-400 text-xs max-w-[420px] mx-auto leading-normal">
                                Leveraging Switzerland Swiss minimalist precision to deliver risk protection to {siteParams.audience}.
                              </p>
                              
                              <div className="pt-3 flex justify-center gap-3">
                                <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-lg text-[10px] tracking-wide uppercase transition-colors">
                                  Access Compliant Audits
                                </button>
                                <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-850 hover:border-slate-850 text-slate-300 rounded-lg text-[10px] font-bold uppercase transition-colors">
                                  View Neutral Sources
                                </button>
                              </div>
                            </div>
                          </div>

                        </div>
                      ) : (
                        <div className="flex-grow flex flex-col">
                          <textarea 
                            readOnly
                            rows={15}
                            className="w-full bg-slate-950 text-slate-400 font-mono text-[10px] p-4.5 rounded-2xl border border-slate-900/80 outline-none resize-none flex-1 leading-normal"
                            value={JSON.stringify(siteOutput, null, 2)}
                          />
                        </div>
                      )}

                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-900 rounded-2xl min-h-[300px]">
                      <Globe size={30} className="text-slate-600 mb-3" />
                      <h4 className="text-xs font-bold text-slate-400">Website Output Not Seeded</h4>
                      <p className="text-[10px] text-slate-500 mt-1 max-w-[280px]">Adjust business name, brand parameters on the left pane and hit the generation trigger to compile web assets.</p>
                    </div>
                  )}

                </div>

              </div>

            </div>
          )}

          {/* 3. SECTION: TEMPLATES ENGINE */}
          {activeMenu === 'templates' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="view-templates">
              
              {/* Preset templates list & configuration */}
              <div className="lg:col-span-5 flex flex-col gap-5">
                
                {/* Available Library */}
                <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-5 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 font-mono pl-1">Document Templates Registry</h3>
                  <div className="space-y-2">
                    {[
                      { type: "Mutual Non-Disclosure Agreement", code: "M-NDA", vars: "EffectiveDate, DisclosingName, ReceivingName, GoverningLaw" },
                      { type: "Cross-Border Privacy Protection Framework Clause", code: "CB-PR", vars: "DataExporter, DataImporter, OptOutLink, SupervisorAuthority" },
                      { type: "Services Master SOW Engagement Letter", code: "S-SOW", vars: "ClientLegalEntity, ServiceHours, HourlyRate, DisputeJurisdiction" }
                    ].map((tpl, idx) => {
                      const isSelected = templateParams.templateType === tpl.type;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setTemplateParams({
                              templateType: tpl.type,
                              jurisdictions: getActiveParams().jurisdictions,
                              variables: tpl.vars,
                              tone: getActiveParams().tone
                            });
                          }}
                          className={`w-full text-left p-3.5 rounded-2xl transition-all border ${
                            isSelected 
                              ? 'bg-emerald-600/10 border-emerald-500/20 text-white' 
                              : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-900 rounded text-slate-300 font-mono uppercase tracking-wider">{tpl.code}</span>
                            <span className="text-[9px] text-slate-500 font-mono">Variables: {tpl.vars.split(',').length}</span>
                          </div>
                          <h4 className="text-xs font-bold mt-2">{tpl.type}</h4>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Scope parameters */}
                <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-5 space-y-3.5">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-300 font-display border-b border-slate-800 pb-2">Custom Template Variables</h3>
                  
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Selected Type</label>
                      <input 
                        type="text"
                        className="w-full bg-slate-950 border border-slate-900 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none"
                        value={templateParams.templateType}
                        onChange={(e) => setTemplateParams(prev => ({ ...prev, templateType: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Double-Brace Variables</label>
                      <input 
                        type="text"
                        className="w-full bg-slate-950 border border-slate-900 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none font-mono"
                        value={templateParams.variables}
                        onChange={(e) => setTemplateParams(prev => ({ ...prev, variables: e.target.value }))}
                      />
                    </div>

                    <button
                      onClick={() => handleGenerate('templates', templateParams, setTemplateOutput, setGeneratingTemplate)}
                      disabled={generatingTemplate}
                      className="w-full mt-1 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-black rounded-xl text-[11px] uppercase tracking-wider transition-all"
                    >
                      {generatingTemplate ? 'Generating Reusable Template...' : 'Generate Reusable Template Body'}
                    </button>
                  </div>
                </div>

              </div>

              {/* Template editor display panel */}
              <div className="lg:col-span-7">
                <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 min-h-[450px] flex flex-col h-full justify-between">
                  
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <FileCode size={15} className="text-emerald-400" />
                      <span className="text-xs font-black uppercase tracking-wider text-slate-200 font-display">System Reusable Template Body</span>
                    </div>

                    {templateOutput && (
                      <button 
                        onClick={() => copyToClipboard(templateOutput.template_body || JSON.stringify(templateOutput), 'template_body')}
                        className="text-[10px] bg-slate-950 px-2 py-1.5 rounded border border-slate-850 flex items-center gap-1.5 hover:text-white"
                      >
                        {copiedText === 'template_body' ? (
                          <>
                            <CheckCircle size={11} className="text-emerald-400" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={11} />
                            <span>Copy Body Clipboard</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {generatingTemplate ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
                      <Bot size={36} className="text-emerald-400 animate-spin mb-3" />
                      <h4 className="text-xs font-bold text-slate-200 font-mono">Compiling double-brace legal variables...</h4>
                    </div>
                  ) : templateOutput ? (
                    <div className="space-y-4 flex-1 flex flex-col justify-between">
                      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-900 text-xs">
                        <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-black block mb-2">Metadata Variables Mapped</span>
                        <div className="flex flex-wrap gap-2">
                          {(templateOutput.variables || []).map((v: string, vi: number) => (
                            <span key={vi} className="px-2 py-1 bg-slate-900 text-[10px] text-slate-300 font-mono rounded border border-slate-850 select-text font-bold">
                              {"{{"}{v}{"}}"}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex-1 bg-slate-950 p-5 rounded-2xl border border-slate-900 text-xs font-mono text-slate-300 leading-relaxed overflow-y-auto max-h-[300px] select-text whitespace-pre-wrap">
                        {templateOutput.template_body || templateOutput.text || JSON.stringify(templateOutput)}
                      </div>

                      <div className="text-[10px] text-slate-500 italic mt-2.5 pt-2.5 border-t border-slate-900 flex justify-between">
                        <span>Status: Completed template draft compilation.</span>
                        <span>Tone: {templateParams.tone}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-900 rounded-2xl">
                      <FileText size={30} className="text-slate-600 mb-3" />
                      <h4 className="text-xs font-bold text-slate-400">No Custom Template Active</h4>
                      <p className="text-[10px] text-slate-500 mt-1 max-w-[280px]">Select any class on the left or customize variables tags and hit generate to query.</p>
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}

          {/* 4. SECTION: AI SUPERLAB */}
          {activeMenu === 'superlab' && (
            <div className="space-y-6" id="view-superlab">
              
              {/* Config prompt and setup */}
              <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-3xl space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Beaker size={16} className="text-purple-400 animate-pulse" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">Simulate Multi-Agent Legal Reasoning Workflow</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-end">
                  <div className="lg:col-span-6">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Intelligent Research Question</label>
                    <textarea 
                      rows={2}
                      className="w-full bg-slate-950 border border-slate-900 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 outline-none resize-none leading-normal"
                      value={labParams.researchQuestion}
                      onChange={(e) => setLabParams(prev => ({ ...prev, researchQuestion: e.target.value }))}
                    />
                  </div>

                  <div className="lg:col-span-3">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Focus Jurisdictions</label>
                    <input 
                      type="text"
                      className="w-full bg-slate-950 border border-slate-900 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 outline-none"
                      value={labParams.jurisdictions}
                      onChange={(e) => setLabParams(prev => ({ ...prev, jurisdictions: e.target.value }))}
                    />
                  </div>

                  <div className="lg:col-span-3">
                    <button
                      onClick={() => handleGenerate('superlab', labParams, setLabOutput, setGeneratingLab)}
                      disabled={generatingLab}
                      className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-slate-850 disabled:to-slate-850 disabled:text-slate-600 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all"
                    >
                      {generatingLab ? 'Processing Graph Executions...' : 'Execute Multi-Agent Lab'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Lab output graph visualization */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 4 Agent flow status cards (5 Columns) */}
                <div className="lg:col-span-5 bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 font-mono pb-2 border-b border-slate-800">Graph Progression Status</h3>
                  
                  <div className="space-y-3.5">
                    {[
                      { step: "Intake Agent", id: 1, role: "Intent extraction & jurisdiction classification", active: generatingLab || labOutput },
                      { step: "Research Agent", id: 2, role: "Gathers framework laws (GDPR, PIPEDA) & observations", active: labOutput },
                      { step: "Analysis Agent", id: 3, role: "Compares, structures, identifies gaps & key trends", active: labOutput },
                      { step: "Reviewer Agent", id: 4, role: "Validates compliance disclaimers & risk-neutral tone", active: labOutput }
                    ].map((step, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-2xl border transition-colors ${
                          step.active 
                            ? 'bg-purple-950/10 border-purple-500/30' 
                            : 'bg-slate-950/40 border-slate-900 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${step.active ? 'bg-purple-600/20 text-purple-400 border border-purple-500/25' : 'bg-slate-900 text-slate-500'}`}>NODE 0{step.id}</span>
                          {step.active ? (
                            <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1 font-mono">
                              <CheckCircle size={10} /> Active Verified
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-600 font-mono">Offline Waiting</span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-white mt-1.5">{step.step}</h4>
                        <p className="text-[10px] text-slate-500 mt-1 leading-normal">{step.role}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Simulated Synthesis display text outputs (7 Columns) */}
                <div className="lg:col-span-7">
                  <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 min-h-[400px] flex flex-col justify-between h-full">
                    
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                      <span className="text-xs font-black uppercase text-slate-200 font-display">Simulated Consensus Lab findings</span>
                      
                      {labOutput && (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              const report = `========================================================================
             MUBUSLINK AI SUPERLAB - MULTI-AGENT CONSENSUS REPORT
========================================================================
Generated At : ${new Date().toLocaleString()}
Jurisdictions: ${labParams.jurisdictions || "EU, USA, Canada"}
Question     : ${labParams.researchQuestion || "General Compliance Comparison"}

------------------------------------------------------------------------
1. JOINT CONSENSUS SUMMARY
------------------------------------------------------------------------
${labOutput.summary || "No consensus summary available."}

------------------------------------------------------------------------
2. JURISDICTIONAL FRAMEWORK REVIEWS
------------------------------------------------------------------------
${Object.entries(labOutput.jurisdictional_comparison || {})
  .map(([key, val]) => `[Scope: ${key}]\n${val}\n`)
  .join('\n')}
------------------------------------------------------------------------
3. CRITICAL STRATEGIC OBSERVATIONS
------------------------------------------------------------------------
${(labOutput.key_points || []).map((pt: string, i: number) => `[Observation 0${i + 1}] • ${pt}`).join('\n')}

========================================================================
          MUBUSLINK LEGAL-TECH COMPLIANCE LABS • CONFIDENTIAL
========================================================================`;
                              downloadReport(`Mubuslink_SuperLab_Report_${Date.now()}.txt`, report);
                            }}
                            className="text-[10px] bg-purple-950/40 hover:bg-purple-900 border border-purple-500/20 text-purple-300 px-2.5 py-1 rounded-xl flex items-center gap-1.5 transition-colors"
                          >
                            <Download size={11} />
                            <span>Download Report</span>
                          </button>
                          
                          <button 
                            onClick={() => copyToClipboard(JSON.stringify(labOutput, null, 2), 'lab')}
                            className="text-[10px] bg-slate-950 px-1.5 py-1 rounded border border-slate-850 flex items-center gap-1 hover:text-white"
                          >
                            {copiedText === 'lab' ? 'Copied' : 'Copy JSON'}
                          </button>
                        </div>
                      )}
                    </div>

                    {generatingLab ? (
                      <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
                        <Bot size={40} className="text-purple-400 animate-pulse mb-3" />
                        <h4 className="text-xs font-bold text-slate-200">Agents analyzing cross-border provisions...</h4>
                        <p className="text-[10px] text-slate-500 font-mono mt-1 max-w-[280px]">Resolving compliance parameters on WIPO treaties. This is mock-checked under Swiss design guidelines.</p>
                      </div>
                    ) : labOutput ? (
                      <div className="space-y-4 flex-1 flex flex-col justify-between">
                        
                        {/* Overall Synthesis block */}
                        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-900 text-xs">
                          <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest font-black block mb-1">Joint Consensus Summary</span>
                          <p className="text-slate-300 leading-relaxed select-text font-serif italic text-xs">
                            "{labOutput.summary || 'Summary findings details resolved safely.'}"
                          </p>
                        </div>

                        {/* Jurisdictions list comparison blocks */}
                        <div className="space-y-2 select-text font-mono text-[11px] leading-relaxed">
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Decisions per Legal Authority Scope</span>
                          {Object.entries(labOutput.jurisdictional_comparison || {}).map(([jurName, jurVal]: [string, any], idx) => (
                            <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-900 flex items-start gap-3">
                              <span className="px-2 py-0.5 bg-slate-900 text-[10px] text-purple-400 font-bold rounded border border-slate-850 shrink-0">{jurName}</span>
                              <p className="text-slate-400 select-text">{typeof jurVal === 'string' ? jurVal : JSON.stringify(jurVal)}</p>
                            </div>
                          ))}
                        </div>

                        {/* Regulatory checks list */}
                        <div className="pt-3.5 border-t border-slate-900">
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-2">Key Critical Observations</span>
                          <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside select-text font-sans">
                            {(labOutput.key_points || []).map((pt: string, idx: number) => (
                              <li key={idx}>{pt}</li>
                            ))}
                          </ul>
                        </div>

                      </div>
                    ) : (
                      <div className="flex-grow flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-900 rounded-2xl">
                        <Beaker size={30} className="text-slate-600 mb-3" />
                        <h4 className="text-xs font-bold text-slate-400">Lab Output Idle</h4>
                        <p className="text-[10px] text-slate-500 mt-1 max-w-[280px]">Fill out a research comparative question on the upper bar and execute the pipeline.</p>
                      </div>
                    )}

                  </div>
                </div>

              </div>

            </div>
          )}

          {/* 5. SECTION: IMAGE STUDIO */}
          {activeMenu === 'imagestudio' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="view-imagestudio">
              
              {/* Form parameters (5 Columns) */}
              <div className="lg:col-span-5 bg-slate-900/30 border border-slate-900 rounded-3xl p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon size={15} className="text-emerald-400" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">Legal Imagery Illustrator</h3>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Vibe Prompt Description</label>
                    <textarea 
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 outline-none resize-none leading-normal"
                      value={imageParams.description}
                      onChange={(e) => setImageParams(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Illustration Style Preset</label>
                    <input 
                      type="text"
                      className="w-full bg-slate-950 border border-slate-900 rounded-lg px-3 py-1.5 text-xs text-slate-300 outline-none"
                      value={imageParams.style}
                      onChange={(e) => setImageParams(prev => ({ ...prev, style: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Brand Color Palette</label>
                    <input 
                      type="text"
                      className="w-full bg-slate-950 border border-slate-900 rounded-lg px-3 py-1.5 text-xs text-slate-300 outline-none"
                      value={imageParams.palette}
                      onChange={(e) => setImageParams(prev => ({ ...prev, palette: e.target.value }))}
                    />
                  </div>

                  <button
                    onClick={() => handleGenerate('imagestudio', imageParams, setImageOutput, setGeneratingImage)}
                    disabled={generatingImage}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all"
                  >
                    {generatingImage ? 'Drafting Technical Prompt...' : 'Synthesize Artistic Prompt'}
                  </button>
                </div>
              </div>

              {/* Composition block output (7 Columns) */}
              <div className="lg:col-span-7">
                <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 min-h-[450px] flex flex-col justify-between h-full">
                  
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <span className="text-xs font-black uppercase text-slate-200 font-display">Imagen Prompting Recipe Assets</span>
                  </div>

                  {generatingImage ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
                      <RefreshCw size={24} className="text-emerald-400 animate-spin mb-3" />
                      <h4 className="text-xs font-bold text-slate-200">Polishing lighting, volumetric shaders coordinates...</h4>
                    </div>
                  ) : imageOutput ? (
                    <div className="space-y-4 flex-1 flex flex-col justify-between">
                      
                      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-900 text-xs text-slate-400 leading-relaxed font-mono">
                        <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-black block mb-2">Optimized prompt parameter</span>
                        "{imageOutput.prompt || 'Optimized prompt generated.'}"
                      </div>

                      {/* Visual placeholder box mocking the legal design asset */}
                      <div className="rounded-2xl border border-slate-900 bg-slate-950 p-6 flex flex-col items-center justify-center text-center text-slate-500 relative overflow-hidden min-h-[220px]">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                        <ImageIcon size={34} className="text-emerald-500 mb-2 relative z-10" />
                        <span className="text-[10px] uppercase font-mono tracking-widest text-slate-300 font-bold relative z-10">Imagen Asset Blueprint</span>
                        <p className="text-[10px] text-slate-500 font-mono mt-1 max-w-[280px] relative z-10">Palette: {imageOutput.color_palette || imageParams.palette}</p>
                        <span className="text-[9px] bg-slate-900 px-2 py-0.5 rounded border border-slate-850 mt-3 relative z-10 text-emerald-400">{imageOutput.use_case || imageParams.useCase}</span>
                      </div>

                    </div>
                  ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-900 rounded-2xl">
                      <ImageIcon size={30} className="text-slate-600 mb-3" />
                      <h4 className="text-xs font-bold text-slate-400">Blueprint Empty</h4>
                      <p className="text-[10px] text-slate-500 mt-1">Configure layout values and hit compile.</p>
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}

          {/* 6. SECTION: AUDIO SYMPHONY */}
          {activeMenu === 'audiosymphony' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="view-audiosymphony">
              
              {/* Controls (5 Columns) */}
              <div className="lg:col-span-5 bg-slate-900/30 border border-slate-900 rounded-3xl p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Music size={15} className="text-emerald-400" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">Voiceover & Audio Designer</h3>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Audio Category Type</label>
                    <input 
                      type="text"
                      className="w-full bg-slate-950 border border-slate-900 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none"
                      value={audioParams.type}
                      onChange={(e) => setAudioParams(prev => ({ ...prev, type: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Speaker style timbre</label>
                    <input 
                      type="text"
                      className="w-full bg-slate-950 border border-slate-900 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none"
                      value={audioParams.voiceStyle}
                      onChange={(e) => setAudioParams(prev => ({ ...prev, voiceStyle: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Narrative Script or Speech message</label>
                    <textarea 
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 outline-none resize-none leading-normal font-sans"
                      value={audioParams.script}
                      onChange={(e) => setAudioParams(prev => ({ ...prev, script: e.target.value }))}
                    />
                  </div>

                  <button
                    onClick={() => handleGenerate('audiosymphony', audioParams, setAudioOutput, setGeneratingAudio)}
                    disabled={generatingAudio}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all"
                  >
                    {generatingAudio ? 'Configuring Lyria instructions...' : 'Synthesize Audio Sequence'}
                  </button>
                </div>
              </div>

              {/* Symphony preview container (7 Columns) */}
              <div className="lg:col-span-7">
                <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 min-h-[450px] flex flex-col justify-between h-full">
                  
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <span className="text-xs font-black uppercase text-slate-200 font-display">Audio blueprint output specs</span>
                  </div>

                  {generatingAudio ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
                      <RefreshCw size={24} className="text-emerald-400 animate-spin mb-3" />
                      <h4 className="text-xs font-bold text-slate-200">Drafting waveforms coordinates...</h4>
                    </div>
                  ) : audioOutput ? (
                    <div className="space-y-4 flex-1 flex flex-col justify-between bg-slate-950 p-5 rounded-2xl border border-slate-900">
                      
                      <div className="text-xs leading-relaxed font-mono text-slate-400">
                        <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-black block mb-2">Speech sequence directions</span>
                        "{audioOutput.audio_prompt || 'Audio guidelines finalized.'}"
                      </div>

                      {/* Mock interactive Audio Player visual bar */}
                      <div className="p-4 bg-slate-900 rounded-xl border border-slate-850 flex items-center justify-between gap-3 text-[10px] mt-6">
                        <div className="flex items-center gap-3">
                          <button className="h-7 w-7 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center font-black text-xs hover:bg-emerald-400 transition-colors">
                            ▶
                          </button>
                          <div>
                            <span className="font-bold text-slate-200 block text-xs">Simulated Voiceover Playback</span>
                            <span className="text-[9px] text-slate-500 font-mono">Timbre: {audioParams.voiceStyle}</span>
                          </div>
                        </div>
                        <span className="font-mono text-slate-300 font-bold">{audioOutput.duration || '30s'}</span>
                      </div>

                      <p className="text-[9px] text-slate-600 font-mono text-center">Waveforms synthesized safely using compliant neutral scripts.</p>

                    </div>
                  ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-900 rounded-2xl">
                      <Music size={30} className="text-slate-600 mb-3" />
                      <h4 className="text-xs font-bold text-slate-400">No Audio Compiled</h4>
                      <p className="text-[10px] text-slate-500 mt-1">Configure narrative and hit compose.</p>
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}

          {/* 7. SECTION: NEURAL CINEMA */}
          {activeMenu === 'neuralcinema' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="view-neuralcinema">
              
              {/* Scene configuration (5 Columns) */}
              <div className="lg:col-span-5 bg-slate-900/30 border border-slate-900 rounded-3xl p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Video size={15} className="text-emerald-400" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">Veo Storyboard Cinematic</h3>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Cinematic Goal Description</label>
                    <textarea 
                      rows={2}
                      className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 outline-none resize-none leading-normal"
                      value={cinemaParams.goal}
                      onChange={(e) => setCinemaParams(prev => ({ ...prev, goal: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Total Duration</label>
                      <input 
                        type="text"
                        className="w-full bg-slate-950 border border-slate-900 rounded-lg px-3 py-1.5 text-xs text-slate-300 outline-none"
                        value={cinemaParams.duration}
                        onChange={(e) => setCinemaParams(prev => ({ ...prev, duration: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Cinematography Style</label>
                      <input 
                        type="text"
                        className="w-full bg-slate-950 border border-slate-900 rounded-lg px-3 py-1.5 text-xs text-slate-300 outline-none"
                        value={cinemaParams.style}
                        onChange={(e) => setCinemaParams(prev => ({ ...prev, style: e.target.value }))}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleGenerate('neuralcinema', cinemaParams, setCinemaOutput, setGeneratingCinema)}
                    disabled={generatingCinema}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all"
                  >
                    {generatingCinema ? 'Compiling Veo video directions...' : 'Assemble Storyboard'}
                  </button>
                </div>
              </div>

              {/* Storyboard display (7 Columns) */}
              <div className="lg:col-span-7">
                <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 min-h-[450px] flex flex-col justify-between h-full">
                  
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <span className="text-xs font-black uppercase text-slate-200 font-display">Veo cinematics storyboard timeline</span>
                  </div>

                  {generatingCinema ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
                      <RefreshCw size={24} className="text-emerald-400 animate-spin mb-3" />
                      <h4 className="text-xs font-bold text-slate-200">Synthesizing scene continuity blocks...</h4>
                    </div>
                  ) : cinemaOutput ? (
                    <div className="space-y-4 flex-1 flex flex-col justify-between">
                      
                      <div className="space-y-2.5">
                        <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-black block">Active Scene Prompts (Veo Map)</span>
                        {(cinemaOutput.scenes || []).map((sc: any, idx: number) => (
                          <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-900 text-xs text-slate-300">
                            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mb-1">
                              <span>SCENE {sc.scene_number || idx + 1}</span>
                              <span>Duration: {sc.duration || 5}s</span>
                            </div>
                            <p className="font-mono text-slate-400 select-text leading-normal">Prompt: "{sc.prompt}"</p>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 bg-blue-500/5 text-blue-400 rounded-xl border border-blue-500/20 text-[10px] text-center font-mono uppercase tracking-wider mt-4">
                        ⚠️ Generated storyboard prompts are optimized for Veo models.
                      </div>

                    </div>
                  ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-900 rounded-2xl">
                      <Video size={30} className="text-slate-600 mb-3" />
                      <h4 className="text-xs font-bold text-slate-400">Storyboard Empty</h4>
                      <p className="text-[10px] text-slate-500 mt-1">Configure goals and prompt Veo system on the left.</p>
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}

          {/* 8. SECTION: MARKETING ENGINE */}
          {activeMenu === 'marketing' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="view-marketing">
              
              {/* Controls (5 Columns) */}
              <div className="lg:col-span-5 bg-slate-900/30 border border-slate-900 rounded-3xl p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Megaphone size={15} className="text-emerald-400" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">Ads & Campaigns Architect</h3>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Campaign Target Audience</label>
                    <input 
                      type="text"
                      className="w-full bg-slate-950 border border-slate-900 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none"
                      value={marketingParams.audience}
                      onChange={(e) => setMarketingParams(prev => ({ ...prev, audience: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Target Marketing Channel</label>
                    <input 
                      type="text"
                      className="w-full bg-slate-950 border border-slate-900 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none"
                      value={marketingParams.channel}
                      onChange={(e) => setMarketingParams(prev => ({ ...prev, channel: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Campaign Offer Proposition</label>
                    <textarea 
                      rows={2}
                      className="w-full bg-slate-950 border border-slate-900 px-3 py-1.5 text-xs text-slate-200 outline-none resize-none leading-normal"
                      value={marketingParams.offer}
                      onChange={(e) => setMarketingParams(prev => ({ ...prev, offer: e.target.value }))}
                    />
                  </div>

                  <button
                    onClick={() => handleGenerate('marketing', marketingParams, setMarketingOutput, setGeneratingMarketing)}
                    disabled={generatingMarketing}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all"
                  >
                    {generatingMarketing ? 'Drafting compliance copy...' : 'Synthesize Campaign Copy'}
                  </button>
                </div>
              </div>

              {/* Marketing result (7 Columns) */}
              <div className="lg:col-span-7">
                <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 min-h-[450px] flex flex-col justify-between h-full">
                  
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <span className="text-xs font-black uppercase text-slate-200 font-display">Generated asset values</span>
                    {marketingOutput && (
                      <button 
                        onClick={() => {
                          const report = `========================================================================
               MUBUSLINK AI MARKETING ENGINE - CAMPAIGN COPY
========================================================================
Generated At: ${new Date().toLocaleString()}
Target      : ${marketingParams.audience || "General Audience"}
Channel     : ${marketingParams.channel || "LinkedIn Campaign"}
Offer       : ${marketingParams.offer || "Direct Audit Proposition"}

------------------------------------------------------------------------
1. BRAND CAMPAIGN HEADLINE
------------------------------------------------------------------------
${marketingOutput.headline || "headline empty"}

------------------------------------------------------------------------
2. STORYTELLING SUB-HEADLINE
------------------------------------------------------------------------
${marketingOutput.subheadline || "subheadline empty"}

------------------------------------------------------------------------
3. ENGAGEMENT DIRECT COPY BODY
------------------------------------------------------------------------
${marketingOutput.body || "body empty"}

------------------------------------------------------------------------
4. CALL-TO-ACTION (CTA) TARGET ENGAGEMENT
------------------------------------------------------------------------
[Action Label] : ${marketingOutput.cta || "cta empty"}

========================================================================
            MUBUSLINK REVOLUTIONARY ADS SUITE • ENZYME ENGINE
========================================================================`;
                          downloadReport(`Mubuslink_Marketing_Campaign_${Date.now()}.txt`, report);
                        }}
                        className="text-[10px] bg-emerald-950/40 hover:bg-emerald-900 border border-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <Download size={11} />
                        <span>Download Campaign</span>
                      </button>
                    )}
                  </div>

                  {generatingMarketing ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
                      <RefreshCw size={24} className="text-emerald-400 animate-spin mb-3" />
                      <h4 className="text-xs font-bold text-slate-200">Composing target copy blocks...</h4>
                    </div>
                  ) : marketingOutput ? (
                    <div className="space-y-4 flex-1 flex flex-col justify-between">
                      
                      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-900 space-y-3.5 text-xs select-text">
                        <div>
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Campaign Headline</span>
                          <h4 className="text-sm font-black text-white font-display select-text">{marketingOutput.headline || 'Auditor solutions headline.'}</h4>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Ad Sub-headline</span>
                          <p className="text-slate-300 font-semibold select-text">{marketingOutput.subheadline || 'Sub-headline details provided.'}</p>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Primary Body Description Copy</span>
                          <p className="text-slate-400 leading-relaxed font-mono text-[11px] select-text">{marketingOutput.body || 'Body text mapped.'}</p>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Primary Offer Engagement CTA</span>
                          <span className="px-3.5 py-1.5 bg-emerald-500 text-slate-950 font-black rounded text-[10px] tracking-wide inline-block font-sans select-text">{marketingOutput.cta || 'CTA Click Link'}</span>
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-900 rounded-2xl">
                      <Megaphone size={30} className="text-slate-600 mb-3" />
                      <h4 className="text-xs font-bold text-slate-400">Marketing Assets Blank</h4>
                      <p className="text-[10px] text-slate-500 mt-1">Configure target audiences copy and compile.</p>
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}

          {/* 9. SECTION: SEO & SALES CONTENT */}
          {activeMenu === 'seo' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="view-seo">
              
              {/* Keywords formulation (5 Columns) */}
              <div className="lg:col-span-5 bg-slate-900/30 border border-slate-900 rounded-3xl p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Search size={15} className="text-emerald-400" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">SEO Keyword Article writer</h3>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Primary Targeting SEO Keyword</label>
                    <input 
                      type="text"
                      className="w-full bg-slate-950 border border-slate-900 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none font-mono"
                      value={seoParams.keyword}
                      onChange={(e) => setSeoParams(prev => ({ ...prev, keyword: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Target Jurisdictions</label>
                      <input 
                        type="text"
                        className="w-full bg-slate-950 border border-slate-900 rounded-lg px-3 py-1.5 text-xs text-slate-300 outline-none"
                        value={seoParams.jurisdictions}
                        onChange={(e) => setSeoParams(prev => ({ ...prev, jurisdictions: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Content Format</label>
                      <input 
                        type="text"
                        className="w-full bg-slate-950 border border-slate-900 rounded-lg px-3 py-1.5 text-xs text-slate-300 outline-none"
                        value={seoParams.type}
                        onChange={(e) => setSeoParams(prev => ({ ...prev, type: e.target.value }))}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleGenerate('seo', seoParams, setSeoOutput, setGeneratingSeo)}
                    disabled={generatingSeo}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all"
                  >
                    {generatingSeo ? 'Generating outlines keyword clusters...' : 'Synthesize SEO Content'}
                  </button>
                </div>
              </div>

              {/* Keyword Article display (7 Columns) */}
              <div className="lg:col-span-7">
                <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 min-h-[450px] flex flex-col justify-between h-full">
                  
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <span className="text-xs font-black uppercase text-slate-200 font-display">SEO Article Content Output</span>
                  </div>

                  {generatingSeo ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
                      <RefreshCw size={24} className="text-emerald-400 animate-spin mb-3" />
                      <h4 className="text-xs font-bold text-slate-200">Assembling structured headers outline...</h4>
                    </div>
                  ) : seoOutput ? (
                    <div className="space-y-4 flex-1 flex flex-col justify-between">
                      
                      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-900 space-y-4 leading-relaxed text-xs">
                        <div>
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">SEO Title Tag</span>
                          <h4 className="text-sm font-bold text-white select-text">{seoOutput.title || 'Dynamic Keywords Title'}</h4>
                        </div>
                        
                        <div>
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Meta Description</span>
                          <p className="text-slate-400 select-text leading-normal italic text-xs">"{seoOutput.meta_description || 'Synthesized meta info description text.'}"</p>
                        </div>

                        <div>
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Core Article Paragraph Content Body</span>
                          <div className="p-3 bg-slate-900 rounded-xl border border-slate-855 text-slate-300 font-serif leading-relaxed text-[11px] select-text select-text whitespace-pre-wrap max-h-[160px] overflow-y-auto">
                            {seoOutput.content || 'Content body parsed.'}
                          </div>
                        </div>

                        {seoOutput.schema && (
                          <div className="pt-2 bg-slate-900/40 p-2.5 rounded-lg text-[9px] font-mono text-slate-500">
                            <span className="font-bold text-slate-400">Schema.org JSON Data Block:</span>
                            <pre className="mt-1">{JSON.stringify(seoOutput.schema, null, 2)}</pre>
                          </div>
                        )}
                      </div>

                    </div>
                  ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-900 rounded-2xl">
                      <Search size={30} className="text-slate-600 mb-3" />
                      <h4 className="text-xs font-bold text-slate-400">No Article Active</h4>
                      <p className="text-[10px] text-slate-500 mt-1">Configure parameters and hit generate on the left pane.</p>
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}

          {/* 10. SECTION: FONTS & ANIMATIONS */}
          {activeMenu === 'fonts' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="view-fonts">
              
              {/* Font config (5 Columns) */}
              <div className="lg:col-span-5 bg-slate-900/30 border border-slate-900 rounded-3xl p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Code size={15} className="text-emerald-400" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">CSS typographic & Motion style Studio</h3>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Asset Category Type</label>
                    <input 
                      type="text"
                      className="w-full bg-slate-950 border border-slate-900 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none"
                      value={fontParams.type}
                      onChange={(e) => setFontParams(prev => ({ ...prev, type: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Meticulous Brand Personality</label>
                    <input 
                      type="text"
                      className="w-full bg-slate-950 border border-slate-900 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none"
                      value={fontParams.brandPersonality}
                      onChange={(e) => setFontParams(prev => ({ ...prev, brandPersonality: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Describe custom motion styling</label>
                    <textarea 
                      rows={2}
                      className="w-full bg-slate-950 border border-slate-900 text-xs text-slate-200 outline-none resize-none leading-normal font-sans"
                      value={fontParams.style}
                      onChange={(e) => setFontParams(prev => ({ ...prev, style: e.target.value }))}
                    />
                  </div>

                  <button
                    onClick={() => handleGenerate('fonts', fontParams, setFontOutput, setGeneratingFont)}
                    disabled={generatingFont}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all"
                  >
                    {generatingFont ? 'Synthesizing css parameters...' : 'Synthesize Typographic Assets'}
                  </button>
                </div>
              </div>

              {/* Font / Animation Preview (7 Columns) */}
              <div className="lg:col-span-7">
                <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 min-h-[450px] flex flex-col justify-between h-full">
                  
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <span className="text-xs font-black uppercase text-slate-200 font-display">CSS & Swiss Typographic specifications</span>
                  </div>

                  {generatingFont ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
                      <RefreshCw size={24} className="text-emerald-400 animate-spin mb-3" />
                      <h4 className="text-xs font-bold text-slate-200">Assembling keyframes declarations...</h4>
                    </div>
                  ) : fontOutput ? (
                    <div className="space-y-4 flex-1 flex flex-col justify-between">
                      
                      <div className="space-y-2.5">
                        <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-black block">Compiled Swiss Design Blueprint Description</span>
                        <p className="text-xs text-slate-300 font-mono select-text bg-slate-950 p-4 rounded-xl border border-slate-900">
                          {fontOutput.design_prompt || 'Swiss modern design constraints verified.'}
                        </p>
                      </div>

                      {/* Interactive visual container executing the CSS mockup styling in real-time */}
                      <div className="mt-4 p-5 rounded-2xl border border-slate-900 bg-slate-950 min-h-[160px] flex flex-col justify-center items-center relative text-center">
                        <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm rounded-2xl" />
                        
                        <div className="relative z-10 space-y-2.5">
                          <span className="text-[9px] uppercase tracking-widest font-mono text-emerald-400">Swiss Kinetic Preview</span>
                          <h4 className="text-sm font-black font-display text-white tracking-widest uppercase">SWISS METICULOUS MINIMALIST</h4>
                          <p className="text-[10px] text-slate-500 font-mono">Animated dynamically according to custom parameters guidelines.</p>
                        </div>
                      </div>

                      {fontOutput.technical_output && (
                        <div className="pt-3 border-t border-slate-900 flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-900 text-[10px] font-mono">
                          <code className="text-slate-400 truncate max-w-[280px]">{fontOutput.technical_output}</code>
                          <button 
                            onClick={() => copyToClipboard(fontOutput.technical_output, 'tech_out')}
                            className="text-slate-400 hover:text-white underline text-[9px] shrink-0 ml-3"
                          >
                            {copiedText === 'tech_out' ? 'Copied code!' : 'Copy Code'}
                          </button>
                        </div>
                      )}

                    </div>
                  ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-900 rounded-2xl">
                      <Code size={30} className="text-slate-600 mb-3" />
                      <h4 className="text-xs font-bold text-slate-400">Typography Studio Empty</h4>
                      <p className="text-[10px] text-slate-500 mt-1">Configure layout style rules and hit generate.</p>
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* Persistent global logs & diagnostic footer status bar */}
      <footer className="border-t border-slate-900 bg-slate-950/70 py-3.5 px-6 flex flex-col md:flex-row justify-between items-center gap-3.5 text-[10px] text-slate-500 font-mono">
        <div>
          &copy; {new Date().getFullYear()} All Legal Matters Workspace • Google AI Studio Orchestrated Backend Enterprise API
        </div>
        <div className="flex items-center gap-4">
          <span className="text-emerald-500 flex items-center gap-1">
            <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
            <span>Node Cluster: Live & Multi-Agent Calibrated</span>
          </span>
          <span className="text-slate-600">|</span>
          <button 
            onClick={fetchStats}
            className="hover:text-white transition-colors flex items-center gap-1 text-[9px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
          >
            <RefreshCw size={10} className={loadingStats ? 'animate-spin' : ''} />
            <span>Ping Data Hook Status</span>
          </button>
        </div>
      </footer>

    </div>
  );
}

// Global bulletproof fallbacks in case of missing server connection or offline preview fallback parameters
function getOfflineFallback(moduleName: string, inputs: any) {
  switch (moduleName) {
    case 'website':
      return {
        "sitemap": ["Home", "About", "Services", "Compliance", "Contact"],
        "pages": {
          "home": {
            "sections": ["Hero", "Swiss Regulatory Grid", "Audit Sign-Up"],
            "html": "...",
            "css": "...",
            "js": "..."
          }
        },
        "seo": {
          "title": `${inputs.businessName || 'All Legal Matters'} - Automated Global Regulatory Checks`,
          "meta_description": `Safeguard your multi-jurisdiction entity using high-fidelity automated verification mapped natively in ${inputs.jurisdictions || 'cross-border scopes'}.`,
          "keywords": ["regulatory checker", "automated auditing", "corporate protection", "Swiss minimalist layout"]
        }
      };
    case 'templates':
      return {
        "template_name": inputs.templateType || "Standard Mutual Confidentiality Protocol",
        "variables": (inputs.variables || "EffectiveDate, ScopeOwner").split(',').map((v: string) => v.trim()),
        "sections": ["Recitals", "Standard Disclosure Scope Rules", "Remedies & Settlement Arbitrage"],
        "template_body": `This Mutual Protocol is entered into as of the date specified in {{EffectiveDate}} in accordance with ${inputs.jurisdictions || 'registered default Delaware statutes'} framework...`
      };
    case 'superlab':
      return {
        "summary": `Consensus simulation report regarding query: ${inputs.researchQuestion || 'regulatory compliance comparison'}`,
        "jurisdictional_comparison": {
          "EU (GDPR)": "Art 9 requires explicit consent with limited automated scraping exceptions.",
          "US Compliance": "Sectoral enforcement limits apply with state biometric CAPTCHA directives.",
          "Canada (PIPEDA)": "Strict opt-out transparency rules applied for cross-border transit checks."
        },
        "key_points": [
          "Double disclaimer must be presented.",
          "Consent validation is structurally necessary across WIPO borders."
        ],
        "structured_output": {
          "detailed_findings": "Consensus graphs synthesized. Safe checks active."
        }
      };
    case 'imagestudio':
      return {
        "prompt": `A professional photography showing a sleek Switzerland-themed executive office overlooking a holographic display of glowing cyber scales, ${inputs.palette || 'Teal Obsidian and Slate Color Schema'} elements, extremely detailed.`,
        "style": inputs.style || "Switzerland Corporate Minimalist 3D",
        "color_palette": inputs.palette || "Slate Emerald Theme",
        "use_case": inputs.useCase || "Landing Hero Blueprint"
      };
    case 'audiosymphony':
      return {
        "audio_prompt": `Composition setup matching: ${inputs.mood || 'trust-filled corporate tone'}. Warm piano intro leading to standard crisp vocal readout of: "${inputs.script || 'Disclaimer active.'}"`,
        "duration": "30s"
      };
    case 'neuralcinema':
      return {
        "storyboard": ["Open on modern corporate office", "Reveal simulated graph scale"],
        "scenes": [
          { "scene_number": 1, "prompt": "Veo scene showing high-contrast Swiss geometric models slowly rotating in space", "duration": 6 },
          { "scene_number": 2, "prompt": "Close up camera pan on clean corporate glass desk with glowing blue checklist graphic", "duration": 7 }
        ]
      };
    case 'marketing':
      return {
        "headline": `Automate Your Cross-Border Risk Checks Safely in 2026`,
        "subheadline": `Empowering ${inputs.audience || 'Chief Compliance Officers'} with Swiss-Style Meticulous AI Precisions.`,
        "body": `Secure compliant templates instantly. Map operations across ${inputs.jurisdictions || 'Global markets'} under verified neutral standards.`,
        "cta": `Request Gap Checklist Audit`
      };
    case 'seo':
      return {
        "title": `Understanding Cross-Border Biometric Transfer Guidelines`,
        "meta_description": `Explore standard compliance protocols under ${inputs.jurisdictions || 'selected state and federal laws'} frameworks.`,
        "content": `Biometric scanning data systems must comply with local privacy codes. Specifically, under Illinois BIPA and WIPO directives, explicit consent must be structured in double-brace variables prior to processing any employee records...`,
        "schema": {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Cross-Border biometric transit rules"
        }
      };
    case 'fonts':
      return {
        "design_prompt": ` Swiss Swiss typography pairings matching brand personality: ${inputs.brandPersonality || ' suisse meticulous monospace '}`,
        "technical_output": `@keyframes pulseContainer { 0% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(16,185,129,0)); } 50% { transform: scale(1.02); filter: drop-shadow(0 0 8px rgba(16,185,129,0.35)); } 100% { transform: scale(1); } }`
      };
    default:
      return {};
  }
}
