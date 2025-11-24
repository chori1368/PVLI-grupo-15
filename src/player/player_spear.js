import Player from './player.js';

export default class PlayerSpear extends Player {
    constructor(scene, side) {
        super(scene, side, 'spear');
        this.jumpSpeed = -750;
        this.dashing = false;
        this.type = 1; //spear type
    }

    DoubleJump() {
        this.dashing = true;
        if (this.flipX){
            this.setVelocityX(this.jumpSpeed);
        }
        else{
            this.setVelocityX(-this.jumpSpeed);
        }
        this.scene.time.delayedCall(300, this.DashFinish,[],this);
    }

    DashFinish() {
        this.dashing=false;
        //console.log('acaba ataque');
    }

    addCollision(player) {
        this.scene.physics.add.overlap(player, this.weaponbox, () => {
            if (this.attacking&&this.weaponbox.body.enable){
                player.reduceLife(400);
                this.weaponbox.body.enable = false;
                //console.log('daño');
            }
        });
        this.scene.physics.add.overlap(player, this , () => {
            if (this.dashing){
                player.reduceLife(400);
                this.dashing = false;
                //console.log('daño');
            }
        });
    }
}
