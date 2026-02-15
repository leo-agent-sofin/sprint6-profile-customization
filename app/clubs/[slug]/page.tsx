'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { clubs, Club, ClubMembership } from '@/lib/clubs';
import { storage } from '@/lib/storage';
import { rides } from '@/lib/rides';

export default function ClubDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [club, setClub] = useState<Club | null>(null);
  const [members, setMembers] = useState<ClubMembership[]>([]);
  const [username, setUsername] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'members' | 'leaderboard'>('feed');

  useEffect(() => {
    const profile = storage.getProfile();
    const user = profile?.name || 'Anonymous';
    setUsername(user);
    
    const found = clubs.getBySlug(slug);
    if (found) {
      setClub(found);
      const clubMembers = clubs.getMembers(found.id);
      setMembers(clubMembers);
      setIsMember(clubs.isMember(found.id, user));
    }
  }, [slug]);

  if (!club) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900">Club not found</h1>
          <Link href="/clubs" className="text-blue-600 hover:underline mt-4 inline-block">
            ← Back to clubs
          </Link>
        </div>
      </div>
    );
  }

  const tagEmojis: { [key: string]: string } = {
    road: '🛣️',
    mtb: '🏔️',
    gravel: '🪨',
    cx: '🚴'
  };

  const handleJoin = () => {
    if (clubs.joinClub(club.id, username)) {
      setIsMember(true);
      setMembers(clubs.getMembers(club.id));
    }
  };

  const handleLeave = () => {
    if (clubs.leaveClub(club.id, username)) {
      setIsMember(false);
      setMembers(clubs.getMembers(club.id));
    }
  };

  const leaderboard = clubs.getLeaderboard(club.id);
  const challenge = club.challenge;
  const challengeProgress = challenge ? (challenge.currentKm / challenge.goalKm) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 md:py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Link */}
        <Link href="/clubs" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
          ← Back to clubs
        </Link>

        {/* Club Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{club.name}</h1>
              {club.location && (
                <p className="text-gray-600 flex items-center gap-2">
                  <span>📍</span> {club.location}
                </p>
              )}
            </div>
            {isMember ? (
              <button
                onClick={handleLeave}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
              >
                Leave Club
              </button>
            ) : (
              <button
                onClick={handleJoin}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Join Club
              </button>
            )}
          </div>

          <p className="text-gray-700 mb-4">{club.description}</p>

          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {club.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
                  {tagEmojis[tag]} {tag}
                </span>
              ))}
            </div>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">{members.length} members</span>
          </div>

          {/* Challenge Progress */}
          {challenge && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900">🏆 Club Challenge</h3>
                <span className="text-sm text-gray-600">
                  {challenge.currentKm.toFixed(0)} / {challenge.goalKm} km
                </span>
              </div>
              <div className="bg-white rounded-full h-4 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all"
                  style={{ width: `${Math.min(challengeProgress, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {challengeProgress >= 100 ? '🎉 Goal reached!' : `${(100 - challengeProgress).toFixed(0)}% to go`}
              </p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200">
          {['feed', 'members', 'leaderboard'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-3 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          {activeTab === 'feed' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Club Activity</h2>
              {/* Mock club feed - in real app would aggregate member rides */}
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🚴</div>
                <p>Club feed shows rides from all members</p>
                <p className="text-sm">(Coming soon: real-time activity feed)</p>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Members ({members.length})</h2>
              {members.map(member => (
                <div
                  key={member.username}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                      {member.username[0].toUpperCase()}
                    </div>
                    <span className="font-medium">{member.username}</span>
                  </div>
                  {member.role === 'admin' && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                      Admin
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🏆 Leaderboard</h2>
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.username}
                  className={`flex items-center justify-between p-4 rounded-xl ${
                    index < 3 ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-gray-400 w-8">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </span>
                    <div>
                      <span className="font-semibold">{entry.username}</span>
                      {entry.role === 'admin' && (
                        <span className="ml-2 text-xs text-gray-500">(Admin)</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{entry.weeklyKm.toFixed(1)} km</div>
                    <div className="text-sm text-gray-500">this week</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Invite Section (Admin only) */}
        {isMember && members.find(m => m.username === username)?.role === 'admin' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Invite Members</h3>
            <div className="flex gap-3">
              <input
                type="text"
                readOnly
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/join/${club.slug}`}
                className="flex-1 px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-600"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/join/${club.slug}`);
                  alert('Invite link copied!');
                }}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all"
              >
                Copy Link
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
