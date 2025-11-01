import MenuScene from './scenes/menu.js';
import CharacterScene from './scenes/selection.js';
import LevelScene from './scenes/level.js';
import ResultScene from './scenes/result.js';

let config = {
  
	type: Phaser.AUTO,
	width:  1200,
	height: 800,
	pixelArt: true,
	scale: { autoCenter: Phaser.Scale.CENTER_HORIZONTALLY },

	scene: [ MenuScene, CharacterScene, LevelScene, ResultScene ],

	physics: { 
        default: 'arcade', 
        arcade: { 
            gravity: { y: 800 }, 
            debug: true 
        },
        checkCollision: {
            up: true,
            down: true,
            left: true,
            right: true
        }
    },
};

new Phaser.Game(config);