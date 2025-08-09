import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateGeminiContent = async (prompt) => {
  try {
    console.log('API Key:', process.env.GEMINI_API_KEY); // Debug

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        maxOutputTokens: 8000,
        temperature: 0.7,
        topP: 0.95,
        topK: 60,
      },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = await response.text();

    console.log('Raw Response:', rawText);

    // Correct regex to capture JSON inside markdown fences or plain JSON:
    const jsonMatch = rawText.match(/``````|({[\s\S]*})/);

    if (!jsonMatch) {
      console.warn('No JSON block found in Gemini output:', rawText);
      throw new Error('No valid JSON block found in Gemini output');
    }

    // Extracted JSON text is either in group 1 (inside fences) or group 2 (plain JSON)
    const extractedJSON = (jsonMatch[1] || jsonMatch[2]).trim();

    console.log('Extracted JSON:', extractedJSON);

    // Optional: Check for truncated JSON (can be customized)
    if (extractedJSON.includes('\n\n') && !extractedJSON.endsWith('}')) {
      console.warn('Possible truncated JSON detected:', extractedJSON);
      throw new Error('Truncated JSON response from Gemini');
    }

    // Parse the JSON safely
    let parsedContent;
    try {
      parsedContent = JSON.parse(extractedJSON);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError.message, 'Raw Text:', extractedJSON);
      throw new Error('Invalid JSON format in Gemini response');
    }

    // Basic validation of parsed data
    if (!parsedContent || typeof parsedContent !== 'object' || Array.isArray(parsedContent) || Object.keys(parsedContent).length === 0) {
      throw new Error('Empty or invalid response from Gemini');
    }

    return parsedContent;
  } catch (error) {
    console.error('Gemini error:', error.message);
    if (error.message.includes('quota') || error.message.includes('key')) {
      throw new Error('API key or quota limit exceeded. Check your Gemini API key and free tier limits.');
    }
    throw error;
  }
};
