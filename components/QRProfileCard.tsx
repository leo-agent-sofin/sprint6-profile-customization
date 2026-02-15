'use client';

import { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { UserProfile } from '@/lib/types';
import { rides } from '@/lib/rides';

interface QRProfileCardProps {
  profile: UserProfile;
}

type QRColor = 'black' | 'blue' | 'orange';

export default function QRProfileCard({ profile }: QRProfileCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [qrColor, setQRColor] = useState<QRColor>('black');

  const stats = rides.getTotals();
  const streak = calculateStreak();
  
  // Generate profile URL
  const username = profile.name.toLowerCase().replace(/\s+/g, '-');
  const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/profile/${username}`;

  function calculateStreak(): number {
    const allRides = rides.getAll();
    if (allRides.length === 0) return 0;
    
    const dates = [...new Set(allRides.map(r => r.date))].sort();
    let streak = 0;
    let currentDate = new Date();
    
    for (let i = 0; i < 365; i++) {
      const dateKey = currentDate.toISOString().split('T')[0];
      if (dates.includes(dateKey)) {
        streak++;
      } else if (i > 0) {
        break;
      }
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  }

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    setIsExporting(true);
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        width: 1080,
        height: 1350,
        windowWidth: 1080,
        windowHeight: 1350
      });
      
      const link = document.createElement('a');
      link.download = `sofin-profile-${username}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const qrColors = {
    black: '#000000',
    blue: '#3B82F6',
    orange: '#F97316'
  };

  const qrBgColors = {
    black: '#FFFFFF',
    blue: '#EFF6FF',
    orange: '#FFF7ED'
  };

  return (
    <div className="space-y-6">
      {/* QR Color Picker */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">QR Code Color</label>
        <div className="flex gap-3">
          {(['black', 'blue', 'orange'] as QRColor[]).map((color) => (
            <button
              key={color}
              onClick={() => setQRColor(color)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                qrColor === color
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {color.charAt(0).toUpperCase() + color.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Card */}
      <div
        ref={cardRef}
        className="relative rounded-2xl overflow-hidden"
        style={{ 
          width: '1080px', 
          height: '1350px', 
          transform: 'scale(0.4)', 
          transformOrigin: 'top left',
          background: 'linear-gradient(to bottom right, #0f172a 0%, #312e81 50%, #581c87 100%)'
        }}
      >
        {/* Cycling Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 text-9xl">🚴</div>
          <div className="absolute bottom-40 left-20 text-9xl">🚴</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl opacity-50">🚴</div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-between h-full p-20">
          {/* Header Section */}
          <div className="text-center space-y-8 w-full">
            {/* Avatar */}
            <div className="mx-auto w-64 h-64 rounded-full overflow-hidden border-8 border-white shadow-2xl">
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name & Location */}
            <div>
              <h1 className="text-7xl font-bold text-white mb-4">
                {profile.name}
              </h1>
              {profile.bio && (
                <p className="text-4xl text-blue-200">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border-2 border-white/20">
                <div className="text-6xl font-bold text-white mb-2">
                  {stats.totalDistance.toFixed(0)}
                </div>
                <div className="text-3xl text-blue-200">Total km</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border-2 border-white/20">
                <div className="text-6xl font-bold text-white mb-2">
                  {stats.totalRides}
                </div>
                <div className="text-3xl text-blue-200">Rides</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border-2 border-white/20">
                <div className="text-6xl font-bold text-white mb-2">
                  {streak}
                </div>
                <div className="text-3xl text-blue-200">Day Streak</div>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-12 shadow-2xl">
              <QRCodeSVG
                value={profileUrl}
                size={400}
                level="H"
                fgColor={qrColors[qrColor]}
                bgColor={qrBgColors[qrColor]}
              />
            </div>
            <div className="text-center">
              <p className="text-4xl font-semibold text-white mb-2">
                Scan to Follow
              </p>
              <p className="text-3xl text-blue-200">
                Join me on Sofin
              </p>
            </div>
          </div>

          {/* Branding */}
          <div className="text-center">
            <div className="text-5xl font-bold text-white mb-2">
              Sofin
            </div>
            <div className="text-3xl text-blue-200">
              Track Every Mile
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={isExporting}
        className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-wait transition-all transform"
      >
        {isExporting ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Generating...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            📥 Download Profile Card
          </span>
        )}
      </button>

      <p className="text-sm text-gray-600 text-center">
        Perfect for Instagram stories (1080x1350) • Share your cycling profile
      </p>
    </div>
  );
}
