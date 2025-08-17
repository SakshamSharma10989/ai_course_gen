'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function ProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const userId = user.id;

    fetch(`/api/profile?userId=${encodeURIComponent(userId)}`)
      .then(res => res.json())
      .then(data => {
        setResults(data.results || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded) return <div>Loading user information...</div>;
  if (!isSignedIn) return <div>Please sign in to view your quiz history.</div>;
  if (loading) return <div>Loading your quiz history...</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 text-gray-900">
      <h1 className="text-3xl text-teal-700 mb-6 font-bold text-center">
        Past Quiz Records
      </h1>

      {results.length === 0 ? (
        <div className="text-center text-gray-600">
          No past quiz scores found.
        </div>
      ) : (
        <ul className="space-y-4">
          {results.map((result, i) => (
            <li
              key={i}
              className="p-4 border rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="text-xl font-semibold text-gray-800">
                {result.topic ? decodeURIComponent(result.topic) : "Untitled Topic"}
              </div>

              <div className="mt-2">
                <span className="font-semibold text-teal-600">Score:</span>{" "}
                {result.score} / {result.totalQuestions}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
