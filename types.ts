export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  attachment?: {
    data: string; // Base64
    mimeType: string;
  };
  timestamp: number;
}

export interface UserState {
  hasInteracted: boolean;
}

export enum FileType {
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
  PDF = 'PDF'
}

export type ViewMode = 'DASHBOARD' | 'CHAT' | 'TOOLS_CALC' | 'PROFILE' | 'AUTH' | 'SETTINGS' | 'HISTORY' | 'TRIBES';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  netWorth: number;
  xp: number;
  level: string; // 'ROOKIE', 'OPERATOR', 'ELITE'
  // New Fields
  age?: number;
  userType?: 'ADULT' | 'CHILD';
  qualification?: string;
  isTechie?: boolean;
  socials?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  // x404 System
  skills: string[];
  credits: number;
  isElite: boolean;
}

export interface ActivityLog {
    id: string;
    title: string;
    desc: string;
    time: string;
    type: 'SYSTEM' | 'USER';
}

export interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    lastModified: number;
    preview: string;
}

export interface Tribe {
    id: string;
    name: string;
    description: string;
    members: number;
    category: 'TECH' | 'ART' | 'FINANCE' | 'HEALTH' | 'SCIENCE';
    isJoined?: boolean;
}

export interface FeedPost {
    id: string;
    author: string;
    content: string;
    likes: number;
    timestamp: string;
}

export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'jp' | 'cn' | 'ru' | 'ar' | 'hi' | 'pt';

export const LANGUAGES: { code: LanguageCode; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'jp', name: '日本語', flag: '🇯🇵' },
    { code: 'cn', name: '中文', flag: '🇨🇳' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
];