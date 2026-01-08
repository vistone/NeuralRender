import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config({ path: '.env.local' });

// API response interfaces
interface AIProviderResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static files from the dist directory in production
const clientDistPath = process.env.CLIENT_DIST_PATH || path.join(__dirname, '..');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientDistPath));
  console.log(`📦 Serving static files from: ${clientDistPath}`);
}

// Initialize AI clients
const geminiClient = process.env.GEMINI_API_KEY 
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

/**
 * Health check endpoint
 */
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    providers: {
      gemini: !!process.env.GEMINI_API_KEY,
      deepseek: !!process.env.DEEPSEEK_API_KEY,
      kimi: !!process.env.KIMI_API_KEY
    }
  });
});

/**
 * Gemini AI endpoint
 */
app.post('/api/ai/gemini', async (req: Request, res: Response) => {
  try {
    if (!geminiClient) {
      return res.status(503).json({ error: 'Gemini API key not configured' });
    }

    const { prompt, model = 'gemini-3-flash-preview' } = req.body;

    // Input validation
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required and must be a string' });
    }

    if (prompt.length > 50000) {
      return res.status(400).json({ error: 'Prompt too long (max 50,000 characters)' });
    }

    const response = await geminiClient.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || '{}';
    res.json({ response: text });
  } catch (error: any) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: error.message || 'Failed to process request' });
  }
});

/**
 * DeepSeek AI endpoint
 */
app.post('/api/ai/deepseek', async (req: Request, res: Response) => {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: 'DeepSeek API key not configured' });
    }

    const { prompt, model = 'deepseek-chat' } = req.body;

    // Input validation
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required and must be a string' });
    }

    if (prompt.length > 50000) {
      return res.status(400).json({ error: 'Prompt too long (max 50,000 characters)' });
    }

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
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
      const errorText = await response.text();
      throw new Error(`DeepSeek API error: ${response.status} ${errorText}`);
    }

    const data = await response.json() as AIProviderResponse;
    const content = data.choices[0]?.message?.content || '{}';
    res.json({ response: content });
  } catch (error: any) {
    console.error('DeepSeek API error:', error);
    res.status(500).json({ error: error.message || 'Failed to process request' });
  }
});

/**
 * Kimi (Moonshot) AI endpoint
 */
app.post('/api/ai/kimi', async (req: Request, res: Response) => {
  try {
    const apiKey = process.env.KIMI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: 'Kimi API key not configured' });
    }

    const { prompt, model = 'moonshot-v1-8k' } = req.body;

    // Input validation
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required and must be a string' });
    }

    if (prompt.length > 50000) {
      return res.status(400).json({ error: 'Prompt too long (max 50,000 characters)' });
    }

    const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert web developer and designer specializing in modern, accessible web design. Always respond with valid JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Kimi API error: ${response.status} ${errorText}`);
    }

    const data = await response.json() as AIProviderResponse;
    const content = data.choices[0]?.message?.content || '{}';
    
    // Kimi might wrap JSON in markdown code blocks, extract it
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
    const cleanedContent = jsonMatch ? jsonMatch[1] : content;
    
    res.json({ response: cleanedContent });
  } catch (error: any) {
    console.error('Kimi API error:', error);
    res.status(500).json({ error: error.message || 'Failed to process request' });
  }
});

// In production, serve the React app for all other routes
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 NeuralRender AI Proxy Server running on http://localhost:${PORT}`);
  console.log(`📡 Configured providers:`, {
    gemini: !!process.env.GEMINI_API_KEY,
    deepseek: !!process.env.DEEPSEEK_API_KEY,
    kimi: !!process.env.KIMI_API_KEY
  });
  if (process.env.NODE_ENV === 'production') {
    console.log(`📦 Serving static files from dist/`);
  }
});

export default app;
