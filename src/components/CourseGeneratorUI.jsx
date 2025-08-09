'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/context/AppContext';

export default function CourseGeneratorUI() {
  const router = useRouter();
  const {
    topic,
    setTopic,
    isLoading,
    error,
    generateModules,
    generateQuiz,
    setError,
  } = useAppContext();

  async function onGenerateModules() {
    try {
      const moduleId = await generateModules();
      if (moduleId) {
        router.push(`/modules/${encodeURIComponent(moduleId)}`);
      }
    } catch (err) {
      console.error('Module generation failed:', err);
      setError('Failed to generate modules. Please try again.');
    }
  }

  async function onGenerateQuiz() {
    try {
      await generateQuiz();
      router.push(`/quiz/${encodeURIComponent(topic)}`);
    } catch (err) {
      console.error('Quiz generation failed:', err);
      setError('Failed to generate quiz. Please try again.');
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-teal-50 text-gray-800 flex flex-col items-center px-4 py-16">
      {/* Search Input Form */}
      <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-xl flex flex-col gap-4 mb-12">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Search for a course topic..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 placeholder-gray-500"
          aria-label="Course topic"
        />
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onGenerateModules}
            disabled={!topic.trim() || isLoading}
            className={`flex-1 px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition duration-300 font-medium shadow ${
              !topic.trim() || isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Generate Modules
          </button>
          <button
            type="button"
            onClick={onGenerateQuiz}
            disabled={!topic.trim() || isLoading}
            className={`flex-1 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition duration-300 font-medium shadow ${
              !topic.trim() || isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Generate Quiz
          </button>
        </div>
      </form>

      {/* Hero Section & Info Cards */}
      <section className="text-center max-w-3xl mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-teal-700 mb-4">
          🎓 Create Your Personalized Learning Journey
        </h1>
        <p className="text-gray-700 text-lg mb-8">
          Discover a powerful tool to design custom courses. Input any subject, and instantly receive a comprehensive curriculum with video lessons, detailed markdown guides, and interactive quizzes—all driven by cutting-edge AI.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            ['Custom Courses', 'Tailor-made learning paths for any topic.'],
            ['Video Lessons', 'Engaging video content for every module.'],
            ['Interactive Quizzes', 'Test your knowledge with dynamic quizzes.'],
          ].map(([title, desc], i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg shadow-md border-l-4 border-teal-400 text-left"
            >
              <h3 className="text-xl font-semibold text-teal-700 mb-2">{title}</h3>
              <p className="text-gray-700">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded-md max-w-xl text-center shadow">
          ⚠️ {error}
        </div>
      )}
    </main>
  );
}
