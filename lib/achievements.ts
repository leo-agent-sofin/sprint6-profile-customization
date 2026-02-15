// Personal Bests and Achievements system
import { rides, Ride } from './rides';

export interface PersonalBest {
  value: number;
  date: string;
  rideId: string;
}

export interface PersonalBests {
  longestRide: PersonalBest | null;      // km
  biggestClimb: PersonalBest | null;     // m
  longestDuration: PersonalBest | null;  // minutes
  fastestSpeed: PersonalBest | null;     // km/h
}

export interface Achievement {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  unlockedDate?: string;
}

const ACHIEVEMENTS_KEY = 'achievements';
const PB_KEY = 'personalBests';

const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'unlocked' | 'unlockedDate'>[] = [
  { id: 'first-ride', name: 'First Ride', emoji: '🚴', description: 'Completed your first ride' },
  { id: 'century', name: 'Century Rider', emoji: '💯', description: 'Completed a 100km+ ride' },
  { id: '1000km-club', name: '1000km Club', emoji: '🌟', description: 'Cycled 1000km+ total' },
  { id: 'climber', name: 'Climber', emoji: '⛰️', description: 'Climbed 1000m+ in a single ride' },
  { id: 'everesting', name: 'Everesting', emoji: '🏔️', description: 'Climbed 8848m+ total elevation' },
  { id: '7-day-streak', name: '7-Day Warrior', emoji: '🔥', description: 'Rode 7 days in a row' },
  { id: '30-day-streak', name: '30-Day Champion', emoji: '👑', description: 'Rode 30 days in a row' }
];

