'use client';

import { useRef, useState } from 'react';
import { rides } from '@/lib/rides';
import { achievements } from '@/lib/achievements';
import { storage } from '@/lib/storage';

export default function StatsExport() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateStatsImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsGenerating(true);

    // Give React time to render
    setTimeout(() => {
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsGenerating(false);
        return;
      }

      const width = 1080;
      const height = 1080;
      canvas.width = width;
      canvas.height = height;

      // Get data
      const profile = storage.getProfile();
      const stats = rides.getTotals();
      const pbs = achievements.getPersonalBests();
      const unlockedCount = achievements.getUnlockedCount();
      const totalAchievements = achievements.getAll().length;

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#3B82F6'); // blue-500
      gradient.addColorStop(0.5, '#6366F1'); // indigo-500
      gradient.addColorStop(1, '#8B5CF6'); // purple-500
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Title
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 72px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🚴 Cycling Stats', width / 2, 120);

      // User name
      if (profile) {
        ctx.font = '48px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = '#E0E7FF';
        ctx.fillText(profile.name, width / 2, 200);
      }

      // White card background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 10;
      const cardY = 250;
      const cardHeight = 750;
      const cardPadding = 60;
      ctx.roundRect(cardPadding, cardY, width - cardPadding * 2, cardHeight, 30);
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Stats grid
      const gridStartY = cardY + 80;
      const gridSpacing = 140;
      const labelFont = '28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const valueFont = 'bold 64px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const emojiFont = '56px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

      const statsData = [
        { emoji: '🚴', value: stats.totalRides.toString(), label: 'Total Rides', color: '#3B82F6' },
        { emoji: '📏', value: `${stats.totalDistance.toFixed(1)}`, label: 'Total km', color: '#10B981' },
        { emoji: '⛰️', value: stats.totalElevation.toString(), label: 'Elevation (m)', color: '#F59E0B' },
        { emoji: '⚡', value: `${stats.avgSpeed.toFixed(1)}`, label: 'Avg km/h', color: '#EC4899' }
      ];

      // Draw stats in 2x2 grid
      statsData.forEach((stat, index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);
        const x = cardPadding + 120 + col * 480;
        const y = gridStartY + row * gridSpacing;

        // Emoji
        ctx.font = emojiFont;
        ctx.textAlign = 'center';
        ctx.fillText(stat.emoji, x, y);

        // Value
        ctx.font = valueFont;
        ctx.fillStyle = stat.color;
        ctx.fillText(stat.value, x, y + 80);

        // Label
        ctx.font = labelFont;
        ctx.fillStyle = '#6B7280';
        ctx.fillText(stat.label, x, y + 120);
      });

      // Personal Bests section
      const pbStartY = gridStartY + 320;
      ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#1F2937';
      ctx.textAlign = 'center';
      ctx.fillText('🏆 Personal Bests', width / 2, pbStartY);

      const pbData = [
        { emoji: '🚴', label: 'Longest', value: pbs.longestRide ? `${pbs.longestRide.value.toFixed(1)}km` : '—' },
        { emoji: '⛰️', label: 'Biggest Climb', value: pbs.biggestClimb ? `${pbs.biggestClimb.value}m` : '—' }
      ];

      pbData.forEach((pb, index) => {
        const x = cardPadding + 120 + index * 480;
        const y = pbStartY + 80;

        ctx.font = '40px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(pb.emoji, x, y);

        ctx.font = 'bold 48px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = '#8B5CF6';
        ctx.fillText(pb.value, x, y + 60);

        ctx.font = '24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = '#6B7280';
        ctx.fillText(pb.label, x, y + 95);
      });

      // Achievements
      const achievementsY = pbStartY + 220;
      ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#1F2937';
      ctx.fillText(`🎖️ ${unlockedCount}/${totalAchievements} Achievements`, width / 2, achievementsY);

      // Download
      const link = document.createElement('a');
      link.download = `cycling-stats-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      setIsGenerating(false);
    }, 100);
  };

  return (
    <>
      <button
        onClick={generateStatsImage}
        disabled={isGenerating}
        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-wait"
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Generating...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            📸 Export Stats Image
          </span>
        )}
      </button>
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
}
