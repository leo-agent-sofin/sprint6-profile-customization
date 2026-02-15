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

  // Convert lab/oklab colors to RGB
  const sanitizeElementForExport = (element: HTMLElement): HTMLElement => {
    const clone = element.cloneNode(true) as HTMLElement;
    
    // List of elements to sanitize
    const allElements = clone.querySelectorAll('*');
    
    allElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      const computedStyle = window.getComputedStyle(htmlEl);
      
      // Get all computed styles and convert lab/oklab to RGB
      const stylesToConvert = ['color', 'backgroundColor', 'borderColor', 'outlineColor'];
      
      stylesToConvert.forEach((styleProp) => {
        const value = computedStyle.getPropertyValue(styleProp);
        if (value.includes('lab(') || value.includes('oklab(')) {
          // Force RGB by setting a fallback color based on context
          // For the QR card, we know the color scheme
          if (styleProp === 'color') {
            htmlEl.style.color = '#FFFFFF'; // White text for dark card
          } else if (styleProp === 'backgroundColor') {
            // Keep the gradient we set inline, or use transparent
            htmlEl.style.backgroundColor = 'transparent';
          }
        }
      });
      
      // Remove any Tailwind gradient classes that might use oklab
      if (htmlEl.classList.contains('bg-gradient-to-br') || 
          htmlEl.classList.contains('bg-gradient-to-r') ||
          htmlEl.classList.contains('bg-gradient-to-b')) {
        // Keep only the essential classes, remove gradient ones
        // We'll set inline styles instead
      }
    });
    
    return clone;
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    setIsExporting(true);
    
    try {
      // Create a clean container with RGB-only colors
      const exportContainer = document.createElement('div');
      exportContainer.style.position = 'fixed';
      exportContainer.style.left = '-9999px';
      exportContainer.style.top = '0';
      document.body.appendChild(exportContainer);
      
      // Clone the card with sanitized colors
      const clone = cardRef.current.cloneNode(true) as HTMLElement;
      
      // Reset transform for clean export
      clone.style.transform = 'none';
      clone.style.width = '1080px';
      clone.style.height = '1350px';
      
      // Ensure all text colors are explicit RGB
      const allText = clone.querySelectorAll('h1, p, div, span');
      allText.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const currentColor = htmlEl.style.color;
        if (!currentColor || currentColor.includes('lab')) {
          // Determine color based on element type
          if (htmlEl.tagName === 'H1') {
            htmlEl.style.color = '#FFFFFF';
          } else if (htmlEl.classList.contains('text-blue-200') || htmlEl.style.color.includes('blue')) {
            htmlEl.style.color = '#BFDBFE'; // blue-200 in RGB
          } else {
            htmlEl.style.color = '#FFFFFF';
          }
        }
      });
      
      // Ensure stat cards have explicit background
      const statCards = clone.querySelectorAll('[class*="backdrop-blur"]');
      statCards.forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        htmlEl.style.backdropFilter = 'none'; // Remove backdrop-filter
      });
      
      exportContainer.appendChild(clone);
      
      // Wait for fonts and images
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(clone, {
        scale: 2,
        backgroundColor: null,
        width: 1080,
        height: 1350,
        useCORS: true,
        allowTaint: true,
        logging: false
      });
      
      // Cleanup
      document.body.removeChild(exportContainer);
      
      const link = document.createElement('a');
      link.download = `sofin-profile-${username}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
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
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={{ backgroundColor: qrColor === color ? '#2563EB' : undefined }}
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
          background: 'linear-gradient(to bottom right, rgb(15, 23, 42) 0%, rgb(49, 46, 129) 50%, rgb(88, 28, 135) 100%)'
        }}
      >
        {/* Cycling Pattern Background */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          opacity: 0.1,
          color: 'rgb(255, 255, 255)'
        }}>
          <div style={{ position: 'absolute', top: '80px', right: '80px', fontSize: '120px' }}>🚴</div>
          <div style={{ position: 'absolute', bottom: '160px', left: '80px', fontSize: '120px' }}>🚴</div>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '120px', opacity: 0.5 }}>🚴</div>
        </div>

        <div style={{ 
          position: 'relative', 
          zIndex: 10, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          height: '100%', 
          padding: '80px' 
        }}>
          {/* Header Section */}
          <div style={{ textAlign: 'center', width: '100%' }}>
            {/* Avatar */}
            <div style={{ 
              margin: '0 auto', 
              width: '256px', 
              height: '256px', 
              borderRadius: '50%', 
              overflow: 'hidden', 
              border: '8px solid rgb(255, 255, 255)', 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
              <img
                src={profile.avatar_url}
                alt={profile.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                crossOrigin="anonymous"
              />
            </div>

            {/* Name & Location */}
            <div style={{ marginTop: '32px' }}>
              <h1 style={{ 
                fontSize: '72px', 
                fontWeight: 'bold', 
                color: 'rgb(255, 255, 255)', 
                marginBottom: '16px',
                lineHeight: 1.2
              }}>
                {profile.name}
              </h1>
              {profile.bio && (
                <p style={{ 
                  fontSize: '36px', 
                  color: 'rgb(191, 219, 254)'
                }}>
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Stats Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '24px', 
              marginTop: '48px' 
            }}>
              <div style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '24px', 
                padding: '32px', 
                border: '2px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '60px', fontWeight: 'bold', color: 'rgb(255, 255, 255)', marginBottom: '8px' }}>
                  {stats.totalDistance.toFixed(0)}
                </div>
                <div style={{ fontSize: '30px', color: 'rgb(191, 219, 254)' }}>Total km</div>
              </div>
              <div style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '24px', 
                padding: '32px', 
                border: '2px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '60px', fontWeight: 'bold', color: 'rgb(255, 255, 255)', marginBottom: '8px' }}>
                  {stats.totalRides}
                </div>
                <div style={{ fontSize: '30px', color: 'rgb(191, 219, 254)' }}>Rides</div>
              </div>
              <div style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '24px', 
                padding: '32px', 
                border: '2px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '60px', fontWeight: 'bold', color: 'rgb(255, 255, 255)', marginBottom: '8px' }}>
                  {streak}
                </div>
                <div style={{ fontSize: '30px', color: 'rgb(191, 219, 254)' }}>Day Streak</div>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              backgroundColor: 'rgb(255, 255, 255)', 
              borderRadius: '24px', 
              padding: '48px', 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
              <QRCodeSVG
                value={profileUrl}
                size={400}
                level="H"
                fgColor={qrColors[qrColor]}
                bgColor={qrBgColors[qrColor]}
              />
            </div>
            <div style={{ marginTop: '32px' }}>
              <p style={{ fontSize: '36px', fontWeight: 600, color: 'rgb(255, 255, 255)', marginBottom: '8px' }}>
                Scan to Follow
              </p>
              <p style={{ fontSize: '30px', color: 'rgb(191, 219, 254)' }}>
                Join me on Sofin
              </p>
            </div>
          </div>

          {/* Branding */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'rgb(255, 255, 255)', marginBottom: '8px' }}>
              Sofin
            </div>
            <div style={{ fontSize: '30px', color: 'rgb(191, 219, 254)' }}>
              Track Every Mile
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={isExporting}
        className="w-full px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-wait transition-all transform"
        style={{ backgroundColor: '#2563EB' }}
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
