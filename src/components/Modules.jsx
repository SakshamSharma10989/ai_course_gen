import ReactMarkdown from 'react-markdown';

export default function Modules({ topic, sections }) {
  if (!topic || !sections) return null;

  const getThumbnailUrl = (videoUrl) => {
    if (!videoUrl) return null;
    const videoId = videoUrl.split('v=')[1]?.split('&')[0];
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
  };

  return (
    <div className="bg-black text-white px-6 py-10 rounded-xl shadow-xl w-full max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-10 text-cyan-400 border-b border-gray-700 pb-2">
        📘 Module: <span className="text-white">{topic}</span>
      </h2>

      {sections.map((section, index) => (
        <div
          key={index}
          className="bg-[#1e1e1e] rounded-xl p-6 mb-8 shadow-lg hover:shadow-cyan-500/20 transition duration-300"
        >
          <h3 className="text-xl font-semibold text-cyan-300 mb-4">{section.title}</h3>

          <ReactMarkdown
            components={{
              code({ inline, className, children }) {
                const isBlock = !inline && /language-(\w+)/.exec(className || '');
                return isBlock ? (
                  <pre className="bg-[#2d2d2d] text-white text-sm p-4 rounded-lg overflow-x-auto mb-4">
                    <code>{children}</code>
                  </pre>
                ) : (
                  <code className="bg-gray-800 text-cyan-300 px-2 py-1 rounded text-sm">
                    {children}
                  </code>
                );
              },
            }}
          >
            {section.content}
          </ReactMarkdown>

          {section.videoUrl && section.videoTitle ? (
            <div className="mt-4 rounded-xl overflow-hidden bg-black border border-gray-700 max-w-2xl">
              <div className="relative aspect-video">
                <img
                  src={getThumbnailUrl(section.videoUrl)}
                  alt={section.videoTitle}
                  className="w-full h-full object-cover"
                />
                <a
                  href={section.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition"
                >
                  <svg
                    className="w-16 h-16 fill-white"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </a>
              </div>
              <div className="p-4">
                <h4 className="text-lg font-medium truncate text-white">
                  🎬 {section.videoTitle}
                </h4>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 mt-4 italic">No video available for this section.</p>
          )}
        </div>
      ))}
    </div>
  );
}
