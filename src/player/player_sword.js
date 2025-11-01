import Player from './player.js';

export default class player_sword extends Player {
    constructor(scene, x, y, texture) {
        const keys = scene.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            up: Phaser.Input.Keyboard.KeyCodes.W
        });
        super(scene, x, y, texture, keys);
        this.maxJumps = 2;
        this.jumpCount = 0;
    }
     handleJump() {
        const { up } = this.keys;

        // Reiniciar contador si está tocando el suelo
        if (this.body.blocked.down || this.body.touching.down) {
            this.jumpCount = 0;
        }

        // Doble salto
        if (Phaser.Input.Keyboard.JustDown(up) && this.jumpCount < this.maxJumps) {
            this.setVelocityY(this.jumpSpeed);
            this.jumpCount++;
        }
    }
    
}
