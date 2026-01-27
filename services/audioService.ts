// Audio Engine for Sound FX and Text-to-Speech

const synth = window.speechSynthesis;
let audioCtx: AudioContext | null = null;

const initAudioCtx = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// Play a synthesized tone (Sound FX)
const playTone = (freq: number, type: OscillatorType, duration: number, vol: number = 0.1) => {
  const ctx = initAudioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + duration);
};

export const AudioService = {
  // FX: Positive Chime
  playSuccess: () => {
    playTone(880, 'sine', 0.1);
    setTimeout(() => playTone(1760, 'sine', 0.3), 100);
  },

  // FX: Processing/Computing
  playProcessing: () => {
    playTone(200, 'square', 0.05, 0.05);
    setTimeout(() => playTone(300, 'square', 0.05, 0.05), 50);
  },

  // FX: Alert/Warning
  playAlert: () => {
    playTone(150, 'sawtooth', 0.3, 0.1);
  },

  // Text to Speech
  speak: (text: string) => {
    if (synth.speaking) synth.cancel();
    
    // Remove bracketed text [Sound FX] from speech
    const cleanText = text.replace(/\[.*?\]/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.pitch = 0.9; // Slightly lower, more serious
    utterance.rate = 1.1; // Faster, efficient
    utterance.volume = 1.0;
    
    // Try to find a good system voice
    const voices = synth.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'));
    if (preferredVoice) utterance.voice = preferredVoice;

    synth.speak(utterance);
  },

  stopSpeech: () => {
    if (synth.speaking) synth.cancel();
  }
};