'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Minimize2, Play, Pause } from 'lucide-react';
import { useTimer } from '@/hooks/useTimer';
import { Navbar } from '@/components/Navbar';
import { HeroCountdown } from '@/components/HeroCountdown';
import { DashboardGrid } from '@/components/DashboardGrid';
import { MilestonesTimeline } from '@/components/MilestonesTimeline';
import { MotivationalCard } from '@/components/MotivationalCard';
import { SettingsModal } from '@/components/SettingsModal';
import { ResetConfirmModal } from '@/components/ResetConfirmModal';
import { KeyboardShortcutsModal } from '@/components/KeyboardShortcutsModal';
import { CompletionOverlay } from '@/components/CompletionOverlay';
import { ProjectorMode } from '@/components/ProjectorMode';
import { RulebookModal } from '@/components/RulebookModal';

export default function Home() {
  const {
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
  } = useTimer();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isRulebookOpen, setIsRulebookOpen] = useState(false);
  const [isProjectorMode, setIsProjectorMode] = useState(false);
  const [isCompletionDismissed, setIsCompletionDismissed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isCompletionOpen = data.status === 'COMPLETED' && !isCompletionDismissed;

  const handleCopySyncLink = useCallback(() => {
    const url = getShareableSyncUrl();
    if (url && navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
  }, [getShareableSyncUrl]);

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('Error enabling fullscreen:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.error('Error exiting fullscreen:', err);
        });
      }
    }
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (data.status === 'NOT_STARTED') {
          startTimer();
        } else if (data.status === 'LIVE') {
          pauseTimer();
        } else if (data.status === 'PAUSED') {
          resumeTimer();
        }
      }

      if (e.code === 'KeyF' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleToggleFullscreen();
      }

      if (e.code === 'KeyR' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (data.status !== 'NOT_STARTED') {
          setIsResetConfirmOpen(true);
        }
      }

      if (e.code === 'KeyM' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        toggleSound();
      }

      if (e.key === '?' || (e.shiftKey && e.code === 'Slash')) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      }

      if (e.code === 'Escape') {
        if (isProjectorMode) setIsProjectorMode(false);
        if (isSettingsOpen) setIsSettingsOpen(false);
        if (isResetConfirmOpen) setIsResetConfirmOpen(false);
        if (isShortcutsOpen) setIsShortcutsOpen(false);
        if (isRulebookOpen) setIsRulebookOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    data.status,
    startTimer,
    pauseTimer,
    resumeTimer,
    toggleSound,
    handleToggleFullscreen,
    isProjectorMode,
    isSettingsOpen,
    isResetConfirmOpen,
    isShortcutsOpen,
    isRulebookOpen,
  ]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#FBF4EC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#C84B1E] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono tracking-widest text-[#2E140B] uppercase font-bold">
            Synchronizing Martian Mission Clock...
          </span>
        </div>
      </div>
    );
  }

  // FULLSCREEN MODE: ONLY THE TIMER IS VISIBLE
  if (isFullscreen) {
    const { formattedRemaining } = metrics;
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-4 select-none overflow-hidden bg-[#FBF4EC]">
        {/* Minimal corner controls (appear subtly on hover) */}
        <div className="fixed top-4 right-4 z-20 flex items-center gap-2 opacity-30 hover:opacity-100 transition-opacity">
          {data.status === 'NOT_STARTED' && (
            <button
              onClick={startTimer}
              title="Start (Space)"
              className="p-2.5 rounded-xl bg-[#2E140B] text-[#FFFDFB] border border-[#C84B1E]/40 hover:bg-[#C84B1E] transition"
            >
              <Play className="w-4 h-4 fill-[#FFFDFB]" />
            </button>
          )}
          {data.status === 'LIVE' && (
            <button
              onClick={pauseTimer}
              title="Pause (Space)"
              className="p-2.5 rounded-xl bg-[#2E140B] text-[#F5D0B5] border border-[#C84B1E]/40 hover:bg-[#4A2315] transition"
            >
              <Pause className="w-4 h-4 fill-[#F5D0B5]" />
            </button>
          )}
          {data.status === 'PAUSED' && (
            <button
              onClick={resumeTimer}
              title="Resume (Space)"
              className="p-2.5 rounded-xl bg-[#2E140B] text-[#F5D0B5] border border-[#C84B1E]/40 hover:bg-[#C84B1E] transition"
            >
              <Play className="w-4 h-4 fill-[#F5D0B5]" />
            </button>
          )}
          <button
            onClick={handleToggleFullscreen}
            title="Exit Fullscreen (F or Esc)"
            className="p-2.5 rounded-xl bg-[#2E140B] text-[#FFFDFB] border border-[#C84B1E]/40 hover:bg-[#C84B1E] transition"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>

        {/* ONLY THE TIMER */}
        <div className="relative z-10 martian-timer-deck rounded-3xl px-6 py-7 sm:px-12 sm:py-10 md:px-16 md:py-12">
          <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-8 font-mono">
            <div className="flex flex-col items-center">
              <div className="digit-card px-5 py-6 sm:px-10 sm:py-10 md:px-12 md:py-12 rounded-2xl min-w-[95px] sm:min-w-[180px] md:min-w-[230px] flex items-center justify-center">
                <span className="text-5xl sm:text-8xl md:text-9xl font-black tracking-tight text-[#2E140B] tabular-nums leading-none">
                  {formattedRemaining.hours}
                </span>
              </div>
              <span className="mt-2.5 text-[11px] sm:text-xs font-mono tracking-[0.25em] text-[#C84B1E] font-bold uppercase">
                Hours
              </span>
            </div>

            <div className="text-4xl sm:text-7xl md:text-8xl font-black text-[#C84B1E] pb-7 animate-pulse">
              :
            </div>

            <div className="flex flex-col items-center">
              <div className="digit-card px-5 py-6 sm:px-10 sm:py-10 md:px-12 md:py-12 rounded-2xl min-w-[95px] sm:min-w-[180px] md:min-w-[230px] flex items-center justify-center">
                <span className="text-5xl sm:text-8xl md:text-9xl font-black tracking-tight text-[#2E140B] tabular-nums leading-none">
                  {formattedRemaining.minutes}
                </span>
              </div>
              <span className="mt-2.5 text-[11px] sm:text-xs font-mono tracking-[0.25em] text-[#C84B1E] font-bold uppercase">
                Minutes
              </span>
            </div>

            <div className="text-4xl sm:text-7xl md:text-8xl font-black text-[#C84B1E] pb-7 animate-pulse">
              :
            </div>

            <div className="flex flex-col items-center">
              <div className="digit-card px-5 py-6 sm:px-10 sm:py-10 md:px-12 md:py-12 rounded-2xl min-w-[95px] sm:min-w-[180px] md:min-w-[230px] flex items-center justify-center">
                <span className="text-5xl sm:text-8xl md:text-9xl font-black tracking-tight text-[#C84B1E] tabular-nums leading-none">
                  {formattedRemaining.seconds}
                </span>
              </div>
              <span className="mt-2.5 text-[11px] sm:text-xs font-mono tracking-[0.25em] text-[#C84B1E] font-bold uppercase">
                Seconds
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FBF4EC] text-[#2E140B] flex flex-col relative selection:bg-[#C84B1E]/20">
      {/* Subtle Martian sand & terracotta ambient gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(200,75,30,0.08),transparent_55%)]" />

      {/* Foreground Content (z-10) */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          eventName={settings.eventName}
          organizerName={settings.organizerName}
          status={data.status}
          isUniversalSynced={isUniversalSynced}
          soundEnabled={settings.soundEnabled}
          onToggleSound={toggleSound}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          isProjectorMode={isProjectorMode}
          onToggleProjectorMode={() => setIsProjectorMode((prev) => !prev)}
          onOpenRulebook={() => setIsRulebookOpen(true)}
          onCopySyncLink={handleCopySyncLink}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
        />

        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <HeroCountdown
            status={data.status}
            metrics={metrics}
            showMilliseconds={settings.showMilliseconds}
            onStart={startTimer}
            onPause={pauseTimer}
            onResume={resumeTimer}
            onPromptReset={() => setIsResetConfirmOpen(true)}
          />

          <DashboardGrid status={data.status} metrics={metrics} />

          <MilestonesTimeline metrics={metrics} />

          <MotivationalCard metrics={metrics} />
        </div>

        <footer className="w-full border-t-2 border-[#C84B1E] bg-[#2E140B] text-[#FFFDFB] py-7 px-4 text-center">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E4C5B4] font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C84B1E]" />
              <span>MARTIAN 1.0 • {settings.organizerName}</span>
            </div>
            <div>
              <span>UNIVERSAL MISSION CLOCK • PRECISION TIMESTAMP SYNC</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsRulebookOpen(true)}
                className="text-[#F5D0B5] hover:text-[#FFFDFB] transition underline"
              >
                Rulebook
              </button>
              <span>•</span>
              <button
                onClick={() => setIsShortcutsOpen(true)}
                className="text-[#E4C5B4] hover:text-[#FFFDFB] transition underline"
              >
                Hotkeys (?)
              </button>
              <span>•</span>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="text-[#E4C5B4] hover:text-[#FFFDFB] transition underline"
              >
                Settings
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals & Overlays */}
      <RulebookModal isOpen={isRulebookOpen} onClose={() => setIsRulebookOpen(false)} />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        status={data.status}
        metrics={metrics}
        onUpdateSettings={updateSettings}
        onSetDemoRemaining={setDemoRemaining}
        onSetCustomTime={setCustomTime}
        onPromptReset={() => {
          setIsSettingsOpen(false);
          setIsResetConfirmOpen(true);
        }}
      />

      <ResetConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirmReset={() => {
          resetTimer();
          setIsCompletionDismissed(false);
        }}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <CompletionOverlay
        isOpen={isCompletionOpen}
        eventName={settings.eventName}
        onDismiss={() => setIsCompletionDismissed(true)}
        onPromptReset={() => {
          setIsCompletionDismissed(true);
          setIsResetConfirmOpen(true);
        }}
      />

      <ProjectorMode
        isOpen={isProjectorMode}
        onClose={() => setIsProjectorMode(false)}
        eventName={settings.eventName}
        eventSubtitle={settings.eventSubtitle}
        status={data.status}
        metrics={metrics}
        soundEnabled={settings.soundEnabled}
        onToggleSound={toggleSound}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        onStart={startTimer}
        onPause={pauseTimer}
        onResume={resumeTimer}
      />
    </main>
  );
}
