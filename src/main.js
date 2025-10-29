import MenuScene from './Scenes/MenuScene.js';
import CharacterScene from './Scenes/CharacterScene.js';
import ControlsScene from './Scenes/ControlsScene.js';
import GameScene from './Scenes/GameScene.js';
import ResultScene from './Scenes/ResultScene.js';

const config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 800,
  parent: 'PVLI-grupo-15',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 500 }
    }
  },
  scene: [MenuScene, CharacterScene, ControlsScene, GameScene, ResultScene]
};

const game = new Phaser.Game(config);
