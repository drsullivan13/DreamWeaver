import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  childName: string;
  ageRange: string;
  setChildName: (name: string) => void;
  setAgeRange: (range: string) => void;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  childName: '',
  ageRange: '3-5',
  setChildName: (name) => {
    set({ childName: name });
    AsyncStorage.setItem('settings_childName', name);
  },
  setAgeRange: (range) => {
    set({ ageRange: range });
    AsyncStorage.setItem('settings_ageRange', range);
  },
  loadSettings: async () => {
    const [childName, ageRange] = await Promise.all([
      AsyncStorage.getItem('settings_childName'),
      AsyncStorage.getItem('settings_ageRange'),
    ]);
    set({
      childName: childName || '',
      ageRange: ageRange || '3-5',
    });
  },
}));
