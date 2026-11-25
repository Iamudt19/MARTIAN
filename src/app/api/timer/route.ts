import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { StoredTimerData } from '@/types/timer';
import { DEFAULT_DURATION_MS } from '@/lib/constants';

const STATE_FILE = path.join(process.cwd(), '.martian-timer-state.json');

const defaultState: StoredTimerData = {
  status: 'NOT_STARTED',
  startTime: null,
  targetDuration: DEFAULT_DURATION_MS,
  pauseTime: null,
  totalPausedDuration: 0,
  alertsTriggered: [],
  updatedAt: 0,
};

// In-memory store for fast reads and serverless fallback
let memoryState: StoredTimerData | null = null;

function readState(): StoredTimerData {
  if (memoryState) return memoryState;
  try {
    if (fs.existsSync(STATE_FILE)) {
      const raw = fs.readFileSync(STATE_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as StoredTimerData;
      memoryState = parsed;
      return parsed;
    }
  } catch {
    // Ignore filesystem errors on read-only serverless platforms
  }
  memoryState = { ...defaultState };
  return memoryState;
}

function writeState(newState: StoredTimerData) {
  memoryState = newState;
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(newState, null, 2), 'utf-8');
  } catch {
    // Ignore filesystem errors on read-only serverless platforms
  }
}

export async function GET() {
  const state = readState();
  return NextResponse.json(
    {
      state,
      serverTime: Date.now(),
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const incoming = body?.state as StoredTimerData | undefined;
    if (!incoming || !incoming.status) {
      return NextResponse.json({ error: 'Invalid timer state' }, { status: 400 });
    }

    const sanitized: StoredTimerData = {
      status: incoming.status,
      startTime: incoming.startTime ?? null,
      targetDuration: incoming.targetDuration ?? DEFAULT_DURATION_MS,
      pauseTime: incoming.pauseTime ?? null,
      totalPausedDuration: incoming.totalPausedDuration ?? 0,
      alertsTriggered: Array.isArray(incoming.alertsTriggered) ? incoming.alertsTriggered : [],
      updatedAt: incoming.updatedAt || Date.now(),
    };

    writeState(sanitized);

    return NextResponse.json({
      ok: true,
      state: sanitized,
      serverTime: Date.now(),
    });
  } catch {
    return NextResponse.json({ error: 'Failed to update timer state' }, { status: 500 });
  }
}
