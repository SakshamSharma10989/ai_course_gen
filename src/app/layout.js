'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { AppContextProvider } from './context/AppContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import './globals.css';

export default function RootLayout({ children }) {
  // Adjust these values if your header or sidebar has different heights/widths!
  const headerHeight = 48; // px, adjust to your real header height (py-2/2.5 + font size)
  const sidebarWidth = '16rem'; // 64 * 0.25rem = 16rem for w-64

  return (
    <html lang="en">
      <head />
      <body>
        <ClerkProvider>
          <AppContextProvider>
            {/* Fixed header */}
            <div
              className="fixed top-0 left-0 w-full z-30"
              style={{ height: headerHeight }}
            >
              <Header />
            </div>

            {/* Fixed sidebar (below header) */}
            <div
              className="fixed left-0 z-20 border-r border-gray-200 bg-white h-full"
              style={{
                width: sidebarWidth,
                top: headerHeight,
                height: `calc(100vh - ${headerHeight}px)`
              }}
            >
              <Sidebar />
            </div>

            {/* Main: Margin top for header, margin left for sidebar */}
            <main
              className="bg-gradient-to-b from-white via-sky-100 to-cyan-100 min-h-screen overflow-y-auto"
              style={{
                marginTop: headerHeight,
                marginLeft: sidebarWidth,
              }}
            >
              {children}
            </main>
          </AppContextProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
