import Player from './player.js';

export default class PlayerSpear extends Player {
    constructor(scene, side) {
        super(scene, side, 'spear');
        this.jumpSpeed = -750;
        /** booleano para comprobar si el player ya ha hecho daño con ese dash */
        this.dashing = false;
        this.type = 1; //spear type

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
        this.anims.play('jump', true);
        this.scene.time.delayedCall(300, this.DashFinish, [], this);
    }

    DashFinish() {
        this.dashing = false;
    }

    addCollision(player) {
        this.scene.physics.add.overlap(player, this.hattackbox, () => {
            if (this.attacking && this.hattackbox.body.enable) {
                player.reduceLife(400);
          
                this.hattackbox.body.enable = false;

            }
        });
        this.scene.physics.add.overlap(player, this.vattackbox, () => {
            if (this.attacking && this.vattackbox.body.enable) {
                player.reduceLife(400);
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