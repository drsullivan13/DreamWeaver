# DreamWeaver

A parent-child bedtime story creation app. Parents and young children collaborate to create AI-generated illustrated bedtime stories via voice or text input.

## How It Works

1. **Create** -- Choose a theme or describe your own story idea using text or voice
2. **Generate** -- Claude AI writes a personalized bedtime story with your child as the hero
3. **Read** -- Swipe through illustrated pages with your child
4. **Save** -- Keep favorite stories in your library to read again

## Tech Stack

- **Client**: Expo (React Native) with Expo Router, Zustand, Reanimated
- **Server**: Express.js running on Bun
- **Story AI**: Anthropic Claude API
- **Illustrations**: Replicate SDXL (falls back to placeholders if no token)

## Prerequisites

- [Bun](https://bun.sh/) installed
- An [Anthropic API key](https://console.anthropic.com/) for story generation
- (Optional) A [Replicate API token](https://replicate.com/) for image generation

## Setup

```bash
# Install client dependencies
bun install

# Install server dependencies
cd server && bun install && cd ..

# Configure environment
cp .env.example .env
cp .env.example server/.env
```

Edit `server/.env` and add your API keys:

```
ANTHROPIC_API_KEY=your_key_here
REPLICATE_API_TOKEN=your_token_here   # optional
```

## Running

```bash
# Start both server (port 3001) and Expo web concurrently
bun run dev
```

Or run them separately:

```bash
bun run server   # Express API on http://localhost:3001
bun run web      # Expo web client
```

## Project Structure

```
app/              Expo Router screens (Home, Create, Library, Reader, Settings)
components/       Reusable UI (PageTurner, BookShelf, VoiceInput, LoadingDream, etc.)
engine/           Client-side providers and orchestration (AdaptiveEngine)
services/         API client and AsyncStorage wrapper
stores/           Zustand state (story, library, settings)
constants/        Theme (colors, typography, spacing)
server/           Express backend
  routes/         Story and image generation endpoints
  services/       Claude and Replicate API wrappers
```

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | GET | Health check |
| `/api/story/generate` | POST | Generate a bedtime story via Claude |
| `/api/image/generate` | POST | Generate an illustration via Replicate |
