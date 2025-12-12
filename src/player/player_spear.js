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
    addCollision(targetPlayer) {
        this.scene.physics.add.overlap(targetPlayer, this.hattackbox, () => {
            if (this.attacking && this.hattackbox.body.enable) {
                targetPlayer.reduceLife(400);
                
                // Calcular impulso horizontal
                let knockX;
                if (this.flipX) {
                    knockX = -200; 
                } else {
                    knockX = 200; 
                }

                let knockY = -200; 
                
                // Desactivar colisión hacia abajo para permitir el knockback
                targetPlayer.body.checkCollision.down = false;
                
                // Aplicar el impulso al jugador contrario
                targetPlayer.setVelocityX(knockX);
                targetPlayer.setVelocityY(knockY);
                
                //Reactivar la colisión después de un tiempo
                this.scene.time.delayedCall(100, () => {
                    targetPlayer.body.checkCollision.down = true;
                }, [], this);

                this.hattackbox.body.enable = false;
            }
        });

        //Ataque vertical
        this.scene.physics.add.overlap(targetPlayer, this.vattackbox, () => {
            if (this.attacking && this.vattackbox.body.enable) {
                targetPlayer.reduceLife(400);
                
                // Calcular impulso vertical
                let knockX;
                if (this.flipX) {
                    knockX = -100;
                } else {
                    knockX = 100;
                }

                let knockY = -300; 
                
                //Desactivar colisión hacia abajo para permitir el knockback
                targetPlayer.body.checkCollision.down = false;

                //Aplicar el impulso al otro jugador
                targetPlayer.setVelocityX(knockX);
                targetPlayer.setVelocityY(knockY);
                
                // Reactivar la colisión después de un tiempo
                 this.scene.time.delayedCall(100, () => {
                    targetPlayer.body.checkCollision.down = true;
                }, [], this);

                this.vattackbox.body.enable = false; 
            }
        });
        this.scene.physics.add.overlap(targetPlayer, this, () => {
            if (this.dashing) {

                targetPlayer.reduceLife(400);
                this.dashing = false;
            }
        });
    };
}
