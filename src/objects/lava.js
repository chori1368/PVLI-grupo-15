export default class Lava {
    constructor(scene, x, y, texture, scaleX = 1, scaleY = 1) {
        this.scene = scene;

        // Solo un sprite de lava
        this.sprite = scene.physics.add.staticImage(x, y, texture)
            .setScale(scaleX, scaleY)
            .refreshBody();
    }

    addCollision(player) {
        this.scene.physics.add.overlap(player, this.sprite, () => {
            if (player.active) {
                player.reduceLife(3500);
              if (this.scene && this.scene.sound) this.scene.sound.play('daño');        // Crear té en una posición aleatoria en la parte superior de la escena

                player.setVelocityY(-700);
                player.resetJumpCount();
            }
        });
    }
}
