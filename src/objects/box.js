/**
 * Caja física que los jugadores pueden empujar y que se destruye al caer en lava.
 * @extends Phaser.Physics.Arcade.Sprite
 */
export default class Box extends Phaser.Physics.Arcade.Sprite {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     */
    constructor(scene, x, y) {
        super(scene, x, y, 'box');
        // Anadir objeto a escena y habilitar fisicas
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Algunas propiedades físicas de la caja
        this.setScale(0.35);
        this.body.setMass(1000);
        this.body.setDragX(1500);
        this.body.setBounce(0);
    }

    /**
     * Define qué ocurre cuando la caja toca la lava (fade + destroy).
     * @param {Phaser.GameObjects.GameObject|Phaser.Physics.Arcade.StaticGroup} lava
     */
    addCollision(lava) {
        this.scene.physics.add.collider(this, lava, () => {
            this.scene.tweens.add({
                targets: this,
                alpha: 0,
                y: this.y + 50,
                duration: 300,
                onComplete: () => this.destroy()
            });
        });
    }
}
