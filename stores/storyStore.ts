import { create } from 'zustand';
import { Story } from '../engine/types';

interface StoryState {
  currentStory: Story | null;
  currentPage: number;
  isGenerating: boolean;
  error: string | null;
  setCurrentStory: (story: Story | null) => void;
  setCurrentPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setGenerating: (val: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStoryStore = create<StoryState>((set, get) => ({
  currentStory: null,
  currentPage: 0,
  isGenerating: false,
  error: null,
  setCurrentStory: (story) => set({ currentStory: story, currentPage: 0, error: null }),
  setCurrentPage: (page) => set({ currentPage: page }),
  nextPage: () => {
    const { currentPage, currentStory } = get();
    if (currentStory && currentPage < currentStory.pages.length - 1) {
      set({ currentPage: currentPage + 1 });
    }
  },
  prevPage: () => {
    const { currentPage } = get();
    if (currentPage > 0) {
      set({ currentPage: currentPage - 1 });
    }
  },
  setGenerating: (val) => set({ isGenerating: val }),
  setError: (error) => set({ error }),
}));
