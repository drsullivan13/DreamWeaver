import { ImageProvider } from '../types';
import { apiPost } from '../../services/api';

export class ReplicateImageProvider implements ImageProvider {
  async generateImage(prompt: string): Promise<string> {
    const { url } = await apiPost('/api/image/generate', { prompt });
    return url;
  }
}
