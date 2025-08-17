export const modulePrompts = {
  getModuleStructure: (topic) => `
You are a course module generator. Generate a structured learning module for the topic: "${topic}".

The module must include exactly 4 sections:
1. Introduction
2. Basics
3. Examples
4. Summary

Each section must be an object with:
- "title": the exact section name ("Introduction", "Basics", "Examples", "Summary")
- "content": a plain text explanation (100-150 words, no markdown, no backticks)
- "videoUrl": a YouTube video link or null if none provided
- "videoTitle": the video title or null if none provided

Requirements:
- Interpret "${topic}" strictly as a programming or computer science concept (e.g., "string" means programming data type, not musical instruments).
- Only assign a video if it is:
   1. In English,
   2. Directly relevant to programming/computer science,
   3. Matches the section’s purpose (Intro → overview, Basics → fundamentals, Examples → coding demos, Summary → recap).
- If no valid video is available, return null for "videoUrl" and "videoTitle".
- Do NOT include any non-programming or irrelevant videos, even if they appear in the search results.
- Embed any code in "content" as plain text with escaped characters (e.g., \\n for newlines, \\t for tabs).
- Return only valid JSON in this format:
{
  "topic": "${topic}",
  "sections": [
    {"title": "Introduction", "content": "Text...", "videoUrl": null, "videoTitle": null},
    {"title": "Basics", "content": "Text...", "videoUrl": null, "videoTitle": null},
    {"title": "Examples", "content": "Text with escaped code...", "videoUrl": null, "videoTitle": null},
    {"title": "Summary", "content": "Text...", "videoUrl": null, "videoTitle": null}
  ]
}
`.trim(),
};
