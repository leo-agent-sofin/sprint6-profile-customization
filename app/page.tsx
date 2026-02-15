import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            🚴 Cycling Tracker
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Track Your Rides, Monitor Your Progress
          </p>
          <p className="text-sm text-gray-500">
            Log rides, view stats, build your cycling habit 🚀
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/profile"
            className="group block p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
              👤
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-900">
              Your Profile
            </h2>
            <p className="text-gray-600">
              Edit your name, bio, and avatar. All changes persist across sessions.
            </p>
          </Link>

          <Link
            href="/dashboard"
            className="group block p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
              📊
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-900">
              Dashboard
            </h2>
            <p className="text-gray-600">
              View your profile and access quick links to manage your account.
            </p>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-900">
            ✨ Features
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">🚴</span>
              <span>Log rides with distance, elevation, and duration</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">📊</span>
              <span>Track total rides, km, elevation, time, and avg speed</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">📅</span>
              <span>7-day calendar with ride distance visualization</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">👤</span>
              <span>Customizable profile with cycling stats</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">💾</span>
              <span>All data persists locally in your browser</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
