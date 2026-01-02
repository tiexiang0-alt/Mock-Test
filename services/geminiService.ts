/**
 * Edge TTS Service for TOEFL Listening Prep AI
 * Uses Microsoft Edge's high-quality neural voices via a backend service.
 * Falls back to browser native TTS if Edge TTS server is unavailable.
 */

const EDGE_TTS_SERVER = "http://localhost:3001";
let audioElement: HTMLAudioElement | null = null;
let isEdgeTtsAvailable: boolean | null = null;

// Browser fallback variables
let voicesLoaded = false;
let availableVoices: SpeechSynthesisVoice[] = [];

// Initialize browser voices as fallback
const loadVoices = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    availableVoices = window.speechSynthesis.getVoices();
    voicesLoaded = true;
  }
};

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

/**
 * Check if Edge TTS server is available
 */
const checkEdgeTtsAvailability = async (): Promise<boolean> => {
  if (isEdgeTtsAvailable !== null) {
    return isEdgeTtsAvailable;
  }

  try {
    const response = await fetch(`${EDGE_TTS_SERVER}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000)
    });
    isEdgeTtsAvailable = response.ok;
    console.log("🎙️ Edge TTS server:", isEdgeTtsAvailable ? "available ✓" : "unavailable ✗");
    return isEdgeTtsAvailable;
  } catch {
    isEdgeTtsAvailable = false;
    console.log("🎙️ Edge TTS server: unavailable, using browser fallback");
    return false;
  }
};

/**
 * Stop any currently playing audio
 */
export const stopNativeTts = () => {
  // Stop Edge TTS audio
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
    audioElement = null;
  }

  // Stop browser TTS
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Play TTS using Edge TTS server
 */
const playEdgeTts = async (
  text: string,
  speakerType: string,
  onStart: () => void,
  onEnd: () => void
): Promise<void> => {
  try {
    // Use POST for longer text to avoid URL length limits
    const response = await fetch(`${EDGE_TTS_SERVER}/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        speaker: speakerType
      })
    });

    if (!response.ok) {
      throw new Error(`Edge TTS error: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    // Create audio element
    audioElement = new Audio(audioUrl);

    audioElement.onplay = () => {
      onStart();
    };

    audioElement.onended = () => {
      URL.revokeObjectURL(audioUrl);
      audioElement = null;
      onEnd();
    };

    audioElement.onerror = (e) => {
      console.error("Audio playback error:", e);
      URL.revokeObjectURL(audioUrl);
      audioElement = null;
      onEnd();
    };

    // Play the audio
    await audioElement.play();

  } catch (error) {
    console.error("Edge TTS error:", error);
    throw error;
  }
};

/**
 * Play TTS using browser's native SpeechSynthesis (fallback)
 */
const playBrowserTts = (
  text: string,
  speakerType: string,
  onStart: () => void,
  onEnd: () => void
): void => {
  if (!('speechSynthesis' in window)) {
    console.error("TTS not supported");
    onEnd();
    return;
  }

  window.speechSynthesis.cancel();

  if (availableVoices.length === 0) {
    availableVoices = window.speechSynthesis.getVoices();
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1.0;

  const usVoices = availableVoices.filter(v => v.lang === 'en-US');
  const pool = usVoices.length > 0 ? usVoices : availableVoices;

  let selectedVoice: SpeechSynthesisVoice | undefined;

  const findVoice = (keywords: string[]) => {
    return pool.find(v => keywords.some(k => v.name.toLowerCase().includes(k.toLowerCase())));
  };

  if (speakerType === 'female') {
    selectedVoice = findVoice(['Aria', 'Natural', 'Zira', 'Google US English', 'female']);
  } else if (speakerType === 'male') {
    selectedVoice = findVoice(['Guy', 'Natural', 'David', 'male']);
  } else if (speakerType === 'lecturer') {
    selectedVoice = findVoice(['Guy', 'Christopher', 'Roger', 'Natural', 'male']);
  } else if (speakerType === 'duo') {
    selectedVoice = findVoice(['Aria', 'Natural', 'Google US English']);
  }

  if (!selectedVoice) {
    selectedVoice = pool[0];
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  utterance.onstart = onStart;
  utterance.onend = onEnd;
  utterance.onerror = (e) => {
    console.error("Browser TTS Error", e);
    onEnd();
  };

  window.speechSynthesis.speak(utterance);
};

/**
 * Main TTS function - uses Edge TTS if available, otherwise falls back to browser TTS
 */
export const playNativeTts = async (
  text: string,
  speakerType: string,
  onStart: () => void,
  onEnd: () => void
): Promise<void> => {
  // Stop any currently playing audio
  stopNativeTts();

  // Check if Edge TTS is available
  const useEdgeTts = await checkEdgeTtsAvailability();

  if (useEdgeTts) {
    try {
      await playEdgeTts(text, speakerType, onStart, onEnd);
    } catch (error) {
      // Fall back to browser TTS
      console.log("Falling back to browser TTS");
      playBrowserTts(text, speakerType, onStart, onEnd);
    }
  } else {
    playBrowserTts(text, speakerType, onStart, onEnd);
  }
};

/**
 * Get available voices from Edge TTS server
 */
export const getEdgeTtsVoices = async (): Promise<Record<string, string>> => {
  try {
    const response = await fetch(`${EDGE_TTS_SERVER}/voices`);
    if (response.ok) {
      return await response.json();
    }
  } catch {
    console.error("Failed to get Edge TTS voices");
  }
  return {};
};
