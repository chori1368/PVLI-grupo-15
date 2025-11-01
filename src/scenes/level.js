import PlayerSpear from '../player/player_spear.js';
import PlayerSword from '../player/player_sword.js';
import Ground from '../objects/platform.js';
import HealthBar from '../ui/healthbar.js';

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
         this.player1 = new PlayerSpear(this, this.scale.width / 3, this.scale.height / 2, 'player');
         this.player2 = new PlayerSword(this, this.scale.width * 2 / 3, this.scale.height /1.35, 'player');
         this.player1.setScale(0.25);
         this.player2.setScale(0.25);

         this.physics.add.collider(this.player1, this.grounds);
         this.physics.add.collider(this.player2, this.grounds);
         // Crear barras de vida
const barWidth = 300;
const barHeight = 25;
const padding = 20;

this.healthBar1 = new HealthBar(this, padding, padding, barWidth, barHeight, 0x00ff00);
this.healthBar2 = new HealthBar(this, this.scale.width - barWidth - padding, padding, barWidth, barHeight, 0x00ff00);

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
         this.player1.handleInput();
         this.player2.handleInput();
         this.healthBar1.update(this.player1.life, this.player1.maxLife);
         this.healthBar2.update(this.player2.life, this.player2.maxLife);
    }
}
