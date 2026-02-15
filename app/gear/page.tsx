'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bike, bikes, components } from '@/lib/bikes';
import BikeCard from '@/components/BikeCard';
import AddBikeModal from '@/components/AddBikeModal';

export default function GearPage() {
  const [bikeList, setBikeList] = useState<Bike[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [serviceAlerts, setServiceAlerts] = useState<{ component: any; bike: Bike }[]>([]);

  useEffect(() => {
    setBikeList(bikes.getAll());
    setServiceAlerts(components.getAlerts());
  }, []);

  const refreshBikes = () => {
    setBikeList(bikes.getAll());
    setServiceAlerts(components.getAlerts());
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this bike?')) {
      bikes.delete(id);
      refreshBikes();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 md:py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">🔧 My Garage</h1>
            <p className="text-lg text-gray-600">Manage your bikes and track component wear</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transition-all"
          >
            + Add Bike
          </button>
        </div>

        {/* Service Alerts */}
        {serviceAlerts.length > 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
              ⚠️ Service Alerts ({serviceAlerts.length})
            </h2>
            <div className="space-y-3">
              {serviceAlerts.map(({ component, bike }) => (
                <div key={component.id} className="flex items-center justify-between bg-white rounded-xl p-4">
                  <div>
                    <span className="font-semibold text-gray-900">{bike.name}</span>
                    <span className="text-gray-500 mx-2">→</span>
                    <span className="text-red-600 font-medium">{component.name}</span>
                    <span className="text-gray-500 ml-2">({component.currentWearPercent.toFixed(0)}% wear)</span>
                  </div>
                  <Link
                    href={`/gear/${bike.id}`}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Service Now
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bikes Grid */}
        {bikeList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bikeList.map(bike => (
              <BikeCard key={bike.id} bike={bike} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="text-6xl mb-4">🚴</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Bikes Yet</h3>
            <p className="text-gray-600 mb-6">Add your first bike to start tracking components and service intervals.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold"
            >
              Add Your First Bike
            </button>
          </div>
        )}
      </div>

      {/* Add Bike Modal */}
      {showAddModal && (
        <AddBikeModal
          onClose={() => setShowAddModal(false)}
          onAdded={refreshBikes}
        />
      )}
    </div>
  );
}
