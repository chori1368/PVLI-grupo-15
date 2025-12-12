/**
 * Plataforma estática (Arcade) que se puede atravesar por abajo y laterales.
 * Por defecto usa la textura `platform`.
 * @extends Phaser.Physics.Arcade.Sprite
 */

export default class Platform extends Phaser.Physics.Arcade.Sprite {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {string} [texture='platform']
   * @param {number} [scale=1]
   */
  constructor(scene, x, y, texture = 'platform', scale = 1) {
    super(scene, x, y, texture);
    // Añadir a la escena y habilitar físicas
    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    // Configurar colisiones para permitir atravesar desde abajo (y laterales)
    this.body.checkCollision.down = false;
    this.body.checkCollision.left = false;
    this.body.checkCollision.right = false;

    // Ajustar escala
    this.setScale(scale);
    this.body.updateFromGameObject();

    // Ajustar collider a solo la parte superior del sprite
    this.body.setSize(this.displayWidth, this.displayHeight * 0.2);
    this.body.setOffset(0, 0);
  }

  /** Animación de desaparición (y auto-eliminación). */
  break() {
    // Tween de caída
    this.scene.tweens.add({
      targets: this,
      y: this.y + 300,
      angle: Phaser.Math.Between(-20, 20),
      duration: 800,
      ease: 'Quad.easeIn',
      onComplete: () => this.destroy()
    });

    // Tween de transparencia (empieza más tarde)
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 200,
      delay: 600, // Espera 600ms antes de empezar a desvanecerse
      ease: 'Linear'
    });
  }
}
