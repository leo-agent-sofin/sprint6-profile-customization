'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { rides, Ride } from '@/lib/rides';
import RideComparison from '@/components/RideComparison';
import { SkeletonCard } from '@/components/SkeletonLoader';

export default function RideComparePage() {
  const params = useParams();
  const rideId = params.id as string;
  
  const [ride1, setRide1] = useState<Ride | null>(null);
  const [ride2, setRide2] = useState<Ride | null>(null);
  const [availableRides, setAvailableRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const allRides = rides.getAll();
    setAvailableRides(allRides);
    
    const foundRide = allRides.find(r => r.id === rideId);
    if (foundRide) {
      setRide1(foundRide);
      // Set second ride to the next most recent ride, or the same ride if only one exists
      const otherRides = allRides.filter(r => r.id !== rideId);
      if (otherRides.length > 0) {
        setRide2(otherRides[0]);
      } else {
        setRide2(foundRide);
      }
    }
    setIsLoading(false);
  }, [rideId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 md:py-12 px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (!ride1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ride Not Found</h1>
          <p className="text-gray-600 mb-6">This ride doesn't exist or has been deleted.</p>
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 md:py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">🔄 Ride Comparison</h1>
            <p className="text-lg text-gray-600">Compare your rides side-by-side</p>
          </div>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-white text-gray-700 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Ride 2 Selector */}
        {availableRides.length > 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Compare with another ride:
            </label>
            <select
              value={ride2?.id || ''}
              onChange={(e) => {
                const selected = availableRides.find(r => r.id === e.target.value);
                if (selected) setRide2(selected);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableRides
                .filter(r => r.id !== ride1.id)
                .map((ride) => (
                  <option key={ride.id} value={ride.id}>
                    {new Date(ride.date).toLocaleDateString()} - {ride.distance.toFixed(1)}km, {ride.elevationGain}m climb
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Comparison */}
        {ride1 && ride2 && (
          <div className="card-enter">
            <RideComparison ride1={ride1} ride2={ride2} />
          </div>
        )}

        {/* Single Ride Warning */}
        {availableRides.length < 2 && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">🚴</div>
            <h3 className="text-xl font-bold text-yellow-800 mb-2">
              Log More Rides to Compare
            </h3>
            <p className="text-yellow-700 mb-4">
              You need at least 2 rides to use the comparison feature.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-amber-600 transition-all"
            >
              Log Your Next Ride
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
