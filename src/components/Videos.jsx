'use client';

import { useState, useEffect } from 'react';
import Modules from './Modules';

export default function Videos({ topic, isLoading, setIsLoading, setError }) {
  const [content, setContent] = useState(null);

  useEffect(() => {
    if (!isLoading || !topic) return;

    // Clear old content at fetch start for smooth UX
    setContent(null);

    const fetchContent = async () => {
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: topic }),
        });

        if (!response.ok) {
          if (response.status === 400) {
            throw new Error('Invalid topic provided');
          }
          if (response.status === 403) {
            throw new Error('API access disabled. Check your Google Cloud billing account.');
          }
          if (response.status === 429) {
            throw new Error('API quota exceeded. Try again tomorrow.');
          }
          throw new Error(`Failed to fetch content (status: ${response.status})`);
        }

        const data = await response.json();

        if (!data.content || !data.content.topic || !data.content.sections) {
          throw new Error('Invalid response from API. No content returned.');
        }

        setContent(data.content);
      } catch (err) {
        setError(err.message || 'An unexpected error occurred while fetching content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [isLoading, topic, setIsLoading, setError]);

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-white px-6">
      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-4 text-cyan-400">
          <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-lg">Generating your course...</p>
        </div>
      )}

      {!isLoading && content && (
        <Modules topic={content.topic} sections={content.sections} />
      )}
    </div>
  );
}
