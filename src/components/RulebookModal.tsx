'use client';

import React, { useState } from 'react';
import { X, ShieldAlert, BookOpen, Search } from 'lucide-react';
import { MARTIAN_RULEBOOK, EVENT_METADATA } from '@/lib/constants';
import { soundManager } from '@/lib/audio';

interface RulebookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulebookModal: React.FC<RulebookModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredRules = MARTIAN_RULEBOOK.filter(
    (rule) =>
      rule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.number.includes(searchQuery) ||
      rule.points.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E140B]/75 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-[#FBF4EC] text-[#2E140B] rounded-2xl border-2 border-[#C84B1E] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#C84B1E]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#2E140B] text-[#FFFDFB]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#C84B1E] text-[#FFFDFB]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight uppercase">
                MARTIAN 1.0 • Official Rulebook
              </h2>
              <p className="text-xs text-[#E4C5B4] font-mono">
                {EVENT_METADATA.organizer} • Rules, Regulations & Participant Guidelines
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-[#E4C5B4] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rules..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#4A2315] border border-[#C84B1E]/40 text-xs text-[#FFFDFB] placeholder-[#B89482] focus:outline-none focus:border-[#C84B1E]"
              />
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-2 rounded-lg text-[#E4C5B4] hover:text-[#FFFDFB] hover:bg-[#4A2315] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Strict Venue & Exit Rule Banner */}
          <div className="p-4 rounded-xl bg-[#FAE6E0] border border-[#C84B1E]/40 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#C84B1E] shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C84B1E] block mb-1">
                STRICT VENUE & EXIT RULE
              </span>
              <p className="text-xs sm:text-sm text-[#2E140B] font-medium leading-relaxed">
                {EVENT_METADATA.strictVenueRule}
              </p>
            </div>
          </div>

          {/* 2-Column Rule Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRules.map((rule) => (
              <div
                key={rule.number}
                className="p-4 rounded-xl bg-[#F9EDE4] border border-[#C84B1E]/25 hover:border-[#C84B1E]/60 transition"
              >
                <div className="flex items-center gap-2.5 mb-2.5 pb-2 border-b border-[#C84B1E]/15">
                  <span className="px-2 py-0.5 rounded-md bg-[#C84B1E] text-[#FFFDFB] font-mono text-xs font-bold">
                    {rule.number}
                  </span>
                  <h3 className="text-xs sm:text-sm font-extrabold text-[#2E140B] tracking-wide uppercase">
                    {rule.title}
                  </h3>
                </div>
                <ul className="space-y-1.5">
                  {rule.points.map((point, i) => (
                    <li
                      key={i}
                      className="text-xs text-[#4A2315] leading-relaxed flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C84B1E] mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {filteredRules.length === 0 && (
            <div className="text-center py-10 text-sm text-[#6B4433]">
              No rules matched &ldquo;{searchQuery}&rdquo;.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#C84B1E]/25 bg-[#F5E5D8] flex items-center justify-between text-[11px] font-mono text-[#6B4433] font-semibold">
          <span>MARTIAN 1.0 · {EVENT_METADATA.organizer}</span>
          <span>19 Official Regulations</span>
        </div>
      </div>
    </div>
  );
};
