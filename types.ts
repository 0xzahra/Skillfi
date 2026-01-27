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

export type ViewMode = 'DASHBOARD' | 'CHAT' | 'TOOLS_CALC' | 'PROFILE' | 'AUTH' | 'SETTINGS' | 'HISTORY';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  netWorth: number;
  xp: number;
  level: string; // 'ROOKIE', 'OPERATOR', 'ELITE'
  socials?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
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