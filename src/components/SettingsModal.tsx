'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Sliders,
  Play,
  RotateCcw,
  Check,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { TimerSettings, TimerStatus, TimerCalculations } from '@/types/timer';
import { soundManager } from '@/lib/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TimerSettings;
  status: TimerStatus;
  metrics: TimerCalculations;
  onUpdateSettings: (newPartial: Partial<TimerSettings>) => void;
  onSetDemoRemaining: (seconds: number) => void;
  onSetCustomTime: (hours: number, minutes: number, seconds: number) => void;
  onPromptReset: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  status,
  metrics,
  onUpdateSettings,
  onSetDemoRemaining,
  onSetCustomTime,
  onPromptReset,
}) => {
  const [eventNameInput, setEventNameInput] = useState(settings.eventName);
  const [hoursInput, setHoursInput] = useState(metrics.formattedRemaining.hours);
  const [minutesInput, setMinutesInput] = useState(metrics.formattedRemaining.minutes);
  const [secondsInput, setSecondsInput] = useState(metrics.formattedRemaining.seconds);

  useEffect(() => {
    if (isOpen) {
      setEventNameInput(settings.eventName);
      setHoursInput(metrics.formattedRemaining.hours);
      setMinutesInput(metrics.formattedRemaining.minutes);
      setSecondsInput(metrics.formattedRemaining.seconds);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (eventNameInput.trim()) {
      onUpdateSettings({ eventName: eventNameInput.trim() });
    }
  };

  const handleApplyTime = (e: React.FormEvent) => {
    e.preventDefault();
    const h = Math.max(0, Math.min(999, parseInt(hoursInput || '0', 10) || 0));
    const m = Math.max(0, Math.min(59, parseInt(minutesInput || '0', 10) || 0));
    const s = Math.max(0, Math.min(59, parseInt(secondsInput || '0', 10) || 0));
    onSetCustomTime(h, m, s);
    onClose();
  };

  const applyPresetHours = (h: number) => {
    setHoursInput(h.toString().padStart(2, '0'));
    setMinutesInput('00');
    setSecondsInput('00');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E140B]/75 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-panel p-6 sm:p-8 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto text-[#FFFDFB]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#C84B1E]/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#C84B1E]/25 text-[#F5D0B5]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#FFFDFB] tracking-wide">
                Control Center Settings
              </h2>
              <p className="text-xs text-[#E4C5B4]">
                Edit countdown time, event title, audio & demo modes
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-[#E4C5B4] hover:text-[#FFFDFB] hover:bg-[#4A2315] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {/* Edit Countdown Time */}
          <form
            onSubmit={handleApplyTime}
            className="p-4 rounded-xl bg-[#4A2315] border border-[#C84B1E]/40 space-y-3"
          >
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#F5D0B5] uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C84B1E]" />
                <span>Edit Countdown Time (HH : MM : SS)</span>
              </label>
              <span className="text-[10px] font-mono text-[#E4C5B4]">
                {status === 'NOT_STARTED' ? 'Sets Duration' : 'Updates Live Clock'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] font-mono text-[#E4C5B4] uppercase block mb-1">
                  Hours
                </span>
                <input
                  type="number"
                  min={0}
                  max={999}
                  value={hoursInput}
                  onChange={(e) => setHoursInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#2E140B] border border-[#C84B1E]/40 text-[#FFFDFB] font-mono text-center text-base font-bold focus:outline-none focus:border-[#C84B1E]"
                />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#E4C5B4] uppercase block mb-1">
                  Minutes
                </span>
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={minutesInput}
                  onChange={(e) => setMinutesInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#2E140B] border border-[#C84B1E]/40 text-[#FFFDFB] font-mono text-center text-base font-bold focus:outline-none focus:border-[#C84B1E]"
                />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#E4C5B4] uppercase block mb-1">
                  Seconds
                </span>
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={secondsInput}
                  onChange={(e) => setSecondsInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#2E140B] border border-[#C84B1E]/40 text-[#FFFDFB] font-mono text-center text-base font-bold focus:outline-none focus:border-[#C84B1E]"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1.5">
                {[12, 24, 36, 48].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => applyPresetHours(h)}
                    className="px-2.5 py-1 rounded-lg bg-[#2E140B] hover:bg-[#C84B1E] border border-[#C84B1E]/35 text-[11px] font-mono text-[#F9EDE4] transition"
                  >
                    {h}h
                  </button>
                ))}
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#C84B1E] hover:bg-[#B93815] text-[#FFFDFB] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition shadow-md"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply Time</span>
              </button>
            </div>
          </form>

          {/* Hackathon Event Name */}
          <form onSubmit={handleSaveName} className="space-y-2">
            <label className="text-xs font-semibold text-[#F5D0B5] uppercase tracking-wider block">
              Event Title
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={eventNameInput}
                onChange={(e) => setEventNameInput(e.target.value)}
                placeholder="e.g. MARTIAN 1.0"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#4A2315] border border-[#C84B1E]/35 text-[#FFFDFB] placeholder-[#B89482] text-sm focus:outline-none focus:border-[#C84B1E]"
              />
              <button
                type="submit"
                onClick={() => soundManager.playClick()}
                className="px-4 py-2.5 rounded-xl bg-[#C84B1E] hover:bg-[#B93815] text-[#FFFDFB] font-semibold text-xs flex items-center gap-1.5 transition"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </form>

          {/* Sound & Alert Controls */}
          <div className="p-4 rounded-xl bg-[#4A2315] border border-[#C84B1E]/30 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-[#FFFDFB] block">
                  Audio Alerts
                </span>
                <span className="text-xs text-[#E4C5B4]">
                  Synthesized chimes at 1h, 30m, 10m, 5m, 1m & completion
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onUpdateSettings({ soundEnabled: !settings.soundEnabled });
                }}
                className={`p-2.5 rounded-xl border transition ${
                  settings.soundEnabled
                    ? 'bg-[#C84B1E] border-[#F5D0B5]/30 text-[#FFFDFB]'
                    : 'bg-[#2E140B] border-[#C84B1E]/30 text-[#B89482]'
                }`}
              >
                {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>

            {settings.soundEnabled && (
              <div className="space-y-2 pt-2 border-t border-[#C84B1E]/25">
                <div className="flex justify-between text-xs text-[#E4C5B4]">
                  <span>Sound Volume</span>
                  <span>{Math.round(settings.volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={settings.volume}
                  onChange={(e) => {
                    const vol = parseFloat(e.target.value);
                    onUpdateSettings({ volume: vol });
                  }}
                  className="w-full accent-[#C84B1E] cursor-pointer"
                />

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => soundManager.playAlertChime('medium')}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-[#2E140B] hover:bg-[#C84B1E] border border-[#C84B1E]/35 text-xs text-[#F9EDE4] font-mono transition"
                  >
                    🔔 Test Alert Chime
                  </button>
                  <button
                    type="button"
                    onClick={() => soundManager.playCompletionFanfare()}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-[#C84B1E]/25 hover:bg-[#C84B1E] border border-[#C84B1E]/40 text-xs text-[#F5D0B5] hover:text-[#FFFDFB] font-mono transition"
                  >
                    🎉 Test Victory Fanfare
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Milliseconds Precision Display */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#4A2315] border border-[#C84B1E]/30">
            <div>
              <span className="text-sm font-semibold text-[#FFFDFB] block">
                Show Milliseconds
              </span>
              <span className="text-xs text-[#E4C5B4]">
                Adds high-speed .MS digit display to hero countdown
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onUpdateSettings({ showMilliseconds: !settings.showMilliseconds });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 border ${
                settings.showMilliseconds
                  ? 'bg-[#C84B1E] border-[#F5D0B5]/40'
                  : 'bg-[#2E140B] border-[#C84B1E]/30'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#FFFDFB] transition-transform ${
                  settings.showMilliseconds ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Organizer Demo Modes */}
          <div className="p-4 rounded-xl bg-[#4A2315] border border-[#C84B1E]/35 space-y-3">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5D0B5] block">
                Organizer Presentation & Testing Mode
              </span>
              <span className="text-xs text-[#E4C5B4]">
                Quickly test countdown alerts and zero-second celebration
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  onSetDemoRemaining(10);
                  onClose();
                }}
                className="py-2 px-3 rounded-xl bg-[#2E140B] hover:bg-[#C84B1E] border border-[#C84B1E]/40 text-[#F9EDE4] text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Play className="w-3.5 h-3.5 fill-[#C84B1E]" />
                <span>Jump to 10s Demo</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSetDemoRemaining(65);
                  onClose();
                }}
                className="py-2 px-3 rounded-xl bg-[#C84B1E]/25 hover:bg-[#C84B1E] border border-[#C84B1E]/40 text-[#F5D0B5] hover:text-[#FFFDFB] text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Jump to 1m Alert</span>
              </button>
            </div>
          </div>

          {/* Hard Reset */}
          {status !== 'NOT_STARTED' && (
            <div className="p-4 rounded-xl bg-[#4A2315] border border-[#C84B1E]/50 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#F5D0B5] uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#C84B1E]" />
                  <span>Reset All Timer Data</span>
                </span>
                <span className="text-[11px] text-[#E4C5B4]">
                  Clears local storage and returns to 24:00:00
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onPromptReset();
                }}
                className="px-3 py-1.5 rounded-lg bg-[#C84B1E] hover:bg-[#B93815] text-[#FFFDFB] text-xs font-semibold flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
