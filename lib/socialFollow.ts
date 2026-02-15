// Social following system
import { storage } from './storage';

export interface FollowRelationship {
  followerUsername: string;
  followingUsername: string;
  followedAt: string;
}

const FOLLOWS_KEY = 'sofin_follows';

export const socialFollow = {
  // Get all follow relationships
  getAll: (): FollowRelationship[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(FOLLOWS_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Follow a user
  follow: (followerUsername: string, followingUsername: string): boolean => {
    if (followerUsername === followingUsername) return false;
    
    const follows = socialFollow.getAll();
    const exists = follows.some(
      f => f.followerUsername === followerUsername && f.followingUsername === followingUsername
    );
    
    if (exists) return false;
    
    follows.push({
      followerUsername,
      followingUsername,
      followedAt: new Date().toISOString()
    });
    
    localStorage.setItem(FOLLOWS_KEY, JSON.stringify(follows));
    return true;
  },

  // Unfollow a user
  unfollow: (followerUsername: string, followingUsername: string): boolean => {
    const follows = socialFollow.getAll();
    const filtered = follows.filter(
      f => !(f.followerUsername === followerUsername && f.followingUsername === followingUsername)
    );
    
    if (filtered.length === follows.length) return false;
    
    localStorage.setItem(FOLLOWS_KEY, JSON.stringify(filtered));
    return true;
  },

  // Check if following
  isFollowing: (followerUsername: string, followingUsername: string): boolean => {
    return socialFollow.getAll().some(
      f => f.followerUsername === followerUsername && f.followingUsername === followingUsername
    );
  },

  // Get users someone is following
  getFollowing: (username: string): string[] => {
    return socialFollow.getAll()
      .filter(f => f.followerUsername === username)
      .map(f => f.followingUsername);
  },

  // Get followers of a user
  getFollowers: (username: string): string[] => {
    return socialFollow.getAll()
      .filter(f => f.followingUsername === username)
      .map(f => f.followerUsername);
  },

  // Get follower count
  getFollowerCount: (username: string): number => {
    return socialFollow.getFollowers(username).length;
  },

  // Get following count
  getFollowingCount: (username: string): number => {
    return socialFollow.getFollowing(username).length;
  },

  // Search users (mock - in real app would search backend)
  searchUsers: (query: string): string[] => {
    if (!query || query.length < 2) return [];
    
    // Get all unique usernames from follows
    const follows = socialFollow.getAll();
    const allUsernames = new Set<string>();
    follows.forEach(f => {
      allUsernames.add(f.followerUsername);
      allUsernames.add(f.followingUsername);
    });
    
    // Add current user profile
    const profile = storage.getProfile();
    if (profile?.name) allUsernames.add(profile.name);
    
    // Filter by query
    return Array.from(allUsernames).filter(
      username => username.toLowerCase().includes(query.toLowerCase())
    );
  }
};
