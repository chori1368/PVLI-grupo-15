export default class Box extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'box');

        // Anadir objeto a escena y habilitar fisicas
        scene.add.existing(this);
        scene.physics.add.existing(this);

        
        this.setScale(0.35);
        this.setBounce(0.1);
        this.setCollideWorldBounds(true);
        this.body.setFriction(0.2, 0);
    }
}
