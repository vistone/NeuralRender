
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis, WebPageScenario, WebPageType, PrivacySettings } from "../types";

export interface ModernizationResult {
  analysis: AIAnalysis;
  html: string;
}

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async modernize(
    scenario: WebPageScenario, 
    theme: string, 
    privacy: PrivacySettings
  ): Promise<ModernizationResult> {
    const prompt = `
      Act as "NeuralRender", a world-class AI Proxy that sits between users and legacy websites.
      URL: ${scenario.url}
      Theme: ${theme}
      Privacy Shielding: ${JSON.stringify(privacy)}
      
      RAW SOURCE:
      ${scenario.originalContent}
      
      CORE TASK:
      1. ANALYZE: Identify the core business logic, user intent, and site category.
      2. SCAN: Detect intrusive scripts, trackers, and annoying ads.
      3. RECONSTRUCT: Generate a high-performance, modern React-like HTML structure using Tailwind CSS.
      
      PRIVACY DIRECTIVES:
      ${privacy.adShield ? "- REMOVE all ads and marketing noise. Replace them with useful white space or context-aware placeholders." : ""}
      ${privacy.trackerDeception ? "- IDENTIFY all forms and replace 'Personal Info' requirements with simulated/virtual data concepts in the UI." : ""}
      ${privacy.scriptSandbox ? "- Strip all <script> and <iframe> tags. All interactions must be modern UI-driven." : ""}

      VISUAL DIRECTIVES for "${theme}":
      - CYBERPUNK: High contrast black/pink/cyan, glitches, monospace accents.
      - GLASSMORPHISM: Frosted glass effect (bg-white/10 backdrop-blur-md), soft shadows, organic shapes.
      - MINIMALIST: Radical simplicity, extreme white space, serif/sans-serif pairing.
      - DARK_MODE: Deep slates, subtle gradients, focus on readability.

      Return ONLY a JSON object:
      {
        "analysis": {
          "intent": "Brief description of why the user is here",
          "category": "NEWS" | "ECOMMERCE" | "FORUM" | "DOCS" | "LEGACY",
          "summary": "1-sentence executive summary",
          "structure": [{"role": "header", "selector": "nav", "actionable": true}],
          "threats": ["List specific trackers/ads neutralized"],
          "detectedAds": number,
          "privacyScore": number (0-100)
        },
        "modernizedHtml": "Complete HTML string for a div container. Use Tailwind only."
      }
    `;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Upgrading to pro for better structural reasoning
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const data = JSON.parse(response.text || '{}');
    return {
      analysis: data.analysis,
      html: data.modernizedHtml
    };
  }

  async simulateFetch(url: string): Promise<WebPageScenario> {
    const prompt = `
      Generate a raw, legacy HTML dump for the URL: ${url}
      Make it messy (tables, spacer gifs, 90s styles, popups).
      Include tech details like "Classic ASP", "FrontPage Extensions".
      Return JSON: {"title": "string", "originalContent": "string", "tech": ["string"], "type": "string"}
    `;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    const data = JSON.parse(response.text || '{}');
    
    return {
      url,
      type: (data.type as WebPageType) || WebPageType.LEGACY,
      title: data.title || url,
      originalContent: data.originalContent,
      originalTech: data.tech || []
    };
  }
}
