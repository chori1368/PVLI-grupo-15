export default class Box extends Phaser.Physics.Arcade.Sprite {
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
