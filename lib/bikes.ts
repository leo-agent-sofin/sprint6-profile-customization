// Bike and component tracking system
export type BikeType = 'road' | 'mtb' | 'gravel' | 'cx' | 'tt' | 'urban';

export interface Bike {
  id: string;
  name: string;
  type: BikeType;
  brand: string;
  model: string;
  color: string;
  weightKg?: number;
  photo?: string;
  totalKm: number;
  addedAt: string;
}

export type ComponentType = 'chain' | 'cassette' | 'tires' | 'brakePads' | 'bottomBracket';

export interface Component {
  id: string;
  bikeId: string;
  type: ComponentType;
  name: string;
  installDate: string;
  installKm: number;
  expectedLifeKm: number;
  currentWearPercent: number;
}

const BIKES_KEY = 'sofin_bikes';
const COMPONENTS_KEY = 'sofin_components';

// Default service intervals
export const SERVICE_INTERVALS: { [key in ComponentType]: number } = {
  chain: 3000,
  cassette: 8000,
  tires: 5000,
  brakePads: 4000,
  bottomBracket: 10000
};

export const COMPONENT_NAMES: { [key in ComponentType]: string } = {
  chain: 'Chain',
  cassette: 'Cassette',
  tires: 'Tires',
  brakePads: 'Brake Pads',
  bottomBracket: 'Bottom Bracket'
};

export const bikes = {
  // Get all bikes
  getAll: (): Bike[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(BIKES_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Get bike by ID
  getById: (id: string): Bike | null => {
    return bikes.getAll().find(b => b.id === id) || null;
  },

  // Add new bike
  add: (bike: Omit<Bike, 'id' | 'totalKm' | 'addedAt'>): Bike => {
    const newBike: Bike = {
      ...bike,
      id: Date.now().toString(),
      totalKm: 0,
      addedAt: new Date().toISOString()
    };

    const all = bikes.getAll();
    all.push(newBike);
    localStorage.setItem(BIKES_KEY, JSON.stringify(all));
    return newBike;
  },

  // Update bike mileage
  addMileage: (bikeId: string, km: number): void => {
    const all = bikes.getAll();
    const bike = all.find(b => b.id === bikeId);
    if (bike) {
      bike.totalKm += km;
      localStorage.setItem(BIKES_KEY, JSON.stringify(all));
    }
  },

  // Delete bike
  delete: (id: string): void => {
    const all = bikes.getAll().filter(b => b.id !== id);
    localStorage.setItem(BIKES_KEY, JSON.stringify(all));
    // Also delete components
    const allComponents = JSON.parse(localStorage.getItem(COMPONENTS_KEY) || '[]');
    const filtered = allComponents.filter((c: Component) => c.bikeId !== id);
    localStorage.setItem(COMPONENTS_KEY, JSON.stringify(filtered));
  }
};

export const components = {
  // Get all components
  getAll: (): Component[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(COMPONENTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Get components for a bike
  getForBike: (bikeId: string): Component[] => {
    return components.getAll().filter(c => c.bikeId === bikeId);
  },

  // Add component
  add: (bikeId: string, type: ComponentType, name: string): Component => {
    const bike = bikes.getById(bikeId);
    const installKm = bike?.totalKm || 0;
    
    const newComponent: Component = {
      id: Date.now().toString(),
      bikeId,
      type,
      name,
      installDate: new Date().toISOString(),
      installKm,
      expectedLifeKm: SERVICE_INTERVALS[type],
      currentWearPercent: 0
    };

    const all = components.getAll();
    all.push(newComponent);
    localStorage.setItem(COMPONENTS_KEY, JSON.stringify(all));
    return newComponent;
  },

  // Update wear based on bike mileage
  updateWear: (bikeId: string, currentBikeKm: number): void => {
    const all = components.getAll();
    let updated = false;

    all.forEach(c => {
      if (c.bikeId === bikeId) {
        const kmSinceInstall = currentBikeKm - c.installKm;
        c.currentWearPercent = Math.min((kmSinceInstall / c.expectedLifeKm) * 100, 100);
        updated = true;
      }
    });

    if (updated) {
      localStorage.setItem(COMPONENTS_KEY, JSON.stringify(all));
    }
  },

  // Get service alerts (components over 75% wear)
  getAlerts: (): { component: Component; bike: Bike }[] => {
    const alerts: { component: Component; bike: Bike }[] = [];
    
    components.getAll().forEach(c => {
      if (c.currentWearPercent >= 75) {
        const bike = bikes.getById(c.bikeId);
        if (bike) {
          alerts.push({ component: c, bike });
        }
      }
    });

    return alerts;
  },

  // Replace component (reset wear)
  replace: (componentId: string): void => {
    const all = components.getAll();
    const comp = all.find(c => c.id === componentId);
    if (comp) {
      const bike = bikes.getById(comp.bikeId);
      comp.installDate = new Date().toISOString();
      comp.installKm = bike?.totalKm || 0;
      comp.currentWearPercent = 0;
      localStorage.setItem(COMPONENTS_KEY, JSON.stringify(all));
    }
  }
};
