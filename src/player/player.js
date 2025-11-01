export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, keys) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(0.5);
        this.setOrigin(0.5);
        this.setCollideWorldBounds(true);

        this.speed = 300;
        this.jumpSpeed = -800;

        // Guardamos las teclas (pueden ser WASD o flechas)
        this.keys = keys;

        // Vida inicial
        this.life = 19000;

        // Temporizador que reduce vida poco a poco
        this.lifeTimer = scene.time.addEvent({
            delay: 500,
            callback: () => this.reduceLife(2),
            callbackScope: this,
            loop: true
        });
    }

    handleInput() {
        if (!this.active) return;

        const { left, right, up } = this.keys;

        if (left.isDown) {
            this.setVelocityX(-this.speed);
            this.flipX = true;
        } else if (right.isDown) {
            this.setVelocityX(this.speed);
            this.flipX = false;
        } else {
            this.setVelocityX(0);
        }

        if (up.isDown && this.body.touching.down) {
            this.setVelocityY(this.jumpSpeed);
        }
    }

    reduceLife(amount) {
        this.life -= amount;
        if (this.life <= 0) {
            this.life = 0;
            this.die();
        }
    }

    die() {
        this.lifeTimer.remove();
        this.setTint(0xff0000);
        this.setVelocity(0);
        this.setActive(false);
        this.setVisible(false);
    }
}
