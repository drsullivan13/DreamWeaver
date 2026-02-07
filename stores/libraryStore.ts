import { create } from 'zustand';
import { Story } from '../engine/types';
import * as storage from '../services/storage';

interface LibraryState {
  stories: Story[];
  isLoading: boolean;
  loadStories: () => Promise<void>;
  saveStory: (story: Story) => Promise<void>;
  deleteStory: (id: string) => Promise<void>;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  stories: [],
  isLoading: false,
  loadStories: async () => {
    set({ isLoading: true });
    const stories = await storage.loadStories();
    set({ stories, isLoading: false });
  },
  saveStory: async (story) => {
    await storage.saveStory(story);
    const stories = await storage.loadStories();
    set({ stories });
  },
  deleteStory: async (id) => {
    await storage.deleteStory(id);
    set({ stories: get().stories.filter((s) => s.id !== id) });
  },
}));
