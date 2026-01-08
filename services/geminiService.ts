import { GoogleGenAI } from "@google/genai";
import { WebPageScenario, WebPageType, PrivacySettings } from "../types";
import { AIService, AIServiceConfig, ModernizationResult } from "./aiService";

export class GeminiService extends AIService {
  private ai: GoogleGenAI | null = null;
  private useServer: boolean;
  private serverUrl: string;

  constructor(config?: AIServiceConfig) {
    const apiKey = config?.apiKey || process.env.API_KEY || '';
    super({
      apiKey,
      maxRetries: config?.maxRetries,
      retryDelay: config?.retryDelay
    });
    
    // Use server-side API if available, otherwise direct client-side (for backward compatibility)
    this.useServer = import.meta.env.VITE_USE_SERVER !== 'false';
    this.serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
    
    // Only initialize Google AI client if not using server and we have an API key
    if (!this.useServer && this.apiKey) {
      this.ai = new GoogleGenAI({ apiKey: this.apiKey });
    }
  }

  getProviderName(): string {
    return 'Gemini';
  }

  /**
   * Call Gemini API via server or directly
   */
  private async callGeminiAPI(prompt: string): Promise<string> {
    if (this.useServer) {
      // Call server endpoint
      const response = await fetch(`${this.serverUrl}/api/ai/gemini`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } else {
      // Direct client-side call (legacy)
      if (!this.ai) {
        throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY or enable server mode.');
      }

      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      return response.text || '{}';
    }
  }

  /**
   * Generate modernization prompt with privacy settings
   */
  protected generateModernizationPrompt(scenario: WebPageScenario, theme: string, privacy?: PrivacySettings): string {
    const privacyDirectives = privacy ? `
      PRIVACY DIRECTIVES:
      ${privacy.adShield ? "- REMOVE all ads and marketing noise. Replace them with useful white space or context-aware placeholders." : ""}
      ${privacy.trackerDeception ? "- IDENTIFY all forms and replace 'Personal Info' requirements with simulated/virtual data concepts in the UI." : ""}
      ${privacy.scriptSandbox ? "- Strip all <script> and <iframe> tags. All interactions must be modern UI-driven." : ""}
    ` : '';

    return `
      Act as "NeuralRender", a world-class AI Proxy that sits between users and legacy websites.
      URL: ${scenario.url}
      Theme: ${theme}
      ${privacy ? `Privacy Shielding: ${JSON.stringify(privacy)}` : ''}
      
      RAW SOURCE:
      ${scenario.originalContent}
      
      CORE TASK:
      1. ANALYZE: Identify the core business logic, user intent, and site category.
      2. SCAN: Detect intrusive scripts, trackers, and annoying ads. ${privacy ? 'Apply privacy shielding as specified.' : ''}
      3. RECONSTRUCT: Generate a high-performance, modern React-like HTML structure using Tailwind CSS.
      4. ENHANCE: Improve accessibility (WCAG 2.1 AA compliance), remove security threats, optimize performance.
      
      ${privacyDirectives}

      VISUAL DIRECTIVES for "${theme}":
      - CYBERPUNK: High contrast black/pink/cyan, glitches, monospace accents, neon effects.
      - GLASSMORPHISM: Frosted glass effect (bg-white/10 backdrop-blur-md), soft shadows, organic shapes.
      - MINIMALIST: Radical simplicity, extreme white space, serif/sans-serif pairing.
      - DARK_MODE: Deep slates, subtle gradients, focus on readability.
      - RETRO_80S: Bright colors, geometric patterns, Memphis design vibes.
      - HIGH_CONTRAST: Maximum readability, bold colors, clear boundaries.

      Return ONLY a JSON object:
      {
        "analysis": {
          "intent": "Brief description of why the user is here",
          "category": "NEWS" | "ECOMMERCE" | "FORUM" | "DOCS" | "LEGACY",
          "summary": "1-sentence executive summary",
          "structure": [{"role": "header", "selector": "nav", "actionable": true}],
          "threats": ["List specific trackers/ads neutralized"],
          "detectedAds": number,
          "privacyScore": number (0-100),
          "accessibilityScore": number (0-100),
          "performanceGain": number (0-100),
          "sizeReduction": number (0-100)
        },
        "modernizedHtml": "Complete HTML string for a div container. Use Tailwind only."
      }
    `;
  }

  /**
   * Performs analysis and content generation in a single pass to minimize latency.
   * Now includes caching, enhanced metrics, and privacy settings.
   */
  async modernize(scenario: WebPageScenario, theme: string, privacy?: PrivacySettings): Promise<ModernizationResult> {
    // Check cache first
    const cacheKey = { theme, privacy: privacy || {} };
    const cached = this.cache.get(scenario.url, cacheKey);
    if (cached) {
      console.log('Cache hit for:', scenario.url, theme);
      return cached;
    }

    const prompt = this.generateModernizationPrompt(scenario, theme, privacy);

    const result = await this.withRetry(async () => {
      const text = await this.callGeminiAPI(prompt);
      const data = JSON.parse(text);
      
      // Calculate metrics using base class method
      const metrics = this.calculateMetrics(scenario, data.modernizedHtml || '', data.analysis.threats || []);
      
      const result: ModernizationResult = {
        analysis: {
          ...data.analysis,
          detectedAds: data.analysis.detectedAds || 0,
          privacyScore: data.analysis.privacyScore || 50,
          accessibilityScore: data.analysis.accessibilityScore || 75,
          performanceGain: data.analysis.performanceGain || 50,
          sizeReduction: data.analysis.sizeReduction || 30
        },
        html: data.modernizedHtml,
        metrics
      };

      return result;
    });

    // Cache the result
    this.cache.set(scenario.url, cacheKey, result);

    return result;
  }

  /**
   * Generates a "raw" HTML simulation for arbitrary URLs to bypass CORS/fetching limitations in the sandbox.
   * Now includes retry logic for better reliability.
   */
  async simulateFetch(url: string): Promise<WebPageScenario> {
    const prompt = this.generateSimulationPrompt(url);

    try {
      const result = await this.withRetry(async () => {
        const text = await this.callGeminiAPI(prompt);
        const data = JSON.parse(text);
        
        return {
          url,
          type: (data.type as WebPageType) || WebPageType.LEGACY,
          title: data.title || url,
          originalContent: data.originalContent,
          originalTech: data.tech || []
        };
      });
      
      return result;
    } catch (error) {
      console.error('Failed to simulate fetch:', error);
      // Return a fallback scenario
      return {
        url,
        type: WebPageType.LEGACY,
        title: 'Error Loading Page',
        originalContent: `<html><body><h1>Error</h1><p>Unable to load ${url}</p></body></html>`,
        originalTech: ['Unknown']
      };
    }
  }
}
