'use client';

import { useEffect, useState } from 'react';
import QuizHeader from '@/components/QuizHeader';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function QuizPageClient({ topic }) {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState({});
  const { isLoaded, isSignedIn, user } = useUser();
  const userId = user?.id || null;

  useEffect(() => {
    if (!topic) {
      setError('No topic provided.');
      setLoading(false);
      return;
    }
    const fetchQuiz = async () => {
      setLoading(true);
      setError('');
      setQuizData(null);
      setSelectedOptions({});
      try {
        const res = await fetch('/api/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch quiz');
        setQuizData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [topic]);

  const handleOptionSelect = (questionId, optionIndex) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const totalQuestions = quizData?.questions?.length || 0;
  const answeredCount = Object.keys(selectedOptions).length;

  const correctCount =
    quizData?.questions?.reduce((count, question) => {
      const selected = selectedOptions[question.id];
      return count + (selected === question.answer ? 1 : 0);
    }, 0) || 0;
   const router = useRouter();
  // Save quiz result to backend (MongoDB)
  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic,
        score: correctCount,              // ✅ match backend field name
        totalQuestions,   
        userId    // optional Clerk user ID
      }),
    });


      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save result');

      // ✅ No alert here — you could optionally trigger a UI update, redirect, or toast instead
      console.log('✅ Quiz result saved successfully:', data);
      router.push('/profile'); // Redirect to profile page after saving
    } catch (err) {
      console.error('❌ Error saving result:', err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-lg text-gray-700">
        Loading quiz...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 font-semibold">
        Error: {error}. Please try again later.
      </div>
    );
  }

  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    return (
      <div className="p-8 text-center text-red-600 font-semibold">
        Quiz data is empty or malformed.
        <pre className="mt-4 bg-gray-100 p-4 rounded text-left max-h-64 overflow-auto text-sm text-black">
          {JSON.stringify(quizData, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 bg-gradient-to-b from-white via-sky-100 to-cyan-100 text-gray-900 overflow-x-hidden">
      <div className="max-w-3xl mx-auto w-full">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-teal-700">
          Quiz 
        </h1>

        <QuizHeader
          topic={topic}
          current={Math.min(answeredCount + 1, totalQuestions)}
          total={totalQuestions}
        />

        <form className="mt-6 space-y-8" onSubmit={(e) => e.preventDefault()}>
          {quizData.questions.map((q, index) => {
            const selected = selectedOptions[q.id];
            const isAnswered = typeof selected === 'number';
            const isCorrect = isAnswered && selected === q.answer;

            return (
              <fieldset
                key={q.id ?? index}
                className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow w-full p-4"
              >
                <div className="block w-full text-black font-semibold text-lg mb-4 break-words whitespace-normal">
                  {index + 1}. {q.question}
                </div>

                <ul className="space-y-4 w-full">
                  {q.options.map((opt, i) => {
                    const optionSelected = selected === i;
                    const isOptionCorrect = q.answer === i;

                    let labelClasses =
                      'flex items-start gap-4 p-4 rounded-lg cursor-pointer border transition-colors w-full break-words whitespace-normal';

                    if (optionSelected && isOptionCorrect) {
                      labelClasses +=
                        ' bg-green-100 text-green-900 font-semibold border-green-400';
                    } else if (optionSelected && !isOptionCorrect) {
                      labelClasses +=
                        ' bg-red-100 text-red-900 font-semibold border-red-400';
                    } else if (isAnswered && !optionSelected && isOptionCorrect) {
                      labelClasses +=
                        ' bg-green-50 text-green-700 border-green-300';
                    } else {
                      labelClasses +=
                        ' bg-white hover:bg-gray-100 border-gray-200 text-black';
                    }

                    return (
                      <li key={i} className="w-full">
                        <label
                          htmlFor={`q${q.id}_opt${i}`}
                          className={labelClasses}
                        >
                          <input
                            id={`q${q.id}_opt${i}`}
                            type="radio"
                            name={`q${q.id}`}
                            checked={optionSelected}
                            onChange={() => handleOptionSelect(q.id, i)}
                            className="mt-1 h-5 w-5 text-teal-600 focus:ring-teal-500 shrink-0"
                            aria-label={`${q.question} option ${opt}`}
                          />
                          <span className="flex-1 min-w-0 break-words whitespace-normal">
                            {opt}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-2 text-sm font-semibold">
                  {!isAnswered && (
                    <span className="text-gray-600">Please select an option.</span>
                  )}
                  {isAnswered && isCorrect && (
                    <span className="text-green-700">Your answer is correct!</span>
                  )}
                  {isAnswered && !isCorrect && (
                    <span className="text-red-700">Your answer is incorrect.</span>
                  )}
                </div>
              </fieldset>
            );
          })}
        </form>

        <div className="flex items-center justify-between mt-8 px-4 max-w-3xl mx-auto">
          <div className="text-lg font-semibold text-gray-800">
            You scored {correctCount} / {totalQuestions} questions
          </div>
          <button
            type="button"
            disabled={answeredCount !== totalQuestions}
            onClick={handleSubmit}
            className={`ml-4 rounded bg-teal-600 text-white py-2 px-6 font-semibold transition-opacity ${
              answeredCount !== totalQuestions
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-teal-700'
            }`}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
