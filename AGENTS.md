# Agent Guide

This repository is an Expo (React Native) client with an Express backend running on Bun.

## Prerequisites

- Bun installed (https://bun.sh/)
- Anthropic API key for story generation
- Optional Replicate API token for image generation

## Setup

```bash
bun install
cd server && bun install && cd ..
cp .env.example .env
cp .env.example server/.env
```

Edit `server/.env` and add API keys:

```
ANTHROPIC_API_KEY=your_key_here
REPLICATE_API_TOKEN=your_token_here
```

## Run

Start both the API server and Expo web client:

```bash
bun run dev
```

Run them separately if needed:

```bash
bun run server   # API on http://localhost:3001
bun run web      # Expo web client
```

Other useful scripts:

- `bun run start` (Expo start)
- `bun run ios` / `bun run android`

## Project Structure

- `app/`: Expo Router screens
- `components/`: shared UI components
- `engine/`: client-side orchestration
- `services/`: API and storage helpers
- `stores/`: Zustand stores
- `constants/`: design tokens
- `server/`: Express API (Bun)

## Testing / Linting / Typecheck

No test, lint, or typecheck scripts are configured in `package.json` at this time.

## Conventions

- Use existing Expo Router patterns in `app/`.
- Keep API keys in `server/.env`; do not commit secrets.
