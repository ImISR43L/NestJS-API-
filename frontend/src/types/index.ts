// This file will hold all shared type definitions for your application.

export interface User {
  id: string;
  email: string;
  username: string;
  gold: number;
  gems: number;
  createdAt: string;
  updatedAt: string;
}

// --- Enums (can be shared by Habits, Dailies, etc.) ---
export enum Difficulty {
  TRIVIAL = 'TRIVIAL',
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export enum HabitType {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
  BOTH = 'BOTH',
}

export enum UserGroupRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export enum MembershipStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
}

// --- Habit Type ---
export interface Habit {
  id: string;
  userId: string;
  title: string;
  notes?: string;
  type: HabitType;
  difficulty: Difficulty;
  isPaused: boolean;
  positiveCounter: number;
  negativeCounter: number;
  createdAt: string;
  updatedAt: string;
  currentStreak: number;
  longestStreak: number;
  goldRewardLockedUntil?: string | null;
}

// --- NEW TYPE FOR DAILIES ---
export interface Daily {
  id: string;
  userId: string;
  title: string;
  notes?: string | null; // Allow notes to be null
  completed: boolean;
  difficulty: Difficulty;
  lastCompleted?: string | null;
  createdAt: string;
  updatedAt: string;
  goldRewardLockedUntil?: string | null;
}

// --- NEW TYPE FOR DAILY LOGS ---
export interface DailyLog {
  date: string;
  notes?: string | null;
}

export interface Todo {
  id: string;
  userId: string;
  title: string;
  notes?: string | null;
  dueDate?: string | null;
  completed: boolean;
  difficulty: Difficulty;
  createdAt: string;
  updatedAt: string;
}

export interface GroupMember {
  user: {
    id: string;
    username: string;
  };
  role: UserGroupRole;
  status: MembershipStatus;
}

export interface Group {
  id: string;
  name: string;
  description?: string | null;
  isPublic: boolean;
  createdAt: string;
  _count?: {
    members: number;
  };
  // The API will now return a full list of members for admins
  members?: GroupMember[];
}

export interface GroupMessage {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  user: {
    username: string;
  };
}

export interface UserGroupMembership {
  id: string;
  userId: string;
  groupId: string;
  role: UserGroupRole;
  joinedAt: string;
  group: Group;
}
