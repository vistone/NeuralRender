import { GoogleGenAI } from "@google/genai";
import { WebPageScenario, WebPageType } from "../types";
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
   * Performs analysis and content generation in a single pass to minimize latency.
   * Now includes caching and enhanced metrics.
   */
  async modernize(scenario: WebPageScenario, theme: string): Promise<ModernizationResult> {
    // Check cache first
    const cached = this.cache.get(scenario.url, { theme });
    if (cached) {
      console.log('Cache hit for:', scenario.url, theme);
      return cached;
    }

    const prompt = this.generateModernizationPrompt(scenario, theme);

    const result = await this.withRetry(async () => {
      const text = await this.callGeminiAPI(prompt);
      const data = JSON.parse(text);
      
      // Calculate metrics using base class method
      const metrics = this.calculateMetrics(scenario, data.modernizedHtml || '', data.analysis.threats || []);
      
      const result: ModernizationResult = {
        analysis: {
          ...data.analysis,
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
    this.cache.set(scenario.url, result, { theme });

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
        
        // Map string to enum
        let type = WebPageType.LEGACY;
        if (data.type === 'NEWS') type = WebPageType.NEWS;
        else if (data.type === 'ECOMMERCE') type = WebPageType.ECOMMERCE;
        else if (data.type === 'FORUM') type = WebPageType.FORUM;
        else if (data.type === 'DOCS') type = WebPageType.DOCS;

        return {
          url,
          type,
          title: data.title || "External Site",
          originalContent: data.originalContent || "<div>Connection failed.</div>",
          originalTech: data.tech || ["Simulated"]
        };
      });

      return result;
    } catch (e) {
      return {
        url,
        type: WebPageType.LEGACY,
        title: "Simulation Error",
        originalContent: `<div style="padding: 20px; color: red;">Proxy Error: Unable to resolve ${url}. The service may be temporarily unavailable.</div>`,
        originalTech: ["None"]
      };
    }
  }
}
