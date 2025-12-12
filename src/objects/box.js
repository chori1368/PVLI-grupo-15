export default class Box extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'box');

        // Anadir objeto a escena y habilitar fisicas
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Algunas propiedades físicas de la caja
        this.setScale(0.35);
        this.body.setBounce(0.05);
        this.body.setDamping(true);
        this.body.setDrag(1200, 0);
        this.body.setFriction(1, 0);
    }
}
