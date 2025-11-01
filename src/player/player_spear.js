import Player from './player.js';

export default class player_spear extends Player {
    constructor(scene, x, y, texture) {
        const keys = scene.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            up: Phaser.Input.Keyboard.KeyCodes.UP
        });
        super(scene, x, y, texture, keys);
    }
}
