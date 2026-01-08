
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis, WebPageScenario, WebPageType, PerformanceMetrics } from "../types";
import { Cache } from "../utils/cache";

export interface ModernizationResult {
  analysis: AIAnalysis;
  html: string;
  metrics?: PerformanceMetrics;
}

export class GeminiService {
  private ai: GoogleGenAI;
  private cache: Cache<ModernizationResult>;
  private maxRetries = 3;
  private retryDelay = 1000;

  constructor() {
    // Correct initialization with named parameter as per guidelines
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    this.cache = new Cache<ModernizationResult>();
  }

  /**
   * Retry wrapper for API calls
   */
  private async withRetry<T>(
    fn: () => Promise<T>,
    retries = this.maxRetries
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.withRetry(fn, retries - 1);
      }
      throw error;
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

    const prompt = `
      You are an advanced AI Web Rendering Proxy called "NeuralRender". 
      Target URL: ${scenario.url}
      Target Theme: ${theme}
      
      Raw Content Provided (Simulated Fetch):
      ${scenario.originalContent}
      
      TASK:
      1. Analyze the page: core intent, semantic structure tree, and potential threats (ads, trackers, phishing, malicious scripts).
      2. RE-IMAGINE the content as a modern, accessible, and high-quality web page.
      3. Calculate accessibility improvements and performance gains.
      
      RULES for HTML Generation:
      - Use semantic HTML5 with proper ARIA labels.
      - Use Tailwind CSS classes for ALL styling.
      - DO NOT include <script>, <iframe>, or external tracking tags.
      - Strip all original inline styles.
      - For the "${theme}" theme, apply consistent and striking visual styles.
      - If the theme is "RETRO_80S", use glowing neon colors (cyan, magenta, yellow), mono fonts, and 80s aesthetics.
      - If "GLASSMORPHISM", use semi-transparent backgrounds (backdrop-blur), subtle shadows, and modern glass effects.
      - If "MINIMALIST", use lots of white space, elegant typography, and subtle colors.
      - If "DARK_MODE", use dark backgrounds with high contrast text and accent colors.
      - If "HIGH_CONTRAST", ensure WCAG AAA compliance with strong color contrasts.
      - Improve accessibility: proper heading hierarchy, alt texts, keyboard navigation support.
      - Optimize for performance: remove redundant elements, optimize structure.
      
      Return your response in JSON format matching this structure:
      {
        "analysis": {
          "intent": "Clear description of page purpose",
          "summary": "Brief summary of modernization improvements",
          "structure": [{"role": "string", "selector": "string", "actionable": "boolean"}],
          "threats": ["List of removed threats and malicious elements"],
          "accessibilityScore": 85,
          "performanceGain": 60,
          "sizeReduction": 45
        },
        "modernizedHtml": "The full HTML string for the body content with enhanced accessibility and modern design"
      }
    `;

    const result = await this.withRetry(async () => {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      // Using .text property directly as per guidelines
      const text = response.text || '{}';
      const data = JSON.parse(text);
      
      // Calculate metrics
      const originalSize = new TextEncoder().encode(scenario.originalContent).length;
      const modernizedSize = new TextEncoder().encode(data.modernizedHtml || '').length;
      
      const result: ModernizationResult = {
        analysis: {
          ...data.analysis,
          accessibilityScore: data.analysis.accessibilityScore || 75,
          performanceGain: data.analysis.performanceGain || 50,
          sizeReduction: data.analysis.sizeReduction || 30
        },
        html: data.modernizedHtml,
        metrics: {
          originalSize,
          modernizedSize,
          loadTime: Date.now(),
          threatsRemoved: data.analysis.threats?.length || 0
        }
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
    const prompt = `
      The user wants to visit this URL: ${url}
      Since we are in a simulation environment, generate a representative "raw, legacy, or cluttered" HTML document that might belong to this domain.
      
      Include:
      - A realistic title based on the domain.
      - Messy structure (tables, old divs, inline styles, deprecated tags).
      - Placeholder content relevant to the domain name and likely page type.
      - Some simulated ads, tracker descriptions, or security concerns.
      - Make it look authentically outdated (like early 2000s web design).
      
      Return JSON: {
        "title": "string", 
        "originalContent": "string with realistic legacy HTML", 
        "tech": ["string array of legacy technologies used"], 
        "type": "NEWS" | "ECOMMERCE" | "FORUM" | "DOCS" | "LEGACY"
      }
    `;

    try {
      const result = await this.withRetry(async () => {
        const response = await this.ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: { responseMimeType: "application/json" }
        });
        
        // Using .text property directly as per guidelines
        const data = JSON.parse(response.text || '{}');
        
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

  /**
   * Clear the cache (useful for testing or manual refresh)
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return this.cache.getStats();
  }
}
