# Contributing to NeuralRender

Thank you for your interest in contributing to NeuralRender! This document provides guidelines and instructions for contributing.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistone/NeuralRender.git
   cd NeuralRender
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   - Create `.env.local` file
   - Add your Gemini API key: `GEMINI_API_KEY=your_key_here`

4. **Start development server**
   ```bash
   npm run dev
   ```

## Project Structure

```
NeuralRender/
├── App.tsx              # Main app component
├── index.tsx            # Entry point
├── constants.tsx        # Demo scenarios
├── types.ts             # TypeScript types
├── config.ts            # Configuration
├── services/
│   └── geminiService.ts # AI service
├── utils/
│   ├── ErrorBoundary.tsx
│   ├── cache.ts
│   ├── storage.ts
│   └── hooks.ts
└── __tests__/           # Test files
```

## Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Add JSDoc comments for public APIs
- Use functional components with hooks
- Keep components focused and single-purpose

## Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Add comments where necessary
   - Update tests if applicable

3. **Test your changes**
   ```bash
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

## Commit Message Format

Use conventional commits:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Adding New Features

### Adding a New Theme

1. Add theme to `types.ts` enum:
   ```typescript
   export enum RenderingTheme {
     // ... existing themes
     NEW_THEME = 'NEW_THEME'
   }
   ```

2. Update AI prompt in `geminiService.ts` to handle new theme

3. Test the theme with various scenarios

### Adding a New Scenario

1. Add scenario to `constants.tsx`:
   ```typescript
   {
     url: 'https://example.com',
     type: WebPageType.LEGACY,
     title: 'Example Site',
     originalTech: ['Old Tech'],
     originalContent: `<div>...</div>`
   }
   ```

## Testing

- Write tests for new utilities in `__tests__/`
- Test all new features manually
- Ensure build succeeds before submitting

## Documentation

- Update README.md for new features
- Update CHANGELOG.md with changes
- Add inline comments for complex logic
- Update configuration docs if adding settings

## Questions?

Open an issue for:
- Bug reports
- Feature requests
- Questions about the code
- Suggestions for improvements

## Code of Conduct

- Be respectful and constructive
- Welcome newcomers
- Focus on the code, not the person
- Help others learn and grow

Thank you for contributing to NeuralRender! 🚀
