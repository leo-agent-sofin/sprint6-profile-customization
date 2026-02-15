// Activity logging utilities
export type Activities = Record<string, boolean>;

const ACTIVITIES_KEY = 'activities';

export const activities = {
  // Get all activities
  getAll: (): Activities => {
    if (typeof window === 'undefined') return {};
    const data = localStorage.getItem(ACTIVITIES_KEY);
    return data ? JSON.parse(data) : {};
  },

  // Save activities
  saveAll: (activities: Activities): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
  },

  // Log activity for today
  logToday: (): boolean => {
    const today = activities.getTodayKey();
    const allActivities = activities.getAll();
    
    // Check if already logged
    if (allActivities[today]) {
      return false; // Already logged
    }

    // Log today
    allActivities[today] = true;
    activities.saveAll(allActivities);
    return true; // Successfully logged
  },

  // Check if today is logged
  isTodayLogged: (): boolean => {
    const today = activities.getTodayKey();
    const allActivities = activities.getAll();
    return allActivities[today] === true;
  },

  // Get today's key (YYYY-MM-DD format)
  getTodayKey: (): string => {
    const date = new Date();
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  },

  // Get activity count
  getCount: (): number => {
    const allActivities = activities.getAll();
    return Object.keys(allActivities).length;
  },

  // Get current streak
  getStreak: (): number => {
    const allActivities = activities.getAll();
    const dates = Object.keys(allActivities).sort().reverse();
    
    if (dates.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    
    // Check from today backwards
    for (let i = 0; i < 365; i++) { // Max check 1 year
      const dateKey = currentDate.toISOString().split('T')[0];
      
      if (allActivities[dateKey]) {
        streak++;
      } else if (i > 0) {
        // If we've started counting and hit a gap, stop
        break;
      }
      
      // Move to previous day
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  },

  // Get last 7 days activity
  getLastWeek: (): { date: string; logged: boolean }[] => {
    const allActivities = activities.getAll();
    const result = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      
      result.push({
        date: dateKey,
        logged: allActivities[dateKey] === true
      });
    }
    
    return result;
  }
};
