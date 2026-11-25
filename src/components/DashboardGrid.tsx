'use client';

import React from 'react';
import {
  Activity,
  Clock,
  Calendar,
  Hourglass,
  CheckCircle2,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { TimerStatus, TimerCalculations } from '@/types/timer';

interface DashboardGridProps {
  status: TimerStatus;
  metrics: TimerCalculations;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({ status, metrics }) => {
  const {
    formattedElapsed,
    formattedRemaining,
    startTimeDate,
    expectedEndTimeDate,
  } = metrics;

  const formatDate = (date: Date | null) => {
    if (!date) return '—';
    return date.toLocaleTimeString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const getStatusDisplay = () => {
    switch (status) {
      case 'LIVE':
        return {
          text: 'LIVE / RUNNING',
          color: 'text-[#FFFDFB]',
          border: 'border-[#C84B1E]',
          bg: 'bg-[#C84B1E]',
        };
      case 'PAUSED':
        return {
          text: 'TEMPORARILY PAUSED',
          color: 'text-[#FFFDFB]',
          border: 'border-[#C26D1F]',
          bg: 'bg-[#C26D1F]',
        };
      case 'COMPLETED':
        return {
          text: 'SPLASHDOWN COMPLETE',
          color: 'text-[#FFFDFB]',
          border: 'border-[#2E140B]',
          bg: 'bg-[#2E140B]',
        };
      case 'NOT_STARTED':
      default:
        return {
          text: 'STANDBY (READY)',
          color: 'text-[#2E140B]',
          border: 'border-[#C84B1E]/30',
          bg: 'bg-[#F5E5D8]',
        };
    }
  };

  const statusInfo = getStatusDisplay();

  const cards = [
    {
      title: 'Event Status',
      value: statusInfo.text,
      sub: 'Official Hackathon Timeline',
      icon: Activity,
      iconColor: 'text-[#C84B1E]',
      badgeColor: statusInfo.color,
      badgeBorder: statusInfo.border,
      badgeBg: statusInfo.bg,
    },
    {
      title: 'Total Duration',
      value: '24 Hours',
      sub: '86,400 Total Seconds',
      icon: Zap,
      iconColor: 'text-[#C26D1F]',
    },
    {
      title: 'Launch Time',
      value: formatDate(startTimeDate),
      sub: startTimeDate ? 'Mission Commenced' : 'Scheduled: 10:30 AM Day 1',
      icon: Calendar,
      iconColor: 'text-[#2E140B]',
    },
    {
      title: 'Expected Splashdown',
      value: formatDate(expectedEndTimeDate),
      sub: expectedEndTimeDate ? 'Final Wrap-up' : 'Scheduled: 9:30 AM Day 2',
      icon: Clock,
      iconColor: 'text-[#C26D1F]',
    },
    {
      title: 'Time Elapsed',
      value: `${formattedElapsed.hours}:${formattedElapsed.minutes}:${formattedElapsed.seconds}`,
      sub: 'Wall-clock Duration',
      icon: Hourglass,
      iconColor: 'text-[#C84B1E]',
      mono: true,
    },
    {
      title: 'Time Remaining',
      value: `${formattedRemaining.hours}:${formattedRemaining.minutes}:${formattedRemaining.seconds}`,
      sub: 'Until Final Bells',
      icon: TrendingUp,
      iconColor: 'text-[#2E140B]',
      mono: true,
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-4 mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-black text-[#2E140B] tracking-wide uppercase flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#C84B1E]" />
          <span>Mission Control Telemetry</span>
        </h2>
        <span className="text-xs font-mono text-[#6B4433] font-bold">
          REAL-TIME SYNC
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="martian-sand-panel p-5 rounded-2xl relative group hover:border-[#C84B1E]/60 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-[#C84B1E] uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl bg-[#F5E5D8] border border-[#C84B1E]/20 ${card.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-1">
                {card.badgeColor ? (
                  <div
                    className={`inline-block px-3 py-1 rounded-lg text-xs font-bold tracking-wider ${card.badgeBg} ${card.badgeBorder} ${card.badgeColor} border`}
                  >
                    {card.value}
                  </div>
                ) : (
                  <div
                    className={`text-xl sm:text-2xl font-black text-[#2E140B] tracking-tight ${
                      card.mono ? 'font-mono tabular-nums' : ''
                    }`}
                  >
                    {card.value}
                  </div>
                )}
                <p className="mt-1.5 text-xs text-[#6B4433] font-medium">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
