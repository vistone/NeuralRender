/**
 * DeepSeek AI Service Implementation
 * Uses DeepSeek API for web modernization
 */

import { WebPageScenario, WebPageType } from "../types";
import { AIService, AIServiceConfig, ModernizationResult } from "./aiService";

export class DeepSeekService extends AIService {
  private apiEndpoint = 'https://api.deepseek.com/v1/chat/completions';

  constructor(config?: AIServiceConfig) {
    const apiKey = config?.apiKey || process.env.DEEPSEEK_API_KEY || '';
    super({
      apiKey,
      maxRetries: config?.maxRetries,
      retryDelay: config?.retryDelay
    });
  }

  getProviderName(): string {
    return 'DeepSeek';
  }

  /**
   * Call DeepSeek API
   */
  private async callDeepSeekAPI(prompt: string): Promise<string> {
    const response = await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are an expert web developer and designer specializing in modern, accessible web design. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '{}';
  }

  /**
   * Performs analysis and content generation
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
      const responseText = await this.callDeepSeekAPI(prompt);
      const data = JSON.parse(responseText);
      
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
   * Generates a "raw" HTML simulation for arbitrary URLs
   */
  async simulateFetch(url: string): Promise<WebPageScenario> {
    const prompt = this.generateSimulationPrompt(url);

    try {
      const result = await this.withRetry(async () => {
        const responseText = await this.callDeepSeekAPI(prompt);
        const data = JSON.parse(responseText);
        
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
