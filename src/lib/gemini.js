import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateGeminiContent = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });

  const result = await model.generateContent(prompt);
  const rawText = result.response.text();

  const jsonMatch = rawText.match(/```(?:json)?([\s\S]*?)```|({[\s\S]*})/);
  if (!jsonMatch) {
    throw new Error('No valid JSON block found in Gemini output');
  }

  const extractedJSON = (jsonMatch[1] || jsonMatch[0]).trim();
  const parsedContent = JSON.parse(extractedJSON);

  if (!parsedContent || typeof parsedContent !== 'object' || Array.isArray(parsedContent)) {
    throw new Error('Invalid response from Gemini');
  }

  return parsedContent;
};