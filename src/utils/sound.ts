// Web Audio API Synthesizer for 3D Portfolio
class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;

  constructor() {
    // AudioContext will be initialized on first user click/keypress
  }

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.setupEngineSound();
    } catch {
      console.warn('Web Audio API not supported');
    }
  }

  private setupEngineSound() {
    if (!this.ctx) return;
    try {
      this.engineOsc = this.ctx.createOscillator();
      this.engineGain = this.ctx.createGain();
      this.engineFilter = this.ctx.createBiquadFilter();

      this.engineOsc.type = 'sawtooth';
      this.engineOsc.frequency.setValueAtTime(45, this.ctx.currentTime); // idle pitch

      this.engineFilter.type = 'lowpass';
      this.engineFilter.frequency.setValueAtTime(250, this.ctx.currentTime);

      this.engineGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      this.engineOsc.connect(this.engineFilter);
      this.engineFilter.connect(this.engineGain);
      this.engineGain.connect(this.ctx.destination);

      this.engineOsc.start();
    } catch {
      // Ignore audio setup fail
    }
  }

  public updateEngine(speedKmh: number, isAccelerating: boolean) {
    if (!this.ctx || !this.engineOsc || !this.engineGain || !this.engineFilter || this.isMuted) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const baseFreq = 45;
    const maxFreq = 220;
    const targetFreq = baseFreq + Math.min(speedKmh * 3.5, maxFreq);
    const filterCutoff = 200 + Math.min(speedKmh * 15, 1800);

    const now = this.ctx.currentTime;
    this.engineOsc.frequency.setTargetAtTime(targetFreq, now, 0.1);
    this.engineFilter.frequency.setTargetAtTime(filterCutoff, now, 0.1);

    const targetGain = isAccelerating ? 0.07 : (speedKmh > 2 ? 0.04 : 0.02);
    this.engineGain.gain.setTargetAtTime(targetGain, now, 0.1);
  }

  public playCrash(volume: number = 0.5) {
    if (!this.ctx || this.isMuted) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    try {
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(Math.min(volume * 0.25, 0.3), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
    } catch {
      // Ignore
    }
  }

  public playBoost() {
    if (!this.ctx || this.isMuted) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.4);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Ignore
    }
  }

  public playZoneChime() {
    if (!this.ctx || this.isMuted) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.08, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    } catch {
      // Ignore
    }
  }

  public playClick() {
    if (!this.ctx || this.isMuted) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Ignore
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.engineGain && this.ctx) {
      this.engineGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }
}

export const soundManager = new SoundManager();
