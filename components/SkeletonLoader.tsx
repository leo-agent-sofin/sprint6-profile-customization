'use client';

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
        <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
      </div>
      <div className="space-y-4">
        <div className="h-32 bg-gray-200 rounded-xl"></div>
        <div className="h-24 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 animate-pulse">
      <div className="flex items-center gap-6 mb-6">
        <div className="h-32 w-32 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-8 w-48 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonRideCard() {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 p-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          <div>
            <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="bg-gradient-to-br from-gray-100 to-gray-200 p-6 rounded-xl animate-pulse"
        >
          <div className="h-10 w-full bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-20 bg-gray-300 rounded mx-auto"></div>
        </div>
      ))}
    </div>
  );
}
