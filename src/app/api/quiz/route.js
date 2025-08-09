export async function POST(req) {
  try {
    const { topic } = await req.json();

    if (!topic || typeof topic !== 'string' || topic.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid topic' }),
        { status: 400 }
      );
    }

    const safeTopic = topic.trim();

    const prompt = `
You are a quiz generator. Generate 5 multiple-choice quiz questions on the topic: "${safeTopic}".
Each question must include:
- A "question" string
- An "options" array with 4 plain string values
- An "answer" index (0-based) representing the correct option
- Numeric fields (like "id" and "answer") must NOT have quotes.

Return ONLY valid JSON in this format:
{
  "topic": "${safeTopic}",
  "questions": [
    {
      "id": 1,
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "answer": 2
    },
    ...
  ]
}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY2}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(
        `Gemini API error: ${response.status} ${response.statusText} - ${errText}`
      );
    }

    const data = await response.json();

    let parsed;
    try {
      parsed = JSON.parse(
        data.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
      );
    } catch {
      throw new Error('Gemini returned malformed JSON');
    }

    if (!parsed.topic || !Array.isArray(parsed.questions)) {
      throw new Error('Invalid format in Gemini response');
    }

    const isValid = parsed.questions.every(
      (q) =>
        typeof q.question === 'string' &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        typeof q.answer === 'number' &&
        q.answer >= 0 &&
        q.answer < q.options.length
    );

    if (!isValid) {
      console.error('Malformed questions:', parsed.questions);
      throw new Error('One or more questions are malformed');
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    console.error('[API Error]', err.message);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to generate quiz' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
