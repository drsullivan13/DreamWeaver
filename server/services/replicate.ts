import Replicate from "replicate";

const PLACEHOLDER_URL =
  "https://placehold.co/800x600/1a1a2e/e0a0ff?text=Dream+Image";

const STYLE_PREFIX =
  "Watercolor children's storybook illustration, soft dreamy colors, whimsical and magical, gentle lighting, bedtime story art style. ";

export async function generateImage(prompt: string): Promise<string> {
  const token = process.env.REPLICATE_API_TOKEN;

  if (!token) {
    console.log(
      "REPLICATE_API_TOKEN not set — returning placeholder image URL"
    );
    return PLACEHOLDER_URL;
  }

  const replicate = new Replicate({ auth: token });

  const output = await replicate.run(
    "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
    {
      input: {
        prompt: STYLE_PREFIX + prompt,
        width: 800,
        height: 600,
        num_outputs: 1,
        scheduler: "K_EULER",
        num_inference_steps: 30,
        guidance_scale: 7.5,
      },
    }
  );

  // Replicate SDXL returns an array of URLs
  if (Array.isArray(output) && output.length > 0) {
    return String(output[0]);
  }

  return PLACEHOLDER_URL;
}
