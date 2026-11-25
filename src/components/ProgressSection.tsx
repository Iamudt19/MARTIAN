'use client';

import React from 'react';
import { TimerCalculations } from '@/types/timer';
import { HACKATHON_MILESTONES } from '@/lib/constants';
import { Activity, Clock, Flag } from 'lucide-react';

interface ProgressSectionProps {
  metrics: TimerCalculations;
}

export const ProgressSection: React.FC<ProgressSectionProps> = ({ metrics }) => {
  const { progressPercent, formattedElapsed, formattedRemaining, currentMilestone, nextMilestone } = metrics;

  return (
    <section className="w-full max-w-5xl mx-auto px-4 mb-10">
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-orange-500/20 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-white uppercase">
                Mission Trajectory Progress
              </h3>
              <p className="text-xs text-slate-400">
                10:30 AM Day 1 Launch → 9:30 AM Day 2 Splashdown
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-slate-500">ELAPSED:</span>
              <span className="text-orange-300 font-semibold">
                {formattedElapsed.hours}:{formattedElapsed.minutes}:{formattedElapsed.seconds}
              </span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-slate-500">REMAINING:</span>
              <span className="text-cyan-300 font-semibold">
                {formattedRemaining.hours}:{formattedRemaining.minutes}:{formattedRemaining.seconds}
              </span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="px-2.5 py-1 rounded-md bg-orange-500/15 border border-orange-500/30 font-bold text-orange-200 text-xs">
              {progressPercent.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Martian Progress Bar */}
        <div className="relative w-full h-4 sm:h-5 rounded-full bg-black/70 border border-white/[0.1] overflow-hidden p-0.5 shadow-inner">
          <div className="absolute inset-0 flex justify-between px-2 pointer-events-none opacity-40">
            {HACKATHON_MILESTONES.map((m) => (
              <div
                key={m.id}
                className="w-px h-full bg-orange-300/30"
                style={{ left: `${Math.min(100, (m.hoursOffset / 24) * 100)}%`, position: 'absolute' }}
              />
            ))}
          </div>

          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-600 via-amber-500 to-cyan-400 relative transition-all duration-300 ease-out shadow-lg"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-full bg-white rounded-full blur-[1px]" />
          </div>
        </div>

        <div className="relative w-full mt-3 flex justify-between text-[10px] font-mono text-slate-400 select-none">
          <span>10:30 AM (IGNITION)</span>
          <span className="hidden sm:inline">2:30 PM (ALPHA)</span>
          <span>10:30 PM (MIDWAY)</span>
          <span className="hidden sm:inline">8:30 AM (BETA)</span>
          <span>9:30 AM (SPLASHDOWN)</span>
        </div>

        <div className="mt-5 pt-5 border-t border-white/[0.08] grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-500/[0.06] border border-orange-500/25">
            <div className="p-2 rounded-lg bg-orange-500/20 text-orange-300">
              <Flag className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-mono tracking-wider text-orange-400 font-bold block">
                ACTIVE MISSION STAGE
              </span>
              <p className="text-xs sm:text-sm font-semibold text-white truncate">
                {currentMilestone.stepNumber} • {currentMilestone.title} ({currentMilestone.timeLabel})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-cyan-500/[0.05] border border-cyan-500/20">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300">
              <Clock className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 font-bold block">
                NEXT SCHEDULED CHECKPOINT
              </span>
              <p className="text-xs sm:text-sm font-semibold text-white truncate">
                {nextMilestone
                  ? `${nextMilestone.stepNumber} • ${nextMilestone.title} (${nextMilestone.timeLabel})`
                  : 'Final Splashdown Reached!'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
