# Changelog

All notable changes to NeuralRender will be documented in this file.

## [Unreleased] - 2026-01-08

### Added - Multi-AI Provider Support
- **Multiple AI Providers**: Support for Google Gemini, DeepSeek, and Kimi (Moonshot) AI
- **Provider Selection UI**: Easy toggle in sidebar to switch between AI providers
- **Abstract AI Service**: Base class architecture for consistent behavior across providers
- **Service Factory**: Factory pattern for creating appropriate AI service instances
- **Provider-specific Implementations**:
  - `GeminiService`: Google Gemini 3 Flash integration
  - `DeepSeekService`: DeepSeek API integration with JSON response parsing
  - `KimiService`: Kimi (Moonshot) API integration with markdown extraction
- **Configuration**: AI provider settings in config.ts
- **Environment Variables**: Support for multiple API keys (GEMINI_API_KEY, DEEPSEEK_API_KEY, KIMI_API_KEY)

### Changed
- **Architecture**: Refactored GeminiService to extend abstract AIService base class
- **App Component**: Updated to use AIServiceFactory and support dynamic provider switching
- **Documentation**: Updated README with multi-provider setup instructions

### Previous Features (from earlier commits)
- **Error Boundary**: Graceful error handling with recovery UI
- **Smart Caching**: In-memory cache for API responses (10-minute TTL)
- **Retry Logic**: Automatic retry for failed API calls (3 attempts)
- **History Panel**: Track recently visited URLs with timestamps
- **Bookmarks**: Save and manage favorite modernized sites
- **Export Functionality**: Download modernized HTML files
- **Comparison View**: Side-by-side original vs modernized display
- **Performance Metrics**: Real-time display of:
  - Accessibility scores (with WCAG compliance)
  - Performance gains
  - Size reduction percentages
  - Bandwidth savings
- **Keyboard Shortcuts**: 
  - `Ctrl+R`: Reload page
  - `Ctrl+E`: Toggle enhanced view
  - `Ctrl+H`: Toggle history
  - `Ctrl+B`: Toggle bookmark
  - `Ctrl+S`: Export HTML
  - `Shift+?`: Show shortcuts help
- **Enhanced AI Prompts**: More detailed instructions for better modernization
- **Additional Scenarios**: Added 2 more demo scenarios (total 5)
- **Configuration File**: Centralized config for easy customization
- **Utility Modules**:
  - Cache utility for API response caching
  - Storage utility for history/bookmarks
  - Custom hooks (keyboard shortcuts, debounce, localStorage)
- **Test Infrastructure**: Basic test suite for utilities
- **Comprehensive Documentation**: Updated README with all features

### Enhanced
- **Security Analysis**: Improved threat detection and reporting
- **Accessibility**: Better WCAG compliance scoring
- **UI/UX**: 
  - Progress bars for metrics
  - Animated transitions
  - Help modal for shortcuts
  - Better visual feedback
- **Performance**: 
  - Reduced redundant API calls with caching
  - Optimized re-renders
  - Better error recovery

### Technical Improvements
- TypeScript strict mode ready
- Modular architecture with utility separation
- Better error handling throughout
- JSDoc comments for service methods
- Organized code structure

### Fixed
- API timeout handling
- Error message display
- Navigation state management

## [0.0.0] - Initial Release

### Added
- Basic AI-powered web modernization
- 5 rendering themes
- 3 viewport modes (Desktop, Tablet, Mobile)
- AI analysis panel
- System logs
- Demo scenarios
