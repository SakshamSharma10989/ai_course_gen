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
- Interpret "${topic}" strictly as a programming or computer science concept (e.g., "string" refers to a data type in programming, not musical instruments or other meanings).
- If YouTube search results are provided, assign only English-language videos relevant to programming or computer science to sections in order (Introduction, Basics, Examples, Summary).
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
- Do not include markdown, backticks, or any text outside the JSON.
`.trim(),
};