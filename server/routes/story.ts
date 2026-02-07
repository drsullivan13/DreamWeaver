import { Router, Request, Response } from "express";
import { generateStory } from "../services/claude";

const router = Router();

router.post("/generate", async (req: Request, res: Response) => {
  try {
    const { prompt, childName, ageRange, theme } = req.body;

    if (!prompt || !childName || !ageRange || !theme) {
      res.status(400).json({
        error:
          "Missing required fields: prompt, childName, ageRange, and theme are all required.",
      });
      return;
    }

    const story = await generateStory(prompt, childName, ageRange, theme);
    res.json(story);
  } catch (error) {
    console.error("Story generation error:", error);
    res.status(500).json({
      error: "Failed to generate story. Please try again.",
    });
  }
});

export default router;
