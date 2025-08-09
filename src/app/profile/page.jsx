'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';  // Import Clerk's hook

export default function ProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser(); // Get user info from Clerk
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return; // Wait for user to load and be signed in

    const userId = user.id; // Get the authenticated user's Clerk ID

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
    <div className="max-w-2xl mx-auto py-6  text-gray-900">
      {results.length === 0 ? (
        <div>No past quiz scores found.</div>
      ) : (
         <div>
          <h1 className="text-3xl text-teal-700 mb-4 font-bold">Past Quiz Records</h1>
           <ul>
      {results.map((result, i) => (
        <li key={i} className="mb-4 border-b pb-2">
          <div>
            <span className="font-semibold">Topic:</span> {result.topic}
          </div>
          <div>
            <span className="font-semibold">Score:</span> {result.score} / {result.totalQuestions}
          </div>
          <div className="text-sm text-gray-900">
            {result.createdAt
              ? new Date(result.createdAt).toLocaleString()
              : ""}
          </div>
        </li>
      ))}
    </ul>
          </div>
      )}
    </div>
  );
}
