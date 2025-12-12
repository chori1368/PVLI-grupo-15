export default class Lava extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'lava');

        // Añadimos el sprite a la escena
        scene.add.existing(this);

        // Marcamos el oibjeto como estático
        scene.physics.add.existing(this, true);

        // Ajustamos el collider a la parte inferior del sprite
        this.body.setSize(this.width, this.height * 0.75);
    }

    addCollision(player) {
        this.scene.physics.add.overlap(player, this.sprite, () => {
            if (player.active) {
                player.reduceLife(3500);
              if (this.scene && this.scene.sound) this.scene.sound.play('daño');        // Crear té en una posición aleatoria en la parte superior de la escena

                player.setVelocityY(-700);
                
            }
        });
    }
}
