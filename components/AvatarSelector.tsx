'use client';

import { useState, useEffect } from 'react';
import { AvatarHistory } from '@/lib/types';
import { storage } from '@/lib/storage';

interface AvatarSelectorProps {
  currentAvatar: string;
  onSelect: (url: string) => void;
}

const DEFAULT_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Robot1',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Robot2',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Pixel1',
];

export default function AvatarSelector({ currentAvatar, onSelect }: AvatarSelectorProps) {
  const [history, setHistory] = useState<AvatarHistory>([]);
  const [customUrl, setCustomUrl] = useState('');

  useEffect(() => {
    setHistory(storage.getAvatarHistory());
  }, []);

  const handleSelect = (url: string) => {
    storage.setCurrentAvatar(url);
    onSelect(url);
    setHistory(storage.getAvatarHistory());
  };

  const handleCustomUrl = () => {
    if (customUrl.trim()) {
      storage.addAvatar(customUrl);
      handleSelect(customUrl);
      setCustomUrl('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Avatar */}
      <div className="flex items-center gap-4">
        <img 
          src={currentAvatar} 
          alt="Current avatar" 
          className="w-24 h-24 rounded-full border-4 border-blue-500"
        />
        <div>
          <h3 className="font-semibold text-lg">Current Avatar</h3>
          <p className="text-sm text-gray-600">Select from history or defaults</p>
        </div>
      </div>

      {/* Avatar History */}
      {history.length > 0 && (
        <div>
          <h4 className="font-medium mb-3">Your Uploads</h4>
          <div className="grid grid-cols-4 gap-3">
            {history.map((item, index) => (
              <button
                key={index}
                onClick={() => handleSelect(item.url)}
                className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                  item.url === currentAvatar 
                    ? 'border-blue-500 ring-2 ring-blue-300' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <img 
                  src={item.url} 
                  alt={`Avatar ${index + 1}`} 
                  className="w-full aspect-square object-cover"
                />
                {item.is_current && (
                  <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Default Avatars */}
      <div>
        <h4 className="font-medium mb-3">Default Avatars</h4>
        <div className="grid grid-cols-4 gap-3">
          {DEFAULT_AVATARS.map((url, index) => (
            <button
              key={index}
              onClick={() => handleSelect(url)}
              className={`rounded-lg overflow-hidden border-2 transition-all ${
                url === currentAvatar 
                  ? 'border-blue-500 ring-2 ring-blue-300' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <img 
                src={url} 
                alt={`Default avatar ${index + 1}`} 
                className="w-full aspect-square"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Custom URL */}
      <div>
        <h4 className="font-medium mb-3">Custom Avatar URL</h4>
        <div className="flex gap-2">
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCustomUrl}
            disabled={!customUrl.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
