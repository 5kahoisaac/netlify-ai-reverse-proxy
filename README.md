# AI Proxy Server

A minimal reverse proxy for AI model APIs to bypass region restrictions, deployed on Netlify Functions.

## Setup

```bash
npm install
netlify dev  # For local development
```

## Deployment

Deploy to Netlify:
1. Connect your repository to Netlify
2. Deploy automatically with the included `netlify.toml` configuration

## Usage

Replace the base URL in your AI client with your Netlify deployment URL:

### Gemini API
```javascript
// Instead of: https://generativelanguage.googleapis.com
// Use: https://your-site.netlify.app/gemini

fetch('https://your-site.netlify.app/gemini/v1/models/gemini-pro:generateContent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_GEMINI_KEY'
  },
  body: JSON.stringify({
    contents: [{ parts: [{ text: 'Hello' }] }]
  })
});
```

### Claude API
```javascript
// Instead of: https://api.anthropic.com
// Use: https://your-site.netlify.app/claude

fetch('https://your-site.netlify.app/claude/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_CLAUDE_KEY',
    'anthropic-version': '2023-06-01'
  },
  body: JSON.stringify({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 1000,
    messages: [{ role: 'user', content: 'Hello' }]
  })
});
```

### OpenAI API
```javascript
// Instead of: https://api.openai.com
// Use: https://your-site.netlify.app/openai

fetch('https://your-site.netlify.app/openai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_OPENAI_KEY'
  },
  body: JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: 'Hello' }]
  })
});
```

## Configuration

Routes are configured in `routes.json`. Add new AI services by adding entries to the array:

```json
[
  {
    "route": "/gemini",
    "url": "https://generativelanguage.googleapis.com"
  },
  {
    "route": "/claude", 
    "url": "https://api.anthropic.com"
  },
  {
    "route": "/openai",
    "url": "https://api.openai.com"
  }
]
```

The proxy forwards requests from `{route}/*` to `{url}/*` automatically.
