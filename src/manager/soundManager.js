// SoundManager.js
export default {
  scene: null,
  sounds: new Set(), // keys preloaded/registered (opcional)
  volumes: { master: 1, music: 1, sfx: 1 },
  muted: false,

  init(scene) {
    this.scene = scene;
    // intentar cargar ajustes guardados (opcional)
    try {
      const raw = localStorage.getItem('sound_settings');
      if (raw) {
        const p = JSON.parse(raw);
        this.volumes = { ...this.volumes, ...(p.volumes||{}) };
        this.muted = !!p.muted;
      }
    } catch (e) {}
  },

  preload(list = []) {
    if (!this.scene) throw new Error('SoundManager.init(scene) antes de preload');
    list.forEach(a => this.scene.load.audio(a.key, a.path));
  },
  play(key, opts = {}, channel = 'sfx') {
    if (!this.scene) throw new Error('SoundManager.init(scene) antes de play');
    if (this.muted) return;
    const vol = (typeof opts.volume === 'number' ? opts.volume : 1) * this._eff(channel);
    // one-shot rápido - no necesitamos guardar instancia
    return this.scene.sound.play(key, { ...opts, volume: vol });
  },

  playMusic(key, { loop = true, fade = 0, volume = 1 } = {}) {
    if (!this.scene) throw new Error('SoundManager.init(scene) antes de playMusic');
    if (this.muted) return;
    // simple: stop all music and start new
    this.scene.sound.stopAll();
    const inst = this.scene.sound.add(key, { loop, volume: volume * this._eff('music') });
    inst.play();
    return inst;
  },

  setMaster(v){ this.volumes.master = Phaser.Math.Clamp(v,0,1); this._save(); },
  setSfx(v){ this.volumes.sfx = Phaser.Math.Clamp(v,0,1); this._save(); },

  mute(){ this.muted = true; this.scene.sound.pauseAll?.(); this._save(); },
  unmute(){ this.muted = false; this.scene.sound.resumeAll?.(); this._save(); },
  toggleMute(){ if(this.muted) this.unmute(); else this.mute(); },

  _eff(channel){ return this.muted ? 0 : this.volumes.master * (channel === 'music' ? this.volumes.music : this.volumes.sfx); },

  _save(){
    try { localStorage.setItem('sound_settings', JSON.stringify({ volumes: this.volumes, muted: this.muted })); } catch(e){}
  }
};
