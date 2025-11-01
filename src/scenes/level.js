import PlayerSpear from '../player/player_spear.js';
import PlayerSword from '../player/player_sword.js';
import Ground from '../objects/platform.js';
import HealthBar from '../ui/healthbar.js';
import Timer from '../ui/timer.js';


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
        this.timeLeft = 180;
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
         const portraitSize = 50;

         // Jugador 1 con su barra de vida
         this.healthBar1 = new HealthBar(this, padding + portraitSize + 10, padding, barWidth, barHeight, 0x00ff00);
         // Imagen del jugador 1
         this.player1Image = this.add.image(padding, padding + barHeight / 2, 'player')
         .setOrigin(0, 0.5)  // anclar vertical al medio de la barra
         .setDisplaySize(portraitSize, portraitSize);

         // Jugador 2 con su barra de vida
         this.healthBar2 = new HealthBar(this, this.scale.width - barWidth - padding - portraitSize - 10, padding, barWidth, barHeight, 0x00ff00);
         // Imagen del jugador 2
         this.player2Image = this.add.image(this.scale.width - padding, padding + barHeight / 2, 'player')
         .setOrigin(1, 0.5)  // anclar al lado derecho
         .setDisplaySize(portraitSize, portraitSize);

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
        this.timer = new Timer(this, this.scale.width / 2, padding, 3);

    }

    update() {
         this.player1.handleInput();
         this.player2.handleInput();
         this.healthBar1.update(this.player1.life, this.player1.maxLife);
         this.healthBar2.update(this.player2.life, this.player2.maxLife);
    }
}
