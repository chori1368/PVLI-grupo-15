import PlayerSpear from '../player/player_spear.js';
import PlayerSword from '../player/player_sword.js';
import Platform from '../objects/platform.js';
import Floating from '../objects/floating.js';
import Bridge from '../objects/bridge.js';
import Lava from '../objects/lava.js';
import Squirrel from '../objects/squirrel.js';
import Box from '../objects/box.js';

export default class LevelScene extends Phaser.Scene {
    constructor() { super('level'); }

    preload() {
        //Preload audio
        this.load.audio('BattleMusic', 'assets/sounds/MusicaBatalla.mp3');
        this.load.audio('tea', 'assets/sounds/tea.mp3');
        this.load.audio('terremoto', 'assets/sounds/terremoto.mp3');
        this.load.audio('spear', 'assets/sounds/lanza.mp3');
        this.load.audio('sword', 'assets/sounds/sword.mp3');
        this.load.audio('break', 'assets/sounds/break.mp3');
        this.load.audio('swallow', 'assets/sounds/swallow.mp3');
        this.load.audio('spinningSword', 'assets/sounds/spinningSword.mp3');
        this.load.audio('spinningSpear', 'assets/sounds/spinningSpear.mp3');
        this.load.audio('speardash', 'assets/sounds/spearDash.mp3');
        this.load.audio('daño', 'assets/sounds/Daño.mp3');


        // Preload assets
        this.load.image('platform', 'assets/level/platform.png');
        this.load.image('floating', 'assets/level/floating.png');
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

        // Dimensiones del mundo
        this.worldWidth = 3000;
        this.worldHeight = 2000;

        // Ajustamos los límites del mundo y de la cámara
        this.physics.world.setBounds(0, 0, this.worldWidth + 750, this.worldHeight);
        this.cameras.main.setBounds(0, 0, this.worldWidth + 750, this.worldHeight);
        this.physics.world.setBoundsCollision(true, true, false, true);

        // Fondo del nivel (coliseo)
        this.add.image(this.worldWidth / 2 * 0.8, this.scale.height / 2, 'coliseum').setOrigin(0.5, 0.4).setScrollFactor(0.3, 0.9);

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

        // Momento (en ms del reloj de Phaser) en el que termina la partida
        this.matchEndTime = this.time.now + this.matchDurationMs;

        // Música de batalla
        this.music = this.sound.play('BattleMusic', { loop: true, volume: 0.1 });

        // Puente
        this.bridge = new Bridge(this);

        // Y del "suelo" que queremos mantener fijo en pantalla (borde inferior de cámara)
        this.groundY = this.scale.height - 180;

        // Pilares/Platformas (columnas con plataformas)
        this.platforms = [
            // Extremo izquierdo
            new Platform(this, 100, this.scale.height - 465, 'platform', 0.4),
            new Platform(this, 335, this.scale.height - 465, 'platform', 0.4),
            new Platform(this, 570, this.scale.height - 465, 'platform', 0.4),

            // Centro
            new Platform(this, 1600, this.scale.height - 465, 'platform', 0.4),
            new Platform(this, 1835, this.scale.height - 465, 'platform', 0.4),

            // Lateral derecho
            new Platform(this, 2600, this.scale.height - 465, 'platform', 0.4),
            new Platform(this, 2835, this.scale.height - 465, 'platform', 0.4),
            new Platform(this, 3070, this.scale.height - 465, 'platform', 0.4),

            // Extremo derecho
            new Platform(this, 3605, this.scale.height - 465, 'platform', 0.4),
            new Platform(this, 3835, this.scale.height - 465, 'platform', 0.4),
        ];

        // Plataformas flotantes que se rompen al pisarlas
        this.floating = [];
        
        // Cajas
        this.boxes = [
            new Box(this, 700, this.scale.height - 500),
            new Box(this, 1200, this.scale.height - 520),
            new Box(this, 1700, this.scale.height - 500)
        ];

        // Lava
        this.lava = new Lava(this, this.scale.width / 2, this.scale.height - 90, 'lava').setOrigin(0.5, 0);
        
        // Crear jugador izquierdo (según tipo)
        if (data.left == 0) this.playerLeft = new PlayerSword(this, 'left');
        else this.playerLeft = new PlayerSpear(this, 'left');

        // Crear jugador derecho (según tipo)
        if (data.right == 0) this.playerRight = new PlayerSword(this, 'right');
        else this.playerRight = new PlayerSpear(this, 'right');

        // Colliders jugadores con mundo
        this.physics.add.collider(this.playerLeft, this.platforms);
        this.physics.add.collider(this.playerRight, this.platforms);
        this.physics.add.collider(this.playerLeft, this.bridge.getSegments());
        this.physics.add.collider(this.playerRight, this.bridge.getSegments());
        this.physics.add.collider([this.playerLeft, this.playerRight], this.boxes);
        this.physics.add.collider(this.boxes, this.platforms);
        this.physics.add.collider(this.boxes, this.bridge.getSegments());
        this.physics.add.collider(this.boxes, this.boxes);

        // Eventos de colisión entre jugadores y lava
        this.lava.addCollision(this.playerLeft);
        this.lava.addCollision(this.playerRight);
        this.playerLeft.addCollision(this.playerRight);
        this.playerRight.addCollision(this.playerLeft);

        // Array de colliders para pasarlo a cualquier overlap externo
        this.colliders = [
            this.playerLeft,
            this.playerRight,
            this.platforms,
            this.bridge.getSegments(),
            this.boxes
        ];

        // Tiempo de partida (1 minuto en ms), se invoca la destruccion del puente
        this.time.delayedCall(this.matchDurationMs, null, null, this);

        // Puente hundiéndose a los 30 segundos
        this.time.delayedCall(30000, () => this.bridge.break());

        // Camera shake 5 segundos antes de destruir el puente
        this.time.delayedCall(30000 - 2000, () => {
            // duración 500 ms, intensidad 0.01 
            this.sound.play('terremoto');
            this.cameras.main.shake(2000, 0.01);
        });

        // Destruir puente al finalizar la partida
        this.time.delayedCall(60000, () => { this.bridge.destroy(), this.sound.play('break'); });

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
            this.sound.stopAll();
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
        this.cameraFollow();
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
        if (Phaser.Math.Between(0, 1) === 0) x = (window.outterWidth - window.innerWidth) / 2 + 20;
        else x = (window.outterWidth + window.innerWidth) / 2 - 20;

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
    cameraFollow() {
        const midX = (this.playerLeft.x + this.playerRight.x) / 2;
        const midY = (this.playerLeft.y + this.playerRight.y) / 2;
        const dx = Math.abs(this.playerLeft.x - this.playerRight.x);
        const dy = Math.abs(this.playerLeft.y - this.playerRight.y);

        // Calculamos el zoom necesario para que quepan tanto horizontal como verticalmente
        const zoomX = this.cameras.main.width * 0.7 / Math.max(dx, 1);
        const zoomY = this.cameras.main.height * 0.7 / Math.max(dy, 1);
        let zoom = Math.min(zoomX, zoomY);

        // Zoom mínimo consistente entre resoluciones:
        const min = Math.max(this.scale.width / (this.worldWidth + 700), this.scale.height / (this.worldWidth + 700));
        zoom = Phaser.Math.Clamp(zoom, min, 1.1);

        // Suavizado para evitar saltos
        this.cameras.main.zoom = Phaser.Math.Linear(this.cameras.main.zoom, zoom, 0.05);

        // Centrar entre jugadores en X e Y (manteniendo tu offset en X)
        this.cameras.main.centerOn(midX + 180, midY + 180);
    }
}
