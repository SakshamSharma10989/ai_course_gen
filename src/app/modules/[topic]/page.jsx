'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppContext } from '@/app/context/AppContext';

function getYoutubeThumbnail(url) {
  if (!url) return null;
  const match = url.match(/(?:v=|\/embed\/|\.be\/|v\/)([a-zA-Z0-9_-]{11})/);
  return match
    ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
    : null;
}

function capitalizeTitle(title) {
  if (!title) return '';
  return title
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function ModulePage() {
  const { topic } = useParams();
  const { moduleData, currentTopic, setError } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [localModuleData, setLocalModuleData] = useState(null);

  useEffect(() => {
    setLoading(true);

    const normalizedUrlTopic = decodeURIComponent(topic || '')
      .replace(/-/g, ' ')
      .toLowerCase()
      .trim();
    const normalizedCurrentTopic = (currentTopic || '').toLowerCase().trim();

    if (moduleData && normalizedCurrentTopic === normalizedUrlTopic) {
      setLocalModuleData(moduleData);
      setError('');
    } else {
      setError('Module data not found. Please generate modules.');
      setLocalModuleData(null);
    }
    setLoading(false);
  }, [moduleData, currentTopic, topic, setError]);

  if (loading)
    return <div className="text-center py-10">Loading modules...</div>;

  if (!localModuleData)
    return (
      <div className="text-center py-10 text-red-500">
        Module not found. Please regenerate modules.
      </div>
    );

  return (
    <main className="min-h-screen bg-white text-gray-800 px-6 py-16 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-teal-600">
        {capitalizeTitle(localModuleData.topic)}
      </h1>
      <section>
        {localModuleData.sections && localModuleData.sections.length > 0 ? (
          localModuleData.sections.map((section, i) => (
            <article key={i} className="mb-8">
              <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
              <p className="mb-2 whitespace-pre-wrap">{section.content}</p>
              {section.videoUrl ? (
                <a
                  href={section.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"//for safety reasons 
                  className="block mt-2"
                >
                  {(section.thumbnail || getYoutubeThumbnail(section.videoUrl)) ? (
                    <img
                      src={
                        section.thumbnail || getYoutubeThumbnail(section.videoUrl)
                      }
                      alt={section.videoTitle || 'Video Thumbnail'}
                      className="rounded-lg shadow-md hover:opacity-80 transition w-full max-w-md aspect-video object-cover"
                    />
                  ) : (
                    
                    null
                  )}
                </a>
              ) : (
                null
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
