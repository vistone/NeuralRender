# Multi-AI Provider Feature

## Overview
The NeuralRender AI Proxy now supports three AI providers that can be switched dynamically through the UI.

## Supported AI Providers

### 1. Google Gemini
- **Model**: gemini-3-flash-preview
- **Strengths**: Advanced reasoning, high quality modernization
- **API**: Google GenAI SDK

### 2. DeepSeek
- **Model**: deepseek-chat
- **Strengths**: Fast inference, efficient for Chinese content
- **API**: REST API (https://api.deepseek.com/v1/chat/completions)

### 3. Kimi (Moonshot)
- **Model**: moonshot-v1-8k
- **Strengths**: Long context window support
- **API**: REST API (https://api.moonshot.cn/v1/chat/completions)

## Configuration

### API Keys
Set in `.env.local`:
```bash
GEMINI_API_KEY=your_gemini_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key
KIMI_API_KEY=your_kimi_api_key
```

### Default Provider
Set in `config.ts`:
```typescript
ai: {
  defaultProvider: 'GEMINI',
  enableProviderSelection: true
}
```

## UI Features

The AI Provider selector is in the left sidebar with:
- Current provider indicator
- All available providers listed
- Provider descriptions
- One-click switching

## Architecture

All providers extend `AIService` base class and share:
- Retry mechanism (3 attempts)
- Caching (10-min TTL)
- Metrics calculation
- Error handling

## Usage

1. Configure API keys in `.env.local`
2. Select provider from sidebar
3. Navigate to any URL
4. Provider processes the modernization
