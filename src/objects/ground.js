export default class Ground extends Phaser.GameObjects.Image {
  constructor(scene, x, y, texture, scaleX = 1, scaleY = 1) {
    super(scene, x, y, texture);
    this.scene = scene;
    scene.add.existing(this);
    scene.physics.add.existing(this,true);

    this.setScale(scaleX, scaleY);
    if (this.body && this.body.updateFromGameObject) {
      this.body.updateFromGameObject();
    }
  }

  reset() {
    if (this.active){
      this.scene.tweens.add({
        targets: this,
        y: this.y -250,
        duration: Phaser.Math.Between(7000, 13000),
        ease: 'Linear',
        onUpdate: () => this.body.updateFromGameObject(),
        onComplete: () => {
         this.move();
        }
     });
    }
    else this.reset();
  }

  move() {
    this.scene.tweens.add({
      targets: this,
      y: this.y + 250,
      duration: Phaser.Math.Between(7000, 13000),
      ease: 'Linear',
      onUpdate: () => this.body.updateFromGameObject(),
      onComplete: () => {
        if (this.active) this.reset();
        else this.destroy();
      }
    });
  }
}
