'use client';

import { useState, useEffect } from 'react';
import { social } from '@/lib/social';
import ActivityCard from '@/components/ActivityCard';
import Link from 'next/link';

export default function FeedPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Initialize mock data on first load
    social.initializeMockData();
    
    // Load filtered feed
    const feed = social.getFilteredFeed();
    setActivities(feed);
    setIsLoading(false);
  }, [refreshKey]);

  const handleKudosChange = () => {
    // Refresh to show updated kudos counts
    setRefreshKey(prev => prev + 1);
  };

  const followingCount = social.getFollowing().length;
  const mockCyclists = social.getMockCyclists();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-xl text-gray-600">Loading feed...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 md:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
            Activity Feed
          </h1>
          <p className="text-lg text-gray-600">
            See what your cycling community is up to 🚴
          </p>
        </div>

        {/* Follow Suggestions */}
        {followingCount === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-blue-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              👥 Suggested Cyclists to Follow
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {mockCyclists.slice(0, 4).map((cyclist) => (
                <button
                  key={cyclist.id}
                  onClick={() => {
                    social.toggleFollow(cyclist.id);
                    setRefreshKey(prev => prev + 1);
                  }}
                  className="flex flex-col items-center p-3 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
                >
                  <img
                    src={cyclist.avatar}
                    alt={cyclist.name}
                    className="w-16 h-16 rounded-full mb-2"
                  />
                  <div className="text-sm font-medium text-center">{cyclist.name}</div>
                  <div className="text-xs text-blue-600 mt-1">+ Follow</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feed */}
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onKudosChange={handleKudosChange}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🚴</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Follow Cyclists to See Their Rides!
            </h2>
            <p className="text-gray-600 mb-6">
              Your feed is empty. Follow some cyclists to see their activities and give kudos.
            </p>
            
            <div className="max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold mb-4">Suggested Cyclists</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mockCyclists.map((cyclist) => (
                  <button
                    key={cyclist.id}
                    onClick={() => {
                      social.toggleFollow(cyclist.id);
                      setRefreshKey(prev => prev + 1);
                    }}
                    className="flex flex-col items-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
                  >
                    <img
                      src={cyclist.avatar}
                      alt={cyclist.name}
                      className="w-20 h-20 rounded-full mb-3 border-2 border-blue-200"
                    />
                    <div className="text-sm font-medium text-center mb-2">{cyclist.name}</div>
                    <div className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full">
                      Follow
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Following Summary */}
        {followingCount > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-3">Following</h2>
            <div className="flex flex-wrap gap-3">
              {social.getFollowing().map((userId) => {
                const cyclist = mockCyclists.find(c => c.id === userId);
                if (!cyclist) return null;
                return (
                  <div
                    key={userId}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg"
                  >
                    <img
                      src={cyclist.avatar}
                      alt={cyclist.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium">{cyclist.name}</span>
                    <button
                      onClick={() => {
                        social.toggleFollow(userId);
                        setRefreshKey(prev => prev + 1);
                      }}
                      className="text-xs text-gray-500 hover:text-red-600 ml-1"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Link to Dashboard */}
        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
