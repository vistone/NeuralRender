/**
 * NeuralRender Configuration
 * Customize application behavior and settings
 */

export const CONFIG = {
  // Cache settings
  cache: {
    enabled: true,
    durationMinutes: 10,
  },

  // API retry settings
  api: {
    maxRetries: 3,
    retryDelayMs: 1000,
    timeoutMs: 30000,
  },

  // History settings
  history: {
    maxItems: 50,
    enabled: true,
  },

  // UI settings
  ui: {
    defaultTheme: 'MINIMALIST',
    defaultViewMode: 'desktop',
    showLogs: true,
    animationDuration: 300,
  },

  // Feature flags
  features: {
    enableBookmarks: true,
    enableHistory: true,
    enableExport: true,
    enableComparison: true,
    enableKeyboardShortcuts: true,
    enableMetrics: true,
  },

  // Accessibility settings
  accessibility: {
    enableKeyboardNavigation: true,
    announceChanges: true,
    highContrastMode: false,
  },

  // Debug settings
  debug: {
    enabled: false,
    verboseLogs: false,
    showCacheStats: false,
  },
};

export default CONFIG;
