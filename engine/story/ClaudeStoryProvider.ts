import { StoryProvider, StoryRequest, StoryPage } from '../types';
import { apiPost } from '../../services/api';

export class ClaudeStoryProvider implements StoryProvider {
  async generateStory(request: StoryRequest): Promise<{ title: string; pages: StoryPage[] }> {
    return apiPost('/api/story/generate', request);
  }
}
