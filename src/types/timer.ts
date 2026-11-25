export type TimerStatus = 'NOT_STARTED' | 'LIVE' | 'PAUSED' | 'COMPLETED';

export interface Milestone {
  id: string;
  stepNumber: string; // e.g. "01", "02"
  day: 'DAY 1' | 'DAY 2';
  hoursOffset: number; // in hours from 10:30 AM Day 1 launch
  timeLabel: string; // e.g. "10:30 AM", "2:30 – 4:00 PM"
  title: string;
  description: string;
  deliverable: string;
  iconName: string;
}

export interface RuleItem {
  number: string;
  title: string;
  points: string[];
}

export interface TimerSettings {
  eventName: string;
  eventSubtitle: string;
  organizerName: string;
  durationMs: number; // default 24 * 60 * 60 * 1000
  soundEnabled: boolean;
  volume: number; // 0 to 1
  showMilliseconds: boolean;
  theme: 'martian-mars' | 'deep-space' | 'obsidian';
}

export interface StoredTimerData {
  status: TimerStatus;
  startTime: number | null; // epoch timestamp
  targetDuration: number; // ms
  pauseTime: number | null; // epoch timestamp when paused
  totalPausedDuration: number; // accumulated paused ms
  alertsTriggered: string[]; // ids of milestones or alerts already chimed
  updatedAt?: number; // epoch timestamp of last state mutation for universal sync
}

export interface TimerCalculations {
  status: TimerStatus;
  elapsedMs: number;
  remainingMs: number;
  progressPercent: number; // 0 to 100
  formattedRemaining: {
    hours: string;
    minutes: string;
    seconds: string;
    milliseconds: string;
  };
  formattedElapsed: {
    hours: string;
    minutes: string;
    seconds: string;
  };
  startTimeDate: Date | null;
  expectedEndTimeDate: Date | null;
  currentMilestone: Milestone;
  nextMilestone: Milestone | null;
  timeToNextMilestoneMs: number | null;
}
