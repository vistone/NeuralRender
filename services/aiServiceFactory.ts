/**
 * AI Service Factory
 * Creates appropriate AI service based on provider selection
 */

import { AIProvider } from "../types";
import { AIService, AIServiceConfig } from "./aiService";
import { GeminiService } from "./geminiService";
import { DeepSeekService } from "./deepseekService";
import { KimiService } from "./kimiService";

export class AIServiceFactory {
  /**
   * Create an AI service instance based on provider
   */
  static createService(provider: AIProvider, config?: AIServiceConfig): AIService {
    switch (provider) {
      case AIProvider.GEMINI:
        return new GeminiService(config);
      case AIProvider.DEEPSEEK:
        return new DeepSeekService(config);
      case AIProvider.KIMI:
        return new KimiService(config);
      default:
        // Default to Gemini
        return new GeminiService(config);
    }
  }

  /**
   * Get list of available providers
   */
  static getAvailableProviders(): AIProvider[] {
    return [AIProvider.GEMINI, AIProvider.DEEPSEEK, AIProvider.KIMI];
  }

  /**
   * Get provider display name
   */
  static getProviderDisplayName(provider: AIProvider): string {
    switch (provider) {
      case AIProvider.GEMINI:
        return 'Google Gemini';
      case AIProvider.DEEPSEEK:
        return 'DeepSeek';
      case AIProvider.KIMI:
        return 'Kimi (Moonshot)';
      default:
        return provider;
    }
  }

  /**
   * Get provider description
   */
  static getProviderDescription(provider: AIProvider): string {
    switch (provider) {
      case AIProvider.GEMINI:
        return 'Google\'s advanced AI model with strong reasoning';
      case AIProvider.DEEPSEEK:
        return 'Efficient and fast Chinese AI model';
      case AIProvider.KIMI:
        return 'Moonshot AI with long context support';
      default:
        return '';
    }
  }
}
