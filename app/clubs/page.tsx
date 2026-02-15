'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { clubs, Club } from '@/lib/clubs';
import { storage } from '@/lib/storage';
import ClubCard from '@/components/ClubCard';
import CreateClubModal from '@/components/CreateClubModal';

export default function ClubsPage() {
  const [allClubs, setAllClubs] = useState<Club[]>([]);
  const [myClubs, setMyClubs] = useState<Club[]>([]);
  const [username, setUsername] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'discover' | 'my-clubs'>('discover');

  useEffect(() => {
    const profile = storage.getProfile();
    const user = profile?.name || 'Anonymous';
    setUsername(user);
    
    setAllClubs(clubs.getAll());
    setMyClubs(clubs.getUserClubs(user));
  }, []);

  const refreshClubs = () => {
    setAllClubs(clubs.getAll());
    setMyClubs(clubs.getUserClubs(username));
    setShowCreateModal(false);
  };

  const displayedClubs = activeTab === 'discover' ? allClubs : myClubs;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 md:py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">🚴 Cycling Clubs</h1>
            <p className="text-lg text-gray-600">Join a club or create your own</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transition-all"
          >
            + Create Club
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'discover'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Discover ({allClubs.length})
          </button>
          <button
            onClick={() => setActiveTab('my-clubs')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'my-clubs'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Clubs ({myClubs.length})
          </button>
        </div>

        {/* Clubs Grid */}
        {displayedClubs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedClubs.map(club => (
              <ClubCard 
                key={club.id} 
                club={club} 
                isMember={myClubs.some(c => c.id === club.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="text-6xl mb-4">🚴</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {activeTab === 'discover' ? 'No Clubs Yet' : 'You haven\'t joined any clubs'}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'discover' 
                ? 'Be the first to create a cycling club!' 
                : 'Browse clubs or create your own'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              Create Club
            </button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateClubModal
          username={username}
          onClose={() => setShowCreateModal(false)}
          onCreated={refreshClubs}
        />
      )}
    </div>
  );
}
