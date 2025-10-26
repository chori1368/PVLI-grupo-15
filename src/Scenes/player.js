export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(0.5);
        this.setOrigin(0.5);
        this.setCollideWorldBounds(true);

        this.speed = 300;
        this.jumpSpeed = -500;
    }

    handleInput(keys) {
        if (keys.left.isDown) {
            this.setVelocityX(-this.speed);
            this.flipX = true;
        } else if (keys.right.isDown) {
            this.setVelocityX(this.speed);
            this.flipX = false;
        } else {
            this.setVelocityX(0);
        }

        if (keys.up.isDown && this.body.touching.down) {
            this.setVelocityY(this.jumpSpeed);
        }
    }
}
