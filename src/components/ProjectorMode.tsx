'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Clock,
  Flag,
  Maximize2,
  Minimize2,
  Rocket,
} from 'lucide-react';
import { TimerStatus, TimerCalculations } from '@/types/timer';
import { soundManager } from '@/lib/audio';

interface ProjectorModeProps {
  isOpen: boolean;
  onClose: () => void;
  eventName: string;
  eventSubtitle: string;
  status: TimerStatus;
  metrics: TimerCalculations;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
}

export const ProjectorMode: React.FC<ProjectorModeProps> = ({
  isOpen,
  onClose,
  eventName,
  eventSubtitle,
  status,
  metrics,
  soundEnabled,
  onToggleSound,
  isFullscreen,
  onToggleFullscreen,
  onStart,
  onPause,
  onResume,
}) => {
  const [localTime, setLocalTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      setLocalTime(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  const { formattedRemaining, progressPercent, currentMilestone } = metrics;

  return (
    <div className="fixed inset-0 z-50 bg-[#FBF4EC] flex flex-col justify-between p-6 sm:p-10 overflow-hidden select-none">
      {/* Top Stage Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#2E140B] text-[#FFFDFB] border border-[#C84B1E]/40 shadow-md">
          <Rocket className="w-5 h-5 text-[#C84B1E] animate-pulse" />
          <div>
            <h1 className="text-base sm:text-xl font-black uppercase tracking-tight font-mono">
              {eventName}
            </h1>
            <p className="text-[11px] text-[#E4C5B4] hidden sm:block">{eventSubtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 font-mono text-sm">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#2E140B] text-[#FFFDFB] border border-[#C84B1E]/40 shadow-md">
            <Clock className="w-4 h-4 text-[#C84B1E]" />
            <span className="font-bold tabular-nums">{localTime || '--:--:--'}</span>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onToggleSound();
            }}
            className="p-2.5 rounded-xl bg-[#2E140B] hover:bg-[#4A2315] border border-[#C84B1E]/40 text-[#FBF4EC] transition"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-[#F5D0B5]" /> : <VolumeX className="w-5 h-5 text-[#B89482]" />}
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onToggleFullscreen();
            }}
            className="p-2.5 rounded-xl bg-[#2E140B] hover:bg-[#4A2315] border border-[#C84B1E]/40 text-[#FBF4EC] transition"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2.5 rounded-xl bg-[#2E140B] hover:bg-[#C84B1E] border border-[#C84B1E]/40 text-[#FFFDFB] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Massive Centered Stage Timer */}
      <div className="flex flex-col items-center justify-center my-auto">
        <div className="martian-timer-deck rounded-3xl px-8 py-10 sm:px-14 sm:py-14 flex flex-col items-center relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#2E140B] via-[#C84B1E] to-[#C26D1F]" />
          <div className="flex items-center justify-center gap-4 sm:gap-8 md:gap-10 font-mono">
            <div className="flex flex-col items-center">
              <div className="digit-card px-6 py-7 sm:px-10 sm:py-12 md:px-14 md:py-16 rounded-3xl min-w-[110px] sm:min-w-[210px] md:min-w-[270px] flex items-center justify-center">
                <span className="text-5xl sm:text-8xl md:text-[10rem] font-black tracking-tight text-[#2E140B] tabular-nums leading-none">
                  {formattedRemaining.hours}
                </span>
              </div>
              <span className="mt-3 text-xs sm:text-sm font-mono tracking-[0.2em] text-[#C84B1E] font-bold uppercase">
                HOURS
              </span>
            </div>

            <div className="text-4xl sm:text-7xl md:text-8xl font-black text-[#C84B1E] pb-10 animate-pulse">
              :
            </div>

            <div className="flex flex-col items-center">
              <div className="digit-card px-6 py-7 sm:px-10 sm:py-12 md:px-14 md:py-16 rounded-3xl min-w-[110px] sm:min-w-[210px] md:min-w-[270px] flex items-center justify-center">
                <span className="text-5xl sm:text-8xl md:text-[10rem] font-black tracking-tight text-[#2E140B] tabular-nums leading-none">
                  {formattedRemaining.minutes}
                </span>
              </div>
              <span className="mt-3 text-xs sm:text-sm font-mono tracking-[0.2em] text-[#C84B1E] font-bold uppercase">
                MINUTES
              </span>
            </div>

            <div className="text-4xl sm:text-7xl md:text-8xl font-black text-[#C84B1E] pb-10 animate-pulse">
              :
            </div>

            <div className="flex flex-col items-center">
              <div className="digit-card px-6 py-7 sm:px-10 sm:py-12 md:px-14 md:py-16 rounded-3xl min-w-[110px] sm:min-w-[210px] md:min-w-[270px] flex items-center justify-center">
                <span className="text-5xl sm:text-8xl md:text-[10rem] font-black tracking-tight text-[#C84B1E] tabular-nums leading-none">
                  {formattedRemaining.seconds}
                </span>
              </div>
              <span className="mt-3 text-xs sm:text-sm font-mono tracking-[0.2em] text-[#C84B1E] font-bold uppercase">
                SECONDS
              </span>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            {status === 'NOT_STARTED' && (
              <button
                onClick={onStart}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#2E140B] via-[#C84B1E] to-[#C26D1F] text-[#FFFDFB] font-bold uppercase tracking-wider text-sm flex items-center gap-2 transition shadow-lg"
              >
                <Play className="w-4 h-4 fill-[#FFFDFB]" />
                <span>Launch 24h Mission</span>
              </button>
            )}
            {status === 'LIVE' && (
              <button
                onClick={onPause}
                className="px-8 py-3 rounded-xl bg-[#F9EDE4] hover:bg-[#F2DFD1] border-2 border-[#C26D1F] text-[#2E140B] font-bold uppercase tracking-wider text-sm flex items-center gap-2 transition"
              >
                <Pause className="w-4 h-4 fill-[#2E140B]" />
                <span>Pause</span>
              </button>
            )}
            {status === 'PAUSED' && (
              <button
                onClick={onResume}
                className="px-8 py-3 rounded-xl bg-[#C84B1E] hover:bg-[#B93815] text-[#FFFDFB] font-bold uppercase tracking-wider text-sm flex items-center gap-2 transition"
              >
                <Play className="w-4 h-4 fill-[#FFFDFB]" />
                <span>Resume</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Stage Progress Track */}
      <div className="w-full max-w-6xl mx-auto space-y-3">
        <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-[#2E140B]">
          <div className="flex items-center gap-2 font-bold">
            <Flag className="w-4 h-4 text-[#C84B1E]" />
            <span>
              STAGE {currentMilestone.stepNumber}: {currentMilestone.title} ({currentMilestone.timeLabel})
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#C84B1E] font-black tabular-nums">
            <span>{progressPercent.toFixed(1)}% COMPLETE</span>
          </div>
        </div>

        <div className="w-full h-3.5 rounded-full bg-[#F2DFD1] border border-[#C84B1E]/25 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#2E140B] via-[#C84B1E] to-[#C26D1F] transition-all duration-300 relative"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>
      </div>
    </div>
  );
};
