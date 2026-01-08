
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  Globe, 
  ShieldCheck, 
  Zap, 
  Settings, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  ChevronRight,
  Monitor,
  Smartphone,
  Tablet,
  Cpu,
  Terminal,
  Activity,
  Shield,
  Fingerprint,
  Ghost,
  Lock,
  Unlock,
  AlertTriangle,
  Info,
  Menu,
  Layout,
  ExternalLink,
  Key
} from 'lucide-react';
import { SCENARIOS } from './constants';
import { WebPageScenario, AIAnalysis, RenderingTheme, PrivacySettings } from './types';
import { GeminiService } from './services/geminiService';

const App: React.FC = () => {
  const [addressBar, setAddressBar] = useState(SCENARIOS[0].url);
  const [activeScenario, setActiveScenario] = useState<WebPageScenario>(SCENARIOS[0]);
  const [isEnhanced, setIsEnhanced] = useState(true);
  const [theme, setTheme] = useState<RenderingTheme>(RenderingTheme.GLASSMORPHISM);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [modernizedHtml, setModernizedHtml] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    adShield: true,
    virtualIdentity: true,
    scriptSandbox: true,
    trackerDeception: true
  });
  
  const logContainerRef = useRef<HTMLDivElement>(null);
  const gemini = useMemo(() => new GeminiService(), []);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-30), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const checkApiKey = async () => {
    // If we hit auth errors, provide the key selection UI
    if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
      addLog("Authentication required. Please select an API key.");
      await window.aistudio.openSelectKey();
    }
  };

  const handleNavigate = useCallback(async (inputUrl: string) => {
    setIsProcessing(true);
    setAnalysis(null);
    setLogs([]);
    addLog(`NeuralLink handshaking: ${inputUrl}`);
    
    try {
      await checkApiKey();
      
      let targetScenario = SCENARIOS.find(s => s.url === inputUrl);
      if (!targetScenario) {
        addLog(`Proxying external endpoint...`);
        targetScenario = await gemini.simulateFetch(inputUrl);
      }
      
      setActiveScenario(targetScenario);
      setAddressBar(targetScenario.url);

      addLog(`Analyzing semantic structure...`);
      const result = await gemini.modernize(targetScenario, theme, privacy);
      
      setAnalysis(result.analysis);
      setModernizedHtml(result.html);
      
      addLog(`Interpreted Intent: ${result.analysis.intent}`);
      addLog(`Neutralized ${result.analysis.detectedAds} trackers/ads.`);
      addLog(`Neural Reconstruction Successful.`);
    } catch (err: any) {
      addLog(`Modernization failed: ${err.message || 'Unknown error'}`);
      if (err.message?.includes('401')) {
        addLog("Security alert: Invalid API key credentials.");
      }
      setModernizedHtml(`<div class="p-20 text-center text-slate-500 font-mono">
        <AlertTriangle className="mx-auto mb-4 text-red-500" size={48} />
        <h2 class="text-xl font-bold text-white mb-2">Neural Link Interrupted</h2>
        <p class="text-sm">The AI core encountered an authentication failure or network timeout.</p>
        <button onclick="location.reload()" class="mt-6 px-4 py-2 bg-indigo-600 rounded text-white text-xs font-bold uppercase">Retry Handshake</button>
      </div>`);
    } finally {
      setIsProcessing(false);
    }
  }, [gemini, theme, privacy]);

  useEffect(() => {
    handleNavigate(SCENARIOS[0].url);
  }, [handleNavigate]);

  const viewportWidth = {
    desktop: 'w-full max-w-7xl',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]'
  };

  return (
    <div className="flex h-screen w-full bg-[#030712] text-slate-300 overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* LEFT SIDEBAR: IDENTITY & PRIVACY */}
      <aside className="w-72 border-r border-slate-800/40 flex flex-col bg-[#0b0f1a] relative z-30">
        <div className="p-6 border-b border-slate-800/40">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
              <Cpu size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-white leading-none">NEURAL RENDER</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">AI Agent v2.4</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Shield size={12} className="text-indigo-400" /> Security Stack
            </h3>
            
            {[
              { id: 'adShield', label: 'Ad Shield', icon: <Zap size={14} />, color: 'text-yellow-400' },
              { id: 'virtualIdentity', label: 'Ghost Identity', icon: <Fingerprint size={14} />, color: 'text-cyan-400' },
              { id: 'scriptSandbox', label: 'Script Sandbox', icon: <Lock size={14} />, color: 'text-emerald-400' },
              { id: 'trackerDeception', label: 'Tracker Decoy', icon: <Ghost size={14} />, color: 'text-purple-400' }
            ].map(item => (
              <label key={item.id} className="flex items-center justify-between group cursor-pointer p-2 rounded-lg hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`${item.color} opacity-70 group-hover:opacity-100 transition-opacity`}>{item.icon}</span>
                  <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200">{item.label}</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={(privacy as any)[item.id]} 
                  onChange={() => setPrivacy(p => ({ ...p, [item.id]: !(p as any)[item.id] }))}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Knowledge Base</h3>
          <div className="space-y-1">
            {SCENARIOS.map(s => (
              <button
                key={s.url}
                onClick={() => handleNavigate(s.url)}
                className={`w-full text-left p-3 rounded-xl text-xs transition-all flex items-center justify-between group border ${activeScenario.url === s.url ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' : 'text-slate-500 border-transparent hover:bg-slate-800/50'}`}
              >
                <span className="truncate max-w-[160px]">{s.title}</span>
                <ChevronRight size={12} className={activeScenario.url === s.url ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} />
              </button>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-slate-800/40">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-2 flex items-center gap-2">
              <Terminal size={12} /> Neural Stream
            </h3>
            <div 
              ref={logContainerRef}
              className="h-40 bg-black/40 rounded-xl p-3 font-mono text-[9px] text-emerald-500/70 overflow-y-auto border border-slate-800/40"
            >
              {logs.map((l, i) => <div key={i} className="mb-1 leading-tight"><span className="opacity-30">#</span> {l}</div>)}
              {isProcessing && <div className="animate-pulse">_</div>}
            </div>
          </div>
        </div>
      </aside>

      {/* CENTER: BROWSER SURFACE */}
      <main className="flex-1 flex flex-col relative bg-[#020617] overflow-hidden">
        {/* TOP COMMAND BAR */}
        <header className="h-16 border-b border-slate-800/40 bg-[#0b0f1a]/80 backdrop-blur-xl flex items-center px-6 gap-6 z-20">
          <div className="flex items-center gap-2 text-slate-400 bg-black/40 px-4 py-2 rounded-2xl border border-slate-800/40 flex-1 group focus-within:border-indigo-500/50 transition-all shadow-inner">
            <Globe size={16} className="text-slate-600 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              value={addressBar}
              onChange={(e) => setAddressBar(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNavigate(addressBar)}
              className="bg-transparent border-none focus:ring-0 text-xs flex-1 outline-none text-slate-300 placeholder:text-slate-600 font-mono"
              placeholder="Inject URL into Neural Core..."
            />
            {isProcessing && <RefreshCw size={14} className="animate-spin text-indigo-500" />}
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-800/60 shadow-inner">
            {[
              { id: 'desktop', icon: <Monitor size={14} /> },
              { id: 'tablet', icon: <Tablet size={14} /> },
              { id: 'mobile', icon: <Smartphone size={14} /> }
            ].map(v => (
              <button 
                key={v.id}
                onClick={() => setViewMode(v.id as any)}
                className={`p-2 rounded-lg transition-all ${viewMode === v.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
              >
                {v.icon}
              </button>
            ))}
          </div>

          <button 
            onClick={() => checkApiKey()}
            className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all"
            title="Configure API Key"
          >
            <Key size={18} />
          </button>
        </header>

        {/* WEB VIEWPORT */}
        <div className="flex-1 overflow-auto p-12 flex flex-col items-center bg-[radial-gradient(circle_at_50%_50%,_#0f172a_0%,_#020617_100%)] relative">
          
          {/* THEME SELECTOR CHIPS */}
          <div className="flex items-center gap-2 mb-8 bg-slate-900/40 p-1.5 rounded-full border border-slate-800/60 backdrop-blur shadow-2xl">
            {Object.values(RenderingTheme).map(t => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-tight transition-all border ${theme === t ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'text-slate-500 border-transparent hover:bg-white/5'}`}
              >
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className={`transition-all duration-1000 ease-in-out shadow-[0_48px_100px_-24px_rgba(0,0,0,0.8)] bg-white min-h-[700px] overflow-hidden rounded-3xl border border-white/5 relative ${viewportWidth[viewMode]}`}>
            
            {/* SCANNING OVERLAY */}
            {isProcessing && (
              <div className="absolute inset-0 z-50 bg-[#020617]/40 backdrop-blur-md flex items-center justify-center flex-col gap-6">
                <div className="relative">
                  <div className="w-24 h-24 border-2 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 m-auto w-16 h-16 border-2 border-indigo-400/10 border-b-indigo-400 rounded-full animate-spin [animation-direction:reverse]"></div>
                  <Zap size={32} className="absolute inset-0 m-auto text-indigo-400 animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-indigo-400 font-bold tracking-[0.2em] uppercase text-xs mb-2">Neural Rewriting</p>
                  <p className="text-slate-400 text-[10px] font-mono animate-pulse">STRUCTURAL ANALYZER: PASS {Math.floor(Math.random() * 4)}...</p>
                </div>
              </div>
            )}
            
            <div className="h-full bg-white overflow-y-auto modernization-content">
              {isEnhanced ? (
                <div dangerouslySetInnerHTML={{ __html: modernizedHtml }} />
              ) : (
                <div className="p-8 text-slate-800" dangerouslySetInnerHTML={{ __html: activeScenario.originalContent }} />
              )}
            </div>
          </div>

          {/* VIEW TOGGLE FLOATER */}
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#0f172a]/90 backdrop-blur-2xl border border-slate-700/50 p-1.5 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] z-40">
            <button 
              onClick={() => setIsEnhanced(false)}
              className={`px-6 py-2 rounded-full text-[10px] font-black tracking-widest transition-all flex items-center gap-2 ${!isEnhanced ? 'bg-slate-800 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <EyeOff size={12} /> LEGACY SOURCE
            </button>
            <div className="w-[1px] h-4 bg-slate-700 mx-1"></div>
            <button 
              onClick={() => setIsEnhanced(true)}
              className={`px-6 py-2 rounded-full text-[10px] font-black tracking-widest transition-all flex items-center gap-2 ${isEnhanced ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/40' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <ShieldCheck size={12} /> NEURAL AGENT
            </button>
          </div>
        </div>
      </main>

      {/* RIGHT SIDEBAR: SITE TELEMETRY */}
      <aside className="w-80 border-l border-slate-800/40 bg-[#0b0f1a] flex flex-col z-30">
        <div className="p-6 border-b border-slate-800/40">
          <h2 className="font-bold text-white text-sm flex items-center gap-2 uppercase tracking-tight">
            <Activity size={16} className="text-indigo-400" /> Site Telemetry
          </h2>
        </div>
        
        <div className="flex-1 p-6 space-y-8 overflow-y-auto">
          {analysis ? (
            <>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Privacy Score</span>
                    <span className={`text-xs font-bold ${analysis.privacyScore > 70 ? 'text-emerald-400' : 'text-yellow-400'}`}>{analysis.privacyScore}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full transition-all duration-1000" style={{ width: `${analysis.privacyScore}%` }}></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Agent Assessment</span>
                  <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 shadow-inner">
                    <p className="text-xs text-slate-300 leading-relaxed font-medium italic">"{analysis.summary}"</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Neutralized Targets</span>
                  <div className="space-y-2">
                    {analysis.threats.map((t, i) => (
                      <div key={i} className="flex items-center gap-3 text-[10px] text-slate-400 bg-red-500/5 p-3 rounded-xl border border-red-500/10 hover:border-red-500/30 transition-colors">
                        <ShieldCheck size={12} className="text-red-500 shrink-0" />
                        <span>{t}</span>
                      </div>
                    ))}
                    {analysis.threats.length === 0 && (
                      <div className="text-[10px] text-emerald-400 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/20 flex items-center gap-2">
                        <ShieldCheck size={12} /> Environment secured.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800/40">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/60 space-y-4">
                  <h4 className="text-[10px] font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                    <Layout size={12} className="text-indigo-400" /> Structure Mapping
                  </h4>
                  <div className="space-y-3">
                    {analysis.structure.slice(0, 4).map((s, i) => (
                      <div key={i} className="flex items-center justify-between group">
                        <span className="text-[10px] text-slate-500 group-hover:text-slate-300 transition-colors uppercase tracking-tight">{s.role}</span>
                        <div className="flex items-center gap-2">
                          <code className="text-[9px] bg-black/40 px-1.5 py-0.5 rounded text-indigo-400 border border-slate-800">{s.selector}</code>
                          {s.actionable && <Zap size={10} className="text-yellow-500 fill-yellow-500/20" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-20">
              <Ghost size={48} className="text-slate-500 mb-6" />
              <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">Waiting for Data Ingestion</p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default App;
