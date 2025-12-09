import IntroScene from './scenes/intro.js';
import SelectionScene from './scenes/selection.js';
import LevelScene from './scenes/level.js';
import ResultScene from './scenes/result.js';

// Configuración del juego:
const config = {

    type: Phaser.AUTO,

    width: 1920,
    height: 1080,

    scale: {
        mode: Phaser.Scale.EXPAND,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    },

    scene: [ IntroScene, SelectionScene, LevelScene, ResultScene ],
    //scene: [ LevelScene ],

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

// Instancia del juego:
const game = new Phaser.Game(config);

// Botones de play y pause
const play = document.getElementById('play-btn');
const pause = document.getElementById('pause-btn');

// Pausado y reanudado del juego:
const toggleState = () => {
    // Si pause esta checked o play no lo está:
    if (pause.checked || !play.checked) game.pause(); // Pausamos el juego
    else game.resume(); // Reanudamos
};

// Listeners en los botones que llaman a toggleState:
play?.addEventListener('change', toggleState);
pause?.addEventListener('change', toggleState);

toggleState(); // Inicializamos para sincronizar correctamente el s0