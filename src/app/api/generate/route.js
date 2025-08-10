import { generateGeminiContent } from '@/lib/gemini';
import { modulePrompts } from '@/lib/prompts';
import { fetchYouTubeVideos } from '@/lib/youtube';

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || !prompt.trim()) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 1️⃣ Fetch YouTube videos related to the prompt
    const videos = await fetchYouTubeVideos(prompt).catch((err) => {
      console.error('Video fetch failed:', err.message);
      return [];
    });

    // 2️⃣ Build structured Gemini prompt (no need to include thumbnails here)
    const structuredPrompt =
      modulePrompts.getModuleStructure(prompt) +
      (videos.length > 0
        ? `\nYouTube search results: ${JSON.stringify(
            videos.map((v) => ({
              videoUrl: v.videoUrl,
              videoTitle: v.videoTitle,
            }))
          )}`
        : '\nNo YouTube videos found; assign null to videoUrl and videoTitle for all sections.');

    console.log('Structured Prompt:', structuredPrompt);

    // 3️⃣ Call Gemini API
    const rawContent = await generateGeminiContent(structuredPrompt);

    // 4️⃣ Parse Gemini response safely
    let parsedContent;
    try {
      if (typeof rawContent === 'string') {
        const cleaned = rawContent
          .replace(/```json/, '')
          .replace(/```$/, '')
          .trim();
        parsedContent = JSON.parse(cleaned);
      } else {
        parsedContent = rawContent;
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError.message, 'Raw content:', rawContent);
      throw new Error('Invalid JSON response from Gemini');
    }

    // 5️⃣ Validate structure
    if (!parsedContent.topic || !Array.isArray(parsedContent.sections)) {
      console.error('Invalid response structure:', parsedContent);
      throw new Error('Invalid response structure from content generation');
    }

    // 6️⃣ Merge YouTube thumbnails into each section
    if (videos.length > 0) {
      parsedContent.sections = parsedContent.sections.map((section, index) => {
        const vid = videos[index] || null;
        return {
          ...section,
          videoUrl: vid?.videoUrl || section.videoUrl || null,
          videoTitle: vid?.videoTitle || section.videoTitle || null,
          thumbnail: vid?.thumbnail || null,
        };
      });
    }

    // 7️⃣ Return final content with thumbnails
    return new Response(
      JSON.stringify({ content: parsedContent }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('API error:', error.message);

    let errorMessage = 'Content generation failed';
    let status = 500;

    if (error.message.includes('API access disabled')) {
      errorMessage = 'API access disabled. Check your Google Cloud billing account.';
      status = 403;
    } else if (error.message.includes('quota exceeded')) {
      errorMessage = 'API quota exceeded. Try again tomorrow.';
      status = 429;
    } else if (
      error.message.includes('Invalid JSON response') ||
      error.message.includes('Invalid response structure')
    ) {
      errorMessage = 'Error processing Gemini response. Please check the API configuration.';
    }

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
