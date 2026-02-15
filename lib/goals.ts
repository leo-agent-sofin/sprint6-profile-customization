// Goal tracking system for cycling app
import { rides } from './rides';

export interface WeeklyGoal {
  targetKm: number;
  currentKm: number;
  weekStart: string; // YYYY-MM-DD
  weekEnd: string;
}

export interface MonthlyStats {
  month: string; // YYYY-MM
  totalDistance: number;
  totalRides: number;
  totalElevation: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  tier: 'bronze' | 'silver' | 'gold';
  unlocked: boolean;
  unlockedDate?: string;
}

const GOALS_KEY = 'weeklyGoal';
const MONTHLY_STATS_KEY = 'monthlyStats';
const BADGES_KEY = 'earnedBadges';

export const badges: Badge[] = [
  { id: 'bronze-100', name: 'Century Starter', description: 'Ride 100km in a month', tier: 'bronze', unlocked: false },
  { id: 'bronze-5-rides', name: 'Regular Rider', description: 'Complete 5 rides in a month', tier: 'bronze', unlocked: false },
  { id: 'silver-250', name: 'Distance Demon', description: 'Ride 250km in a month', tier: 'silver', unlocked: false },
  { id: 'silver-10-rides', name: 'Dedicated Cyclist', description: 'Complete 10 rides in a month', tier: 'silver', unlocked: false },
  { id: 'gold-500', name: 'Century Master', description: 'Ride 500km in a month', tier: 'gold', unlocked: false },
  { id: 'gold-20-rides', name: 'Legend', description: 'Complete 20 rides in a month', tier: 'gold', unlocked: false }
];

export const goals = {
  // Weekly Goal
  getWeeklyGoal: (): WeeklyGoal => {
    if (typeof window === 'undefined') {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      return {
        targetKm: 50,
        currentKm: 0,
        weekStart: startOfWeek.toISOString().split('T')[0],
        weekEnd: new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
    }
    
    const data = localStorage.getItem(GOALS_KEY);
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const weekStart = startOfWeek.toISOString().split('T')[0];
    const weekEnd = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    if (data) {
      const saved: WeeklyGoal = JSON.parse(data);
      // Check if it's a new week
      if (saved.weekStart !== weekStart) {
        return {
          targetKm: saved.targetKm,
          currentKm: 0,
          weekStart,
          weekEnd
        };
      }
      // Recalculate current progress from rides
      const weekRides = rides.getAll().filter(r => r.date >= weekStart && r.date <= weekEnd);
      const currentKm = weekRides.reduce((sum, r) => sum + r.distance, 0);
      return { ...saved, currentKm };
    }
    
    return {
      targetKm: 50,
      currentKm: 0,
      weekStart,
      weekEnd
    };
  },

  setWeeklyGoal: (targetKm: number): void => {
    const current = goals.getWeeklyGoal();
    const updated = { ...current, targetKm };
    localStorage.setItem(GOALS_KEY, JSON.stringify(updated));
  },

  // Calculate current week progress
  getCurrentProgress: (): number => {
    const goal = goals.getWeeklyGoal();
    return (goal.currentKm / goal.targetKm) * 100;
  },

  // Monthly Stats
  getMonthlyStats: (): MonthlyStats => {
    if (typeof window === 'undefined') return { month: '', totalDistance: 0, totalRides: 0, totalElevation: 0 };
    
    const data = localStorage.getItem(MONTHLY_STATS_KEY);
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    
    if (data) {
      const saved = JSON.parse(data);
      if (saved.month === currentMonth) {
        return saved;
      }
    }
    
    // Recalculate from rides
    const monthRides = rides.getAll().filter(r => r.date.startsWith(currentMonth + '-'));
    return {
      month: currentMonth,
      totalDistance: monthRides.reduce((sum, r) => sum + r.distance, 0),
      totalRides: monthRides.length,
      totalElevation: monthRides.reduce((sum, r) => sum + r.elevationGain, 0)
    };
  },

  // Badges
  getBadges: (): Badge[] => {
    if (typeof window === 'undefined') return badges;
    const data = localStorage.getItem(BADGES_KEY);
    if (!data) return badges;
    return JSON.parse(data);
  },

  checkAndUnlockBadges: (): string[] => {
    const allBadges = goals.getBadges();
    const monthlyStats = goals.getMonthlyStats();
    const newlyUnlocked: string[] = [];
    
    const updateBadge = (badgeId: string, condition: boolean) => {
      const badge = allBadges.find(b => b.id === badgeId);
      if (badge && !badge.unlocked && condition) {
        badge.unlocked = true;
        badge.unlockedDate = new Date().toISOString();
        newlyUnlocked.push(badgeId);
      }
    };

    // Bronze badges
    updateBadge('bronze-100', monthlyStats.totalDistance >= 100);
    updateBadge('bronze-5-rides', monthlyStats.totalRides >= 5);
    
    // Silver badges
    updateBadge('silver-250', monthlyStats.totalDistance >= 250);
    updateBadge('silver-10-rides', monthlyStats.totalRides >= 10);
    
    // Gold badges
    updateBadge('gold-500', monthlyStats.totalDistance >= 500);
    updateBadge('gold-20-rides', monthlyStats.totalRides >= 20);
    
    if (newlyUnlocked.length > 0) {
      localStorage.setItem(BADGES_KEY, JSON.stringify(allBadges));
    }
    
    return newlyUnlocked;
  },

  // Check if goal reached
  checkGoalReached: (): boolean => {
    const goal = goals.getWeeklyGoal();
    return goal.currentKm >= goal.targetKm;
  }
};
