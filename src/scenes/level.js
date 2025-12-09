import PlayerSpear from '../player/player_spear.js';
import PlayerSword from '../player/player_sword.js';
import Ground from '../objects/platform.js';
import Bridge from '../objects/bridge.js';
import Lava from '../objects/lava.js';
import Te from '../objects/tea.js';
import BreakableGround from '../objects/breakableGround.js';
import SoundManager from '../manager/soundManager.js';

export default class LevelScene extends Phaser.Scene {
    constructor() {
        super('level');
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
        this.load.image('suelo', 'assets/suelo.png');
        this.load.image('bridge', 'assets/ground.png');
        this.load.image('lava', 'assets/lava.png');
        this.load.image('te', 'assets/te.png');
        this.load.image('coliseum', 'assets/level/coliseum.png');

        //Preload spritesheets
        this.load.spritesheet('sword', 'assets/characters/sword.png', { frameWidth: 668, frameHeight: 656 });
        this.load.spritesheet('spear', 'assets/characters/spear.png', { frameWidth: 668, frameHeight: 656 });
    }

    create(data) {

        // Fondo
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'coliseum').setScrollFactor(0.5).displayHeight = this.scale.height;
        
        // Color de fondo de cámara
        this.cameras.main.setBackgroundColor('#161338');

        // Asignamos el reloj del html (UI)
        this.clock = document.querySelector('clock');
        // Barras de vida del html (UI)
        this.healthbarLeft = document.querySelector('healthbar.left');
        this.healthbarRight = document.querySelector('healthbar.right');
        // Duración de la partida en milisegundos (1 minuto)
        this.matchDurationMs = 60000;
        this.matchEndTime = null;

        // Al iniciar el nivel mostramos el reloj
        if (this.clock) {
            this.clock.style.display = 'block';
        }
        // Y las barras de vida
        if (this.healthbarLeft) {
            this.healthbarLeft.style.display = 'flex';
        }
        if (this.healthbarRight) {
            this.healthbarRight.style.display = 'flex';
        }

        // Tiempo de partida (1 minuto en ms), se invoca la destruccion del puente
        this.time.delayedCall(this.matchDurationMs, null, null, this);
        // Momento (en ms del reloj de Phaser) en el que termina la partida
        this.matchEndTime = this.time.now + this.matchDurationMs;

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
        this.time.delayedCall(30000, () => this.bridge.collapseParts());

        this.time.delayedCall(60000, () => { this.bridge.destroy(), SoundManager.play('break'); });

        // Suelos
        this.grounds = [
            new Ground(this, 500, 700, 'suelo', 0.25, 0.5),
            new Ground(this, 1200, 500, 'suelo', 0.25, 0.5)
        ];
        this.breakables = [];

        // Lava
        const lavaY = this.scale.height + 100;
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

        // --- Finalmente arranca el spawn del té (ahora los players ya existen) ---
        this.spawnTea();
    }

    isGameOver() {
        if (!this.playerLeft.isAlive()) {
            SoundManager.stopMusic();
            if (this.clock) this.clock.style.display = 'none';
            if (this.healthbarLeft) this.healthbarLeft.style.display = 'none';
            if (this.healthbarRight) this.healthbarRight.style.display = 'none';
            this.scene.start('result', { winner: 'right', type: this.playerRight.type });
        } else if (!this.playerRight.isAlive()) {
            SoundManager.stopMusic();
            if (this.clock) this.clock.style.display = 'none';
            if (this.healthbarLeft) this.healthbarLeft.style.display = 'none';
            if (this.healthbarRight) this.healthbarRight.style.display = 'none';
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

        this.updateCameraFollow();

        this.isGameOver();
    }

    // Actualiza el timer del html (clock)
    updateClock() {
        if (!this.clock || this.matchEndTime === null) return;

        const remainingMs = Math.max(this.matchEndTime - this.time.now, 0);
        const totalSeconds = Math.ceil(remainingMs / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const minutesStr = minutes.toString().padStart(2, '0');
        const secondsStr = seconds.toString().padStart(2, '0');

        this.clock.textContent = `${minutesStr}:${secondsStr}`;
    }

    // Cámara sigue al punto medio entre ambos jugadores
    updateCameraFollow() {
        const p1 = this.playerLeft;
        const p2 = this.playerRight;
        if (!p1 || !p2) return;

        const centerX = (p1.x + p2.x) / 2;
        const centerY = (p1.y + p2.y) / 2;

        this.cameras.main.centerOn(centerX, centerY);
    }
}
