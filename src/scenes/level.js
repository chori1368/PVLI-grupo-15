import PlayerSpear from '../player/player_spear.js';
import PlayerSword from '../player/player_sword.js';
import Ground from '../objects/platform.js';
import Bridge from '../objects/bridge.js';
import HealthBar from '../ui/healthbar.js';
import Timer from '../ui/timer.js';
import Lava from '../objects/lava.js';
import Te from '../objects/tea.js';

export default class LevelScene extends Phaser.Scene {
    constructor() { super('level'); }

    preload() {
        console.log(this.sys.settings.key + ": preload");

        // Preload assets        
        this.load.image('sword', 'assets/characters/sword.png');
        this.load.image('spear', 'assets/characters/spear.png');
        this.load.image('suelo', 'assets/suelo.png');
        this.load.image('bridge', 'assets/ground.png');
        this.load.image('lava', 'assets/lava.png');
        this.load.image('te', 'assets/te.png');
    }

    create(data) {
        console.log(this.sys.settings.key + ": create");

        const padding = 20;

        //Puente
        this.bridge = new Bridge(this, 0, this.scale.height - 50, 'bridge', 0.1, 0.1);

        // Romper puente a los 30 segundos
        this.time.delayedCall(30000, () => {
            this.bridge.collapseParts(10, true);
        });
        this.time.delayedCall(60000, () => {
            this.bridge.destroy();
        });

        //Suelos adicionales
        this.grounds = [
            new Ground(this, 500, 700, 'suelo', 0.25, 0.5),
            new Ground(this, 1200, 500, 'suelo', 0.25, 0.5)
        ];

        // Lava
        const lavaY = this.scale.height - 25; // altura
        const lavaX = this.scale.width / 2;   // centrado horizontal
        this.lava = new Lava(this, lavaX, lavaY, 'lava', 10, 0.5);

        // Té
        this.spawnTea();

        // Crear jugador izq
        if (data.left === 0) this.playerLeft = new PlayerSword(this, 'left');
        else this.playerLeft = new PlayerSpear(this, 'left');

        // Crear jugador dcha
        if (data.right === 0) this.playerRight = new PlayerSword(this, 'right');
        else this.playerRight = new PlayerSpear(this, 'right');

        // Jugador con suelos
        this.physics.add.collider(this.playerLeft, this.grounds);
        this.physics.add.collider(this.playerRight, this.grounds);
        this.physics.add.collider(this.playerLeft, this.bridge.getSegments());
        this.physics.add.collider(this.playerRight, this.bridge.getSegments());

        this.lava.addCollision(this.playerLeft);//Lava con jugadores
        this.lava.addCollision(this.playerRight);
        this.playerLeft.addCollision(this.playerRight);
        this.playerRight.addCollision(this.playerLeft);


        // --- Barras de vida ---
        const barWidth = 300;
        const barHeight = 25;

        this.healthBar1 = new HealthBar(this, this.scale.width - barWidth - 100, padding, barWidth, barHeight, 0x763a6b);
        this.healthBar2 = new HealthBar(this, 90, padding, barWidth, barHeight, 0x763a6b);


        // --- Botón Resultado ---
        const botonResultado = this.add.text(this.scale.width - 150, 100, 'Resultado', {
            fontSize: '40px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        botonResultado.setInteractive({ useHandCursor: true });
        botonResultado.on('pointerdown', () => this.scene.start('result'));

        // Timer
        this.timer = new Timer(this, this.scale.width / 2, padding, 60);
    }

    isGameOver() {
        if (!this.playerLeft.isAlive())
            this.scene.start('result', { winner: 'right', type: this.playerRight.type });

        else if(!this.playerRight.isAlive())
            this.scene.start('result', { winner: 'left', type: this.playerLeft.type });
    }

    spawnTea() {
        const delay = Phaser.Math.Between(5000, 10000); // tiempo aleatorio entre 5 y 10 segundos
        this.time.delayedCall(delay, () => {
            const x = Phaser.Math.Between(50, this.scale.width - 50);
            const y = this.scale.height - 1200;
            this.te = new Te(this, x, y, 'te', 7500);
            this.te.addCollision(this.playerLeft);
            this.te.addCollision(this.playerRight);
            this.physics.add.collider(this.te, this.grounds);
            this.physics.add.collider(this.te, this.bridge.getSegments());
            this.spawnTea(); // programa el siguiente spawn
        });
    }

    update() {
        this.playerLeft.handleInput();
        this.playerRight.handleInput();
        this.healthBar1.update(this.playerLeft.life, this.playerLeft.maxLife); // barra de izq
        this.healthBar2.update(this.playerRight.life, this.playerRight.maxLife); // barra de dcha
        this.isGameOver();
    }
}