
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
  GLASSMORPHISM = 'GLASSMORPHISM'
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
  structure: {
    role: string;
    selector: string;
    actionable: boolean;
  }[];
  threats: string[];
  summary: string;
}
