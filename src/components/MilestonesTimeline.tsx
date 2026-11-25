'use client';

import React from 'react';
import {
  Rocket,
  Cpu,
  Code2,
  Flame,
  ShieldAlert,
  FileCheck,
  Trophy,
  Utensils,
  Coffee,
  Compass,
  Check,
  Clock,
  Lock,
  AlertTriangle,
} from 'lucide-react';
import { TimerCalculations, Milestone } from '@/types/timer';
import { HACKATHON_MILESTONES, EVENT_METADATA } from '@/lib/constants';

interface MilestonesTimelineProps {
  metrics: TimerCalculations;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Rocket,
  Cpu,
  Code2,
  Flame,
  ShieldAlert,
  FileCheck,
  Trophy,
  Utensils,
  Coffee,
  Compass,
};

export const MilestonesTimeline: React.FC<MilestonesTimelineProps> = ({ metrics }) => {
  const { elapsedMs } = metrics;
  const elapsedHours = elapsedMs / (1000 * 60 * 60);

  const getMilestoneState = (milestone: Milestone, index: number) => {
    const nextM = HACKATHON_MILESTONES[index + 1];
    if (nextM && elapsedHours >= nextM.hoursOffset) {
      return 'completed';
    }
    if (elapsedHours >= milestone.hoursOffset && (!nextM || elapsedHours < nextM.hoursOffset)) {
      return 'active';
    }
    return 'upcoming';
  };

  const day1 = HACKATHON_MILESTONES.filter((m) => m.day === 'DAY 1');
  const day2 = HACKATHON_MILESTONES.filter((m) => m.day === 'DAY 2');

  const renderMilestoneCard = (milestone: Milestone, globalIdx: number) => {
    const state = getMilestoneState(milestone, globalIdx);
    const IconComponent = ICON_MAP[milestone.iconName] || Rocket;

    return (
      <div
        key={milestone.id}
        className={`relative rounded-2xl p-4 sm:p-5 border transition-all duration-200 ${
          state === 'active'
            ? 'bg-[#2E140B] text-[#FFFDFB] border-[#C84B1E] shadow-xl shadow-[#2E140B]/20 scale-[1.01]'
            : state === 'completed'
            ? 'martian-sand-panel border-[#C84B1E]/35 opacity-85'
            : 'martian-sand-panel opacity-95 hover:border-[#C84B1E]/55'
        }`}
      >
        {state === 'active' && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C84B1E] text-[10px] font-mono font-bold text-[#FFFDFB]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FBF4EC] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFFDFB]"></span>
            </span>
            <span>ACTIVE</span>
          </div>
        )}

        <div className="flex items-start gap-3.5">
          <div
            className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 ${
              state === 'active'
                ? 'bg-[#C84B1E] border-[#F9EDE4]/30 text-[#FFFDFB]'
                : state === 'completed'
                ? 'bg-[#2E140B] border-[#2E140B] text-[#FBF4EC]'
                : 'bg-[#F5E5D8] border-[#C84B1E]/25 text-[#C84B1E]'
            }`}
          >
            <IconComponent className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1 pr-14">
              <span
                className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  state === 'active'
                    ? 'bg-[#C84B1E] text-[#FFFDFB]'
                    : state === 'completed'
                    ? 'bg-[#2E140B] text-[#FFFDFB]'
                    : globalIdx % 2 === 0
                    ? 'bg-[#C26D1F] text-[#FFFDFB]'
                    : 'bg-[#C84B1E] text-[#FFFDFB]'
                }`}
              >
                {milestone.stepNumber}
              </span>
              <h3
                className={`text-sm sm:text-base font-extrabold tracking-wide ${
                  state === 'active' ? 'text-[#FFFDFB]' : 'text-[#2E140B]'
                }`}
              >
                {milestone.title}
              </h3>
            </div>

            <div
              className={`text-xs font-mono font-bold mb-1 ${
                state === 'active' ? 'text-[#F5D0B5]' : 'text-[#C84B1E]'
              }`}
            >
              {milestone.timeLabel}
            </div>

            <p
              className={`text-xs leading-relaxed ${
                state === 'active' ? 'text-[#F9EDE4]' : 'text-[#6B4433]'
              }`}
            >
              {milestone.description}
            </p>
          </div>

          <div className="self-center shrink-0">
            {state === 'completed' && (
              <div className="p-1 rounded-full bg-[#2E140B]/10 text-[#2E140B]" title="Completed">
                <Check className="w-4 h-4" />
              </div>
            )}
            {state === 'active' && (
              <div className="p-1 rounded-full bg-[#C84B1E]/30 text-[#F5D0B5]" title="In Progress">
                <Clock className="w-4 h-4 animate-spin" />
              </div>
            )}
            {state === 'upcoming' && (
              <div className="p-1 rounded-full bg-[#C84B1E]/10 text-[#6B4433]/60" title="Upcoming">
                <Lock className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 mb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#2E140B] uppercase tracking-tight flex items-center gap-2.5">
            <Rocket className="w-6 h-6 text-[#C84B1E]" />
            <span>MARTIAN 1.0 • Event Flow & Mission Schedule</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#6B4433] mt-1 font-medium">
            Official 12-stage mission timeline synchronized with live event elapsed time
          </p>
        </div>
      </div>

      {/* DAY 1 — LIFTOFF */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-lg bg-[#2E140B] text-xs font-mono font-bold text-[#FFFDFB] uppercase tracking-wider mb-4 shadow-sm">
          <span>DAY 1</span>
          <span className="text-[#C84B1E]">•</span>
          <span>LIFTOFF</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {day1.map((m, idx) => renderMilestoneCard(m, idx))}
        </div>
      </div>

      {/* DAY 2 — THE FINAL APPROACH */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-lg bg-[#2E140B] text-xs font-mono font-bold text-[#FFFDFB] uppercase tracking-wider mb-4 shadow-sm">
          <span>DAY 2</span>
          <span className="text-[#C26D1F]">•</span>
          <span>THE FINAL APPROACH</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {day2.map((m, idx) => renderMilestoneCard(m, day1.length + idx))}
        </div>
      </div>

      {/* Mission Control Note */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FAE6E0] border border-[#C84B1E]/35 flex items-start gap-3 shadow-sm">
        <AlertTriangle className="w-5 h-5 text-[#C84B1E] shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C84B1E] block mb-1">
            MISSION CONTROL NOTE
          </span>
          <p className="text-xs sm:text-sm text-[#2E140B] font-medium leading-relaxed">
            {EVENT_METADATA.missionNote}
          </p>
        </div>
      </div>
    </section>
  );
};
