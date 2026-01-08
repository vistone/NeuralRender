
export enum WebPageType {
  NEWS = 'NEWS',
  ECOMMERCE = 'ECOMMERCE',
  FORUM = 'FORUM',
  DOCS = 'DOCS',
  LEGACY = 'LEGACY'
}

export enum RenderingTheme {
  MINIMALIST = 'MINIMALIST',
  DARK_MODE = 'DARK_MODE',
  HIGH_CONTRAST = 'HIGH_CONTRAST',
  RETRO_80S = 'RETRO_80S',
  GLASSMORPHISM = 'GLASSMORPHISM',
  CYBERPUNK = 'CYBERPUNK'
}

export interface PrivacySettings {
  adShield: boolean;
  virtualIdentity: boolean;
  scriptSandbox: boolean;
  trackerDeception: boolean;
}

export enum AIProvider {
  GEMINI = 'GEMINI',
  DEEPSEEK = 'DEEPSEEK',
  KIMI = 'KIMI'
}

export interface WebPageScenario {
  url: string;
  type: WebPageType;
  title: string;
  originalContent: string;
  originalTech: string[];
}

export interface AIAnalysis {
  intent: string;
  category: WebPageType;
  structure: {
    role: string;
    selector: string;
    actionable: boolean;
  }[];
  threats: string[];
  summary: string;
  // Privacy metrics (from main branch)
  detectedAds: number;
  privacyScore: number;
  // Enhanced metrics (from our branch)
  accessibilityScore?: number;
  performanceGain?: number;
  sizeReduction?: number;
}

export interface PerformanceMetrics {
  originalSize: number;
  modernizedSize: number;
  loadTime: number;
  threatsRemoved: number;
}

export interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
  modifiers?: string[];
}
