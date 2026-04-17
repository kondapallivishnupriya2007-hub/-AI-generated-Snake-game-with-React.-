export class GlitchSynth {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentTrack = 0;
  private oscillators: OscillatorNode[] = [];
  private intervals: number[] = [];
  private gainNode: GainNode | null = null;

  constructor() {}

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  public playTrack(index: number) {
    this.stop();
    this.init();
    if (!this.ctx) return;
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    this.isPlaying = true;
    this.currentTrack = index;
    
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = 0.1; // Keep it quiet
    this.gainNode.connect(this.ctx.destination);

    if (index === 0) {
      this.playCyberDirge();
    } else if (index === 1) {
      this.playNullPointer();
    } else {
      this.playNeuralDecay();
    }
  }

  public stop() {
    this.isPlaying = false;
    this.oscillators.forEach(osc => {
      try { osc.stop(); } catch(e) {}
    });
    this.oscillators = [];
    this.intervals.forEach(id => clearInterval(id));
    this.intervals = [];
    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }
  }

  private addOscillator(type: OscillatorType, frequency: number): OscillatorNode {
    if (!this.ctx || !this.gainNode) throw new Error('Not initialized');
    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
    osc.connect(this.gainNode);
    osc.start();
    this.oscillators.push(osc);
    return osc;
  }

  // Track 0: Slow ominous drone
  private playCyberDirge() {
    const osc1 = this.addOscillator('sawtooth', 55); // A1
    const osc2 = this.addOscillator('square', 55.5); // Slight detune
    
    let t = 0;
    const intervalId = window.setInterval(() => {
      if (!this.ctx) return;
      t += 0.1;
      const freq = 55 + Math.sin(t) * 5;
      osc1.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.1);
      
      if (Math.random() > 0.95) {
        const blip = this.addOscillator('sine', 880);
        setTimeout(() => blip.stop(), 50);
      }
    }, 100);
    this.intervals.push(intervalId);
  }

  // Track 1: Fast chaotic arpeggio
  private playNullPointer() {
    const notes = [220, 261.63, 329.63, 392.00, 440]; // A minor pentatonic
    let idx = 0;
    const osc = this.addOscillator('square', notes[0]);
    
    const intervalId = window.setInterval(() => {
      if (!this.ctx) return;
      idx = (idx + Math.floor(Math.random() * 3)) % notes.length;
      let freq = notes[idx];
      if (Math.random() > 0.8) freq *= 2; // Octave jump
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    }, 120);
    this.intervals.push(intervalId);
  }

  // Track 2: Random high-pitched granular bleeps
  private playNeuralDecay() {
    const baseFreq = 800;
    const osc = this.addOscillator('sawtooth', baseFreq);
    
    const intervalId = window.setInterval(() => {
      if (!this.ctx) return;
      const freq = baseFreq + (Math.random() * 2000);
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      // Amplitude modulation for "choppy" effect
      if (this.gainNode) {
        this.gainNode.gain.setValueAtTime(Math.random() * 0.1, this.ctx.currentTime);
      }
    }, 80);
    this.intervals.push(intervalId);
  }
}

export const synth = new GlitchSynth();
