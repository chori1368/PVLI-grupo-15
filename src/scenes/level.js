import Player from '../player/player.js';
import Ground from '../objects/platform.js';

export default class LevelScene extends Phaser.Scene {
    constructor() {
        super('LevelScene');
    }

    preload() {
        this.load.image('player', '../assets/characters/player.png');
        this.load.image('suelo', '../assets/suelo.png');
    }

    create() {
        this.cameras.main.setBackgroundColor('#3b8de5ff');

        // Suelos
        this.grounds = [
            new Ground(this, this.scale.width / 2, this.scale.height - 50, 'suelo', 8, 1),
            new Ground(this, 300, 550, 'suelo', 0.5, 1),
            new Ground(this, 900, 400, 'suelo', 0.5, 1)
        ];

        // Jugador
        this.player = new Player(this, this.scale.width / 2, this.scale.height / 2, 'player');

        this.physics.add.collider(this.player, this.grounds);

        // Controles
        this.keys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            up: Phaser.Input.Keyboard.KeyCodes.W
        });

        // Botón resultado
        const botonResultado = this.add.text(this.scale.width - 150, 100, 'Resultado', {
            fontSize: '40px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        botonResultado.setInteractive({ useHandCursor: true });
        botonResultado.on('pointerdown', () => this.scene.start('ResultScene'));
    }

    update() {
        this.player.handleInput(this.keys);
    }
}
