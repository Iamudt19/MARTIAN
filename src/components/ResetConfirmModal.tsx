'use client';

import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { soundManager } from '@/lib/audio';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E140B]/75 backdrop-blur-md">
      <div className="relative w-full max-w-md glass-panel p-6 sm:p-7 rounded-2xl border border-[#C84B1E]/50 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-[#C84B1E]/25 border border-[#C84B1E]/40 text-[#F5D0B5]">
            <AlertTriangle className="w-6 h-6 text-[#C84B1E]" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-[#FFFDFB] tracking-tight">
              Reset Hackathon Countdown?
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-[#E4C5B4] leading-relaxed">
              This will stop the current countdown, erase elapsed timestamp logs, and return the timer to <strong className="text-[#FFFDFB]">24:00:00</strong>.
            </p>
            <p className="mt-2 text-xs text-[#F5D0B5] font-medium">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#C84B1E]/25">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl bg-[#4A2315] hover:bg-[#5C2D1B] text-[#F9EDE4] text-xs font-semibold border border-[#C84B1E]/30 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onConfirmReset();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-[#C84B1E] hover:bg-[#B93815] text-[#FFFDFB] text-xs font-bold tracking-wide uppercase flex items-center gap-2 shadow-lg transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Confirm Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
