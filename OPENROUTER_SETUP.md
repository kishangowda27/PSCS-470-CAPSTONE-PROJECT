# OpenRouter API Setup Guide

## Quick Setup

1. **Create `.env` file** in the project root:
   ```bash
   cp .env.example .env
   ```

2. **Add your OpenRouter API key** to `.env`:
   ```
   VITE_OPENROUTER_API_KEY=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
   VITE_OPENROUTER_MODEL=openai/gpt-4o-mini
   ```

3. **Restart your development server** after adding the API key:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## API Key Configuration

The OpenRouter API key is configured in two places:

### 1. Client-Side (`.env` file)
- Variable: `VITE_OPENROUTER_API_KEY`
- Used for: Local development fallback when API route is unavailable
- Location: `.env` file in project root

### 2. Server-Side (Deployment)
- Variable: `OPENROUTER_API_KEY`
- Used for: Production API route (`/api/chat`)
- Location: Environment variables in your hosting platform (Vercel, Netlify, etc.)

## How It Works

1. **Primary Method**: Frontend calls `/api/chat` endpoint
   - Server-side API route handles the OpenRouter request
   - More secure (API key not exposed to client)
   - Used in production

2. **Fallback Method**: Direct OpenRouter call from browser
   - Only used in local development if API route fails
   - Requires `VITE_OPENROUTER_API_KEY` in `.env`
   - API key is exposed in client bundle (not recommended for production)

## Career Guidance Features

The AI career advisor provides:
- **Personalized Advice**: Based on user profile (name, title, target role, interests, location)
- **Skill Recommendations**: Specific skills to learn based on target role
- **Career Path Guidance**: Steps to transition from current to target role
- **Resource Suggestions**: Learning platforms and resources
- **Actionable Steps**: Concrete next steps users can take immediately

## Current Configuration

- **Model**: `openai/gpt-4o-mini` (fast and cost-effective)
- **Temperature**: `0.7` (balanced creativity and consistency)
- **Max Tokens**: `1000` (allows for comprehensive responses)
- **System Prompt**: Includes user profile data for personalized responses

## Testing

To test the API:
1. Start the development server
2. Navigate to `/chat` page
3. Ask a career-related question
4. Check browser console for any errors

## Troubleshooting

### API Key Not Working
- Verify the API key is correct in `.env`
- Check that `.env` file is in the project root
- Restart the development server after changing `.env`
- Check browser console for error messages

### API Route Not Available
- In local development, the code will fall back to direct OpenRouter call
- Make sure `VITE_OPENROUTER_API_KEY` is set in `.env`
- For production, set `OPENROUTER_API_KEY` in your hosting platform

### Rate Limiting
- OpenRouter has rate limits based on your plan
- The code includes automatic retry for rate limit errors
- If you hit limits, wait a few minutes and try again

## Security Notes

- **Never commit `.env` file** to version control (already in `.gitignore`)
- **Use server-side API route** in production to keep API key secure
- **Rotate API keys** if they are accidentally exposed

