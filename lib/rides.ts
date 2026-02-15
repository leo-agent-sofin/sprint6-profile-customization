// Cycling ride management
export type RouteType = 'flat' | 'hilly' | 'mountain' | 'sprint';

export interface Ride {
  id: string;
  date: string; // YYYY-MM-DD
  distance: number; // km
  elevationGain: number; // meters
  duration: number; // minutes
  avgSpeed: number; // km/h
  routeType?: RouteType;
  elevationData?: number[]; // elevation points in meters for charting
}

const RIDES_KEY = 'rides';

export const rides = {
  // Get all rides
  getAll: (): Ride[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(RIDES_KEY);
    const rides = data ? JSON.parse(data) : [];
    
    // Migration: add routeType to existing rides
    const needsMigration = rides.some((r: Ride) => !r.routeType);
    if (needsMigration) {
      const migrated = rides.map((r: Ride) => {
        if (!r.routeType) {
          const elevationRatio = r.elevationGain / r.distance;
          let routeType: RouteType = 'flat';
          if (elevationRatio > 25) routeType = 'mountain';
          else if (elevationRatio > 10) routeType = 'hilly';
          else if (r.avgSpeed > 30) routeType = 'sprint';
          
          // Generate elevation data too
          const elevationData = Array.from({ length: Math.max(20, Math.floor(r.distance * 2)) }, (_, i) => {
            const progress = i / Math.max(20, Math.floor(r.distance * 2));
            return 100 + (r.elevationGain * progress) + (Math.random() - 0.5) * 20;
          });
          
          return { ...r, routeType, elevationData };
        }
        return r;
      });
      localStorage.setItem(RIDES_KEY, JSON.stringify(migrated));
      return migrated;
    }
    
    return rides;
  },

  // Save all rides
  saveAll: (rides: Ride[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(RIDES_KEY, JSON.stringify(rides));
  },

  // Generate mock elevation data for visualization
  generateElevationData: (distance: number, elevationGain: number): number[] => {
    const points = Math.max(20, Math.floor(distance * 2)); // 1 point per 0.5km
    const data: number[] = [];
    let currentElevation = 100; // Start at 100m
    
    for (let i = 0; i < points; i++) {
      const progress = i / points;
      // Add some randomness + general trend based on total elevation gain
      const trend = (elevationGain / points) * (Math.random() * 0.5 + 0.75);
      const noise = (Math.random() - 0.5) * 10;
      currentElevation += trend + noise;
      data.push(Math.max(0, Math.round(currentElevation)));
    }
    
    return data;
  },

  // Add a new ride
  add: (distance: number, elevationGain: number, duration: number): Ride => {
    const calculatedSpeed = duration > 0 ? (distance / (duration / 60)) : 0;
    const avgSpeed = Math.round(calculatedSpeed * 10) / 10;
    
    // Determine route type based on speed and elevation
    let routeType: RouteType = 'flat';
    const elevationRatio = elevationGain / distance;
    if (elevationRatio > 25) routeType = 'mountain';
    else if (elevationRatio > 10) routeType = 'hilly';
    else if (avgSpeed > 30) routeType = 'sprint';
    
    const elevationData = rides.generateElevationData(distance, elevationGain);
    
    const ride: Ride = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      distance,
      elevationGain,
      duration,
      avgSpeed,
      routeType,
      elevationData
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
