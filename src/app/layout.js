'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { AppContextProvider } from './context/AppContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <ClerkProvider>
          <AppContextProvider>
            {/* Fixed header */}
            <div className="fixed top-0 left-0 w-full z-30 h-12">
              <Header />
            </div>

            {/* Fixed sidebar (below header) */}
            <div className="fixed left-0 top-12 z-20 w-full border-b border-gray-200 bg-white md:bottom-0 md:w-64 md:border-b-0 md:border-r">
              <Sidebar />
            </div>

            {/* Main: Margin top for header, margin left for sidebar */}
            <main className="mt-28 min-h-screen overflow-y-auto bg-gradient-to-b from-white via-sky-100 to-cyan-100 md:mt-12 md:ml-64">
              {children}
            </main>
          </AppContextProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
