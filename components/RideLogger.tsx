'use client';

import { useState } from 'react';
import { rides } from '@/lib/rides';
import { social } from '@/lib/social';
import { storage } from '@/lib/storage';
import { achievements } from '@/lib/achievements';
import Toast from './Toast';

interface RideLoggerProps {
  onRideLogged?: () => void;
}

type ToastType = 'success' | 'info' | 'error' | 'achievement';

export default function RideLogger({ onRideLogged }: RideLoggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [distance, setDistance] = useState('');
  const [elevationGain, setElevationGain] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('success');

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    const distanceNum = parseFloat(distance);
    const elevationNum = parseFloat(elevationGain);
    const hoursNum = parseInt(hours || '0');
    const minutesNum = parseInt(minutes || '0');

    if (!distance || isNaN(distanceNum) || distanceNum <= 0) {
      newErrors.distance = 'Distance must be greater than 0';
    }
    if (!elevationGain || isNaN(elevationNum) || elevationNum < 0) {
      newErrors.elevationGain = 'Elevation gain must be 0 or greater';
    }
    if ((hoursNum === 0 && minutesNum === 0) || hoursNum < 0 || minutesNum < 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }
    if (minutesNum >= 60) {
      newErrors.duration = 'Minutes must be less than 60';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const distanceNum = parseFloat(distance);
      const elevationNum = parseFloat(elevationGain);
      const hoursNum = parseInt(hours || '0');
      const minutesNum = parseInt(minutes || '0');
      const totalMinutes = hoursNum * 60 + minutesNum;

      const ride = rides.add(distanceNum, elevationNum, totalMinutes);

      // Add to social feed
      const profile = storage.getProfile();
      const userName = profile ? profile.name : 'New User';
      const userAvatar = profile ? profile.avatar_url : 'https://api.dicebear.com/7.x/avataaars/svg?seed=Default';
      
      social.addActivity(userName, userAvatar, {
        distance: ride.distance,
        elevation: ride.elevationGain,
        duration: ride.duration,
        avgSpeed: ride.avgSpeed
      });

      // Check for new achievements
      const newAchievements = achievements.checkAchievements();
      
      // Check for new personal bests
      const newPBs = achievements.updatePersonalBests();

      // Reset form
      setDistance('');
      setElevationGain('');
      setHours('');
      setMinutes('');
      setErrors({});
      setIsOpen(false);
      setIsSubmitting(false);

      // Show success toast
      if (newAchievements.length > 0) {
        const achievementNames = newAchievements.map(id => 
          achievements.getAll().find(a => a.id === id)?.name || id
        );
        setToastMessage(`Achievement Unlocked: ${achievementNames[0]}!`);
        setToastType('achievement');
      } else if (newPBs.length > 0) {
        const pbNames = newPBs.map(pb => achievements.formatPBName(pb));
        setToastMessage(`New Personal Best: ${pbNames[0]}!`);
        setToastType('success');
      } else {
        setToastMessage('Ride logged successfully!');
        setToastType('success');
      }
      
      setShowToast(true);

      if (onRideLogged) {
        onRideLogged();
      }
    }, 300);
  };

  if (!isOpen) {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-lg hover:from-green-700 hover:to-emerald-700 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all transform"
        >
          🚴 Log Ride
        </button>
        
        {showToast && (
          <Toast
            message={toastMessage}
            type={toastType}
            onClose={() => setShowToast(false)}
          />
        )}
      </>
    );
  }

  return (
    <div className="bg-white rounded-xl border-2 border-green-500 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">🚴 Log Your Ride</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Distance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📏 Distance (km) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.1"
            value={distance}
            onChange={(e) => {
              setDistance(e.target.value);
              setErrors({ ...errors, distance: '' });
            }}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.distance
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-green-500'
            }`}
            placeholder="42.5"
          />
          {errors.distance && (
            <p className="mt-1 text-sm text-red-500">{errors.distance}</p>
          )}
        </div>

        {/* Elevation Gain */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ⛰️ Elevation Gain (m) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="1"
            value={elevationGain}
            onChange={(e) => {
              setElevationGain(e.target.value);
              setErrors({ ...errors, elevationGain: '' });
            }}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.elevationGain
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-green-500'
            }`}
            placeholder="450"
          />
          {errors.elevationGain && (
            <p className="mt-1 text-sm text-red-500">{errors.elevationGain}</p>
          )}
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ⏱️ Duration <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="number"
                min="0"
                value={hours}
                onChange={(e) => {
                  setHours(e.target.value);
                  setErrors({ ...errors, duration: '' });
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.duration
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-green-500'
                }`}
                placeholder="Hours"
              />
            </div>
            <div>
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => {
                  setMinutes(e.target.value);
                  setErrors({ ...errors, duration: '' });
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.duration
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-green-500'
                }`}
                placeholder="Minutes"
              />
            </div>
          </div>
          {errors.duration && (
            <p className="mt-1 text-sm text-red-500">{errors.duration}</p>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-wait transition-all transform"
          >
            {isSubmitting ? 'Saving...' : 'Save Ride'}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:-translate-y-0.5 active:translate-y-0 transition-all transform"
          >
            Cancel
          </button>
        </div>
      </form>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}

    </div>
  );
}
