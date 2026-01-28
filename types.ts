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

export type ViewMode = 'DASHBOARD' | 'CHAT' | 'TOOLS_CALC' | 'PROFILE' | 'AUTH' | 'SETTINGS' | 'HISTORY' | 'TRIBES' | 'SUPPORT';

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

export type LanguageCode = string;

export const LANGUAGES: { code: string; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: 'Mandarin', flag: '🇨🇳' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
    { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
    { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'sw', name: 'Swahili', flag: '🇰🇪' },
    { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
    { code: 'yo', name: 'Yoruba', flag: '🇳🇬' },
    { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
    { code: 'zu', name: 'Zulu', flag: '🇿🇦' },
    { code: 'xh', name: 'Xhosa', flag: '🇿🇦' },
    { code: 'am', name: 'Amharic', flag: '🇪🇹' },
    { code: 'om', name: 'Oromo', flag: '🇪🇹' },
    { code: 'so', name: 'Somali', flag: '🇸🇴' },
    { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' },
    { code: 'lg', name: 'Luganda', flag: '🇺🇬' },
    { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
    { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
    { code: 'th', name: 'Thai', flag: '🇹🇭' },
    { code: 'ms', name: 'Malay', flag: '🇲🇾' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pl', name: 'Polish', flag: '🇵🇱' },
    { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
    { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
    { code: 'fa', name: 'Persian', flag: '🇮🇷' },
    { code: 'he', name: 'Hebrew', flag: '🇮🇱' },
    { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
    { code: 'cs', name: 'Czech', flag: '🇨🇿' },
    { code: 'ro', name: 'Romanian', flag: '🇷🇴' },
    { code: 'hu', name: 'Hungarian', flag: '🇭🇺' },
    { code: 'el', name: 'Greek', flag: '🇬🇷' },
    { code: 'da', name: 'Danish', flag: '🇩🇰' },
    { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
    { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
    { code: 'sk', name: 'Slovak', flag: '🇸🇰' },
    { code: 'bg', name: 'Bulgarian', flag: '🇧🇬' },
    { code: 'sr', name: 'Serbian', flag: '🇷🇸' },
    { code: 'hr', name: 'Croatian', flag: '🇭🇷' },
    { code: 'tl', name: 'Tagalog', flag: '🇵🇭' },
    { code: 'kk', name: 'Kazakh', flag: '🇰🇿' },
    { code: 'uz', name: 'Uzbek', flag: '🇺🇿' },
    { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
    { code: 'my', name: 'Burmese', flag: '🇲🇲' },
    { code: 'km', name: 'Khmer', flag: '🇰🇭' },
    { code: 'lo', name: 'Lao', flag: '🇱🇦' },
    { code: 'ne', name: 'Nepali', flag: '🇳🇵' },
    { code: 'si', name: 'Sinhala', flag: '🇱🇰' },
    { code: 'ps', name: 'Pashto', flag: '🇦🇫' },
    { code: 'az', name: 'Azerbaijani', flag: '🇦🇿' },
    { code: 'ka', name: 'Georgian', flag: '🇬🇪' },
    { code: 'hy', name: 'Armenian', flag: '🇦🇲' },
    { code: 'mn', name: 'Mongolian', flag: '🇲🇳' }
];