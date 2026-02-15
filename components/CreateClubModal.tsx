'use client';

import { useState } from 'react';
import { clubs, ClubTag } from '@/lib/clubs';

interface CreateClubModalProps {
  username: string;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateClubModal({ username, onClose, onCreated }: CreateClubModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [selectedTags, setSelectedTags] = useState<ClubTag[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableTags: { tag: ClubTag; label: string; emoji: string }[] = [
    { tag: 'road', label: 'Road', emoji: '🛣️' },
    { tag: 'mtb', label: 'Mountain', emoji: '🏔️' },
    { tag: 'gravel', label: 'Gravel', emoji: '🪨' },
    { tag: 'cx', label: 'Cyclocross', emoji: '🚴' }
  ];

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim() || name.length < 3) {
      newErrors.name = 'Club name must be at least 3 characters';
    }
    if (!description.trim() || description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    if (selectedTags.length === 0) {
      newErrors.tags = 'Select at least one ride style';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    setTimeout(() => {
      clubs.create(name, description, location, selectedTags, username);
      setIsSubmitting(false);
      onCreated();
    }, 300);
  };

  const toggleTag = (tag: ClubTag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setErrors({ ...errors, tags: '' });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">🚴 Create Cycling Club</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Club Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Club Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors({ ...errors, name: '' });
              }}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="e.g., Berlin Road Warriors"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors({ ...errors, description: '' });
              }}
              rows={3}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="What makes your club special?"
            />
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location (optional)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Berlin, Germany"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ride Style *
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(({ tag, label, emoji }) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full border-2 font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400'
                  }`}
                >
                  <span className="mr-1">{emoji}</span>
                  {label}
                </button>
              ))}
            </div>
            {errors.tags && <p className="mt-1 text-sm text-red-500">{errors.tags}</p>}
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Creating...' : 'Create Club'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
