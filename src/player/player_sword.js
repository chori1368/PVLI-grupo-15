import Player from './player.js';

export default class player_sword extends Player {
    constructor(scene, x, y, texture) {
        const keys = scene.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            up: Phaser.Input.Keyboard.KeyCodes.W
        });
        super(scene, x, y, texture, keys);
    }
}
