'use client';

import { useState } from 'react';
import { BikeType, bikes, SERVICE_INTERVALS, COMPONENT_NAMES } from '@/lib/bikes';

interface AddBikeModalProps {
  onClose: () => void;
  onAdded: () => void;
}

export default function AddBikeModal({ onClose, onAdded }: AddBikeModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<BikeType>('road');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bikeTypes: { type: BikeType; label: string; emoji: string }[] = [
    { type: 'road', label: 'Road', emoji: '🛣️' },
    { type: 'mtb', label: 'Mountain', emoji: '🏔️' },
    { type: 'gravel', label: 'Gravel', emoji: '🪨' },
    { type: 'cx', label: 'Cyclocross', emoji: '🚴' },
    { type: 'tt', label: 'Time Trial', emoji: '⏱️' },
    { type: 'urban', label: 'Urban', emoji: '🏙️' }
  ];

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'Bike name is required';
    if (!brand.trim()) newErrors.brand = 'Brand is required';
    if (!model.trim()) newErrors.model = 'Model is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    setTimeout(() => {
      const bike = bikes.add({
        name,
        type,
        brand,
        model,
        color,
        weightKg: weightKg ? parseFloat(weightKg) : undefined
      });

      // Add default components
      const { components } = require('@/lib/bikes');
      components.add(bike.id, 'chain', COMPONENT_NAMES.chain);
      components.add(bike.id, 'cassette', COMPONENT_NAMES.cassette);
      components.add(bike.id, 'tires', COMPONENT_NAMES.tires);
      components.add(bike.id, 'brakePads', COMPONENT_NAMES.brakePads);

      setIsSubmitting(false);
      onAdded();
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">🚴 Add New Bike</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bike Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors({ ...errors, name: '' }); }}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="e.g., My Road Bike"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bike Type</label>
            <div className="grid grid-cols-3 gap-2">
              {bikeTypes.map(({ type: t, label, emoji }) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`p-3 rounded-xl border-2 font-medium transition-all ${
                    type === t
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-blue-400'
                  }`}
                >
                  <span className="block text-xl mb-1">{emoji}</span>
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Brand & Model */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => { setBrand(e.target.value); setErrors({ ...errors, brand: '' }); }}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                  errors.brand ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="e.g., Trek"
              />
              {errors.brand && <p className="mt-1 text-sm text-red-500">{errors.brand}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
              <input
                type="text"
                value={model}
                onChange={(e) => { setModel(e.target.value); setErrors({ ...errors, model: '' }); }}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                  errors.model ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="e.g., Domane SL6"
              />
              {errors.model && <p className="mt-1 text-sm text-red-500">{errors.model}</p>}
            </div>
          </div>

          {/* Color & Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Red"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 8.5"
              />
            </div>
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
              {isSubmitting ? 'Adding...' : 'Add Bike'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
