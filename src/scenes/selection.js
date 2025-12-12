/**
 * Escena de selección de personaje (1v1).
 * Devuelve a `level` los índices seleccionados de cada jugador.
 * @extends Phaser.Scene
 */
export default class SelectionScene extends Phaser.Scene {
    /** Crea la escena con la key `selection`. */
    constructor() { super('selection'); }

    /** Precarga audio y recursos de la pantalla de selección. */
    preload() {
        //Preload audio
        this.load.audio('seleccionar', 'assets/sounds/seleccionar.mp3' );
        this.load.audio('click', 'assets/sounds/click.mp3' );
        
        // Preload assets
        this.load.image('background', 'assets/selection/background.png');
        this.load.image('left', 'assets/selection/left.png');
        this.load.image('right', 'assets/selection/right.png');
        this.load.spritesheet('characters', 'assets/selection/characters.png', { frameWidth: 462, frameHeight: 387 });
    }

    /**
     * Construye la UI de selección y arma los controles.
     * Al continuar, arranca `level` con `{ left, right }` (0/1).
     */
    create() {
        // Background (ajustado al alto de pantalla)
        this.add.image(this.scale.width/2, this.scale.height/2, 'background').displayHeight = this.scale.height;

        // Color de fondo de cámara
        this.cameras.main.setBackgroundColor('#161338');

        // Titulo
        this.add.text(this.scale.width/2, 80, 'SELECCION DE PERSONAJE', {
            fontSize: '50px',
            fontFamily: 'Cinzel',
            fontStyle: 'bold',
            fill: '#be084dff'
        }).setOrigin(0.5);

        // "Selector" Izq
        const left = this.add.sprite(this.scale.width/2 - 500, this.scale.height - 500, 'characters').setOrigin(0.5);

        // "Selector" Dcha (en el frame 1 y flipeado)
        const right = this.add.sprite(this.scale.width/2 + 500, this.scale.height - 500, 'characters', 1).setOrigin(0.5).setFlipX(true);

        // Plataformas
        this.add.image(this.scale.width/2 + 610, this.scale.height - 160, 'left').setOrigin(0.5);
        this.add.image(this.scale.width/2 - 640, this.scale.height - 160, 'right').setOrigin(0.5);

                //controles seleccion derecha
        this.add.text(this.scale.width/2 -600, this.scale.height - 270, '< A          D >', {
            fontSize: '40px',
            fontFamily: 'Cinzel',
            fontStyle: 'bold',
            fill: '#0e0c25ff'
        }).setOrigin(0.5);

        //controles seleccion izquierda
        this.add.text(this.scale.width/2 + 600, this.scale.height - 270, '< ↜          ↝ >', {
            fontSize: '40px',
            fontFamily: 'Cinzel',
            fontStyle: 'bold',
            fill: '#0e0c25ff'
        }).setOrigin(0.5);
        // Controles de seleccion Izq
        const A = this.input.keyboard.addKey('A');
        const D = this.input.keyboard.addKey('D');

        // Controles de seleccion Dcha
        const LEFT = this.input.keyboard.addKey('LEFT');
        const RIGHT = this.input.keyboard.addKey('RIGHT');

        // Eventos de seleccion Izq
        A.on('down', () => { left.setFrame((left.frame.name + 1)% 2); this.sound.play('seleccionar'); });
        D.on('down', () => { left.setFrame((left.frame.name + 1)% 2); this.sound.play('seleccionar'); });

        // Eventos de seleccion Dcha
        LEFT.on('down', () => { right.setFrame((right.frame.name + 1)% 2); this.sound.play('seleccionar'); });
        RIGHT.on('down', () => { right.setFrame((right.frame.name + 1)% 2); this.sound.play('seleccionar'); });

        // Boton de continuar
        const button = this.add.text(this.scale.width / 2, this.scale.height - 70, 'CONTINUAR', {
            fontSize: '30px',
            fontFamily: 'Cinzel',
            fontStyle: 'bold',
            fill: '#be084dff'
        }).setOrigin(0.5).setInteractive();

        // Pasaremos 0 o 1 en funcion del frame seleccionado de cada jugador
        button.on('pointerdown', () => {this.sound.play('click'); this.scene.start('level', { left: left.frame.name, right: right.frame.name });});
    }
}
