export default class Lava extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'lava');

        // Añadimos el sprite a la escena y habilitamos físicas
        scene.add.existing(this);
        scene.physics.add.existing(this, true);

        // Ajustar collider a solo la parte superior del sprite
        this.body.setSize(this.displayWidth, this.displayHeight * 0.5);
        this.body.setOffset(0, this.displayHeight * 0.5);
    }

    addCollision(player) {
        this.scene.physics.add.overlap(player, this, () => {
            player.reduceLife(3500);
            this.scene.sound.play('daño');
            player.setVelocityY(-600);
            player.resetJumpCount();
        });
    }
}
