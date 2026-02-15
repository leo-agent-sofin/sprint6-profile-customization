'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { socialFollow } from '@/lib/socialFollow';
import { storage } from '@/lib/storage';

export default function UserSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    const profile = storage.getProfile();
    if (profile?.name) setCurrentUser(profile.name);
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      const found = socialFollow.searchUsers(query);
      setResults(found.filter(u => u !== currentUser));
    } else {
      setResults([]);
    }
  }, [query, currentUser]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-4">🔍 Find Cyclists</h2>
      
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by username..."
          className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          🔍
        </span>
      </div>

      {results.length > 0 && (
        <div className="mt-4 space-y-2">
          {results.map(username => (
            <SearchResultRow
              key={username}
              username={username}
              currentUser={currentUser}
            />
          ))}
        </div>
      )}

      {query.length >= 2 && results.length === 0 && (
        <p className="mt-4 text-gray-500 text-center">No users found</p>
      )}
    </div>
  );
}

function SearchResultRow({ username, currentUser }: { username: string; currentUser: string }) {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    setIsFollowing(socialFollow.isFollowing(currentUser, username));
  }, [currentUser, username]);

  const handleFollow = () => {
    if (isFollowing) {
      socialFollow.unfollow(currentUser, username);
      setIsFollowing(false);
    } else {
      socialFollow.follow(currentUser, username);
      setIsFollowing(true);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
          {username[0].toUpperCase()}
        </div>
        <span className="font-medium">{username}</span>
      </div>
      <button
        onClick={handleFollow}
        className={`px-4 py-2 rounded-lg font-medium transition-all ${
          isFollowing
            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </button>
    </div>
  );
}
