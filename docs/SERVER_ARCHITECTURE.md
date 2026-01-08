# Server-Side Architecture

## Overview

NeuralRender now includes a server-side component built with Express.js to securely manage AI API keys and proxy requests to various AI providers.

## Why Server-Side?

### Security Benefits
- **API Key Protection**: Keys are stored server-side, never exposed in client bundles
- **Request Control**: Server validates and sanitizes all requests
- **Rate Limiting**: Can implement rate limiting at the server level
- **CORS Management**: Handles cross-origin requests properly

### Architecture Benefits
- **Centralized Logic**: AI provider integration in one place
- **Easier Testing**: Server endpoints can be tested independently
- **Monitoring**: Log all AI requests for debugging and analytics
- **Flexibility**: Easy to add new providers or modify existing ones

## Server Structure

### Main Server File
`server/index.ts` - Express application with the following endpoints:

#### Health Check
```
GET /api/health
```
Returns server status and configured providers:
```json
{
  "status": "ok",
  "providers": {
    "gemini": true,
    "deepseek": true,
    "kimi": false
  }
}
```

#### Gemini Endpoint
```
POST /api/ai/gemini
```
Request body:
```json
{
  "prompt": "Your prompt here",
  "model": "gemini-3-flash-preview" // optional
}
```

Response:
```json
{
  "response": "AI generated response as JSON string"
}
```

#### DeepSeek Endpoint
```
POST /api/ai/deepseek
```
Request/Response format same as Gemini.

#### Kimi Endpoint
```
POST /api/ai/kimi
```
Request/Response format same as Gemini.

## Configuration

### Environment Variables

Create `.env.local` file:
```bash
# AI Provider API Keys
GEMINI_API_KEY=your_gemini_key
DEEPSEEK_API_KEY=your_deepseek_key
KIMI_API_KEY=your_kimi_key

# Server Configuration
SERVER_PORT=3001

# Client Configuration
VITE_USE_SERVER=true
VITE_SERVER_URL=http://localhost:3001
```

### Client-Side Configuration

The client services automatically detect server mode:

```typescript
// In each AI service
this.useServer = import.meta.env.VITE_USE_SERVER !== 'false';
this.serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
```

## Development

### Running in Development

```bash
npm run dev
```

This starts:
1. Express server on port 3001
2. Vite dev server on port 3000
3. Automatic reload for both on file changes

### Running Components Separately

Server only:
```bash
npm run server
```

Client only:
```bash
npm run client
```

## Production

### Building for Production

```bash
npm run build
```

This creates:
- `dist/` - Client build (static files)
- `dist/server/` - Compiled server code

### Running in Production

```bash
npm start
```

Runs the compiled server which:
1. Serves the static client files
2. Handles API requests
3. Listens on configured port

## Migration from Client-Only

If you have an existing client-only setup:

1. **Install new dependencies**:
   ```bash
   npm install
   ```

2. **Add server environment variables** to `.env.local`:
   ```bash
   VITE_USE_SERVER=true
   ```

3. **API keys remain the same** - just keep them in `.env.local`

4. **Run the new dev command**:
   ```bash
   npm run dev
   ```

## Legacy Client-Only Mode

For backward compatibility, you can still run in client-only mode:

1. Set environment variable:
   ```bash
   VITE_USE_SERVER=false
   ```

2. Run client only:
   ```bash
   npm run client
   ```

⚠️ **Warning**: Client-only mode exposes API keys in the browser bundle. Only use for development or if you understand the security implications.

## Error Handling

The server implements comprehensive error handling:

- **400 Bad Request**: Missing or invalid parameters
- **503 Service Unavailable**: API key not configured
- **500 Internal Server Error**: AI provider errors

All errors are logged server-side and returned with descriptive messages.

## Security Best Practices

1. **Never commit `.env.local`** - It contains sensitive API keys
2. **Use server mode in production** - Keeps keys secure
3. **Implement rate limiting** - Prevent API abuse
4. **Monitor logs** - Track unusual activity
5. **Rotate keys regularly** - Update API keys periodically

## Extending the Server

### Adding a New AI Provider

1. Create endpoint in `server/index.ts`:
```typescript
app.post('/api/ai/newprovider', async (req, res) => {
  // Implementation
});
```

2. Update client service to call new endpoint:
```typescript
private async callNewProviderAPI(prompt: string): Promise<string> {
  if (this.useServer) {
    const response = await fetch(`${this.serverUrl}/api/ai/newprovider`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    // Handle response
  }
}
```

3. Add environment variable for the new provider's API key

## Troubleshooting

### Server Won't Start
- Check if port 3001 is already in use
- Verify `.env.local` exists and has API keys
- Check for syntax errors in `server/index.ts`

### Client Can't Connect to Server
- Verify server is running (`npm run server`)
- Check `VITE_SERVER_URL` matches server port
- Look for CORS errors in browser console

### API Requests Failing
- Check server logs for error messages
- Verify API keys are valid
- Test with health check endpoint: `GET http://localhost:3001/api/health`
