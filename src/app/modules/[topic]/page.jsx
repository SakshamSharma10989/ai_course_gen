'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppContext } from '@/app/context/AppContext';

export default function ModulePage() {
  const { topic } = useParams();
  const { moduleData, currentTopic, setError } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [localModuleData, setLocalModuleData] = useState(null);

  useEffect(() => {
    setLoading(true);
    console.log('Route topic:', topic);
    console.log('Current topic from context:', currentTopic);
    console.log('Module data:', moduleData);

    if (moduleData && currentTopic === topic) {
      setLocalModuleData(moduleData);
      setError('');
    } else {
      setError('Module data not found. Please generate modules.');
      setLocalModuleData(null);
    }
    setLoading(false);
  }, [moduleData, currentTopic, topic, setError]);

  if (loading) return <div className="text-center py-10">Loading modules...</div>;

  if (!localModuleData) return <div className="text-center py-10 text-red-500">Module not found. Please regenerate modules.</div>;

  return (
    <main className="min-h-screen bg-white text-gray-800 px-6 py-16 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-teal-600">{localModuleData.topic || topic}</h1>

      {/* Render each section with content and videos */}
      <section>
        {localModuleData.sections && localModuleData.sections.length > 0 ? (
          localModuleData.sections.map((section, i) => (
            <article key={i} className="mb-8">
              <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
              <p className="mb-2 whitespace-pre-wrap">{section.content}</p>
              {section.videoUrl ? (
                <a href={section.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  {section.videoTitle || 'Watch Video'}
                </a>
              ) : (
                <p className="italic text-gray-500">No video available</p>
              )}
            </article>
          ))
        ) : (
          <p>No sections available in this module.</p>
        )}
      </section>
    </main>
  );
}
