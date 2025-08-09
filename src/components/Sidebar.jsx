'use client';

import Link from 'next/link';
import { useUser, SignOutButton } from '@clerk/clerk-react';

export default function Sidebar() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <div className="p-4 text-gray-400">Loading...</div>;
  }

  if (!isSignedIn || !user) {
    return (
      <div className="h-screen w-64 bg-white text-gray-800 p-4 border-r border-gray-200">
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
    <div className="h-screen w-64 bg-white text-gray-800 border-r border-gray-200 flex flex-col">
      {/* User info */}
      <div className="p-4 flex items-center space-x-4 border-b border-gray-200 bg-gray-50">
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="w-12 h-12 rounded-full object-cover border-2 border-teal-400"
        />
        <div className="text-gray-900 font-semibold text-base break-all">
          {username}
        </div>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 p-4 space-y-2">
        <Link
          href="/"
          className="block p-2 rounded-lg text-teal-700 hover:bg-gray-100 hover:text-teal-900 transition-colors duration-200"
        >
          Dashboard
        </Link>
        <Link
          href="/courses"
          className="block p-2 rounded-lg text-teal-700 hover:bg-gray-100 hover:text-teal-900 transition-colors duration-200"
        >
          Courses
        </Link>
        <Link
          href="/profile"
          className="block p-2 rounded-lg text-teal-700 hover:bg-gray-100 hover:text-teal-900 transition-colors duration-200"
        >
          Profile
        </Link>
        {/* Functional Sign Out button */}
        <SignOutButton>
          <button className="block w-full text-left p-2 rounded-lg text-red-500 hover:bg-gray-100 hover:text-red-700 transition-colors duration-200">
            Sign Out
          </button>
        </SignOutButton>
      </nav>
    </div>
  );
}
