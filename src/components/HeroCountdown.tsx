'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Rocket,
  AlertCircle,
  Calendar,
  Award,
  Flag,
  Clock,
} from 'lucide-react';
import { TimerStatus, TimerCalculations } from '@/types/timer';
import { EVENT_METADATA, HACKATHON_MILESTONES } from '@/lib/constants';
import { soundManager } from '@/lib/audio';

interface HeroCountdownProps {
  status: TimerStatus;
  metrics: TimerCalculations;
  showMilliseconds: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onPromptReset: () => void;
}

export const HeroCountdown: React.FC<HeroCountdownProps> = ({
  status,
  metrics,
  showMilliseconds,
  onStart,
  onPause,
  onResume,
  onPromptReset,
}) => {
  const {
    formattedRemaining,
    formattedElapsed,
    progressPercent,
    currentMilestone,
    nextMilestone,
  } = metrics;

  return (
    <section className="relative flex flex-col items-center justify-center pt-8 sm:pt-12 pb-10 px-4">
      {/* Clean MARTIAN 1.0 Typography Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="text-center mb-7 sm:mb-9"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F9EDE4] border border-[#C84B1E]/30 text-[11px] font-mono font-bold uppercase tracking-widest text-[#C84B1E] mb-3">
          <Rocket className="w-3.5 h-3.5" />
          <span>{EVENT_METADATA.organizer} • 24-Hour Hackathon</span>
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight uppercase leading-none">
          <span className="text-[#2E140B]">MARTIAN </span>
          <span className="text-[#C84B1E]">1.0</span>
        </h1>

        <div className="mt-3 inline-block px-5 py-1.5 rounded-full bg-[#FFFDFB] border border-[#C84B1E]/35 text-xs sm:text-base font-semibold text-[#2E140B] shadow-sm">
          {EVENT_METADATA.subtitle}
        </div>
      </motion.div>

      {/* Warm Martian Cream Command Deck */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl rounded-3xl martian-timer-deck p-5 sm:p-8 md:p-10 relative overflow-hidden text-[#2E140B]"
      >
        {/* Top terracotta accent bar */}
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#2E140B] via-[#C84B1E] to-[#C26D1F]" />

        {/* Top Telemetry Strip */}
        <div className="relative flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-[#C84B1E]/20">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
            <span className="px-2.5 py-1 rounded-md bg-[#2E140B] text-[#FFFDFB] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
              <Rocket className="w-3 h-3 text-[#C84B1E]" />
              24H MISSION CLOCK
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#F9EDE4] border border-[#C84B1E]/25 text-[#2E140B] flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-[#C84B1E]" />
              LAUNCH: <strong>{EVENT_METADATA.launchLabel}</strong>
            </span>
            <span className="hidden sm:flex px-2.5 py-1 rounded-md bg-[#F9EDE4] border border-[#C84B1E]/25 text-[#2E140B] items-center gap-1.5">
              <Award className="w-3 h-3 text-[#C26D1F]" />
              SPLASHDOWN: <strong>{EVENT_METADATA.splashdownLabel}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-[#6B4433] font-medium">
              ELAPSED:{' '}
              <strong className="text-[#2E140B] tabular-nums">
                {formattedElapsed.hours}:{formattedElapsed.minutes}:{formattedElapsed.seconds}
              </strong>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#C84B1E] font-bold text-[#FFFDFB] tabular-nums">
              {progressPercent.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Massive Precision Digits */}
        <div className="relative flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 font-mono select-none">
            {/* HOURS */}
            <div className="flex flex-col items-center">
              <div className="digit-card px-4 py-5 sm:px-8 sm:py-8 md:px-10 md:py-10 rounded-2xl min-w-[86px] sm:min-w-[150px] md:min-w-[185px] flex items-center justify-center relative overflow-hidden">
                <span className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-[#2E140B] tabular-nums">
                  {formattedRemaining.hours}
                </span>
              </div>
              <span className="mt-2.5 text-[10px] sm:text-xs uppercase font-mono tracking-[0.2em] text-[#C84B1E] font-bold">
                Hours
              </span>
            </div>

            <div className="text-3xl sm:text-6xl md:text-7xl font-black text-[#C84B1E] pb-7 animate-pulse">
              :
            </div>

            {/* MINUTES */}
            <div className="flex flex-col items-center">
              <div className="digit-card px-4 py-5 sm:px-8 sm:py-8 md:px-10 md:py-10 rounded-2xl min-w-[86px] sm:min-w-[150px] md:min-w-[185px] flex items-center justify-center relative overflow-hidden">
                <span className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-[#2E140B] tabular-nums">
                  {formattedRemaining.minutes}
                </span>
              </div>
              <span className="mt-2.5 text-[10px] sm:text-xs uppercase font-mono tracking-[0.2em] text-[#C84B1E] font-bold">
                Minutes
              </span>
            </div>

            <div className="text-3xl sm:text-6xl md:text-7xl font-black text-[#C84B1E] pb-7 animate-pulse">
              :
            </div>

            {/* SECONDS */}
            <div className="flex flex-col items-center">
              <div className="digit-card px-4 py-5 sm:px-8 sm:py-8 md:px-10 md:py-10 rounded-2xl min-w-[86px] sm:min-w-[150px] md:min-w-[185px] flex items-center justify-center relative overflow-hidden">
                <span className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-[#C84B1E] tabular-nums">
                  {formattedRemaining.seconds}
                </span>
              </div>
              <span className="mt-2.5 text-[10px] sm:text-xs uppercase font-mono tracking-[0.2em] text-[#C84B1E] font-bold">
                Seconds
              </span>
            </div>

            {showMilliseconds && (
              <>
                <div className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#C84B1E]/60 pb-7">
                  .
                </div>
                <div className="flex flex-col items-center">
                  <div className="digit-card px-2.5 py-5 sm:px-4 sm:py-8 md:px-5 md:py-10 rounded-2xl min-w-[52px] sm:min-w-[85px] md:min-w-[105px] flex items-center justify-center">
                    <span className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#2E140B] tabular-nums">
                      {formattedRemaining.milliseconds}
                    </span>
                  </div>
                  <span className="mt-2.5 text-[9px] sm:text-[10px] uppercase font-mono tracking-[0.2em] text-[#C84B1E] font-bold">
                    MS
                  </span>
                </div>
              </>
            )}
          </div>

          <AnimatePresence>
            {status === 'PAUSED' && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="mt-5 flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAE6E0] border border-[#C84B1E]/40 text-[#2E140B] text-xs font-mono font-semibold"
              >
                <AlertCircle className="w-3.5 h-3.5 text-[#C84B1E]" />
                <span>Mission Paused • Press Space to Resume</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Integrated Sleek Progress Bar */}
          <div className="w-full mt-7 pt-6 border-t border-[#C84B1E]/20">
            <div className="relative w-full h-3.5 rounded-full bg-[#F5E5D8] border border-[#C84B1E]/25 overflow-hidden p-0.5">
              <div className="absolute inset-0 pointer-events-none opacity-40">
                {HACKATHON_MILESTONES.map((m) => (
                  <div
                    key={m.id}
                    className="w-px h-full bg-[#C84B1E]/35"
                    style={{
                      left: `${Math.min(100, (m.hoursOffset / 24) * 100)}%`,
                      position: 'absolute',
                    }}
                  />
                ))}
              </div>
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#2E140B] via-[#C84B1E] to-[#C26D1F] transition-all duration-300 relative"
                style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
              />
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-[#2E140B]">
                <Flag className="w-3.5 h-3.5 text-[#C84B1E] shrink-0" />
                <span className="font-mono text-[#C84B1E] font-bold">ACTIVE:</span>
                <span className="font-bold">
                  {currentMilestone.stepNumber} • {currentMilestone.title} ({currentMilestone.timeLabel})
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#2E140B]">
                <Clock className="w-3.5 h-3.5 text-[#C26D1F] shrink-0" />
                <span className="font-mono text-[#C26D1F] font-bold">NEXT:</span>
                <span className="font-medium">
                  {nextMilestone
                    ? `${nextMilestone.stepNumber} • ${nextMilestone.title} (${nextMilestone.timeLabel})`
                    : 'Mission Complete'}
                </span>
              </div>
            </div>
          </div>

          {/* Primary Controls */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {status === 'NOT_STARTED' && (
              <button
                onClick={onStart}
                className="group px-8 sm:px-10 py-3.5 rounded-xl font-bold tracking-wider uppercase text-sm text-[#FFFDFB] bg-gradient-to-r from-[#2E140B] via-[#C84B1E] to-[#C26D1F] hover:opacity-95 shadow-lg shadow-[#2E140B]/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2.5"
              >
                <Play className="w-4 h-4 fill-[#FFFDFB]" />
                <span>Launch Mission (24:00:00)</span>
              </button>
            )}

            {status === 'LIVE' && (
              <button
                onClick={onPause}
                className="px-7 py-3 rounded-xl font-bold tracking-wider uppercase text-sm text-[#2E140B] bg-[#F9EDE4] hover:bg-[#F2DFD1] border-2 border-[#C26D1F] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
              >
                <Pause className="w-4 h-4 fill-[#2E140B]" />
                <span>Pause Mission</span>
              </button>
            )}

            {status === 'PAUSED' && (
              <button
                onClick={onResume}
                className="px-8 py-3.5 rounded-xl font-bold tracking-wider uppercase text-sm text-[#FFFDFB] bg-[#C84B1E] hover:bg-[#B93815] shadow-lg shadow-[#2E140B]/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-[#FFFDFB]" />
                <span>Resume Mission</span>
              </button>
            )}

            {status === 'COMPLETED' && (
              <div className="px-6 py-3 rounded-xl bg-[#2E140B] text-[#FFFDFB] font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                <Rocket className="w-4 h-4 text-[#C84B1E]" />
                <span>Splashdown Achieved • 24h Complete</span>
              </div>
            )}

            {status !== 'NOT_STARTED' && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onPromptReset();
                }}
                title="Reset Countdown (R)"
                className="px-5 py-3 rounded-xl font-semibold tracking-wider uppercase text-xs text-[#2E140B] hover:text-[#FFFDFB] bg-[#F9EDE4] hover:bg-[#C84B1E] border border-[#C84B1E]/35 transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
