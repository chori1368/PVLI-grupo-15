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

        // Vida inicial
        this.life = 1;

        // Temporizador que reduce vida poco a poco
        this.lifeTimer = scene.time.addEvent({
            delay: 500, // cada medio segundo
            callback: () => this.reduceLife(2),
            callbackScope: this,
            loop: true
        });
    }

    handleInput(keys) {
        if (!this.active) return; // si el jugador está muerto, no se mueve

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

    reduceLife(amount) {
        this.life -= amount;
        if (this.life <= 0) {
            this.life = 0;
            this.die();
        }
    }

    die() {
        this.lifeTimer.remove(); // Detiene el temporizador
        this.setTint(0xff0000); // Muestra color rojo al morir
        this.setVelocity(0);
        this.setActive(false);
        this.setVisible(false);
    }
}
