/** Plataforma estática que usa la textura 'platform' por defecto 
 * y se puede atravesar por abajo y laterales */

export default class Platform extends Phaser.Physics.Arcade.Sprite {
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
}
