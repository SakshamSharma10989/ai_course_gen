export const modulePrompts = {
  getModuleStructure: (topic) => `
You are a course module generator. Generate a structured learning module for the topic: "${topic}".

The module must include 4 sections:
1. Introduction
2. Basics
3. Examples
4. Summary

Each section must be an object with:
- "title": a short title (e.g., "Introduction")
- "content": a detailed explanation in plain text (NO markdown formatting)
- "videoUrl": a YouTube video link, or null if none is found
- "videoTitle": the actual title of the video, or null if none

IMPORTANT:
- Embed any code as plain text inside the "content" field using escaped characters — DO NOT use triple backticks or markdown.
- Return ONLY valid JSON in the following format:

{
  "topic": "${topic}",
  "sections": [
    {
      "title": "Introduction",
      "content": "Explanation here...",
      "videoUrl": "https://www.youtube.com/watch?v=...",
      "videoTitle": "The video title"
    },
    {
      "title": "Basics",
      "content": "Detailed concepts...",
      "videoUrl": "https://www.youtube.com/watch?v=...",
      "videoTitle": "The video title"
    },
    {
      "title": "Examples",
      "content": "Code examples in escaped form...",
      "videoUrl": "https://www.youtube.com/watch?v=...",
      "videoTitle": "The video title"
    },
    {
      "title": "Summary",
      "content": "Wrap-up and recap...",
      "videoUrl": null,
      "videoTitle": null
    }
  ]
}

⚠️ DO NOT include:
- Markdown or triple backticks (\`\`\`)
- Any text, explanation, or commentary before or after the JSON.

Respond with strictly valid JSON only, without any additional formatting or text.
`.trim(),
};
