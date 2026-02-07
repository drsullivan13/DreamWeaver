import { EngineCapabilities } from './types';

export function detectCapabilities(): EngineCapabilities {
  return {
    tier: 'cloud',
    hasStoryGeneration: true,
    hasImageGeneration: true,
    hasVoice: false,
  };
}
