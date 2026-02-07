import AsyncStorage from '@react-native-async-storage/async-storage';
import { Story } from '../engine/types';

const STORY_PREFIX = 'story_';

export async function saveStory(story: Story): Promise<void> {
  await AsyncStorage.setItem(`${STORY_PREFIX}${story.id}`, JSON.stringify(story));
}

export async function loadStories(): Promise<Story[]> {
  const keys = await AsyncStorage.getAllKeys();
  const storyKeys = keys.filter((k) => k.startsWith(STORY_PREFIX));
  if (storyKeys.length === 0) return [];

  const pairs = await AsyncStorage.multiGet(storyKeys);
  return pairs
    .map(([, value]) => {
      if (!value) return null;
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function loadStory(id: string): Promise<Story | null> {
  const value = await AsyncStorage.getItem(`${STORY_PREFIX}${id}`);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export async function deleteStory(id: string): Promise<void> {
  await AsyncStorage.removeItem(`${STORY_PREFIX}${id}`);
}
