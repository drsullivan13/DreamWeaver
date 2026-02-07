import { Story, StoryPage, StoryRequest, StoryProvider, ImageProvider } from './types';

export class AdaptiveEngine {
  constructor(
    private storyProvider: StoryProvider,
    private imageProvider: ImageProvider,
  ) {}

  async generateStory(request: StoryRequest): Promise<Story> {
    const { title, pages } = await this.storyProvider.generateStory(request);

    const pagesWithImages: StoryPage[] = await Promise.all(
      pages.map(async (page) => {
        try {
          const imageUrl = await this.imageProvider.generateImage(page.illustrationPrompt);
          return { ...page, imageUrl };
        } catch {
          return { ...page, imageUrl: undefined };
        }
      }),
    );

    return {
      id: String(Date.now()),
      title,
      pages: pagesWithImages,
      createdAt: new Date().toISOString(),
      childName: request.childName,
      theme: request.theme,
    };
  }
}
