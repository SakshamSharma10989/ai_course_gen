import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateGeminiContent = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      maxOutputTokens: 3000,    
      temperature: 0.5,         // conservative & deterministic output
    },
  });

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });

  // Safe JSON extraction
  const rawText = result.response.candidates?.[0]?.content?.parts?.[0]?.text || '';

  if (!rawText) {
    console.error('Gemini returned no text:', JSON.stringify(result, null, 2));
    throw new Error('Empty response from Gemini');
  }

  // Extract JSON block
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
