'use client';

import Link from 'next/link';
import { Club, clubs } from '@/lib/clubs';

interface ClubCardProps {
  club: Club;
  isMember?: boolean;
}

export default function ClubCard({ club, isMember = false }: ClubCardProps) {
  const memberCount = clubs.getMemberCount(club.id);
  
  const tagEmojis: { [key: string]: string } = {
    road: '🛣️',
    mtb: '🏔️',
    gravel: '🪨',
    cx: '🚴'
  };

  return (
    <Link
      href={`/clubs/${club.slug}`}
      className="block bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{club.name}</h3>
          {club.location && (
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <span>📍</span> {club.location}
            </p>
          )}
        </div>
        {isMember && (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
            Member
          </span>
        )}
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{club.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {club.tags.map(tag => (
            <span key={tag} className="text-lg" title={tag}>
              {tagEmojis[tag]}
            </span>
          ))}
        </div>
        <div className="text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{memberCount}</span> members
        </div>
      </div>
    </Link>
  );
}
