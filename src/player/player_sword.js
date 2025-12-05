import Player from './player.js';

export default class PlayerSword extends Player {
    constructor(scene, side) { 
        super(scene, side, 'sword');
        this.type = 0; //sword type
        this.verticalbox = scene.add.zone(0, 0, 55, 100);

    }

    DoubleJump() {
        this.setVelocityY(this.jumpSpeed);
    }
}
