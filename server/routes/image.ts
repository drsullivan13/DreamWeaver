import { Router, Request, Response } from "express";
import { generateImage } from "../services/replicate";

const router = Router();

router.post("/generate", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      res.status(400).json({
        error: "Missing required field: prompt is required.",
      });
      return;
    }

    const url = await generateImage(prompt);
    res.json({ url });
  } catch (error) {
    console.error("Image generation error:", error);
    res.status(500).json({
      error: "Failed to generate image. Please try again.",
    });
  }
});

export default router;
