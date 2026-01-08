
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis, WebPageScenario, WebPageType } from "../types";

export interface ModernizationResult {
  analysis: AIAnalysis;
  html: string;
}

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Correct initialization with named parameter as per guidelines
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  /**
   * Performs analysis and content generation in a single pass to minimize latency.
   */
  async modernize(scenario: WebPageScenario, theme: string): Promise<ModernizationResult> {
    const prompt = `
      You are an advanced AI Web Rendering Proxy called "NeuralRender". 
      Target URL: ${scenario.url}
      Target Theme: ${theme}
      
      Raw Content Provided (Simulated Fetch):
      ${scenario.originalContent}
      
      TASK:
      1. Analyze the page: core intent, semantic structure tree, and potential threats (ads, trackers, phishing).
      2. RE-IMAGINE the content as a modern, accessible, and high-quality web page.
      
      RULES for HTML Generation:
      - Use semantic HTML5.
      - Use Tailwind CSS classes for ALL styling.
      - DO NOT include <script>, <iframe>, or external tracking tags.
      - Strip all original inline styles.
      - For the "${theme}" theme, apply consistent and striking visual styles.
      - If the theme is "RETRO_80S", use glowing neon colors and mono fonts.
      - If "GLASSMORPHISM", use semi-transparent backgrounds and blurs.
      - If "MINIMALIST", use lots of white space and elegant typography.
      
      Return your response in JSON format matching this structure:
      {
        "analysis": {
          "intent": "string",
          "summary": "string",
          "structure": [{"role": "string", "selector": "string", "actionable": "boolean"}],
          "threats": ["string"]
        },
        "modernizedHtml": "The full HTML string for the body content"
      }
    `;

    try {
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
      return {
        analysis: data.analysis,
        html: data.modernizedHtml
      };
    } catch (error) {
      console.error("Modernization failed", error);
      throw error;
    }
  }

  /**
   * Generates a "raw" HTML simulation for arbitrary URLs to bypass CORS/fetching limitations in the sandbox.
   */
  async simulateFetch(url: string): Promise<WebPageScenario> {
    const prompt = `
      The user wants to visit this URL: ${url}
      Since we are in a simulation environment, generate a representative "raw, legacy, or cluttered" HTML document that might belong to this domain.
      
      Include:
      - A realistic title.
      - Messy structure (tables, old divs, inline styles).
      - Placeholder content relevant to the domain name.
      - Some simulated ads or tracker descriptions.
      
      Return JSON: {"title": "string", "originalContent": "string", "tech": ["string"], "type": "NEWS" | "ECOMMERCE" | "FORUM" | "DOCS" | "LEGACY"}
    `;

    try {
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
    } catch (e) {
      return {
        url,
        type: WebPageType.LEGACY,
        title: "Simulation Error",
        originalContent: `<div style="padding: 20px; color: red;">Proxy Error: Unable to resolve ${url}</div>`,
        originalTech: ["None"]
      };
    }
  }
}
