
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
  ArrowRight,
  Download,
  History,
  Bookmark,
  Star,
  Trash2,
  Columns,
  BarChart3
} from 'lucide-react';
import { SCENARIOS } from './constants';
import { WebPageScenario, AIAnalysis, RenderingTheme, WebPageType, PerformanceMetrics } from './types';
import { GeminiService } from './services/geminiService';
import { historyManager, bookmarkManager } from './utils/storage';
import { useKeyboardShortcut } from './utils/hooks';

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
  const [showHistory, setShowHistory] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  
  const logContainerRef = useRef<HTMLDivElement>(null);
  const gemini = useMemo(() => new GeminiService(), []);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-25), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // Check if current URL is bookmarked
  useEffect(() => {
    setIsBookmarked(bookmarkManager.has(addressBar));
  }, [addressBar]);

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
    setMetrics(null);
    setShowComparison(false);
    
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
      const result = await gemini.modernize(targetScenario, theme);
      
      setAnalysis(result.analysis);
      setModernizedHtml(result.html);
      setMetrics(result.metrics || null);
      
      addLog(`Modernization complete.`);
      addLog(`Intent: ${result.analysis.intent}`);
      addLog(`Threats neutralized: ${result.analysis.threats.length}`);
      if (result.analysis.accessibilityScore) {
        addLog(`Accessibility Score: ${result.analysis.accessibilityScore}%`);
      }

      // Add to history
      historyManager.add({
        url: targetScenario.url,
        title: targetScenario.title,
        theme
      });
    } catch (err) {
      addLog(`CRITICAL ERROR: ${err}`);
      console.error(err);
      setModernizedHtml('<div class="p-10 text-red-500 font-bold text-center">Analysis Timeout or Network Error. Please try again.</div>');
    } finally {
      setIsProcessing(false);
    }
  }, [gemini, theme]);

  const handleNavigate = useCallback(async (inputUrl: string) => {
    setIsProcessing(true);
    setAnalysis(null);
    setModernizedHtml('');
    setLogs([]);
    setMetrics(null);
    setShowComparison(false);
    
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
      const result = await gemini.modernize(targetScenario, theme);
      
      setAnalysis(result.analysis);
      setModernizedHtml(result.html);
      setMetrics(result.metrics || null);
      
      addLog(`Modernization complete.`);
      addLog(`Intent: ${result.analysis.intent}`);
      addLog(`Threats neutralized: ${result.analysis.threats.length}`);
      if (result.analysis.accessibilityScore) {
        addLog(`Accessibility Score: ${result.analysis.accessibilityScore}%`);
      }

      // Add to history
      historyManager.add({
        url: targetScenario.url,
        title: targetScenario.title,
        theme
      });
    } catch (err) {
      addLog(`CRITICAL ERROR: ${err}`);
      console.error(err);
      setModernizedHtml('<div class="p-10 text-red-500 font-bold text-center">Analysis Timeout or Network Error. Please try again.</div>');
    } finally {
      setIsProcessing(false);
    }
  }, [gemini, theme]);

  const toggleBookmark = useCallback(() => {
    if (isBookmarked) {
      bookmarkManager.remove(addressBar);
      addLog(`Bookmark removed: ${activeScenario.title}`);
    } else {
      bookmarkManager.add({
        url: addressBar,
        title: activeScenario.title
      });
      addLog(`Bookmark added: ${activeScenario.title}`);
    }
    setIsBookmarked(!isBookmarked);
  }, [isBookmarked, addressBar, activeScenario.title]);

  const exportModernizedHtml = useCallback(() => {
    if (!modernizedHtml) {
      addLog('No content to export');
      return;
    }
    
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${activeScenario.title} - Modernized by NeuralRender</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  ${modernizedHtml}
</body>
</html>`;
    
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeScenario.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-modernized.html`;
    a.click();
    URL.revokeObjectURL(url);
    addLog(`Exported: ${a.download}`);
  }, [modernizedHtml, activeScenario.title]);

  // Keyboard shortcuts - memoized callbacks to prevent re-registrations
  const handleReload = useCallback(() => {
    handleNavigate(addressBar);
  }, [addressBar, handleNavigate]);
  
  const toggleEnhanced = useCallback(() => {
    setIsEnhanced(prev => !prev);
  }, []);
  
  const toggleHistoryPanel = useCallback(() => {
    setShowHistory(prev => !prev);
  }, []);
  
  const toggleShortcutsModal = useCallback(() => {
    setShowShortcuts(prev => !prev);
  }, []);

  useKeyboardShortcut('r', handleReload, { ctrl: true });
  useKeyboardShortcut('e', toggleEnhanced, { ctrl: true });
  useKeyboardShortcut('h', toggleHistoryPanel, { ctrl: true });
  useKeyboardShortcut('b', toggleBookmark, { ctrl: true });
  useKeyboardShortcut('s', exportModernizedHtml, { ctrl: true });
  useKeyboardShortcut('?', toggleShortcutsModal, { shift: true });

  const shortcuts = [
    { keys: 'Ctrl+R', description: 'Reload current page' },
    { keys: 'Ctrl+E', description: 'Toggle enhanced view' },
    { keys: 'Ctrl+H', description: 'Toggle history panel' },
    { keys: 'Ctrl+B', description: 'Toggle bookmark' },
    { keys: 'Ctrl+S', description: 'Export modernized HTML' },
    { keys: 'Shift+?', description: 'Show keyboard shortcuts' },
  ];

  useEffect(() => {
    handleNavigate(SCENARIOS[0].url);
  }, []); // Initial load

  const handleThemeChange = async (newTheme: RenderingTheme) => {
    setTheme(newTheme);
    addLog(`Re-rendering with ${newTheme} aesthetic parameters...`);
    setIsProcessing(true);
    try {
      const result = await gemini.modernize(activeScenario, newTheme);
      setModernizedHtml(result.html);
      setAnalysis(result.analysis);
      setMetrics(result.metrics || null);
      addLog(`Dynamic style rewrite successful.`);
    } catch (err) {
      addLog(`Re-render failed.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const viewportWidth = {
    desktop: 'w-full',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]'
  };

  const historyItems = historyManager.getAll();
  const bookmarks = bookmarkManager.getAll();

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
            <div className="flex items-center justify-between mb-3 px-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Navigation</h3>
              <div className="flex gap-1">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className={`p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors ${showHistory ? 'bg-indigo-500/10 text-indigo-400' : ''}`}
                  title="History (Ctrl+H)"
                >
                  <History size={14} />
                </button>
                <button
                  onClick={() => setShowBookmarks(!showBookmarks)}
                  className={`p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors ${showBookmarks ? 'bg-indigo-500/10 text-indigo-400' : ''}`}
                  title="Bookmarks"
                >
                  <Star size={14} />
                </button>
              </div>
            </div>

            {showHistory && (
              <div className="mb-3 bg-slate-800/30 rounded-xl p-3 border border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-300">Recent History</span>
                  <button
                    onClick={() => {
                      historyManager.clear();
                      setShowHistory(false);
                      addLog('History cleared');
                    }}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {historyItems.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No history yet</p>
                  ) : (
                    historyItems.slice(0, 10).map((item, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          handleNavigate(item.url);
                          setShowHistory(false);
                        }}
                        className="w-full text-left p-2 rounded-lg text-xs hover:bg-slate-700/50 text-slate-400 transition-all block truncate"
                      >
                        {item.title}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {showBookmarks && (
              <div className="mb-3 bg-slate-800/30 rounded-xl p-3 border border-slate-700/50">
                <span className="text-xs font-semibold text-slate-300 block mb-2">Bookmarks</span>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {bookmarks.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No bookmarks yet</p>
                  ) : (
                    bookmarks.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            handleNavigate(item.url);
                            setShowBookmarks(false);
                          }}
                          className="flex-1 text-left p-2 rounded-lg text-xs hover:bg-slate-700/50 text-slate-400 transition-all truncate"
                        >
                          {item.title}
                        </button>
                        <button
                          onClick={() => {
                            bookmarkManager.remove(item.url);
                            setShowBookmarks(false);
                            addLog(`Removed bookmark: ${item.title}`);
                          }}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

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
            <button
              onClick={() => toggleBookmark()}
              className={`p-1.5 rounded-lg transition-colors ${isBookmarked ? 'text-yellow-400 hover:text-yellow-300' : 'text-slate-500 hover:text-slate-300'}`}
              title={isBookmarked ? 'Remove Bookmark (Ctrl+B)' : 'Add Bookmark (Ctrl+B)'}
            >
              {isBookmarked ? <Star size={16} fill="currentColor" /> : <Star size={16} />}
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={exportModernizedHtml}
              disabled={!modernizedHtml}
              className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              title="Export HTML (Ctrl+S)"
            >
              <Download size={16} />
            </button>
            
            <button
              onClick={() => setShowComparison(!showComparison)}
              disabled={!modernizedHtml}
              className={`p-2 rounded-lg bg-slate-800/40 border border-slate-700/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed ${showComparison ? 'text-indigo-400 border-indigo-500/50' : 'text-slate-400 hover:text-slate-200 hover:border-slate-600'}`}
              title="Compare View"
            >
              <Columns size={16} />
            </button>
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
          
          {showComparison ? (
            <div className="flex gap-6 w-full">
              <div className="flex-1 min-w-0">
                <div className="mb-3 text-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-800/50 px-3 py-1 rounded-full">Original</span>
                </div>
                <div className="shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] bg-white min-h-[600px] overflow-hidden rounded-2xl border border-white/5">
                  <div className="h-full overflow-y-auto p-8 text-slate-800 bg-[#f8fafc]" dangerouslySetInnerHTML={{ __html: activeScenario.originalContent }} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="mb-3 text-center">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">Modernized</span>
                </div>
                <div className="shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] bg-white min-h-[600px] overflow-hidden rounded-2xl border border-white/5">
                  <div className="h-full overflow-y-auto modernize-container" dangerouslySetInnerHTML={{ __html: modernizedHtml }} />
                </div>
              </div>
            </div>
          ) : (
            <div className={`transition-all duration-700 ease-in-out shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] bg-white min-h-[600px] overflow-hidden rounded-2xl border border-white/5 ${viewportWidth[viewMode]}`}>
              {isEnhanced ? (
                <div className="h-full overflow-y-auto modernize-container" dangerouslySetInnerHTML={{ __html: modernizedHtml }} />
              ) : (
                <div className="h-full overflow-y-auto p-8 text-slate-800 bg-[#f8fafc]" dangerouslySetInnerHTML={{ __html: activeScenario.originalContent }} />
              )}
            </div>
          )}
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

        {/* Help Button */}
        <button
          onClick={() => setShowShortcuts(true)}
          className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-[#0f172a]/90 backdrop-blur-xl border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:border-indigo-500/50 transition-all shadow-2xl"
          title="Keyboard Shortcuts (Shift+?)"
        >
          <span className="text-lg font-bold">?</span>
        </button>

        {/* Keyboard Shortcuts Modal */}
        {showShortcuts && (
          <div 
            className="absolute inset-0 z-50 bg-[#020617]/80 backdrop-blur-sm flex items-center justify-center p-8"
            onClick={() => setShowShortcuts(false)}
          >
            <div 
              className="bg-[#0f172a] border border-slate-700/50 rounded-2xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="bg-indigo-500/10 p-2 rounded-xl">
                  <Terminal size={20} className="text-indigo-400" />
                </div>
                Keyboard Shortcuts
              </h3>
              <div className="space-y-3">
                {shortcuts.map((shortcut, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700/50">
                    <span className="text-sm text-slate-300">{shortcut.description}</span>
                    <kbd className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-400">
                      {shortcut.keys}
                    </kbd>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowShortcuts(false)}
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-4 rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )}
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
                    <BarChart3 size={14} className="text-yellow-400" /> Performance Metrics
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {analysis.accessibilityScore !== undefined && (
                      <div>
                        <div className="flex items-center justify-between text-[10px] mb-1">
                          <span className="text-slate-500">ACCESSIBILITY</span>
                          <span className="text-emerald-400 font-bold">{analysis.accessibilityScore}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                            style={{ width: `${analysis.accessibilityScore}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {analysis.performanceGain !== undefined && (
                      <div>
                        <div className="flex items-center justify-between text-[10px] mb-1">
                          <span className="text-slate-500">PERFORMANCE GAIN</span>
                          <span className="text-indigo-400 font-bold">+{analysis.performanceGain}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-500"
                            style={{ width: `${analysis.performanceGain}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {analysis.sizeReduction !== undefined && (
                      <div>
                        <div className="flex items-center justify-between text-[10px] mb-1">
                          <span className="text-slate-500">SIZE REDUCTION</span>
                          <span className="text-cyan-400 font-bold">{analysis.sizeReduction}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-500"
                            style={{ width: `${analysis.sizeReduction}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {metrics && (
                      <div className="pt-3 border-t border-slate-700/50">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-500">ORIGINAL SIZE</span>
                          <span className="text-slate-400 font-mono">{formatBytes(metrics.originalSize)}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] mt-1">
                          <span className="text-slate-500">MODERNIZED SIZE</span>
                          <span className="text-slate-400 font-mono">{formatBytes(metrics.modernizedSize)}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">LEGACY TECH</span>
                      <div className="flex gap-1 flex-wrap justify-end">
                        {activeScenario.originalTech.map((tech, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-slate-900 text-[8px] text-slate-400 border border-slate-800">{tech}</span>
                        ))}
                      </div>
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
