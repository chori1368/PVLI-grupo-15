export default class Ground extends Phaser.Physics.Arcade.StaticImage {
    
    constructor(scene, x, y, texture, scaleX = 1, scaleY = 1) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this, true); // true = static body

        this.setScale(scaleX, scaleY);
        this.refreshBody();
    }
}