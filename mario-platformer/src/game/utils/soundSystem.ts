/**
 * game/utils/soundSystem.ts
 *
 * Generates retro-style sound effects procedurally using the Web Audio API.
 * No audio files required! Uses frequency sweeps and oscillators.
 *
 * Call `SoundSystem.init()` once, then `SoundSystem.play('jump')` etc.
 */

type SFXName = 'jump' | 'coin' | 'stomp' | 'death' | 'levelComplete';

class SoundSystemClass {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private enabled = true;

  /** Must be called after a user gesture (browser autoplay policy). */
  init(): void {
    if (this.ctx) return;
    try {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.ctx.destination);
    } catch {
      console.warn('Web Audio API not available');
    }
  }

  setEnabled(v: boolean): void {
    this.enabled = v;
    if (this.masterGain) this.masterGain.gain.value = v ? 0.3 : 0;
  }

  play(name: SFXName): void {
    if (!this.enabled || !this.ctx || !this.masterGain) return;
    switch (name) {
      case 'jump':         this.playJump(); break;
      case 'coin':         this.playCoin(); break;
      case 'stomp':        this.playStomp(); break;
      case 'death':        this.playDeath(); break;
      case 'levelComplete': this.playLevelComplete(); break;
    }
  }

  private tone(
    freq: number, endFreq: number,
    startTime: number, duration: number,
    type: OscillatorType = 'square',
    volume = 0.3
  ): void {
    if (!this.ctx || !this.masterGain) return;
    const osc  = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);

    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.01);
  }

  private playJump(): void {
    const t = this.ctx!.currentTime;
    this.tone(300, 600, t, 0.12, 'square', 0.4);
  }

  private playCoin(): void {
    const t = this.ctx!.currentTime;
    this.tone(988, 1318, t,        0.06, 'sine', 0.5);
    this.tone(1318, 1318, t + 0.06, 0.08, 'sine', 0.4);
  }

  private playStomp(): void {
    const t = this.ctx!.currentTime;
    this.tone(400, 150, t, 0.1, 'square', 0.5);
  }

  private playDeath(): void {
    const t = this.ctx!.currentTime;
    this.tone(500, 100, t,       0.15, 'square', 0.4);
    this.tone(300, 80,  t + 0.15, 0.2,  'square', 0.3);
    this.tone(200, 60,  t + 0.35, 0.3,  'square', 0.25);
  }

  private playLevelComplete(): void {
    const t = this.ctx!.currentTime;
    const melody = [523, 659, 784, 1047];
    melody.forEach((freq, i) => {
      this.tone(freq, freq, t + i * 0.12, 0.1, 'square', 0.4);
    });
  }

  resume(): void {
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
  }
}

// Singleton export
export const SoundSystem = new SoundSystemClass();
