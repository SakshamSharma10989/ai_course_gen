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
You are a quiz generator. Generate 6 multiple-choice quiz questions on the topic: "${safeTopic}".
The questions must be divided into:
- 3 EASY questions
- 2 MEDIUM questions
- 1 HARD question

Each question must include:
- A "question" string
- An "options" array with 4 plain string values
- An "answer" index (0-based) representing the correct option
- A "difficulty" string with value "easy", "medium", or "hard"
- Numeric fields (like "id" and "answer") must NOT have quotes.

Return ONLY valid JSON in this exact format:
{
  "topic": "${safeTopic}",
  "questions": [
    {
      "id": 1,
      "difficulty": "easy",
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "answer": 2
    },
    {
      "id": 2,
      "difficulty": "easy",
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "answer": 1
    },
    ... // total 6 questions
  ]
}
Make sure there are exactly 3 questions with "easy", 2 with "medium", and 1 with "hard" difficulty.
`;



    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
