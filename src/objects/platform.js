export default class Ground extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture, scaleX = 1, scaleY = 1) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this, true); // true = static body
        this.setScale(scaleX, scaleY);
        if (this.body && this.body.updateFromGameObject) {
            this.body.updateFromGameObject();
        }
        this.body.setSize(this.displayWidth,this.displayHeight*0.2);
        this.body.setOffset(0, -this.displayHeight*0.01 );
        this.body.checkCollision.down = false;
    }
}
