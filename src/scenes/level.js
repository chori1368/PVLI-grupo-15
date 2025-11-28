import PlayerSpear from '../player/player_spear.js';
import PlayerSword from '../player/player_sword.js';
import Ground from '../objects/platform.js';
import Bridge from '../objects/bridge.js';
import HealthBar from '../ui/healthbar.js';
import Timer from '../ui/timer.js';
import Camera from '../ui/camera.js';
import Lava from '../objects/lava.js';
import Te from '../objects/tea.js';
import BreakableGround from '../objects/breakableGround.js';

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
    const LEVEL_WIDTH = 2400;
    const LEVEL_HEIGHT = 800;
    const padding = 20;

    console.log(this.sys.settings.key + ": create");

    // Puente
    this.bridge = new Bridge(this, 0, this.scale.height - 50, 'bridge', 0.1, 0.1, LEVEL_WIDTH);
    // Camera shake 5 segundos antes de destruir el puente
     this.time.delayedCall(30000 - 2000, () => {
    // duración 500 ms, intensidad 0.01 
    this.cameras.main.shake(2000, 0.01);
});
    this.time.delayedCall(30000, () => this.bridge.collapseParts(13, true));
    this.time.delayedCall(60000, () => this.bridge.destroy());

    // Suelos
    this.grounds = [
        new Ground(this, 500, 700, 'suelo', 0.25, 0.5),
        new Ground(this, 1200, 500, 'suelo', 0.25, 0.5)
    ];
    this.breakables = [];



    // Lava
    const lavaY = this.scale.height+150;
    const lavaX = this.scale.width / 2;
    this.lava = new Lava(this, lavaX, lavaY, 'lava', 20, 3);

    // --- Crear jugadores (antes de spawnTea) ---
    this.playerLeft = (data.left === 0) ? new PlayerSword(this, 'left') : new PlayerSpear(this, 'left');
    this.playerRight = (data.right === 0) ? new PlayerSword(this, 'right') : new PlayerSpear(this, 'right');

    // Colliders jugadores con mundo
    this.physics.add.collider(this.playerLeft, this.grounds, (player, ground) => {
    console.log('playerLeft tocó el suelo');
    }, null, this);

    this.physics.add.collider(this.playerRight, this.grounds, (player, ground) => {
    console.log('playerRight tocó el suelo');
     }, null, this);
    this.physics.add.collider(this.playerLeft, this.bridge.getSegments());
    this.physics.add.collider(this.playerRight, this.bridge.getSegments());

    this.lava.addCollision(this.playerLeft);
    this.lava.addCollision(this.playerRight);
    this.playerLeft.addCollision(this.playerRight);
    this.playerRight.addCollision(this.playerLeft);
     //Paredes invisibles
    this.physics.world.setBounds(0, 1000, LEVEL_WIDTH, LEVEL_HEIGHT);
    this.physics.world.setBoundsCollision(true, true, false, true); // ejemplo: permitir salir por arriba (false) pero bloquear left/right/down
    this.playerLeft.setCollideWorldBounds(true);
    this.playerRight.setCollideWorldBounds(true);
    this.cameras.main.setBounds(0, 0, LEVEL_WIDTH, LEVEL_HEIGHT);
    const breakable = new BreakableGround(this, 400, 300, 'suelo') ;
    breakable.setScale(0.3);
     breakable.body.setSize(breakable.displayWidth, breakable.displayHeight);
     breakable.body.setOffset((breakable.width - breakable.displayWidth) / 2, (breakable.height - breakable.displayHeight) / 2);
    this.breakables.push(breakable);
    

    // usa el sprite (o gameobject real) para la colisión, pero llama al wrapper
     this.physics.add.collider(this.playerLeft, breakable.sprite ?? breakable, (player, sprite) => {
    breakable.touch(player);
    }, null, this);

    this.physics.add.collider(this.playerRight, breakable.sprite ?? breakable, (player, sprite) => {
    breakable.touch(player);
    }, null, this);



    

    // Cámara dinámica
    // crea la cámara con los jugadores ya existentes
    this.camera = new Camera(this, this.playerLeft, this.playerRight, {
        levelWidth: LEVEL_WIDTH,
        levelHeight: LEVEL_HEIGHT,
        minDistance: 200,
        maxDistance: 1000,
        maxZoom: 1.2
    });

    // --- UI (Healthbars, Timer, Button) ---
    const barWidth = 300;
    const barHeight = 25;
    this.healthBar1 = new HealthBar(this, this.scale.width - barWidth - 100, padding, barWidth, barHeight, 0x763a6b);
    this.healthBar2 = new HealthBar(this, 90, padding, barWidth, barHeight, 0x763a6b);

    const botonResultado = this.add.text(this.scale.width - 150, 100, 'Resultado', {
        fontSize: '40px',
        fill: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 20, y: 10 }
    }).setOrigin(0.5);

    botonResultado.setInteractive({ useHandCursor: true });
    botonResultado.on('pointerdown', () => this.scene.start('result'));

    this.timer = new Timer(this, this.scale.width / 2, padding, 60);

    // UI camera
    this.uiCamera = this.cameras.add(0, 0, this.scale.width, this.scale.height);
    this.uiCamera.setScroll(0, 0);
    this.uiCamera.setZoom(1);

    // UI container con elementos que NO forman parte del sistema de physics
    this.uiContainer = this.add.container(0, 0, [
        this.healthBar1.background, this.healthBar1.bar, this.healthBar1.text,
        this.healthBar2.background, this.healthBar2.bar, this.healthBar2.text,
        this.timer.text,
        botonResultado
    ]);

    // Principal no dibuja la UI; UI camera no dibuja objetos del mundo
    this.cameras.main.ignore(this.uiContainer);

    // Evitar que la uiCamera renderice el mundo (si algunos objetos son undefined, ignorarlos)
    const ignoreList = [
        this.playerLeft,
        this.playerRight,
        ...this.grounds,
        ...this.bridge.getSegments(),
         ...this.breakables.map(b => b.sprite ?? b),
         this.lava.sprite ?? this.lava,
         this.te?.sprite ?? this.te
        
    ].filter(Boolean);
    this.uiCamera.ignore(ignoreList);

    // --- Finalmente arranca el spawn del té (ahora los players ya existen) ---
    this.spawnTea();
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
           this.uiCamera.ignore(this.te);

        });
    }

    update() {
        this.breakables.forEach(b => b.update([this.playerLeft, this.playerRight]));
  
        this.playerLeft.handleInput();
        this.playerRight.handleInput();
        this.healthBar1.update(this.playerLeft.life, this.playerLeft.maxLife); // barra de izq
        this.healthBar2.update(this.playerRight.life, this.playerRight.maxLife); // barra de dcha 
            if (this.camera && typeof this.camera.update === 'function') {
        this.camera.update();
    }
        this.isGameOver();
       
    }
}