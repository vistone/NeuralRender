/**
 * Abstract AI Service Interface
 * Defines common interface for all AI providers (Gemini, DeepSeek, Kimi)
 */

import { AIAnalysis, WebPageScenario, PerformanceMetrics } from "../types";
import { Cache } from "../utils/cache";

export interface ModernizationResult {
  analysis: AIAnalysis;
  html: string;
  metrics?: PerformanceMetrics;
}

export enum AIProvider {
  GEMINI = 'GEMINI',
  DEEPSEEK = 'DEEPSEEK',
  KIMI = 'KIMI'
}

export interface AIServiceConfig {
  apiKey: string;
  maxRetries?: number;
  retryDelay?: number;
}

/**
 * Base abstract class for AI services
 */
export abstract class AIService {
  protected cache: Cache<ModernizationResult>;
  protected maxRetries: number;
  protected retryDelay: number;
  protected textEncoder = new TextEncoder();
  protected apiKey: string;

  constructor(config: AIServiceConfig) {
    this.apiKey = config.apiKey;
    this.maxRetries = config.maxRetries || 3;
    this.retryDelay = config.retryDelay || 1000;
    this.cache = new Cache<ModernizationResult>();
  }

  /**
   * Retry wrapper for API calls
   */
  protected async withRetry<T>(
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
   * Generate the modernization prompt
   */
  protected generateModernizationPrompt(scenario: WebPageScenario, theme: string): string {
    return `
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
  }

  /**
   * Generate the simulation fetch prompt
   */
  protected generateSimulationPrompt(url: string): string {
    return `
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
  }

  /**
   * Calculate metrics for modernization result
   */
  protected calculateMetrics(scenario: WebPageScenario, modernizedHtml: string, threats: string[]): PerformanceMetrics {
    const originalSize = this.textEncoder.encode(scenario.originalContent).length;
    const modernizedSize = this.textEncoder.encode(modernizedHtml || '').length;
    
    return {
      originalSize,
      modernizedSize,
      loadTime: Date.now(),
      threatsRemoved: threats.length
    };
  }

  /**
   * Clear the cache
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

  /**
   * Abstract methods to be implemented by specific AI providers
   */
  abstract modernize(scenario: WebPageScenario, theme: string): Promise<ModernizationResult>;
  abstract simulateFetch(url: string): Promise<WebPageScenario>;
  abstract getProviderName(): string;
}
