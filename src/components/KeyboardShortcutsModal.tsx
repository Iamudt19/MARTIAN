'use client';

import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { soundManager } from '@/lib/audio';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Start, Pause or Resume Countdown' },
    { key: 'F', desc: 'Toggle Timer-Only Fullscreen Mode' },
    { key: 'R', desc: 'Prompt Timer Reset' },
    { key: 'M', desc: 'Toggle Audio Mute / Unmute' },
    { key: '?', desc: 'Open / Close this shortcuts menu' },
    { key: 'Esc', desc: 'Close any active modal or stage view' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E140B]/75 backdrop-blur-md">
      <div className="relative w-full max-w-md glass-panel p-6 sm:p-7 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#C84B1E]/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#C84B1E]/25 text-[#F5D0B5]">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#FFFDFB] tracking-wide">
                Keyboard Shortcuts
              </h2>
              <p className="text-xs text-[#E4C5B4]">
                Quick triggers for venue operators & stage managers
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

        <div className="mt-5 space-y-3">
          {shortcuts.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-[#4A2315] border border-[#C84B1E]/25"
            >
              <span className="text-xs text-[#F9EDE4] font-medium">
                {item.desc}
              </span>
              <kbd className="px-2.5 py-1 rounded-lg bg-[#2E140B] border border-[#C84B1E]/40 text-xs font-mono font-bold text-[#F5D0B5] shadow-sm">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-[#C84B1E]/25 text-center">
          <p className="text-[11px] text-[#E4C5B4] font-mono">
            MARTIAN 1.0 • BMSITM & CSE Division 4
          </p>
        </div>
      </div>
    </div>
  );
};
