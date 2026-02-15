import { UserProfile, AvatarHistory } from './types';

const PROFILE_KEY = 'user_profile';
const AVATAR_HISTORY_KEY = 'avatar_history';

export const storage = {
  // Profile operations
  getProfile: (): UserProfile | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  },

  saveProfile: (profile: UserProfile): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  },

  // Avatar history operations
  getAvatarHistory: (): AvatarHistory => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(AVATAR_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveAvatarHistory: (history: AvatarHistory): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(AVATAR_HISTORY_KEY, JSON.stringify(history));
  },

  addAvatar: (url: string): void => {
    const history = storage.getAvatarHistory();
    // Mark all as not current
    history.forEach(item => item.is_current = false);
    // Add new avatar as current
    history.unshift({
      url,
      uploaded_at: new Date().toISOString(),
      is_current: true
    });
    storage.saveAvatarHistory(history);
  },

  setCurrentAvatar: (url: string): void => {
    const history = storage.getAvatarHistory();
    history.forEach(item => {
      item.is_current = item.url === url;
    });
    storage.saveAvatarHistory(history);
  }
};
