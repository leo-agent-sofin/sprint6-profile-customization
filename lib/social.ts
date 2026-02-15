// Social features: feed activities, following, kudos
export interface FeedActivity {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  date: string; // ISO timestamp
  ride: {
    distance: number;
    elevation: number;
    duration: number;
    avgSpeed: number;
  };
  kudos: string[]; // Array of user IDs who gave kudos
  comments: string[];
}

const FEED_KEY = 'feedActivities';
const FOLLOWING_KEY = 'following';
const CURRENT_USER_ID = 'current-user';

// Mock cyclists for demo
const MOCK_CYCLISTS = [
  { id: 'cyclist-1', name: 'Emma Rodriguez', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
  { id: 'cyclist-2', name: 'Jake Thompson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jake' },
  { id: 'cyclist-3', name: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { id: 'cyclist-4', name: 'Marcus Williams', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus' },
  { id: 'cyclist-5', name: 'Olivia Park', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia' },
  { id: 'cyclist-6', name: 'David Kumar', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
  { id: 'cyclist-7', name: 'Sophie Miller', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie' },
  { id: 'cyclist-8', name: 'Alex Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' }
];

export const social = {
  // Initialize mock data if not exists
  initializeMockData: (): void => {
    if (typeof window === 'undefined') return;
    
    const existing = localStorage.getItem(FEED_KEY);
    if (!existing) {
      const mockActivities: FeedActivity[] = [];
      const now = new Date();
      
      // Generate 8-12 mock rides over the past 7 days
      for (let i = 0; i < 10; i++) {
        const daysAgo = Math.floor(Math.random() * 7);
        const hoursAgo = Math.floor(Math.random() * 24);
        const date = new Date(now);
        date.setDate(date.getDate() - daysAgo);
        date.setHours(date.getHours() - hoursAgo);
        
        const cyclist = MOCK_CYCLISTS[i % MOCK_CYCLISTS.length];
        const distance = 15 + Math.random() * 80; // 15-95 km
        const elevation = Math.floor(Math.random() * 1200); // 0-1200m
        const duration = 30 + Math.random() * 200; // 30-230 min
        const avgSpeed = distance / (duration / 60);
        
        mockActivities.push({
          id: `activity-${i}-${Date.now()}`,
          userId: cyclist.id,
          userName: cyclist.name,
          userAvatar: cyclist.avatar,
          date: date.toISOString(),
          ride: {
            distance: Math.round(distance * 10) / 10,
            elevation: Math.floor(elevation),
            duration: Math.round(duration),
            avgSpeed: Math.round(avgSpeed * 10) / 10
          },
          kudos: [],
          comments: []
        });
      }
      
      // Sort by date (most recent first)
      mockActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      localStorage.setItem(FEED_KEY, JSON.stringify(mockActivities));
    }
  },

  // Get all feed activities
  getFeed: (): FeedActivity[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(FEED_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Save feed activities
  saveFeed: (activities: FeedActivity[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(FEED_KEY, JSON.stringify(activities));
  },

  // Add activity to feed (when user logs a ride)
  addActivity: (userName: string, userAvatar: string, ride: FeedActivity['ride']): void => {
    const activities = social.getFeed();
    const newActivity: FeedActivity = {
      id: `activity-${Date.now()}`,
      userId: CURRENT_USER_ID,
      userName,
      userAvatar,
      date: new Date().toISOString(),
      ride,
      kudos: [],
      comments: []
    };
    activities.unshift(newActivity); // Add to beginning
    social.saveFeed(activities);
  },

  // Toggle kudos on an activity
  toggleKudos: (activityId: string): boolean => {
    const activities = social.getFeed();
    const activity = activities.find(a => a.id === activityId);
    
    if (!activity) return false;
    
    const userIndex = activity.kudos.indexOf(CURRENT_USER_ID);
    
    if (userIndex >= 0) {
      // Remove kudos
      activity.kudos.splice(userIndex, 1);
    } else {
      // Add kudos
      activity.kudos.push(CURRENT_USER_ID);
    }
    
    social.saveFeed(activities);
    return userIndex < 0; // Return true if kudos was added
  },

  // Check if current user gave kudos
  hasKudos: (activityId: string): boolean => {
    const activities = social.getFeed();
    const activity = activities.find(a => a.id === activityId);
    return activity ? activity.kudos.includes(CURRENT_USER_ID) : false;
  },

  // Get following list
  getFollowing: (): string[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(FOLLOWING_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Save following list
  saveFollowing: (following: string[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(FOLLOWING_KEY, JSON.stringify(following));
  },

  // Toggle follow/unfollow
  toggleFollow: (userId: string): boolean => {
    const following = social.getFollowing();
    const index = following.indexOf(userId);
    
    if (index >= 0) {
      // Unfollow
      following.splice(index, 1);
    } else {
      // Follow
      following.push(userId);
    }
    
    social.saveFollowing(following);
    return index < 0; // Return true if now following
  },

  // Check if following user
  isFollowing: (userId: string): boolean => {
    const following = social.getFollowing();
    return following.includes(userId);
  },

  // Get filtered feed (only followed users + own activities)
  getFilteredFeed: (): FeedActivity[] => {
    const allActivities = social.getFeed();
    const following = social.getFollowing();
    
    return allActivities.filter(activity => 
      activity.userId === CURRENT_USER_ID || following.includes(activity.userId)
    );
  },

  // Get user's activities
  getUserActivities: (userId: string, limit?: number): FeedActivity[] => {
    const activities = social.getFeed();
    const userActivities = activities.filter(a => a.userId === userId);
    return limit ? userActivities.slice(0, limit) : userActivities;
  },

  // Format time ago
  formatTimeAgo: (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  },

  // Get mock cyclists
  getMockCyclists: () => MOCK_CYCLISTS,

  getCurrentUserId: () => CURRENT_USER_ID
};
