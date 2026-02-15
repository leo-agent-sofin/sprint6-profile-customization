'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { clubs, Club } from '@/lib/clubs';
import { storage } from '@/lib/storage';

export default function JoinClubPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [club, setClub] = useState<Club | null>(null);
  const [username, setUsername] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const profile = storage.getProfile();
    const user = profile?.name || 'Anonymous';
    setUsername(user);
    
    const found = clubs.getBySlug(slug);
    if (found) {
      setClub(found);
      setIsMember(clubs.isMember(found.id, user));
    }
  }, [slug]);

  if (!club) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Club Not Found</h1>
          <p className="text-gray-600 mb-6">This invite link is invalid or the club no longer exists.</p>
          <Link
            href="/clubs"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold"
          >
            Browse Clubs
          </Link>
        </div>
      </div>
    );
  }

  const handleJoin = () => {
    if (clubs.joinClub(club.id, username)) {
      setJoined(true);
      setIsMember(true);
    }
  };

  const tagEmojis: { [key: string]: string } = {
    road: '🛣️',
    mtb: '🏔️',
    gravel: '🪨',
    cx: '🚴'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 text-center">
        {joined ? (
          <>
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to {club.name}!</h1>
            <p className="text-gray-600 mb-6">You're now a member of the club.</p>
            <div className="space-y-3">
              <Link
                href={`/clubs/${club.slug}`}
                className="block w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold"
              >
                Go to Club
              </Link>
              <Link
                href="/clubs"
                className="block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium"
              >
                Browse More Clubs
              </Link>
            </div>
          </>
        ) : isMember ? (
          <>
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Already a Member</h1>
            <p className="text-gray-600 mb-6">You're already part of {club.name}!</p>
            <Link
              href={`/clubs/${club.slug}`}
              className="block w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold"
            >
              Go to Club
            </Link>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">🚴</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join {club.name}</h1>
            <p className="text-gray-600 mb-4">{club.description}</p>
            
            <div className="flex items-center justify-center gap-2 mb-6">
              {club.tags.map(tag => (
                <span key={tag} className="text-2xl" title={tag}>
                  {tagEmojis[tag]}
                </span>
              ))}
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">{clubs.getMemberCount(club.id)}</span> members
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleJoin}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Join Club
              </button>
              <Link
                href="/clubs"
                className="block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium"
              >
                Cancel
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
