'use client';

export default function Header() {
  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm px-4 sm:px-8 py-2.5 flex items-center gap-4 z-30">
      <img
        src="/image.png"
        alt="App Icon"
        width={36}
        height={36}
        className="rounded-lg border border-gray-200 bg-gray-50"
      />
      <h1 className="text-lg font-bold tracking-tight text-teal-700 drop-shadow-sm">
        Mystudy AI
      </h1>
    </header>
  );
}
