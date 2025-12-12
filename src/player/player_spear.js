import Player from './player.js';

/**
 * Variante de jugador con lanza.
 * Su “doble salto” es un dash horizontal que también puede hacer daño.
 * @extends Player
 */
export default class PlayerSpear extends Player {
    /**
     * @param {Phaser.Scene} scene
     * @param {'left'|'right'} side
     */
    constructor(scene, side) {
        super(scene, side, 'spear');
        this.jumpSpeed = -750;
        /** Booleano para comprobar si el dash está activo (y puede hacer daño). */
        this.dashing = false;
        /** Identificador usado por escenas/UI para distinguir personaje. */
        this.type = 1; // spear type

        // Ajustar collider del arma
        if (this.hattackbox && this.hattackbox.body) {
            this.hattackbox.setSize(120, 40);
            this.hattackbox.body.setSize(120, 40);
            this.hxoffsetplus = 340;
            this.hxoffsetminus = -30;
        }
        if (this.vattackbox && this.vattackbox.body) {
            this.vattackbox.setSize(80, 180);
            this.vattackbox.body.setSize(80, 180);
            this.vxoffsetplus = 200;
            this.vxoffsetminus = -140;
        }
    }

    /** Dash horizontal (sustituye al doble salto). */
    DoubleJump() {
        this.dashing = true;
        try {
            if (this.attackSounds && this.attackSounds.dash) {
                this.sound.play(this.attackSounds.dash);
            }
        } catch (e) { }
        if (this.flipX) {
            this.setVelocityX(this.jumpSpeed);
        } else {
            this.setVelocityX(-this.jumpSpeed);
        }
        this.anims.play('dash', true);
        this.scene.time.delayedCall(300, this.DashFinish, [], this);
    }

    /** Termina el dash y desactiva el daño extra. */
    DashFinish() {
        this.dashing = false;
    }

    /**
     * Overlaps contra otro jugador: ataques normales + daño al contactar en dash.
     * @param {Player} player
     */
    addCollision(player) {
        this.scene.physics.add.overlap(player, this.hattackbox, () => {
            if (this.attacking && this.hattackbox.body.enable) {
                player.reduceLife(400);
          
                let knockX;
                if (this.flipX) {
                    knockX = 600;  // mirando a la izquierda
                } else {
                    knockX = -600; // mirando a la derecha
                }

                let knockY = -400;

                player.setVelocityX(knockX);
                player.setVelocityY(knockY);
                    this.hattackbox.body.enable = false;
                }
        });
        this.scene.physics.add.overlap(player, this.vattackbox, () => {
            if (this.attacking && this.vattackbox.body.enable) {
                player.reduceLife(400);
            
                      let knockX;
                if (this.flipX) {
                 knockX = 200;
                } else {
                    knockX = -200;
                }

                let knockY = -700;

                player.setVelocityX(knockX);
                player.setVelocityY(knockY);
                this.vattackbox.body.enable = false;
            }
        });
        this.scene.physics.add.overlap(player, this, () => {
            if (this.dashing) {

                player.reduceLife(400);
                this.dashing = false;
            }
        });
    };
}
