'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  StoredTimerData,
  TimerSettings,
  TimerCalculations,
  Milestone,
} from '@/types/timer';
import { DEFAULT_DURATION_MS, HACKATHON_MILESTONES, EVENT_METADATA } from '@/lib/constants';
import { soundManager } from '@/lib/audio';
import { triggerCompletionCelebration } from '@/lib/confetti';

const STORAGE_KEY = 'martian_timer_state_v2';
const SETTINGS_KEY = 'martian_timer_settings_v2';

const defaultSettings: TimerSettings = {
  eventName: EVENT_METADATA.name,
  eventSubtitle: EVENT_METADATA.subtitle,
  organizerName: EVENT_METADATA.organizer,
  durationMs: DEFAULT_DURATION_MS,
  soundEnabled: true,
  volume: 0.8,
  showMilliseconds: false,
  theme: 'martian-mars',
};

const initialStoredData: StoredTimerData = {
  status: 'NOT_STARTED',
  startTime: null,
  targetDuration: DEFAULT_DURATION_MS,
  pauseTime: null,
  totalPausedDuration: 0,
  alertsTriggered: [],
  updatedAt: 0,
};

export function useTimer() {
  const [data, setData] = useState<StoredTimerData>(initialStoredData);
  const [settings, setSettings] = useState<TimerSettings>(defaultSettings);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isUniversalSynced, setIsUniversalSynced] = useState(false);
  const [serverOffsetMs, setServerOffsetMs] = useState(0);

  // High-frequency render state (initialized to 0 to avoid SSR prerender Date.now() warning)
  const [now, setNow] = useState<number>(0);
  const rafRef = useRef<number | null>(null);
  const lastUpdatedAtRef = useRef<number>(0);

  // Push state to universal server endpoint
  const pushToServer = useCallback(async (newData: StoredTimerData) => {
    try {
      const res = await fetch('/api/timer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: newData }),
      });
      if (res.ok) {
        setIsUniversalSynced(true);
      }
    } catch {
      // Offline or serverless fallback; localStorage & URL sync still work
    }
  }, []);

  // Read stored data, URL ?sync= param, and server state on mount
  useEffect(() => {
    setNow(Date.now());

    const init = async () => {
      let localParsed: StoredTimerData | null = null;

      try {
        // 1. Check URL ?sync= parameter (highest priority for cross-device link sharing)
        const params = new URLSearchParams(window.location.search);
        const syncParam = params.get('sync');
        if (syncParam) {
          const decoded = JSON.parse(atob(syncParam)) as StoredTimerData;
          if (decoded && decoded.status) {
            decoded.updatedAt = decoded.updatedAt || Date.now();
            localParsed = decoded;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(decoded));
            pushToServer(decoded);
            // Clean URL without reloading
            window.history.replaceState({}, '', window.location.pathname);
          }
        }

        // 2. Load localStorage if not overridden by URL
        if (!localParsed) {
          const savedTimer = localStorage.getItem(STORAGE_KEY);
          if (savedTimer) {
            localParsed = JSON.parse(savedTimer) as StoredTimerData;
          }
        }

        if (localParsed) {
          lastUpdatedAtRef.current = localParsed.updatedAt || 0;
          setData(localParsed);
        }

        // 3. Load settings
        const savedSettings = localStorage.getItem(SETTINGS_KEY);
        if (savedSettings) {
          const parsedSettings: TimerSettings = JSON.parse(savedSettings);
          setSettings(parsedSettings);
          soundManager.setMuted(!parsedSettings.soundEnabled);
          soundManager.setVolume(parsedSettings.volume);
        }

        // 4. Fetch universal state from server
        const res = await fetch('/api/timer', { cache: 'no-store' });
        if (res.ok) {
          const payload = await res.json();
          const serverState = payload.state as StoredTimerData;
          if (payload.serverTime) {
            setServerOffsetMs(payload.serverTime - Date.now());
          }
          setIsUniversalSynced(true);

          const serverUpdated = serverState?.updatedAt || 0;
          const localUpdated = localParsed?.updatedAt || 0;

          if (serverUpdated > localUpdated && serverState.status) {
            lastUpdatedAtRef.current = serverUpdated;
            setData(serverState);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(serverState));
          } else if (localUpdated > serverUpdated && localParsed) {
            pushToServer(localParsed);
          }
        }
      } catch (err) {
        console.error('Failed initializing timer state:', err);
      } finally {
        setIsInitialized(true);
      }
    };

    init();
  }, [pushToServer]);

  // Poll universal server every 2.5 seconds so all devices stay in sync
  useEffect(() => {
    if (!isInitialized) return;

    const pollServer = async () => {
      try {
        const res = await fetch('/api/timer', { cache: 'no-store' });
        if (!res.ok) return;
        const payload = await res.json();
        const serverState = payload.state as StoredTimerData;
        if (payload.serverTime) {
          setServerOffsetMs(payload.serverTime - Date.now());
        }
        setIsUniversalSynced(true);

        const serverUpdated = serverState?.updatedAt || 0;
        if (serverUpdated > lastUpdatedAtRef.current && serverState.status) {
          lastUpdatedAtRef.current = serverUpdated;
          setData(serverState);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(serverState));
        }
      } catch {
        // Ignore transient network errors during polling
      }
    };

    const interval = setInterval(pollServer, 2500);
    return () => clearInterval(interval);
  }, [isInitialized]);

  // Save changes to localStorage + universal server
  const persistData = useCallback(
    (newData: StoredTimerData) => {
      const stamped: StoredTimerData = {
        ...newData,
        updatedAt: Date.now(),
      };
      lastUpdatedAtRef.current = stamped.updatedAt!;
      setData(stamped);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stamped));
      } catch (e) {
        console.error('Error persisting timer state:', e);
      }
      pushToServer(stamped);
    },
    [pushToServer]
  );

  const persistSettings = useCallback((newSettings: TimerSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (e) {
      console.error('Error persisting settings:', e);
    }
  }, []);

  // Listen to multi-tab storage updates
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue) as StoredTimerData;
          lastUpdatedAtRef.current = parsed.updatedAt || Date.now();
          setData(parsed);
        } catch {}
      }
      if (e.key === SETTINGS_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setSettings(parsed);
        } catch {}
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Handle visibility change (tab coming back from sleep/background)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setNow(Date.now());
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Real-time animation loop for millisecond-level precision without drift
  useEffect(() => {
    let lastTick = performance.now();

    const loop = (time: number) => {
      if (time - lastTick >= 30) {
        setNow(Date.now());
        lastTick = time;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Calculate elapsed & remaining times derived strictly from wall-clock timestamps
  const calculateMetrics = (): TimerCalculations => {
    const { status, startTime, targetDuration, pauseTime, totalPausedDuration } = data;
    const adjustedNow = now > 0 ? now + serverOffsetMs : 0;

    let elapsedMs = 0;
    if (status === 'NOT_STARTED' || !startTime) {
      elapsedMs = 0;
    } else if (status === 'PAUSED' && pauseTime) {
      elapsedMs = Math.max(0, pauseTime - startTime - totalPausedDuration);
    } else {
      const currentStamp = adjustedNow > 0 ? adjustedNow : startTime;
      elapsedMs = Math.max(0, currentStamp - startTime - totalPausedDuration);
    }

    if (elapsedMs > targetDuration) {
      elapsedMs = targetDuration;
    }

    const remainingMs = Math.max(0, targetDuration - elapsedMs);
    const progressPercent = targetDuration > 0 ? (elapsedMs / targetDuration) * 100 : 0;

    const remTotalSeconds = Math.floor(remainingMs / 1000);
    const remHours = Math.floor(remTotalSeconds / 3600);
    const remMinutes = Math.floor((remTotalSeconds % 3600) / 60);
    const remSeconds = remTotalSeconds % 60;
    const remMs = Math.floor((remainingMs % 1000) / 10);

    const elTotalSeconds = Math.floor(elapsedMs / 1000);
    const elHours = Math.floor(elTotalSeconds / 3600);
    const elMinutes = Math.floor((elTotalSeconds % 3600) / 60);
    const elSeconds = elTotalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');

    const elapsedHours = elapsedMs / (1000 * 60 * 60);
    let currentMilestone = HACKATHON_MILESTONES[0];
    let nextMilestone: Milestone | null = null;

    for (let i = 0; i < HACKATHON_MILESTONES.length; i++) {
      const m = HACKATHON_MILESTONES[i];
      if (elapsedHours >= m.hoursOffset) {
        currentMilestone = m;
      } else {
        nextMilestone = m;
        break;
      }
    }

    let timeToNextMilestoneMs: number | null = null;
    if (nextMilestone) {
      const milestoneTargetMs = (nextMilestone.hoursOffset / 24) * targetDuration;
      timeToNextMilestoneMs = Math.max(0, milestoneTargetMs - elapsedMs);
    }

    let startTimeDate: Date | null = null;
    let expectedEndTimeDate: Date | null = null;

    if (startTime) {
      startTimeDate = new Date(startTime);
      const currentStamp = adjustedNow > 0 ? adjustedNow : startTime;
      const pausedOffset =
        status === 'PAUSED' && pauseTime
          ? totalPausedDuration + (currentStamp - pauseTime)
          : totalPausedDuration;
      expectedEndTimeDate = new Date(startTime + targetDuration + pausedOffset);
    }

    return {
      status,
      elapsedMs,
      remainingMs,
      progressPercent,
      formattedRemaining: {
        hours: pad(remHours),
        minutes: pad(remMinutes),
        seconds: pad(remSeconds),
        milliseconds: pad(remMs),
      },
      formattedElapsed: {
        hours: pad(elHours),
        minutes: pad(elMinutes),
        seconds: pad(elSeconds),
      },
      startTimeDate,
      expectedEndTimeDate,
      currentMilestone,
      nextMilestone,
      timeToNextMilestoneMs,
    };
  };

  const metrics = calculateMetrics();

  // Check audio alerts & completion state transitions
  useEffect(() => {
    if (!isInitialized || data.status !== 'LIVE') return;

    const remainingSec = Math.floor(metrics.remainingMs / 1000);

    if (remainingSec <= 0 && data.status === 'LIVE') {
      const updated: StoredTimerData = {
        ...data,
        status: 'COMPLETED',
      };
      persistData(updated);
      soundManager.playCompletionFanfare();
      triggerCompletionCelebration();
      return;
    }

    const thresholds = [
      { id: 'alert_1h', sec: 3600, intensity: 'gentle' as const },
      { id: 'alert_30m', sec: 1800, intensity: 'gentle' as const },
      { id: 'alert_10m', sec: 600, intensity: 'medium' as const },
      { id: 'alert_5m', sec: 300, intensity: 'urgent' as const },
      { id: 'alert_1m', sec: 60, intensity: 'urgent' as const },
    ];

    for (const t of thresholds) {
      if (remainingSec <= t.sec && remainingSec >= t.sec - 2) {
        if (!data.alertsTriggered.includes(t.id)) {
          soundManager.playAlertChime(t.intensity);
          const updated: StoredTimerData = {
            ...data,
            alertsTriggered: [...data.alertsTriggered, t.id],
          };
          persistData(updated);
        }
      }
    }
  }, [isInitialized, data, metrics.remainingMs, persistData]);

  // Update dynamic browser tab title
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const { formattedRemaining, status } = metrics;
    const timeStr = `${formattedRemaining.hours}:${formattedRemaining.minutes}:${formattedRemaining.seconds}`;

    if (status === 'LIVE') {
      document.title = `[${timeStr}] • ${settings.eventName} LIVE`;
    } else if (status === 'PAUSED') {
      document.title = `[PAUSED ${timeStr}] • ${settings.eventName}`;
    } else if (status === 'COMPLETED') {
      document.title = `🚀 SPLASHDOWN • ${settings.eventName}`;
    } else {
      document.title = `${settings.eventName} | 24-Hour Mission Control`;
    }
  }, [metrics, settings.eventName]);

  // Timer controls
  const startTimer = useCallback(() => {
    soundManager.playClick();
    const currentTimestamp = Date.now() + serverOffsetMs;
    const updated: StoredTimerData = {
      status: 'LIVE',
      startTime: currentTimestamp,
      targetDuration: settings.durationMs,
      pauseTime: null,
      totalPausedDuration: 0,
      alertsTriggered: [],
    };
    persistData(updated);
  }, [persistData, settings.durationMs, serverOffsetMs]);

  const pauseTimer = useCallback(() => {
    soundManager.playClick();
    if (data.status !== 'LIVE') return;
    const currentTimestamp = Date.now() + serverOffsetMs;
    const updated: StoredTimerData = {
      ...data,
      status: 'PAUSED',
      pauseTime: currentTimestamp,
    };
    persistData(updated);
  }, [data, persistData, serverOffsetMs]);

  const resumeTimer = useCallback(() => {
    soundManager.playClick();
    if (data.status !== 'PAUSED' || !data.pauseTime) return;
    const currentTimestamp = Date.now() + serverOffsetMs;
    const pauseInterval = currentTimestamp - data.pauseTime;
    const updated: StoredTimerData = {
      ...data,
      status: 'LIVE',
      pauseTime: null,
      totalPausedDuration: data.totalPausedDuration + pauseInterval,
    };
    persistData(updated);
  }, [data, persistData, serverOffsetMs]);

  const resetTimer = useCallback(() => {
    soundManager.playClick();
    const updated: StoredTimerData = {
      status: 'NOT_STARTED',
      startTime: null,
      targetDuration: settings.durationMs,
      pauseTime: null,
      totalPausedDuration: 0,
      alertsTriggered: [],
    };
    persistData(updated);
  }, [persistData, settings.durationMs]);

  const setDemoRemaining = useCallback(
    (seconds: number) => {
      soundManager.playClick();
      const currentTimestamp = Date.now() + serverOffsetMs;
      const testTarget = seconds * 1000;
      const fakeElapsed = settings.durationMs - testTarget;
      const updated: StoredTimerData = {
        status: 'LIVE',
        startTime: currentTimestamp - fakeElapsed,
        targetDuration: settings.durationMs,
        pauseTime: null,
        totalPausedDuration: 0,
        alertsTriggered: [],
      };
      persistData(updated);
    },
    [persistData, settings.durationMs, serverOffsetMs]
  );

  const setCustomTime = useCallback(
    (hours: number, minutes: number, seconds: number) => {
      soundManager.playClick();
      const totalMs = Math.max(1000, (hours * 3600 + minutes * 60 + seconds) * 1000);

      if (data.status === 'NOT_STARTED') {
        const updatedSettings = { ...settings, durationMs: totalMs };
        persistSettings(updatedSettings);
        persistData({
          ...data,
          targetDuration: totalMs,
          alertsTriggered: [],
        });
        return;
      }

      const currentTimestamp = Date.now() + serverOffsetMs;
      const effectiveDuration = Math.max(settings.durationMs, totalMs);
      if (effectiveDuration !== settings.durationMs) {
        persistSettings({ ...settings, durationMs: effectiveDuration });
      }
      const fakeElapsed = effectiveDuration - totalMs;

      if (data.status === 'PAUSED') {
        persistData({
          status: 'PAUSED',
          startTime: currentTimestamp - fakeElapsed,
          targetDuration: effectiveDuration,
          pauseTime: currentTimestamp,
          totalPausedDuration: 0,
          alertsTriggered: [],
        });
      } else {
        persistData({
          status: 'LIVE',
          startTime: currentTimestamp - fakeElapsed,
          targetDuration: effectiveDuration,
          pauseTime: null,
          totalPausedDuration: 0,
          alertsTriggered: [],
        });
      }
    },
    [data, settings, persistData, persistSettings, serverOffsetMs]
  );

  const getShareableSyncUrl = useCallback(() => {
    if (typeof window === 'undefined') return '';
    try {
      const encoded = btoa(JSON.stringify(data));
      return `${window.location.origin}${window.location.pathname}?sync=${encodeURIComponent(encoded)}`;
    } catch {
      return window.location.href;
    }
  }, [data]);

  const toggleSound = useCallback(() => {
    const nextSound = !settings.soundEnabled;
    const updated = { ...settings, soundEnabled: nextSound };
    persistSettings(updated);
    soundManager.setMuted(!nextSound);
    if (nextSound) soundManager.playClick();
  }, [settings, persistSettings]);

  const updateSettings = useCallback(
    (newPartial: Partial<TimerSettings>) => {
      const updated = { ...settings, ...newPartial };
      persistSettings(updated);
      if (newPartial.soundEnabled !== undefined) {
        soundManager.setMuted(!newPartial.soundEnabled);
      }
      if (newPartial.volume !== undefined) {
        soundManager.setVolume(newPartial.volume);
      }
      if (newPartial.durationMs && data.status === 'NOT_STARTED') {
        persistData({
          ...data,
          targetDuration: newPartial.durationMs,
        });
      }
    },
    [settings, persistSettings, data, persistData]
  );

  return {
    isInitialized,
    isUniversalSynced,
    data,
    settings,
    metrics,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    setDemoRemaining,
    setCustomTime,
    getShareableSyncUrl,
    toggleSound,
    updateSettings,
  };
}
