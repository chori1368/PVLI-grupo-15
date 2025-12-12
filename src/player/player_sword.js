import Player from './player.js';

/**
 * Variante de jugador con espada.
 * @extends Player
 */
export default class PlayerSword extends Player {
    /**
     * @param {Phaser.Scene} scene
     * @param {'left'|'right'} side
     */
    constructor(scene, side) { 
        super(scene, side, 'sword');
        /** Identificador usado por escenas/UI para distinguir personaje. */
        this.type = 0; // sword type
    }

    /** Doble salto estándar (sin dash). */
    DoubleJump() {
        this.setVelocityY(this.jumpSpeed);
        this.anims.play('jump', true);
    }
}
