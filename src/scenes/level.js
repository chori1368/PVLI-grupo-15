import PlayerSpear from '../player/player_spear.js';
import PlayerSword from '../player/player_sword.js';
import Ground from '../objects/platform.js';
import Bridge from '../objects/bridge.js';
import Lava from '../objects/lava.js';
import Squirrel from '../objects/squirrel.js';
import Box from '../objects/box.js';
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
        this.load.image('pilar', 'assets/level/pilar.png');
        this.load.image('platform', 'assets/level/platform.png');
        this.load.image('bridge', 'assets/level/bridge.png');
        this.load.image('lava', 'assets/level/lava.png');
        this.load.image('tea', 'assets/level/tea.png');
        this.load.image('squirrel', 'assets/characters/squirrel.png');
        this.load.image('box', 'assets/level/box.png');
        this.load.image('coliseum', 'assets/level/coliseum.png');

        // Preload spritesheets
        this.load.spritesheet('sword', 'assets/characters/sword.png', { frameWidth: 916, frameHeight: 593 });
        this.load.spritesheet('spear', 'assets/characters/spear.png', { frameWidth: 926, frameHeight: 593 });
    }

    create(data) {

        // Fondo
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'coliseum').setScrollFactor(0.5).setOrigin(0.5);

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
        this.clock.style.display = 'block';

        // Y las barras de vida
        this.healthbarLeft.style.display = 'flex';
        this.healthbarRight.style.display = 'flex';

        // Tiempo de partida (1 minuto en ms), se invoca la destruccion del puente
        this.time.delayedCall(this.matchDurationMs, null, null, this);

        // Momento (en ms del reloj de Phaser) en el que termina la partida
        this.matchEndTime = this.time.now + this.matchDurationMs;

        const LEVEL_WIDTH = 2400;
        const LEVEL_HEIGHT = 800;

        SoundManager.playMusic('BattleMusic', { loop: true, fade: 0, volume: 0.05 });
        SoundManager.setSfx(0.1);

        // Puente
        this.bridge = new Bridge(this, 0, this.scale.height - 190, 'bridge', 0.45, 0.45, LEVEL_WIDTH);

        // Camera shake 5 segundos antes de destruir el puente
        this.time.delayedCall(30000 - 2000, () => {
            // duración 500 ms, intensidad 0.01 
            SoundManager.play('terremoto');
            this.cameras.main.shake(2000, 0.01);
        });

        // Puente hundiéndose a los 30 segundos
        this.time.delayedCall(30000, () => this.bridge.collapseParts());

        // Destruir puente al finalizar la partida
        this.time.delayedCall(60000, () => { this.bridge.destroy(), SoundManager.play('break'); });

        // Pilares (columnas con plataformas)
        this.pilars = [
            new Ground(this, this.scale.width - 1800, this.scale.height - 450, 'pilar', 0.35, 0.35),
            new Ground(this, this.scale.width - 800, this.scale.height - 550, 'pilar', 0.5, 0.6)
        ];

        this.platforms = [];

        // Lava
        this.lava = new Lava(this, this.scale.width / 2, this.scale.height, 'lava', 20, 1);

        // Cajas
        this.boxes = [
            new Box(this, 700, this.scale.height - 500),
            new Box(this, 1200, this.scale.height - 520),
            new Box(this, 1700, this.scale.height - 500)
        ];

        // Crear jugador izquierdo (según tipo)
        if (data.left == 0) this.playerLeft = new PlayerSword(this, 'left');
        else this.playerLeft = new PlayerSpear(this, 'left');

        // Crear jugador derecho (según tipo)
        if (data.right == 0) this.playerRight = new PlayerSword(this, 'right');
        else this.playerRight = new PlayerSpear(this, 'right');

        // Colliders jugadores con mundo
        this.physics.add.collider(this.playerLeft, this.pilars);
        this.physics.add.collider(this.playerRight, this.pilars);
        this.physics.add.collider(this.playerLeft, this.bridge.getSegments());
        this.physics.add.collider(this.playerRight, this.bridge.getSegments());
        this.physics.add.collider([this.playerLeft, this.playerRight], this.boxes);
        this.physics.add.collider(this.boxes, this.pilars);
        this.physics.add.collider(this.boxes, this.bridge.getSegments());
        this.physics.add.collider(this.boxes, this.boxes);

        // Eventos de colisión entre jugadores y lava
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

        // Array de colliders para pasarlo a cualquier overlap externo
        this.colliders = [
            this.playerLeft,
            this.playerRight,
            this.pilars,
            this.bridge.getSegments(),
            this.boxes
        ];

        // const breakable = new BreakableGround(this, 400, 300, 'suelo');
        // breakable.setScale(0.3);
        // breakable.body.setSize(breakable.displayWidth, breakable.displayHeight);
        // breakable.body.setOffset((breakable.width - breakable.displayWidth) / 2, (breakable.height - breakable.displayHeight) / 2);
        // this.breakables.push(breakable);


        // usa el sprite (o gameobject real) para la colisión, pero llama al wrapper
        // this.physics.add.collider(this.playerLeft, breakable.sprite ?? breakable, (player, sprite) => {
        //     breakable.touch(player);
        // }, null, this);

        // this.physics.add.collider(this.playerRight, breakable.sprite ?? breakable, (player, sprite) => {
        //     breakable.touch(player);
        // }, null, this);

        // Inicializamos el temporizador para la primera ardilla
        this.nextTea = this.time.now + Phaser.Math.Between(5000, 10000);
    }

    isGameOver() {
        let result = null;

        // Comprobar si algún jugador ha muerto
        if (!this.playerLeft.isAlive()) result = { winner: 'right', type: this.playerRight.type };
        else if (!this.playerRight.isAlive()) result = { winner: 'left', type: this.playerLeft.type };

        // Si alguno ha muerto, ocultar UI y pasar de escena
        if (result) {
            SoundManager.stopMusic();
            this.clock.style.display = 'none';
            this.healthbarLeft.style.display = 'none';
            this.healthbarRight.style.display = 'none';
            this.scene.start('result', result);
        }
    }

    update() {
        // Actualizar plataformas
        this.platforms.forEach(p => p.update([this.playerLeft, this.playerRight]));

        // Actualizar jugadores
        this.playerLeft.handleInput();
        this.playerRight.handleInput();

        // Actualizar cámara y reloj
        this.updateCameraFollow();
        this.updateClock();

        // Spawnear ardillas que lanzan té (después de un tiempo nextTea)
        if (this.time.now > this.nextTea) this.spawnSquirrel();

        // Comprobar si la partida ha terminado
        this.isGameOver();
    }

    // Spawnea una ardilla que lanza té en una posición x aleatoria
    spawnSquirrel() {
        let x;
        // Elegir posición x aleatoria dentro del ancho del nivel
        if (Phaser.Math.Between(0, 1) === 0) x = (window.outterWidth - window.innerWidth) / 2 + this.displayWidth;
        else x = (window.outterWidth + window.innerWidth) / 2 - this.displayWidth;

        // Crear ardilla con los colliders del nivel (para el té)
        new Squirrel(this, x);
        // Actualizar el timer para la próxima ardilla
        this.nextTea = this.time.now + Phaser.Math.Between(5000, 10000);
    }

    // Actualiza el timer del html (clock)
    updateClock() {
        // Calculamos el tiempo restante en segundos
        const time = Math.floor((this.matchEndTime - this.time.now) / 1000);

        // Actualizamos el DOM cada segundo (y no cada frame)
        if (this.lastT !== time) {
            this.lastT = time;
            // Formateammos el tiempo en MM:SS (minutos:segundos cada uno con dos dígitos)
            this.clock.textContent = `${Math.floor(time / 60).toString().padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`;
        }
    }

    // Actualiza la cámara para que siga a ambos jugadores
    updateCameraFollow() {
        const x = (this.playerLeft.x + this.playerRight.x) / 2;
        const y = (this.playerLeft.y + this.playerRight.y) / 2;
        this.cameras.main.centerOn(x, y);
    }
}
