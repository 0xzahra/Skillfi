// Audio Engine for Sound FX and Text-to-Speech

const synth = window.speechSynthesis;
let audioCtx: AudioContext | null = null;

const initAudioCtx = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// Helper: Decode Base64 to Uint8Array
function decodeBase64(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

// Helper: Convert PCM Data to AudioBuffer
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

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

  // Standard Text to Speech (Browser)
  speak: (text: string) => {
    if (synth.speaking) synth.cancel();
    
    // Remove bracketed text [Sound FX] from speech
    const cleanText = text.replace(/\[.*?\]/g, '').replace(/https?:\/\/[^\s]+/g, 'link');
    
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

  // High Quality PCM Audio Playback (Gemini TTS)
  playPCM: async (base64Data: string) => {
      try {
          // Stop any browser TTS
          if (synth.speaking) synth.cancel();

          const ctx = initAudioCtx();
          const bytes = decodeBase64(base64Data);
          const audioBuffer = await decodeAudioData(bytes, ctx, 24000, 1);
          
          const source = ctx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(ctx.destination);
          source.start();
      } catch (e) {
          console.error("Error playing PCM audio", e);
      }
  },

  stopSpeech: () => {
    if (synth.speaking) synth.cancel();
    // For PCM, stopping is harder without tracking source, but close enough for now
    if (audioCtx) {
        audioCtx.suspend();
        setTimeout(() => audioCtx?.resume(), 100);
    }
  }
};