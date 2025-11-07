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
        this.load.image('player', 'assets/characters/player.png');
        this.load.image('suelo', 'assets/suelo.png');
        this.load.image('bridge', 'assets/ground.png');
        this.load.image('lava', 'assets/lava.png');
    }

    create() {
        this.cameras.main.setBackgroundColor('#3b8de5ff');
        const padding = 20;

        //Puente
        this.bridge = new Bridge(this, 0, this.scale.height - 50, 'bridge', 0.1, 0.1);
        
        this.lava = null;

        // Romper puente a los 150 segundos
        this.time.delayedCall(30 * 1000, () => {
            this.bridge.collapseParts(20, true);
        });

        //Suelos adicionales
        this.grounds = [
            new Ground(this, 500, 700, 'suelo', 0.25, 0.5),
            new Ground(this, 1200, 450, 'suelo', 0.25, 0.5)
        ];
        // Lava
        const lavaY = this.scale.height - 25; // altura
        const lavaX = this.scale.width / 2;   // centrado horizontal
        this.lava = new Lava(this, lavaX, lavaY, 'lava', 10, 0.5);

     

        // --- Jugadores ---
        this.player1 = new PlayerSpear(this, this.scale.width *2 / 3, this.scale.height / 2, 'player'); //*2 para que este en el tercio derecho de la pantalla
        this.player2 = new PlayerSword(this, this.scale.width / 3, this.scale.height / 2, 'player');

        this.physics.add.collider(this.player1, this.grounds);
        this.physics.add.collider(this.player2, this.grounds);
        this.physics.add.collider(this.player1, this.bridge.getSegments());
        this.physics.add.collider(this.player2, this.bridge.getSegments());
        this.lava.addCollision(this.player1);//Lava con jugadores
        this.lava.addCollision(this.player2);
        this.player1.addCollision(this.player2);
        this.player2.addCollision(this.player1);


        // --- Barras de vida ---
        const barWidth = 300;
        const barHeight = 25;
        const portraitSize = 50;

        this.healthBar1 = new HealthBar(this, this.scale.width - barWidth - 100, padding, barWidth, barHeight, 0x763a6b);
        this.player1Image = this.add.image(this.scale.width - padding, padding + barHeight / 2, 'player')
            .setOrigin(1, 0.5)
            .setDisplaySize(portraitSize, portraitSize);

        this.healthBar2 = new HealthBar(this, 90, padding, barWidth, barHeight, 0x763a6b);
        this.player2Image = this.add.image(padding, padding + barHeight / 2, 'player')
            .setOrigin(0, 0.5)
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
        this.timer = new Timer(this, this.scale.width/2, padding, 60);
    }

    die(player)
    {
        this.scene.start('ResultScene');
    }
    

    update() {

    let d = this.scale.displaySize.width; // tamaño del canvas ya escalado (px)
    let p = this.scale.parentSize.width;  // tamaño visible (px)

    let sobranteX = Math.max(0, d - p);
    let posX = sobranteX / 2;


        //console.log('current canvas size:', this.scale.width);
        //console.log('current display size:', window.innerWidth);
        //console.log('current origin X:', posX);

        this.player1.handleInput();
        this.player2.handleInput();
        this.healthBar1.update(this.player1.life, this.player1.maxLife); // barra de izq
        this.healthBar2.update(this.player2.life, this.player2.maxLife); // barra de dcha
    }
}

