<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# NeuralRender - AI Web Proxy

An intelligent web rewriting proxy that re-interprets, restructures, and modernizes websites in real-time using AI for a personalized browsing experience.

View your app in AI Studio: https://ai.studio/apps/drive/1qbXppOQDeyU9Xe2_eAo_MTv5lwroRCso

## Features

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

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
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
- **AI Engine**: Google Gemini 3 Flash
- **Build Tool**: Vite
- **Icons**: Lucide React

### Project Structure
```
├── App.tsx                 # Main application component
├── index.tsx              # Application entry point
├── constants.tsx          # Demo scenarios and configurations
├── types.ts               # TypeScript type definitions
├── services/
│   └── geminiService.ts   # AI service with caching and retry logic
└── utils/
    ├── ErrorBoundary.tsx  # Error handling component
    ├── cache.ts           # Caching utility
    ├── storage.ts         # Local storage management
    └── hooks.ts           # Custom React hooks
```

## How It Works

1. **URL Input**: Enter any URL or select from demo scenarios
2. **AI Analysis**: Gemini AI analyzes the page structure, content, and potential threats
3. **Modernization**: AI generates clean, semantic HTML with Tailwind CSS styling
4. **Rendering**: View the transformed page with selected theme and viewport
5. **Export**: Download the modernized HTML for your own use

## Contributing

Contributions are welcome! This project demonstrates advanced AI-powered web transformation capabilities.

## License

This project is private and intended for demonstration purposes.
