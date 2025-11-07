import MenuScene from './scenes/menu.js';
import CharacterScene from './scenes/selection.js';
import LevelScene from './scenes/level.js';
import ResultScene from './scenes/result.js';


// Configuración del juego:
let config = {

    type: Phaser.AUTO,

    width: 1920,
    height: 1080,

    pixelArt: true,

    scale: {
        mode: Phaser.Scale.ENVELOP,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },

    scene: [MenuScene, CharacterScene, LevelScene, ResultScene],

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

// Creamos la instancia del juego
const game = new Phaser.Game(config);

// Botones de play y pause
const play = document.getElementById('play-btn');
const pause = document.getElementById('pause-btn');

// Para gestionar el pausado y reanudado del juego:
const toggleState = () => {

    // Si pause esta checked o play no lo está:
    if (pause.checked || !play.checked) {
        game.pause(); // Pausamos el juego
        console.log('game paused');
    }

    else {
        game.resume(); // Reanudamos
        console.log('game resumed');
    }
};

// Añadimos listeners en los botones que llaman a toggleState:
play?.addEventListener('change', toggleState);
pause?.addEventListener('change', toggleState);

toggleState(); // Inicializamos para sincronizar correctamente el s0