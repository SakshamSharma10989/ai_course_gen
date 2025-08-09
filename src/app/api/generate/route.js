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

    // Fetch YouTube videos related to prompt, fallback to empty array on error
    const videos = await fetchYouTubeVideos(prompt).catch((err) => {
      console.error('Video fetch failed:', err.message);
      return [];
    });

    // Construct Gemini prompt string with video info or fallback message
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

    // Generate raw response from Gemini
    const rawContent = await generateGeminiContent(structuredPrompt);

    console.log('Raw Gemini Response:', rawContent);

    // Parse Gemini response safely, handling raw JSON or with markdown fencing removed
    let parsedContent;
    try {
      if (typeof rawContent === 'string') {
        // Clean rawContent by removing any markdown code fences (``````) if present
        const cleaned = rawContent
          .replace(/```json/, '') // remove starting code fence
          .replace(/```$/, '')        // remove ending code fence
          .trim();

        parsedContent = JSON.parse(cleaned);
      } else {
        parsedContent = rawContent;
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError.message, 'Raw content:', rawContent);
      throw new Error('Invalid JSON response from Gemini');
    }

    // Basic validation of the result structure
    if (!parsedContent.topic || !Array.isArray(parsedContent.sections)) {
      console.error('Invalid response structure:', parsedContent);
      throw new Error('Invalid response structure from content generation');
    }

    return new Response(
      JSON.stringify({ content: parsedContent }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('API error:', error.message);

    // Map known error messages to user-friendly messages and HTTP statuses
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
