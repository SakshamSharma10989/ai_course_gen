// /api/modules
import { generateGeminiContent } from '@/lib/gemini';
import { modulePrompts } from '@/lib/prompts';
import { fetchYouTubeVideos } from '@/lib/youtube';

export async function POST(request) {
  try {
    const { prompt } = await request.json();
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const safePrompt = prompt.trim();
    const videos = await fetchYouTubeVideos(safePrompt).catch(() => []);

    const structuredPrompt =
      modulePrompts.getModuleStructure(safePrompt) +
      (videos.length > 0
        ? `\nYouTube search results: ${JSON.stringify(
            videos.map((v) => ({
              videoUrl: v.videoUrl,
              videoTitle: v.videoTitle,
            }))
          )}`
        : '\nNo YouTube videos found; assign null to videoUrl and videoTitle.');

    const parsedContent = await generateGeminiContent(structuredPrompt);

    if (!parsedContent.topic || !Array.isArray(parsedContent.sections)) {
      throw new Error('Invalid response structure');
    }

    const enrichedSections = parsedContent.sections.map((section, index) => ({
      ...section,
      videoUrl: videos[index]?.videoUrl || section.videoUrl || null,
      videoTitle: videos[index]?.videoTitle || section.videoTitle || null,
      thumbnail: videos[index]?.thumbnail || null,
    }));

    return new Response(
      JSON.stringify({ content: { ...parsedContent, sections: enrichedSections } }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const status = error.message.includes('API key') || error.message.includes('quota') ? 403 : 500;
    const errorMessage = error.message.includes('JSON') || error.message.includes('structure')
      ? 'Error processing response'
      : error.message;
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
}