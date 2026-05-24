// Tiny synthesized sound effects for the quiz — no audio asset files.
// Uses the Web Audio API; the context is created lazily on first play so it
// only spins up after a user gesture (browser autoplay policy).

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(
  audio: AudioContext,
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType = "sine",
  peak = 0.18,
): void {
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audio.currentTime + start);
  gain.gain.setValueAtTime(0.0001, audio.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(peak, audio.currentTime + start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + start + duration);
  osc.connect(gain).connect(audio.destination);
  osc.start(audio.currentTime + start);
  osc.stop(audio.currentTime + start + duration + 0.02);
}

export function playCorrect(): void {
  const audio = getCtx();
  if (!audio) return;
  tone(audio, 587.33, 0, 0.14, "triangle"); // D5
  tone(audio, 880.0, 0.1, 0.2, "triangle"); // A5
}

export function playWrong(): void {
  const audio = getCtx();
  if (!audio) return;
  tone(audio, 196.0, 0, 0.22, "sawtooth", 0.14); // G3
  tone(audio, 146.83, 0.08, 0.26, "sawtooth", 0.14); // D3
}

export function playFinish(): void {
  const audio = getCtx();
  if (!audio) return;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
  notes.forEach((n, i) => tone(audio, n, i * 0.12, 0.26, "triangle", 0.16));
}

export function playLevelUp(): void {
  const audio = getCtx();
  if (!audio) return;
  // Rising fanfare
  const notes = [392.0, 523.25, 659.25, 783.99, 1046.5]; // G4 C5 E5 G5 C6
  notes.forEach((n, i) => tone(audio, n, i * 0.09, 0.3, "triangle", 0.18));
}

export function playAchievement(): void {
  const audio = getCtx();
  if (!audio) return;
  // Two-note sparkle
  tone(audio, 880.0, 0, 0.18, "triangle", 0.16); // A5
  tone(audio, 1318.51, 0.11, 0.26, "triangle", 0.16); // E6
}
