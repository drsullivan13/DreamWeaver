import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

interface StoryPage {
  text: string;
  illustrationPrompt: string;
}

interface Story {
  title: string;
  pages: StoryPage[];
}

const SYSTEM_PROMPT = `You are a world-class children's bedtime story author. You create magical, warm, and imaginative stories for children.

Rules:
- The story MUST be a bedtime story appropriate for young children.
- The story MUST have between 5 and 8 pages.
- Each page MUST have 2 to 4 sentences of story text.
- Follow a hero's journey structure: the child faces a gentle challenge, meets helpful friends, overcomes the obstacle with kindness or cleverness, and returns home.
- The story MUST end with a warm, cozy ending that makes the child feel safe and ready for sleep.
- Each page must include an illustration prompt describing a vivid, child-friendly scene for that page.

You MUST respond with valid JSON in exactly this format:
{
  "title": "Story Title",
  "pages": [
    {
      "text": "The story text for this page. Two to four sentences.",
      "illustrationPrompt": "A detailed illustration description for this page in a whimsical storybook style."
    }
  ]
}

Respond ONLY with the JSON object. No additional text, no markdown fences, no explanation.`;

function extractJSON(text: string): Story {
  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch {
    // Fall through to regex extraction
  }

  // Try extracting from markdown code fences
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch {
      // Fall through
    }
  }

  // Try finding a JSON object in the text
  const jsonMatch = text.match(/\{[\s\S]*"title"[\s\S]*"pages"[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      // Fall through
    }
  }

  throw new Error("Failed to extract valid JSON from Claude response");
}

export async function generateStory(
  prompt: string,
  childName: string,
  ageRange: string,
  theme: string
): Promise<Story> {
  const userMessage = `Create a bedtime story with the following details:
- Child's name (the hero): ${childName}
- Age range: ${ageRange}
- Theme: ${theme}
- Story idea: ${prompt}

Make the story magical and age-appropriate for a ${ageRange} year old. The hero's name should be ${childName}.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text content in Claude response");
  }

  return extractJSON(textBlock.text);
}
