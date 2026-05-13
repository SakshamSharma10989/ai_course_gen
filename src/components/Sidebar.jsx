'use client';

import Link from 'next/link';
import { useUser, SignOutButton } from '@clerk/clerk-react';

export default function Sidebar() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <div className="p-4 text-gray-400 md:h-full">Loading...</div>;
  }

  if (!isSignedIn || !user) {
    return (
      <div className="w-full bg-white p-3 text-gray-800 md:h-full md:w-64 md:p-4">
        <Link
          href="/sign-in"
          className="text-teal-600 hover:text-teal-700 font-semibold transition-colors duration-200"
        >
          Please sign in
        </Link>
      </div>
    );
  }

  const username = user.username || user.fullName || user.primaryEmailAddress?.email;

  const avatarUrl =
    user.profileImageUrl ||
    `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(
      username || user.id
    )}`;

  return (
    <div className="flex w-full flex-col bg-white text-gray-800 md:h-full md:w-64">
      {/* User info */}
      <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-50 p-3 md:gap-4 md:p-4">
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="h-10 w-10 rounded-full border-2 border-teal-400 object-cover md:h-12 md:w-12"
        />
        <div className="min-w-0 truncate text-sm font-semibold text-gray-900 md:break-all md:text-base">
          {username}
        </div>
      </div>

      {/* Navigation links */}
      <nav className="flex items-center gap-2 overflow-x-auto p-2 md:flex-1 md:flex-col md:items-stretch md:gap-0 md:space-y-2 md:p-4">
        <Link
          href="/"
          className="block shrink-0 rounded-lg p-2 text-teal-700 hover:bg-gray-100 hover:text-teal-900 transition-colors duration-200"
        >
          Dashboard
        </Link>
        <Link
          href="/profile"
          className="block shrink-0 rounded-lg p-2 text-teal-700 hover:bg-gray-100 hover:text-teal-900 transition-colors duration-200"
        >
          Profile
        </Link>
        {/* Functional Sign Out button */}
        <SignOutButton>
          <button className="block shrink-0 rounded-lg p-2 text-left text-red-500 hover:bg-gray-100 hover:text-red-700 transition-colors duration-200 md:w-full">
            Sign Out
          </button>
        </SignOutButton>
      </nav>
    </div>
  );
}