export const achievements = {
  // Get all achievements with unlock status
  getAll: (): Achievement[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(ACHIEVEMENTS_KEY);
    const unlocked = data ? JSON.parse(data) : {};
    
    return ACHIEVEMENT_DEFINITIONS.map(def => ({
      ...def,
      unlocked: !!unlocked[def.id],
      unlockedDate: unlocked[def.id]
    }));
  },

  // Check and unlock achievement
  unlock: (achievementId: string): boolean => {
    if (typeof window === 'undefined') return false;
    const data = localStorage.getItem(ACHIEVEMENTS_KEY);
    const unlocked = data ? JSON.parse(data) : {};
    
    if (unlocked[achievementId]) {
      return false; // Already unlocked
    }
    
    unlocked[achievementId] = new Date().toISOString();
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(unlocked));
    return true; // Newly unlocked
  },

  // Check all achievements after a ride
  checkAchievements: (): string[] => {
    const newlyUnlocked: string[] = [];
    const allRides = rides.getAll();
    const totals = rides.getTotals();
    
    // First Ride
    if (allRides.length >= 1) {
      if (achievements.unlock('first-ride')) {
        newlyUnlocked.push('first-ride');
      }
    }
    
    // Century Rider (100km+ in single ride)
    const hasCentury = allRides.some(ride => ride.distance >= 100);
    if (hasCentury) {
      if (achievements.unlock('century')) {
        newlyUnlocked.push('century');
      }
    }
    
    // 1000km Club
    if (totals.totalDistance >= 1000) {
      if (achievements.unlock('1000km-club')) {
        newlyUnlocked.push('1000km-club');
      }
    }
    
    // Climber (1000m+ in single ride)
    const hasClimber = allRides.some(ride => ride.elevationGain >= 1000);
    if (hasClimber) {
      if (achievements.unlock('climber')) {
        newlyUnlocked.push('climber');
      }
    }
    
    // Everesting (8848m+ total)
    if (totals.totalElevation >= 8848) {
      if (achievements.unlock('everesting')) {
        newlyUnlocked.push('everesting');
      }
    }
    
    // Streaks
    const streak = achievements.calculateStreak();
    if (streak >= 7) {
      if (achievements.unlock('7-day-streak')) {
        newlyUnlocked.push('7-day-streak');
      }
    }
    if (streak >= 30) {
      if (achievements.unlock('30-day-streak')) {
        newlyUnlocked.push('30-day-streak');
      }
    }
    
    return newlyUnlocked;
  },

  // Calculate current streak
  calculateStreak: (): number => {
    const allRides = rides.getAll();
    if (allRides.length === 0) return 0;
    
    // Get unique dates
    const dates = [...new Set(allRides.map(r => r.date))].sort();
    const today = new Date().toISOString().split('T')[0];
    
    let streak = 0;
    let currentDate = new Date();
    
    for (let i = 0; i < 365; i++) {
      const dateKey = currentDate.toISOString().split('T')[0];
      
      if (dates.includes(dateKey)) {
        streak++;
      } else if (i > 0) {
        break; // Streak broken
      }
      
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  },

  // Get unlocked count
  getUnlockedCount: (): number => {
    return achievements.getAll().filter(a => a.unlocked).length;
  },

  // Personal Bests
  getPersonalBests: (): PersonalBests => {
    if (typeof window === 'undefined') {
      return {
        longestRide: null,
        biggestClimb: null,
        longestDuration: null,
        fastestSpeed: null
      };
    }
    
    const data = localStorage.getItem(PB_KEY);
    return data ? JSON.parse(data) : {
      longestRide: null,
      biggestClimb: null,
      longestDuration: null,
      fastestSpeed: null
    };
  },

  savePersonalBests: (pbs: PersonalBests): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(PB_KEY, JSON.stringify(pbs));
  },

  // Calculate and update personal bests
  updatePersonalBests: (): string[] => {
    const allRides = rides.getAll();
    const currentPBs = achievements.getPersonalBests();
    const newPBs: string[] = [];
    
    if (allRides.length === 0) return newPBs;
    
    // Longest Ride
    const longestRide = allRides.reduce((max, ride) => 
      ride.distance > (max?.distance || 0) ? ride : max
    );
    if (!currentPBs.longestRide || longestRide.distance > currentPBs.longestRide.value) {
      currentPBs.longestRide = {
        value: longestRide.distance,
        date: longestRide.date,
        rideId: longestRide.id
      };
      newPBs.push('longestRide');
    }
    
    // Biggest Climb
    const biggestClimb = allRides.reduce((max, ride) => 
      ride.elevationGain > (max?.elevationGain || 0) ? ride : max
    );
    if (!currentPBs.biggestClimb || biggestClimb.elevationGain > currentPBs.biggestClimb.value) {
      currentPBs.biggestClimb = {
        value: biggestClimb.elevationGain,
        date: biggestClimb.date,
        rideId: biggestClimb.id
      };
      newPBs.push('biggestClimb');
    }
    
    // Longest Duration
    const longestDuration = allRides.reduce((max, ride) => 
      ride.duration > (max?.duration || 0) ? ride : max
    );
    if (!currentPBs.longestDuration || longestDuration.duration > currentPBs.longestDuration.value) {
      currentPBs.longestDuration = {
        value: longestDuration.duration,
        date: longestDuration.date,
        rideId: longestDuration.id
      };
      newPBs.push('longestDuration');
    }
    
    // Fastest Speed
    const fastestSpeed = allRides.reduce((max, ride) => 
      ride.avgSpeed > (max?.avgSpeed || 0) ? ride : max
    );
    if (!currentPBs.fastestSpeed || fastestSpeed.avgSpeed > currentPBs.fastestSpeed.value) {
      currentPBs.fastestSpeed = {
        value: fastestSpeed.avgSpeed,
        date: fastestSpeed.date,
        rideId: fastestSpeed.id
      };
      newPBs.push('fastestSpeed');
    }
    
    achievements.savePersonalBests(currentPBs);
    return newPBs;
  },

  // Get most active week
  getMostActiveWeek: (): { weekStart: string; totalDistance: number; rideCount: number } | null => {
    const allRides = rides.getAll();
    if (allRides.length === 0) return null;
    
    const weeklyData: { [key: string]: { distance: number; count: number } } = {};
    
    allRides.forEach(ride => {
      const date = new Date(ride.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Get Sunday of that week
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { distance: 0, count: 0 };
      }
      weeklyData[weekKey].distance += ride.distance;
      weeklyData[weekKey].count++;
    });
    
    let mostActive = { weekStart: '', totalDistance: 0, rideCount: 0 };
    
    Object.entries(weeklyData).forEach(([weekStart, data]) => {
      if (data.distance > mostActive.totalDistance) {
        mostActive = {
          weekStart,
          totalDistance: data.distance,
          rideCount: data.count
        };
      }
    });
    
    return mostActive.totalDistance > 0 ? mostActive : null;
  },

  // Get most active month
  getMostActiveMonth: (): { month: string; totalDistance: number; rideCount: number } | null => {
    const allRides = rides.getAll();
    if (allRides.length === 0) return null;
    
    const monthlyData: { [key: string]: { distance: number; count: number } } = {};
    
    allRides.forEach(ride => {
      const date = new Date(ride.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { distance: 0, count: 0 };
      }
      monthlyData[monthKey].distance += ride.distance;
      monthlyData[monthKey].count++;
    });
    
    let mostActive = { month: '', totalDistance: 0, rideCount: 0 };
    
    Object.entries(monthlyData).forEach(([month, data]) => {
      if (data.distance > mostActive.totalDistance) {
        mostActive = {
          month,
          totalDistance: data.distance,
          rideCount: data.count
        };
      }
    });
    
    return mostActive.totalDistance > 0 ? mostActive : null;
  },

  // Format PB names
  formatPBName: (key: string): string => {
    const names: { [key: string]: string } = {
      longestRide: 'Longest Ride',
      biggestClimb: 'Biggest Climb',
      longestDuration: 'Longest Duration',
      fastestSpeed: 'Fastest Speed'
    };
    return names[key] || key;
  }
};
