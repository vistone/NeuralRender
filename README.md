<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# NeuralRender - AI Web Proxy

An intelligent web rewriting proxy that re-interprets, restructures, and modernizes websites in real-time using AI for a personalized browsing experience.

View your app in AI Studio: https://ai.studio/apps/drive/1qbXppOQDeyU9Xe2_eAo_MTv5lwroRCso

## Features

### 🤖 Multi-AI Provider Support
- **Multiple AI Models**: Switch between Google Gemini, DeepSeek, and Kimi (Moonshot) AI
- **Provider Selection**: Easy UI toggle to switch AI providers on the fly
- **Unified Interface**: Consistent experience across all AI providers

### 🚀 Core Capabilities
- **AI-Powered Modernization**: Transform legacy websites into modern, accessible web experiences
- **Multiple Themes**: Choose from 5 rendering themes (Minimalist, Dark Mode, High Contrast, Retro 80s, Glassmorphism)
- **Responsive Previews**: Test modernized sites in Desktop, Tablet, and Mobile views
- **Real-time Analysis**: AI analyzes page intent, structure, and security threats

### 🛡️ Security & Privacy
- **Threat Detection**: Automatically identifies and removes ads, trackers, and malicious scripts
- **Content Security**: Strips dangerous elements (scripts, iframes, tracking pixels)
- **Privacy-First**: No data collection, all processing is transparent

### 📊 Performance Metrics
- **Accessibility Scoring**: WCAG compliance analysis with scores
- **Performance Gains**: Measure optimization improvements
- **Size Reduction**: Track bandwidth savings from modernization
- **Before/After Comparison**: Side-by-side view of original vs modernized

### 🎯 Productivity Features
- **History Tracking**: Keep track of recently visited pages
- **Bookmarks**: Save favorite modernized sites
- **Export HTML**: Download modernized pages for offline use
- **Comparison View**: See original and modernized versions side-by-side
- **Smart Caching**: Reduce API calls with intelligent result caching

### ⌨️ Keyboard Shortcuts
- `Ctrl+R` - Reload current page
- `Ctrl+E` - Toggle enhanced view
- `Ctrl+H` - Toggle history panel
- `Ctrl+B` - Toggle bookmark
- `Ctrl+S` - Export modernized HTML
- `Shift+?` - Show keyboard shortcuts

### 🎨 Advanced Features
- **Error Boundary**: Graceful error handling with recovery options
- **Retry Logic**: Automatic API retry for improved reliability
- **System Logs**: Real-time transparency into processing steps
- **Local Storage**: Persistent history and bookmarks

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set your AI API keys in [.env.local](.env.local):
   ```
   # Choose one or more AI providers
   GEMINI_API_KEY=your_gemini_api_key_here
   DEEPSEEK_API_KEY=your_deepseek_api_key_here
   KIMI_API_KEY=your_kimi_api_key_here
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Architecture

### Tech Stack
- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **AI Engines**: Google Gemini 3 Flash / DeepSeek / Kimi (Moonshot)
- **Build Tool**: Vite
- **Icons**: Lucide React

### Project Structure
```
├── App.tsx                 # Main application component
├── index.tsx              # Application entry point
├── constants.tsx          # Demo scenarios and configurations
├── types.ts               # TypeScript type definitions
├── config.ts              # Configuration (AI provider settings)
├── services/
│   ├── aiService.ts       # Abstract AI service base class
│   ├── aiServiceFactory.ts # Factory for creating AI services
│   ├── geminiService.ts   # Google Gemini implementation
│   ├── deepseekService.ts # DeepSeek implementation
│   └── kimiService.ts     # Kimi (Moonshot) implementation
└── utils/
    ├── ErrorBoundary.tsx  # Error handling component
    ├── cache.ts           # Caching utility
    ├── storage.ts         # Local storage management
    └── hooks.ts           # Custom React hooks
```

## How It Works

1. **AI Provider Selection**: Choose between Gemini, DeepSeek, or Kimi AI
2. **URL Input**: Enter any URL or select from demo scenarios
3. **AI Analysis**: Selected AI analyzes the page structure, content, and potential threats
4. **Modernization**: AI generates clean, semantic HTML with Tailwind CSS styling
5. **Rendering**: View the transformed page with selected theme and viewport
6. **Export**: Download the modernized HTML for your own use

## Contributing

Contributions are welcome! This project demonstrates advanced AI-powered web transformation capabilities.

## License

This project is private and intended for demonstration purposes.
