// Cycling ride management
export interface Ride {
  id: string;
  date: string; // YYYY-MM-DD
  distance: number; // km
  elevationGain: number; // meters
  duration: number; // minutes
  avgSpeed: number; // km/h
}

const RIDES_KEY = 'rides';

export const rides = {
  // Get all rides
  getAll: (): Ride[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(RIDES_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Save all rides
  saveAll: (rides: Ride[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(RIDES_KEY, JSON.stringify(rides));
  },

  // Add a new ride
  add: (distance: number, elevationGain: number, duration: number): Ride => {
    const avgSpeed = duration > 0 ? (distance / (duration / 60)) : 0;
    
    const ride: Ride = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      distance,
      elevationGain,
      duration,
      avgSpeed: Math.round(avgSpeed * 10) / 10 // Round to 1 decimal
    };

    const allRides = rides.getAll();
    allRides.unshift(ride); // Add to beginning
    rides.saveAll(allRides);
    
    return ride;
  },

  // Get rides for a specific date
  getByDate: (date: string): Ride[] => {
    const allRides = rides.getAll();
    return allRides.filter(ride => ride.date === date);
  },

  // Get total statistics
  getTotals: () => {
    const allRides = rides.getAll();
    
    const totalDistance = allRides.reduce((sum, ride) => sum + ride.distance, 0);
    const totalElevation = allRides.reduce((sum, ride) => sum + ride.elevationGain, 0);
    const totalDuration = allRides.reduce((sum, ride) => sum + ride.duration, 0);
    const totalRides = allRides.length;
    
    const avgSpeed = totalRides > 0 && totalDuration > 0
      ? totalDistance / (totalDuration / 60)
      : 0;

    return {
      totalRides,
      totalDistance: Math.round(totalDistance * 10) / 10,
      totalElevation: Math.round(totalElevation),
      totalDuration: Math.round(totalDuration),
      avgSpeed: Math.round(avgSpeed * 10) / 10
    };
  },

  // Get last 7 days with ride data
  getLastWeek: (): { date: string; rides: Ride[]; totalDistance: number }[] => {
    const allRides = rides.getAll();
    const result = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      
      const dayRides = allRides.filter(ride => ride.date === dateKey);
      const totalDistance = dayRides.reduce((sum, ride) => sum + ride.distance, 0);
      
      result.push({
        date: dateKey,
        rides: dayRides,
        totalDistance
      });
    }
    
    return result;
  },

  // Format duration for display
  formatDuration: (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }
};
