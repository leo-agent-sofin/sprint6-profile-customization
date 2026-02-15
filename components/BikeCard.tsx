'use client';

import Link from 'next/link';
import { Bike, bikes, components } from '@/lib/bikes';

interface BikeCardProps {
  bike: Bike;
  onDelete?: (id: string) => void;
}

export default function BikeCard({ bike, onDelete }: BikeCardProps) {
  const bikeComponents = components.getForBike(bike.id);
  const alerts = bikeComponents.filter(c => c.currentWearPercent >= 75);
  
  const typeEmojis: { [key: string]: string } = {
    road: '🛣️',
    mtb: '🏔️',
    gravel: '🪨',
    cx: '🚴',
    tt: '⏱️',
    urban: '🏙️'
  };

  const typeLabels: { [key: string]: string } = {
    road: 'Road',
    mtb: 'Mountain',
    gravel: 'Gravel',
    cx: 'Cyclocross',
    tt: 'Time Trial',
    urban: 'Urban'
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
      {/* Photo */}
      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative">
        {bike.photo ? (
          <img src={bike.photo} alt={bike.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🚴
          </div>
        )}
        {alerts.length > 0 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
            ⚠️ {alerts.length} Service Alert{alerts.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{bike.name}</h3>
            <p className="text-gray-600">{bike.brand} {bike.model}</p>
          </div>
          <span className="text-2xl" title={typeLabels[bike.type]}>
            {typeEmojis[bike.type]}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            🎨 {bike.color}
          </span>
          {bike.weightKg && (
            <span className="flex items-center gap-1">
              ⚖️ {bike.weightKg}kg
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-blue-700">{bike.totalKm.toFixed(0)}</div>
            <div className="text-xs text-blue-600">km total</div>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-green-700">{bikeComponents.length}</div>
            <div className="text-xs text-green-600">components</div>
          </div>
        </div>

        {/* Component Wear Preview */}
        {bikeComponents.length > 0 && (
          <div className="space-y-2 mb-4">
            {bikeComponents.slice(0, 3).map(comp => (
              <div key={comp.id} className="flex items-center gap-2 text-sm">
                <span className="text-gray-600 w-24 truncate">{comp.name}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      comp.currentWearPercent >= 75 ? 'bg-red-500' :
                      comp.currentWearPercent >= 50 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${comp.currentWearPercent}%` }}
                  />
                </div>
                <span className={`text-xs font-medium w-12 text-right ${
                  comp.currentWearPercent >= 75 ? 'text-red-600' :
                  comp.currentWearPercent >= 50 ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {comp.currentWearPercent.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href={`/gear/${bike.id}`}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            Manage
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(bike.id)}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
