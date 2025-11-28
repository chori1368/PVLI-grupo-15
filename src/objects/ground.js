// ground.js
export default class Ground extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, scaleX = 1, scaleY = 1, durationToSink = 5000, respawnDelay = 10000) {
    super(scene, x, y, texture);
    this.scene = scene;
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Comportamiento "estático"
    this.body.setImmovable(true);
    this.body.allowGravity = false;

    this.setScale(scaleX, scaleY);
    if (this.body.updateFromGameObject) this.body.updateFromGameObject();

    this._orig = { x, y, texture, scaleX, scaleY };
    this.durationToSink = durationToSink;
    this.respawnDelay = respawnDelay;
    this.sinkEvent = null;
    this.respawnEvent = null;
    this.isDestroyed = false;
  }

  checkPlayers(playersArray = []) {
    if (this.isDestroyed) return;

    const someoneOnTop = playersArray.some(p => p && p.body && this.scene.physics.overlap(p, this));
    if (someoneOnTop) {
      if (!this.sinkEvent) {
        this.sinkEvent = this.scene.time.delayedCall(this.durationToSink, () => this._destroyGround());
      }
    } else {
      if (this.sinkEvent && !this.sinkEvent.hasDispatched) this.sinkEvent.remove(false);
      this.sinkEvent = null;
    }
  }

  _destroyGround() {
    if (this.isDestroyed) return;
    this.isDestroyed = true;

    if (this.sinkEvent) { this.sinkEvent.remove(false); this.sinkEvent = null; }

    if (this.body) this.body.enable = false;
    this.setVisible(false);
    this.setActive(false);

    this.respawnEvent = this.scene.time.delayedCall(this.respawnDelay, () => this._respawnGround());
  }

  _respawnGround() {
    this.isDestroyed = false;
    this.setPosition(this._orig.x, this._orig.y);
    this.setScale(this._orig.scaleX, this._orig.scaleY);
    this.setTexture(this._orig.texture);
    this.setVisible(true);
    this.setActive(true);

    if (this.body) {
      this.body.enable = true;
      this.body.setImmovable(true);
      this.body.allowGravity = false;
      if (this.body.updateFromGameObject) this.body.updateFromGameObject();
    }
    this.respawnEvent = null;
  }

  // limpiar timers si la instancia se destruye manualmente
  destroy(fromScene) {
    if (this.sinkEvent) { try { this.sinkEvent.remove(false); } catch(e) {} this.sinkEvent=null; }
    if (this.respawnEvent) { try { this.respawnEvent.remove(false); } catch(e) {} this.respawnEvent=null; }
    super.destroy(fromScene);
  }
}
