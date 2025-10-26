import Escena1 from './Escena1_Menu.js';
import Escena2 from './Escena2_Personaje.js';
import Escena3 from './Escena3_Controles.js';
import Escena4 from './Escena4_Juego.js';
import Escena5 from './Escena5_Resultado.js';

const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    parent: 'PVLI-grupo-15',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: [Escena1, Escena2, Escena3, Escena4, Escena5]
};

new Phaser.Game(config);
