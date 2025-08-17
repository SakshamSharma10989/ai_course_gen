'use client';
import QuizPageClient from '@/components/QuizPageClient';
import { useParams } from 'next/navigation';

export default function QuizPage({ params }) {
  const { topic } = useParams();
  if (!topic) {
    return (
      <div className="p-8 text-center text-red-600 font-semibold">
        Error: No topic provided. Please try again later.
      </div>
    );
  }
  return <QuizPageClient topic={topic} />;
}
