import Player from './player.js';
import SoundManager from '../manager/soundManager.js';

export default class PlayerSpear extends Player {
    constructor(scene, side) {
        super(scene, side, 'spear');
        this.jumpSpeed = -750;
        this.dashing = false;
        this.type = 1; //spear type

    }

    DoubleJump() {
        this.dashing = true;
        try {
            if (this.attackSounds && this.attackSounds.dash) {
                SoundManager.play(this.attackSounds.dash);
            }
        } catch (e) { }
        if (this.flipX) {
            this.setVelocityX(this.jumpSpeed);
        } else {
            this.setVelocityX(-this.jumpSpeed);
        }
        this.scene.time.delayedCall(300, this.DashFinish, [], this);
    }

    DashFinish() {
        this.dashing = false;
    }

    addCollision(player) {
        this.scene.physics.add.overlap(player, this.horizontalbox, () => {
            if (this.attacking && this.horizontalbox.body.enable) {

                player.reduceLife(400);
                this.horizontalbox.body.enable = false;

            }
        });
        this.scene.physics.add.overlap(player, this.verticalbox, () => {
            if (this.attacking && this.verticalbox.body.enable) {
                player.reduceLife(400);
                this.verticalbox.body.enable = false;
            }
        });
        this.scene.physics.add.overlap(player, this, () => {
            if (this.dashing) {

                player.reduceLife(400);
                this.dashing = false;
            }
        });
    };
} // Cierre de la clase PlayerSpear
