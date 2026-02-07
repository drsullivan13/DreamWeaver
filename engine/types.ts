export interface StoryPage {
  text: string;
  illustrationPrompt: string;
  imageUrl?: string;
}

export interface Story {
  id: string;
  title: string;
  pages: StoryPage[];
  createdAt: string;
  childName: string;
  theme: string;
}

export interface StoryRequest {
  prompt: string;
  childName: string;
  ageRange: string;
  theme: string;
}

export interface StoryProvider {
  generateStory(request: StoryRequest): Promise<{ title: string; pages: StoryPage[] }>;
}

export interface ImageProvider {
  generateImage(prompt: string): Promise<string>;
}

export interface EngineCapabilities {
  tier: 'cloud' | 'hybrid' | 'local';
  hasStoryGeneration: boolean;
  hasImageGeneration: boolean;
  hasVoice: boolean;
}
