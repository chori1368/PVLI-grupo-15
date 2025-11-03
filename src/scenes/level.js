import PlayerSpear from '../player/player_spear.js';
import PlayerSword from '../player/player_sword.js';
import Ground from '../objects/platform.js';
import Bridge from '../objects/bridge.js';
import HealthBar from '../ui/healthbar.js';
import Timer from '../ui/timer.js';
import Lava from '../objects/lava.js';


export default class LevelScene extends Phaser.Scene {
    constructor() {
        super('LevelScene');
    }

    preload() {
        
    }

    create() {
        this.cameras.main.setBackgroundColor('#3b8de5ff');
        const padding = 20;

        //Puente
        this.bridge = new Bridge(this, 0, this.scale.height - 50, 'bridge', 0.1, 0.1);
        
        this.lava = null;

        // Romper puente a los 150 segundos
        this.time.delayedCall(150 * 1000, () => {
            this.bridge.collapseParts(20, true);
        });

        //Suelos adicionales
        this.grounds = [
            new Ground(this, 300, 450, 'suelo', 0.25, 0.5),
            new Ground(this, 700, 300, 'suelo', 0.25, 0.5)
        ];
        // Lava
        const lavaY = this.scale.height - 25; // altura
        const lavaX = this.scale.width / 2;   // centrado horizontal
        this.lava = new Lava(this, lavaX, lavaY, 'lava', 10, 0.5);

     

        // --- Jugadores ---
        this.player1 = new PlayerSpear(this, this.scale.width / 3, this.scale.height / 2, 'player');
        this.player2 = new PlayerSword(this, this.scale.width * 2 / 3, this.scale.height /1.35, 'player');
        this.player1.setScale(0.25);
        this.player2.setScale(0.25);

        this.physics.add.collider(this.player1, this.grounds);
        this.physics.add.collider(this.player2, this.grounds);
        this.physics.add.collider(this.player1, this.bridge.getSegments());
        this.physics.add.collider(this.player2, this.bridge.getSegments());
        this.lava.addCollision(this.player1);//Lava con jugadores
        this.lava.addCollision(this.player2);


        // --- Barras de vida ---
        const barWidth = 300;
        const barHeight = 25;
        const portraitSize = 50;

        this.healthBar1 = new HealthBar(this, padding + portraitSize + 10, padding, barWidth, barHeight, 0x00ff00);
        this.player1Image = this.add.image(padding, padding + barHeight / 2, 'player')
            .setOrigin(0, 0.5)
            .setDisplaySize(portraitSize, portraitSize);

        this.healthBar2 = new HealthBar(this, this.scale.width - barWidth - padding - portraitSize - 10, padding, barWidth, barHeight, 0x00ff00);
        this.player2Image = this.add.image(this.scale.width - padding, padding + barHeight / 2, 'player')
            .setOrigin(1, 0.5)
            .setDisplaySize(portraitSize, portraitSize);

        // --- Controles ---
        this.keys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            up: Phaser.Input.Keyboard.KeyCodes.W
        });

        // --- Botón Resultado ---
        const botonResultado = this.add.text(this.scale.width - 150, 100, 'Resultado', {
            fontSize: '40px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        botonResultado.setInteractive({ useHandCursor: true });
        botonResultado.on('pointerdown', () => this.scene.start('ResultScene'));

        // Timer
        this.timer = new Timer(this, this.scale.width / 2, padding, 180);

        
    }

    update() {
        this.player1.handleInput();
        this.player2.handleInput();
        this.healthBar1.update(this.player1.life, this.player1.maxLife);
        this.healthBar2.update(this.player2.life, this.player2.maxLife);
    }
}

