import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';
import { InputArea } from './components/InputArea';
import { Sidebar } from './components/Sidebar';
import { Calculator } from './components/Calculator';
import { Dashboard } from './components/Dashboard';
import { Auth } from './components/Auth';
import { Settings } from './components/Settings';
import { ChatHistory } from './components/ChatHistory';
import { initializeChat, sendMessageToSkillfi, generateVisionBoard } from './services/geminiService';
import { AudioService } from './services/audioService';
import { Message, ViewMode, UserProfile, ActivityLog, ChatSession } from './types';
import { INITIAL_GREETING } from './constants';

const App: React.FC = () => {
  // --- STATE ---
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>('AUTH');
  const [activities, setActivities] = useState<ActivityLog[]>([
      { id: '1', title: 'System Initialization', desc: 'User logged in', time: 'Just now', type: '