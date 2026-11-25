'use client';

import React from 'react';
import { Trophy, Sparkles, RotateCcw } from 'lucide-react';
import { soundManager } from '@/lib/audio';
import { triggerCompletionCelebration } from '@/lib/confetti';

interface CompletionOverlayProps {
  isOpen: boolean;
  eventName: string;
  onDismiss: () => void;
  onPromptReset: () => void;
}

export const CompletionOverlay: React.FC<CompletionOverlayProps> = ({
  isOpen,
  eventName,
  onDismiss,
  onPromptReset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E140B]/85 backdrop-blur-xl">
      <div className="relative w-full max-w-xl glass-panel p-8 sm:p-10 rounded-3xl border border-[#C84B1E]/50 shadow-2xl text-center">
        <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#C84B1E] to-[#C26D1F] p-0.5 shadow-xl flex items-center justify-center mb-6 animate-pulse">
          <div className="w-full h-full bg-[#2E140B] rounded-2xl flex items-center justify-center">
            <Trophy className="w-10 h-10 text-[#F5D0B5]" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C84B1E]/25 border border-[#C84B1E]/50 text-xs font-mono font-bold text-[#F5D0B5] uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#F5D0B5]" />
          <span>SPLASHDOWN COMPLETE</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-[#FFFDFB] tracking-tight uppercase">
          TIME IS UP!
        </h2>

        <p className="mt-2 text-[#E4C5B4] text-sm sm:text-base font-medium max-w-md mx-auto leading-relaxed">
          The 24-hour mission for <span className="text-[#F5D0B5] font-bold">{eventName}</span> is officially complete. Hands off keyboards!
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#4A2315] border border-[#C84B1E]/30">
          <div>
            <span className="text-[10px] uppercase font-mono text-[#E4C5B4] block">
              DURATION
            </span>
            <span className="text-sm sm:text-base font-bold text-[#FFFDFB]">
              24h 00m
            </span>
          </div>
          <div className="border-x border-[#C84B1E]/30">
            <span className="text-[10px] uppercase font-mono text-[#E4C5B4] block">
              STATUS
            </span>
            <span className="text-sm sm:text-base font-bold text-[#F5D0B5]">
              LOCKED
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-[#E4C5B4] block">
              NEXT STAGE
            </span>
            <span className="text-sm sm:text-base font-bold text-[#F5D0B5]">
              JUDGING
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              triggerCompletionCelebration();
            }}
            className="px-6 py-3 rounded-xl bg-[#C84B1E] hover:bg-[#B93815] text-[#FFFDFB] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition"
          >
            <Sparkles className="w-4 h-4 text-[#F5D0B5]" />
            <span>Replay Confetti</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onDismiss();
            }}
            className="px-6 py-3 rounded-xl bg-[#4A2315] hover:bg-[#5C2D1B] text-[#FFFDFB] font-semibold text-xs uppercase tracking-wider border border-[#C84B1E]/35 transition"
          >
            View Dashboard
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onPromptReset();
            }}
            className="px-5 py-3 rounded-xl bg-[#4A2315] hover:bg-[#C84B1E] text-[#F5D0B5] hover:text-[#FFFDFB] font-semibold text-xs uppercase tracking-wider border border-[#C84B1E]/35 transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Timer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
