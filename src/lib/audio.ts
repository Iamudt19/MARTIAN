/**
 * Audio Synthesizer utilizing the browser's native Web Audio API.
 * Ensures zero missing mp3 404s and immediate, crisp playback across devices.
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.8;

  constructor() {
    // Initialized lazily on first user interaction to comply with browser autoplay policies
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  /**
   * Short crisp futuristic micro-click for UI buttons
   */
  public playClick() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(this.volume * 0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  /**
   * Harmonious cyber alert chime for milestone warnings (1h, 30m, 10m, 5m, 1m)
   */
  public playAlertChime(intensity: 'gentle' | 'medium' | 'urgent' = 'medium') {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const frequencies = intensity === 'urgent' 
      ? [587.33, 880, 1174.66, 1760] // D5, A5, D6, A6 (High energy)
      : intensity === 'medium'
      ? [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6 (Bright major chord)
      : [440, 554.37, 659.25]; // A4, C#5, E5 (Soft chime)

    const noteDuration = intensity === 'urgent' ? 0.15 : 0.22;

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * noteDuration);

      const noteStart = now + idx * noteDuration;
      gain.gain.setValueAtTime(0.001, noteStart);
      gain.gain.linearRampToValueAtTime(this.volume * 0.4, noteStart + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + (intensity === 'urgent' ? 0.6 : 0.9));

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + (intensity === 'urgent' ? 0.65 : 0.95));
    });
  }

  /**
   * Grand celebratory victory fanfare for hackathon completion (time reached 00:00:00)
   */
  public playCompletionFanfare() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [
      { f: 523.25, d: 0.2 }, // C5
      { f: 659.25, d: 0.2 }, // E5
      { f: 783.99, d: 0.2 }, // G5
      { f: 1046.50, d: 0.4 }, // C6
      { f: 880.00, d: 0.25 }, // A5
      { f: 1046.50, d: 0.25 }, // C6
      { f: 1318.51, d: 0.8 }, // E6
    ];

    let offset = 0;
    const now = ctx.currentTime;

    notes.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f, now + offset);

      gain.gain.setValueAtTime(0.001, now + offset);
      gain.gain.linearRampToValueAtTime(this.volume * 0.5, now + offset + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + note.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + note.d + 0.05);

      offset += note.d * 0.85;
    });
  }
}

export const soundManager = new SoundSynthesizer();
