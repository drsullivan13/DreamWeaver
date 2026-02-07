export interface PromptStarter {
  id: string;
  title: string;
  emoji: string;
  prompt: string;
  theme: string;
}

export const promptStarters: PromptStarter[] = [
  {
    id: 'space',
    title: 'Space Adventure',
    emoji: '🚀',
    prompt: 'A brave journey through the stars to find a lost constellation',
    theme: 'space',
  },
  {
    id: 'ocean',
    title: 'Under the Sea',
    emoji: '🐠',
    prompt: 'A magical underwater adventure with friendly sea creatures',
    theme: 'ocean',
  },
  {
    id: 'castle',
    title: 'Enchanted Castle',
    emoji: '🏰',
    prompt: 'Exploring a mysterious castle filled with friendly magic',
    theme: 'fantasy',
  },
  {
    id: 'dinosaur',
    title: 'Dinosaur Discovery',
    emoji: '🦕',
    prompt: 'Traveling back in time to befriend gentle dinosaurs',
    theme: 'dinosaurs',
  },
  {
    id: 'garden',
    title: 'Magical Garden',
    emoji: '🌸',
    prompt: 'Discovering a secret garden where flowers can talk and sing',
    theme: 'nature',
  },
  {
    id: 'arctic',
    title: 'Arctic Expedition',
    emoji: '🐧',
    prompt: 'A cozy adventure in the snowy north with polar animal friends',
    theme: 'arctic',
  },
];
