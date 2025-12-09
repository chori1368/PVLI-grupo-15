import Player from './player.js';

export default class PlayerSword extends Player {
    constructor(scene, side) { 
        super(scene, side, 'sword');
        this.type = 0; //sword type
    }

    DoubleJump() {
        this.setVelocityY(this.jumpSpeed);
    }
}
