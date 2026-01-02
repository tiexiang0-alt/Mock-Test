import React, { useState, useEffect } from 'react';
import { playNativeTts, stopNativeTts } from '../services/geminiService';
import Visualizer from './Visualizer';

interface AudioPlayerProps {
  text: string;
  speakerType: string;
  onAudioEnd: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ text, speakerType, onAudioEnd }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Clean up on unmount or text change
  useEffect(() => {
    return () => {
      stopNativeTts();
    };
  }, []);

  useEffect(() => {
    // Reset state when text changes (new segment)
    setHasPlayed(false);
    setIsPlaying(false);
    setIsLoading(false);
    stopNativeTts();
  }, [text]);

  const handlePlay = async () => {
    if (isPlaying || isLoading) return;

    setIsLoading(true);

    try {
      await playNativeTts(
        text,
        speakerType,
        () => {
          // On Start
          setIsLoading(false);
          setIsPlaying(true);
        },
        () => {
          // On End
          setIsPlaying(false);
          setHasPlayed(true);
          onAudioEnd();
        }
      );
    } catch (error) {
      console.error("Failed to play audio:", error);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const handleReplay = () => {
    handlePlay();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      {/* Visualizer Area */}
      <div className="bg-slate-50 h-32 relative flex items-center justify-center border-b border-slate-100">
        {/* Visualizer Overlay */}
        <div className="absolute inset-0 px-4 flex items-center">
          <Visualizer isPlaying={isPlaying} />
        </div>

        {/* Play Button Overlay */}
        {!isPlaying && (
          <button
            onClick={handlePlay}
            disabled={isLoading}
            className={`
                  relative z-10 flex items-center justify-center w-16 h-16 rounded-full 
                  transition-all duration-300 shadow-lg
                  ${isLoading
                ? 'bg-slate-400 cursor-wait'
                : hasPlayed
                  ? 'bg-slate-700 text-white hover:bg-slate-800 hover:scale-105'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
              }
                `}
          >
            {isLoading ? (
              /* Loading spinner */
              <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : hasPlayed ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 ml-1">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Status Bar */}
      <div className="px-6 py-3 flex justify-between items-center text-sm">
        <div className="font-medium text-slate-600">
          {isLoading ? (
            <span className="flex items-center gap-2 text-amber-600">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Loading Edge TTS...
            </span>
          ) : isPlaying ? (
            <span className="flex items-center gap-2 text-blue-600">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Speaking (Edge TTS)...
            </span>
          ) : hasPlayed ? "Audio finished" : "Click play to start"}
        </div>
        {hasPlayed && !isPlaying && !isLoading && (
          <button onClick={handleReplay} className="text-slate-400 hover:text-slate-600 underline">
            Replay
          </button>
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;