'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { AppContextProvider } from './context/AppContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import './globals.css';

export default function RootLayout({ children }) {
  const headerHeight = 48; 
  const sidebarWidth = '16rem'; 

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
