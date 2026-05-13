'use client';

import React from 'react';
import CourseGeneratorUI from './CourseGeneratorUI';

export default function Home() {
  return (
    <main className="min-h-screen flex items-start justify-center px-3 py-6 sm:px-4 md:items-center">
      <CourseGeneratorUI />
    </main>
  );
}
