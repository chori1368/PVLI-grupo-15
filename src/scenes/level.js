import PlayerSpear from '../player/player_spear.js';
import PlayerSword from '../player/player_sword.js';
import Ground from '../objects/platform.js';
import Bridge from '../objects/bridge.js';
import Camera from '../ui/camera.js';
import Lava from '../objects/lava.js';
import Te from '../objects/tea.js';
import BreakableGround from '../objects/breakableGround.js';
import SoundManager from '../manager/soundManager.js';

export default class LevelScene extends Phaser.Scene {
    constructor() {
        // Llamamos al constructor de Phaser.Scene
        super('level');
        // Asignamos el reloj del html (UI)
        this.clock = document.querySelector('clock');
    }

    preload() {
        SoundManager.init(this);
        SoundManager.preload([
            { key: 'BattleMusic', path: 'assets/sounds/MusicaBatalla.mp3' },
            { key: 'tea', path: 'assets/sounds/tea.mp3' },
            { key: 'terremoto', path: 'assets/sounds/terremoto.mp3' },
            { key: 'spear', path: 'assets/sounds/lanza.mp3' },
            { key: 'sword', path: 'assets/sounds/sword.mp3' },
            { key: 'break', path: 'assets/sounds/LadrilloRoto.mp3' },
            { key: 'swallow', path: 'assets/sounds/swallow.mp3' },
            { key: 'spinningSword', path: 'assets/sounds/spinningSword.mp3' },
            { key: 'spinningSpear', path: 'assets/sounds/spinningSpear.mp3' },
            { key: 'speardash', path: 'assets/sounds/spearDash.mp3' }
        ]);

        // Preload assets        
        this.load.image('sword', 'assets/characters/sword.png');
        this.load.image('spear', 'assets/characters/spear.png');
        this.load.image('suelo', 'assets/suelo.png');
        this.load.image('bridge', 'assets/ground.png');
        this.load.image('lava', 'assets/lava.png');
        this.load.image('te', 'assets/te.png');
    }

    create(data) {

        // Tiempo de partida (1 minuto en ms), se invoca la destruccion del puente
        this.time.delayedCall(60000, null, null, this);

        const LEVEL_WIDTH = 2400;
        const LEVEL_HEIGHT = 800;

        SoundManager.playMusic('BattleMusic', { loop: true, fade: 0, volume: 0.05 });
        SoundManager.setSfx(0.1);

        // Puente
        this.bridge = new Bridge(this, 0, this.scale.height - 50, 'bridge', 0.1, 0.1, LEVEL_WIDTH);
        // Camera shake 5 segundos antes de destruir el puente
        this.time.delayedCall(30000 - 2000, () => {
            // duración 500 ms, intensidad 0.01 
            SoundManager.play('terremoto');
            this.cameras.main.shake(2000, 0.01);
        });
        this.time.delayedCall(30000, () => this.bridge.collapseParts(13, true));

        this.time.delayedCall(60000, () => { this.bridge.destroy(), SoundManager.play('break'); });

        // Suelos
        this.grounds = [
            new Ground(this, 500, 700, 'suelo', 0.25, 0.5),
            new Ground(this, 1200, 500, 'suelo', 0.25, 0.5)
        ];
        this.breakables = [];

        // Lava
        const lavaY = this.scale.height + 150;
        const lavaX = this.scale.width / 2;
        this.lava = new Lava(this, lavaX, lavaY, 'lava', 20, 3);

        // Crear jugador izquierdo (según tipo)
        if (data.left == 0) this.playerLeft = new PlayerSword(this, 'left');
        else this.playerLeft = new PlayerSpear(this, 'left');

        // Crear jugador derecho (según tipo)
        if (data.right == 0) this.playerRight = new PlayerSword(this, 'right');
        else this.playerRight = new PlayerSpear(this, 'right');

        // Colliders jugadores con mundo
        this.physics.add.collider(this.playerLeft, this.grounds, (player, ground) => {
        }, null, this);

        this.physics.add.collider(this.playerRight, this.grounds, (player, ground) => {
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
        const breakable = new BreakableGround(this, 400, 300, 'suelo');
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

        // --- Finalmente arranca el spawn del té (ahora los players ya existen) ---
        this.spawnTea();
    }

    isGameOver() {
        if (!this.playerLeft.isAlive()) {
            SoundManager.stopMusic();
            this.scene.start('result', { winner: 'right', type: this.playerRight.type });
        } else if (!this.playerRight.isAlive()) {
            SoundManager.stopMusic();
            this.scene.start('result', { winner: 'left', type: this.playerLeft.type });
        }
    }

    spawnTea() {
        const delay = Phaser.Math.Between(5000, 10000); // tiempo aleatorio entre 5 y 10 segundos
        const soundTime = delay - 1300; // sonar 1.3 segundos antes de que aparezca el té
        this.time.delayedCall(soundTime, () => {
            SoundManager.play('tea');
        });
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
        this.updateClock();

        this.breakables.forEach(b => b.update([this.playerLeft, this.playerRight]));

        this.playerLeft.handleInput();
        this.playerRight.handleInput();

        if (this.camera && typeof this.camera.update === 'function') {
            this.camera.update();
        }
        this.isGameOver();

    }

    // Actualiza el timer del html (clock)
    updateClock() {
        this.clock.text = `${minutes.toString()}:${seconds.toString()}`;
    }
}