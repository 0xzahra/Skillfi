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