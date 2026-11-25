'use client';

import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Settings,
  HelpCircle,
  Monitor,
  Clock,
  Sparkles,
  BookOpen,
  Share2,
  Check,
  Globe,
  Rocket,
} from 'lucide-react';
import { TimerStatus } from '@/types/timer';
import { soundManager } from '@/lib/audio';

interface NavbarProps {
  eventName: string;
  organizerName: string;
  status: TimerStatus;
  isUniversalSynced: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isProjectorMode: boolean;
  onToggleProjectorMode: () => void;
  onOpenRulebook: () => void;
  onCopySyncLink: () => void;
  onOpenSettings: () => void;
  onOpenShortcuts: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  eventName,
  organizerName,
  status,
  isUniversalSynced,
  soundEnabled,
  onToggleSound,
  isFullscreen,
  onToggleFullscreen,
  isProjectorMode,
  onToggleProjectorMode,
  onOpenRulebook,
  onCopySyncLink,
  onOpenSettings,
  onOpenShortcuts,
}) => {
  const [localTime, setLocalTime] = useState<string>('');
  const [timeZone, setTimeZone] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLocalTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      );
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimeZone(tz.split('/').pop()?.replace('_', ' ') || 'LOCAL');
      } catch {
        setTimeZone('LOCAL');
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    soundManager.playClick();
    onCopySyncLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'LIVE':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C84B1E] text-[#FFFDFB] text-[11px] font-bold tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FBF4EC] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFFDFB]"></span>
            </span>
            <span>LIVE</span>
          </div>
        );
      case 'PAUSED':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C26D1F] text-[#FFFDFB] text-[11px] font-bold tracking-wider">
            <span className="h-2 w-2 rounded-full bg-[#FBF4EC]"></span>
            <span>PAUSED</span>
          </div>
        );
      case 'COMPLETED':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C84B1E] text-[#FFFDFB] text-[11px] font-bold tracking-wider">
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span>SPLASHDOWN</span>
          </div>
        );
      case 'NOT_STARTED':
      default:
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#4A2315] border border-[#C84B1E]/35 text-[#F9EDE4] text-[11px] font-semibold tracking-wider">
            <span className="h-2 w-2 rounded-full bg-[#D9B6A3]"></span>
            <span>STANDBY</span>
          </div>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-[#C84B1E] bg-[#2E140B] text-[#FFFDFB] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Left: Martian Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#C84B1E] border border-[#F9EDE4]/25 shadow-sm">
            <Rocket className="w-4 h-4 text-[#FFFDFB]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-black tracking-tight text-[#FFFDFB] text-sm sm:text-base">
                {eventName}
              </span>
              {getStatusBadge()}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-widest text-[#E4C5B4]">
              <span>{organizerName}</span>
              {isUniversalSynced && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[#F5D0B5] font-semibold">
                  • <Globe className="w-2.5 h-2.5 text-[#C84B1E]" /> UNIVERSAL SYNC
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Venue Clock */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#4A2315] border border-[#C84B1E]/30 text-xs font-mono text-[#F9EDE4]">
          <Clock className="w-3.5 h-3.5 text-[#C84B1E]" />
          <span className="text-[#E4C5B4]">LOCAL:</span>
          <span className="text-[#FFFDFB] font-semibold tabular-nums">{localTime || '--:--:--'}</span>
          <span className="text-[10px] text-[#FFFDFB] bg-[#C84B1E] px-1.5 py-0.5 rounded uppercase font-bold">
            {timeZone}
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenRulebook();
            }}
            title="View Official Rulebook"
            className="px-2.5 py-1.5 rounded-lg bg-[#C84B1E] hover:bg-[#B93815] text-[#FFFDFB] border border-[#F9EDE4]/20 transition flex items-center gap-1.5 text-xs font-bold shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Rulebook</span>
          </button>

          <button
            onClick={handleCopy}
            title="Copy Universal Sync Link to open exact same clock on another device"
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg bg-[#4A2315] hover:bg-[#5C2D1B] text-[#FBF4EC] border border-[#C84B1E]/30 transition flex items-center gap-1.5 text-xs font-medium"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[#F5D0B5]" />
            ) : (
              <Share2 className="w-3.5 h-3.5 text-[#F5D0B5]" />
            )}
            <span className="hidden xl:inline">{copied ? 'Link Copied' : 'Sync Link'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onToggleSound();
            }}
            title={soundEnabled ? 'Mute Audio Alerts (M)' : 'Enable Audio Alerts (M)'}
            className="p-2 rounded-lg bg-[#4A2315] hover:bg-[#5C2D1B] text-[#FBF4EC] border border-[#C84B1E]/30 transition"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#F5D0B5]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#B89482]" />
            )}
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onToggleProjectorMode();
            }}
            title="Toggle Stage Projector View"
            className={`p-2 sm:px-2.5 sm:py-1.5 rounded-lg border transition flex items-center gap-1.5 text-xs font-medium ${
              isProjectorMode
                ? 'bg-[#C84B1E] text-[#FFFDFB] border-[#F9EDE4]/30'
                : 'bg-[#4A2315] hover:bg-[#5C2D1B] text-[#FBF4EC] border-[#C84B1E]/30'
            }`}
          >
            <Monitor className="w-3.5 h-3.5 text-[#F5D0B5]" />
            <span className="hidden lg:inline">Stage</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onToggleFullscreen();
            }}
            title="Enter Timer-Only Fullscreen (F)"
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg bg-[#4A2315] hover:bg-[#5C2D1B] text-[#FBF4EC] border border-[#C84B1E]/30 transition flex items-center gap-1.5 text-xs font-medium"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-[#F5D0B5]" />
            ) : (
              <Maximize2 className="w-4 h-4 text-[#F5D0B5]" />
            )}
            <span className="hidden xl:inline">Fullscreen</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenShortcuts();
            }}
            title="Keyboard Shortcuts (?)"
            className="hidden sm:flex p-2 rounded-lg bg-[#4A2315] hover:bg-[#5C2D1B] text-[#FBF4EC] border border-[#C84B1E]/30 transition"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenSettings();
            }}
            title="Settings & Edit Time"
            className="p-2 rounded-lg bg-[#4A2315] hover:bg-[#5C2D1B] text-[#FBF4EC] border border-[#C84B1E]/30 transition"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
