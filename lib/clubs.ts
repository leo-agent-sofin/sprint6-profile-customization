// Club management system
import { storage } from './storage';

export type ClubTag = 'road' | 'mtb' | 'gravel' | 'cx';

export interface Club {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  tags: ClubTag[];
  adminUsername: string;
  createdAt: string;
  challenge?: {
    goalKm: number;
    currentKm: number;
    startDate: string;
    endDate: string;
  };
}

export interface ClubMembership {
  clubId: string;
  username: string;
  role: 'admin' | 'member';
  joinedAt: string;
}

const CLUBS_KEY = 'sofin_clubs';
const MEMBERS_KEY = 'sofin_club_members';

export const clubs = {
  // Get all clubs
  getAll: (): Club[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(CLUBS_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Get club by slug
  getBySlug: (slug: string): Club | null => {
    const all = clubs.getAll();
    return all.find(c => c.slug === slug) || null;
  },

  // Create new club
  create: (name: string, description: string, location: string, tags: ClubTag[], adminUsername: string): Club => {
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const club: Club = {
      id: Date.now().toString(),
      name,
      slug,
      description,
      location,
      tags,
      adminUsername,
      createdAt: new Date().toISOString()
    };

    const all = clubs.getAll();
    all.push(club);
    localStorage.setItem(CLUBS_KEY, JSON.stringify(all));

    // Auto-add admin as member
    clubs.joinClub(club.id, adminUsername, 'admin');

    return club;
  },

  // Get members of a club
  getMembers: (clubId: string): ClubMembership[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(MEMBERS_KEY);
    const members = data ? JSON.parse(data) : [];
    return members.filter((m: ClubMembership) => m.clubId === clubId);
  },

  // Get member count
  getMemberCount: (clubId: string): number => {
    return clubs.getMembers(clubId).length;
  },

  // Join club
  joinClub: (clubId: string, username: string, role: 'admin' | 'member' = 'member'): boolean => {
    if (typeof window === 'undefined') return false;
    
    const data = localStorage.getItem(MEMBERS_KEY);
    const allMembers: ClubMembership[] = data ? JSON.parse(data) : [];
    
    // Check if already member
    if (allMembers.some(m => m.clubId === clubId && m.username === username)) {
      return false;
    }

    allMembers.push({
      clubId,
      username,
      role,
      joinedAt: new Date().toISOString()
    });

    localStorage.setItem(MEMBERS_KEY, JSON.stringify(allMembers));
    return true;
  },

  // Leave club
  leaveClub: (clubId: string, username: string): boolean => {
    if (typeof window === 'undefined') return false;
    
    const data = localStorage.getItem(MEMBERS_KEY);
    const allMembers: ClubMembership[] = data ? JSON.parse(data) : [];
    
    const filtered = allMembers.filter(m => !(m.clubId === clubId && m.username === username));
    
    if (filtered.length === allMembers.length) return false;
    
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(filtered));
    return true;
  },

  // Check if user is member
  isMember: (clubId: string, username: string): boolean => {
    return clubs.getMembers(clubId).some(m => m.username === username);
  },

  // Get user's clubs
  getUserClubs: (username: string): Club[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(MEMBERS_KEY);
    const members: ClubMembership[] = data ? JSON.parse(data) : [];
    const userClubIds = members.filter(m => m.username === username).map(m => m.clubId);
    return clubs.getAll().filter(c => userClubIds.includes(c.id));
  },

  // Create or update challenge
  setChallenge: (clubId: string, goalKm: number, days: number): Club | null => {
    const all = clubs.getAll();
    const club = all.find(c => c.id === clubId);
    if (!club) return null;

    const startDate = new Date().toISOString();
    const endDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

    club.challenge = {
      goalKm,
      currentKm: 0,
      startDate,
      endDate
    };

    localStorage.setItem(CLUBS_KEY, JSON.stringify(all));
    return club;
  },

  // Update challenge progress
  updateChallengeProgress: (clubId: string, additionalKm: number): void => {
    const all = clubs.getAll();
    const club = all.find(c => c.id === clubId);
    if (club?.challenge) {
      club.challenge.currentKm += additionalKm;
      localStorage.setItem(CLUBS_KEY, JSON.stringify(all));
    }
  },

  // Get leaderboard (mock data - in real app would aggregate rides)
  getLeaderboard: (clubId: string) => {
    const members = clubs.getMembers(clubId);
    return members.map(m => ({
      username: m.username,
      role: m.role,
      weeklyKm: Math.random() * 100 + 20, // Mock data
      monthlyKm: Math.random() * 300 + 50 // Mock data
    })).sort((a, b) => b.weeklyKm - a.weeklyKm);
  }
};
