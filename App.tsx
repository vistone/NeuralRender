
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  Globe, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Settings, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  ChevronRight,
  Monitor,
  Smartphone,
  Tablet,
  Ghost,
  Cpu,
  Terminal,
  Search,
  Activity,
  ArrowRight
} from 'lucide-react';
import { SCENARIOS } from './constants';
import { WebPageScenario, AIAnalysis, RenderingTheme, WebPageType } from './types';
import { GeminiService } from './services/geminiService';

const App: React.FC = () => {
  const [addressBar, setAddressBar] = useState(SCENARIOS[0].url);
  const [activeScenario, setActiveScenario] = useState<WebPageScenario>(SCENARIOS[0]);
  const [isEnhanced, setIsEnhanced] = useState(true);
  const [theme, setTheme] = useState<RenderingTheme>(RenderingTheme.MINIMALIST);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [modernizedHtml, setModernizedHtml] = useState<string>('');
  const [virtualIdEnabled, setVirtualIdEnabled] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  
  const logContainerRef = useRef<HTMLDivElement>(null);
  const gemini = useMemo(() => new GeminiService(), []);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-25), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleNavigate = useCallback(async (inputUrl: string) => {
    setIsProcessing(true);
    setAnalysis(null);
    setModernizedHtml('');
    setLogs([]);
    
    addLog(`Resolving endpoint: ${inputUrl}...`);
    
    try {
      // 1. Check if it's a known scenario or needs simulation
      let targetScenario = SCENARIOS.find(s => s.url === inputUrl);
      
      if (!targetScenario) {
        addLog(`External URL detected. Initiating deep crawl simulation...`);
        targetScenario = await gemini.simulateFetch(inputUrl);
        addLog(`Source capture complete: "${targetScenario.title}"`);
      } else {
        addLog(`Scenario cache hit. Loading source...`);
      }
      
      setActiveScenario(targetScenario);
      setAddressBar(targetScenario.url);

      // 2. Perform combined analysis and modernization for SPEED
      addLog(`Entering Neural Processing Layer (High-Speed Single-Pass)...`);
      const { analysis: analysisData, html } = await gemini.modernize(targetScenario, theme);
      
      setAnalysis(analysisData);
      setModernizedHtml(html);
      
      addLog(`Modernization complete.`);
      addLog(`Intent: ${analysisData.intent}`);
      addLog(`Threats neutralized: ${analysisData.threats.length}`);
    } catch (err) {
      addLog(`CRITICAL ERROR: ${err}`);
      console.error(err);
      setModernizedHtml('<div class="p-10 text-red-500 font-bold text-center">Analysis Timeout or Network Error. Please try again.</div>');
    } finally {
      setIsProcessing(false);
    }
  }, [gemini, theme]);

  useEffect(() => {
    handleNavigate(SCENARIOS[0].url);
  }, []); // Initial load

  const handleThemeChange = async (newTheme: RenderingTheme) => {
    setTheme(newTheme);
    addLog(`Re-rendering with ${newTheme} aesthetic parameters...`);
    setIsProcessing(true);
    try {
      const { html } = await gemini.modernize(activeScenario, newTheme);
      setModernizedHtml(html);
      addLog(`Dynamic style rewrite successful.`);
    } catch (err) {
      addLog(`Re-render failed.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const viewportWidth = {
    desktop: 'w-full',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]'
  };

  return (
    <div className="flex h-screen w-full bg-[#020617] text-slate-200 overflow-hidden selection:bg-indigo-500/30 font-sans">
      {/* Sidebar - Control Panel */}
      <aside className="w-80 border-r border-slate-800/60 flex flex-col bg-[#0f172a] shadow-2xl z-20">
        <div className="p-6 border-b border-slate-800/60 flex items-center gap-3 bg-gradient-to-b from-slate-800/10 to-transparent">
          <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20 group relative overflow-hidden">
            <Cpu size={24} className="text-white relative z-10" />
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-white leading-none mb-1">NeuralRender</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Web Modernization Proxy</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">Navigation</h3>
            <div className="space-y-1">
              {SCENARIOS.map(s => (
                <button
                  key={s.url}
                  onClick={() => handleNavigate(s.url)}
                  className={`w-full text-left p-2.5 rounded-lg text-sm transition-all flex items-center justify-between group ${activeScenario.url === s.url ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/5' : 'hover:bg-slate-800/50 text-slate-400 border border-transparent'}`}
                >
                  <span className="truncate">{s.title}</span>
                  <ChevronRight size={14} className={`transition-transform duration-300 ${activeScenario.url === s.url ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">Rendering Engine</h3>
            <div className="space-y-2 px-2">
              <div className="flex items-center justify-between text-xs mb-1 text-slate-400">
                <span>Theme</span>
                <span className="text-indigo-400 font-mono uppercase">{theme.replace('_', ' ')}</span>
              </div>
              <div className="grid grid-cols-1 gap-1">
                {Object.values(RenderingTheme).map(t => (
                  <button
                    key={t}
                    onClick={() => handleThemeChange(t)}
                    className={`text-left p-2 rounded-lg text-xs font-medium border transition-all ${theme === t ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-800/30 border-slate-700/50 text-slate-400 hover:border-slate-600'}`}
                  >
                    {t.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/60 flex-1 flex flex-col min-h-0">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
              <Terminal size={14} /> System Logs
            </h3>
            <div 
              ref={logContainerRef}
              className="flex-1 bg-black/40 rounded-xl p-3 font-mono text-[10px] text-emerald-500/80 overflow-y-auto border border-slate-800/60 shadow-inner"
            >
              {logs.map((log, i) => (
                <div key={i} className="mb-1 leading-relaxed border-l border-emerald-500/20 pl-2">
                  <span className="opacity-40 mr-2">{i.toString().padStart(2, '0')}</span>
                  {log}
                </div>
              ))}
              {isProcessing && <div className="animate-pulse flex gap-1"><span>$</span><div className="w-2 h-4 bg-emerald-500/50"></div></div>}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#020617]">
        {/* Address Bar Area */}
        <div className="h-16 border-b border-slate-800/60 bg-[#0f172a]/80 backdrop-blur-xl flex items-center px-6 gap-4 z-10 shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 bg-black/40 px-4 py-2 rounded-2xl border border-slate-800/60 flex-1 max-w-3xl focus-within:border-indigo-500/50 transition-colors shadow-inner">
            <ShieldCheck size={18} className={isEnhanced ? 'text-emerald-500' : 'text-slate-500'} />
            <input 
              value={addressBar}
              onChange={(e) => setAddressBar(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNavigate(addressBar)}
              className="bg-transparent border-none focus:ring-0 text-sm flex-1 outline-none text-slate-200 placeholder:text-slate-600"
              placeholder="Enter URL to modernize..."
            />
          </div>
          
          <div className="flex items-center gap-1 bg-slate-800/40 p-1 rounded-xl border border-slate-700/50">
            <button 
              onClick={() => setViewMode('desktop')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'desktop' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/50'}`}
              title="Desktop View"
            >
              <Monitor size={16} />
            </button>
            <button 
              onClick={() => setViewMode('tablet')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'tablet' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/50'}`}
              title="Tablet View"
            >
              <Tablet size={16} />
            </button>
            <button 
              onClick={() => setViewMode('mobile')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'mobile' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/50'}`}
              title="Mobile View"
            >
              <Smartphone size={16} />
            </button>
          </div>
        </div>

        {/* Browser Content */}
        <div className="flex-1 overflow-auto p-12 flex justify-center bg-slate-950/20 relative">
          {isProcessing && (
            <div className="absolute inset-0 z-50 bg-[#020617]/60 backdrop-blur-md flex items-center justify-center flex-col gap-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
                <Zap size={24} className="absolute inset-0 m-auto text-indigo-400 animate-pulse" />
              </div>
              <div className="text-center">
                <p className="text-indigo-400 font-bold tracking-widest uppercase text-xs mb-1">Neural Rewiring</p>
                <p className="text-slate-500 text-sm italic">Simulating modern web architecture...</p>
              </div>
            </div>
          )}
          
          <div className={`transition-all duration-700 ease-in-out shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] bg-white min-h-[600px] overflow-hidden rounded-2xl border border-white/5 ${viewportWidth[viewMode]}`}>
            {isEnhanced ? (
              <div className="h-full overflow-y-auto modernize-container" dangerouslySetInnerHTML={{ __html: modernizedHtml }} />
            ) : (
              <div className="h-full overflow-y-auto p-8 text-slate-800 bg-[#f8fafc]" dangerouslySetInnerHTML={{ __html: activeScenario.originalContent }} />
            )}
          </div>
        </div>

        {/* Mode Toggle Overlay */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#0f172a]/90 backdrop-blur-xl border border-slate-700/50 p-1.5 rounded-full shadow-2xl">
          <button 
            onClick={() => setIsEnhanced(false)}
            className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${!isEnhanced ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <EyeOff size={14} /> RAW SOURCE
          </button>
          <button 
            onClick={() => setIsEnhanced(true)}
            className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${isEnhanced ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <ShieldCheck size={14} /> NEURAL RENDER
          </button>
        </div>
      </main>

      {/* Analysis Panel */}
      <aside className="w-80 border-l border-slate-800/60 bg-[#0f172a] overflow-y-auto flex flex-col shadow-2xl z-20">
        <div className="p-6 border-b border-slate-800/60 bg-gradient-to-b from-slate-800/10 to-transparent">
          <h2 className="font-bold text-white flex items-center gap-2">
            <Activity size={18} className="text-indigo-400" />
            AI Insight
          </h2>
        </div>
        
        <div className="flex-1 p-6 space-y-8">
          {analysis ? (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Site Intent</span>
                  <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 shadow-inner">
                    <p className="text-sm text-slate-300 leading-relaxed font-medium">{analysis.intent}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Security Layer</span>
                  <div className="space-y-2">
                    {analysis.threats.map((t, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs text-slate-400 bg-red-500/5 p-3 rounded-xl border border-red-500/10 group hover:border-red-500/30 transition-colors">
                        <ShieldCheck size={14} className="text-red-500 shrink-0" />
                        <span>{t}</span>
                      </div>
                    ))}
                    {analysis.threats.length === 0 && (
                      <div className="text-xs text-emerald-500 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10 flex items-center gap-2">
                        <ShieldCheck size={14} /> Clean environment.
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Neural Summary</span>
                  <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-slate-700 pl-4 py-1">
                    "{analysis.summary}"
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800/60">
                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 space-y-4">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-tight">
                    <Zap size={14} className="text-yellow-400" /> Metrics
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">LEGACY TECH</span>
                      <div className="flex gap-1">
                        {activeScenario.originalTech.map((tech, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-slate-900 text-[8px] text-slate-400 border border-slate-800">{tech}</span>
                        ))}
                      </div>
                    </div>
                    <div className="h-1 bg-slate-900 rounded-full overflow-hidden flex">
                      <div className="w-[85%] bg-indigo-500 h-full"></div>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">CLEANUP SCORE</span>
                      <span className="text-indigo-400 font-bold">85%</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <Ghost size={40} className="text-slate-800 mb-4" />
              <p className="text-xs text-slate-600 font-medium">No live analysis available.<br/>Initiate rendering to generate insights.</p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default App;
