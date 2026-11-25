'use client';

import React from 'react';
import { Sparkles, Compass } from 'lucide-react';
import { TimerCalculations } from '@/types/timer';
import { MOTIVATIONAL_MESSAGES } from '@/lib/constants';

interface MotivationalCardProps {
  metrics: TimerCalculations;
}

export const MotivationalCard: React.FC<MotivationalCardProps> = ({ metrics }) => {
  const { elapsedMs } = metrics;
  const elapsedHours = elapsedMs / (1000 * 60 * 60);

  const currentMsg =
    MOTIVATIONAL_MESSAGES.find(
      (m) => elapsedHours >= m.range[0] && elapsedHours < m.range[1]
    ) || MOTIVATIONAL_MESSAGES[0];

  return (
    <section className="w-full max-w-5xl mx-auto px-4 mb-14">
      <div className="relative rounded-2xl bg-[#2E140B] text-[#FFFDFB] p-6 sm:p-8 border border-[#C84B1E]/45 shadow-xl overflow-hidden">
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C84B1E]/25 border border-[#C84B1E]/50 text-[#F5D0B5] text-xs font-mono font-semibold mb-3">
              <Compass className="w-3.5 h-3.5 text-[#C84B1E]" />
              <span>{currentMsg.phase}</span>
            </div>

            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#FFFDFB] tracking-tight leading-snug">
              &ldquo;{currentMsg.tagline}&rdquo;
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-[#E4C5B4] leading-relaxed max-w-2xl">
              <strong className="text-[#F5D0B5] font-semibold">Tactical Directive:</strong>{' '}
              {currentMsg.advice}
            </p>
          </div>

          <div className="hidden lg:flex flex-col items-center justify-center p-4 rounded-xl bg-[#4A2315] border border-[#C84B1E]/30 min-w-[140px] text-center">
            <Sparkles className="w-6 h-6 text-[#C84B1E] mb-2 animate-bounce" />
            <span className="text-[10px] font-mono text-[#E4C5B4] uppercase tracking-widest">
              MARTIAN CREW
            </span>
            <span className="text-xs font-bold text-[#FFFDFB] mt-0.5">
              Zero Excuses
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
