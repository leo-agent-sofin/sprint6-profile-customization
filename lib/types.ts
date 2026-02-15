// Profile types and schema
export interface UserProfile {
  name: string;
  bio: string;
  avatar_url: string;
  updated_at: string;
}

export interface AvatarHistoryItem {
  url: string;
  uploaded_at: string;
  is_current: boolean;
}

export type AvatarHistory = AvatarHistoryItem[];
