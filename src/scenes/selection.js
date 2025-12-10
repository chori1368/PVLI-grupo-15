import SoundManager from '../manager/soundManager.js';
export default class SelectionScene extends Phaser.Scene {
    constructor() { super('selection'); }

    preload() {
        SoundManager.init(this);
        SoundManager.preload([
        { key: 'seleccionar', path: 'assets/sounds/seleccionar.mp3' },
        { key: 'click', path: 'assets/sounds/click.mp3' }
        ]);


        // Preload assets
        this.load.image('background', 'assets/selection/background.png');
        this.load.image('left', 'assets/selection/left.png');
        this.load.image('right', 'assets/selection/right.png');
        this.load.spritesheet('characters', 'assets/selection/characters.png', { frameWidth: 462, frameHeight: 387 });
    }

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
            fill: '#b0a2edf2'
        }).setOrigin(0.5);

        // "Selector" Izq
        const left = this.add.sprite(this.scale.width/2 - 500, this.scale.height - 500, 'characters').setOrigin(0.5);

        // "Selector" Dcha (en el frame 1 y flipeado)
        const right = this.add.sprite(this.scale.width/2 + 500, this.scale.height - 500, 'characters', 1).setOrigin(0.5).setFlipX(true);

        // Plataformas
        this.add.image(this.scale.width/2 + 610, this.scale.height - 160, 'left').setOrigin(0.5);
        this.add.image(this.scale.width/2 - 640, this.scale.height - 160, 'right').setOrigin(0.5);

                //controles seleccion derecha
        this.add.text(this.scale.width/2 -600, this.scale.height - 200, 'PULSA A o D \n para elegir', {
            fontSize: '50px',
            fontFamily: 'Cinzel',
            fontStyle: 'bold',
            fill: '#b0a2edf2'
        }).setOrigin(0.5);

        //controles seleccion izquierda
        this.add.text(this.scale.width/2 + 600, this.scale.height - 200, 'PULSA < o > \n para elegir', {
            fontSize: '50px',
            fontFamily: 'Cinzel',
            fontStyle: 'bold',
            fill: '#b0a2edf2'
        }).setOrigin(0.5);
        // Controles de seleccion Izq
        const A = this.input.keyboard.addKey('A');
        const D = this.input.keyboard.addKey('D');

        // Controles de seleccion Dcha
        const LEFT = this.input.keyboard.addKey('LEFT');
        const RIGHT = this.input.keyboard.addKey('RIGHT');

        // Eventos de seleccion Izq
        A.on('down', () => { left.setFrame((left.frame.name + 1)% 2); SoundManager.play('seleccionar'); });
        D.on('down', () => { left.setFrame((left.frame.name + 1)% 2); SoundManager.play('seleccionar'); });

        // Eventos de seleccion Dcha
        LEFT.on('down', () => { right.setFrame((right.frame.name + 1)% 2); SoundManager.play('seleccionar'); });
        RIGHT.on('down', () => { right.setFrame((right.frame.name + 1)% 2); SoundManager.play('seleccionar'); });

        // Boton de continuar
        const button = this.add.text(this.scale.width / 2, this.scale.height - 70, 'CONTINUAR', {
            fontSize: '30px',
            fontFamily: 'Cinzel',
            fontStyle: 'bold',
            fill: '#ada2edf2'
        }).setOrigin(0.5).setInteractive();

        // Pasaremos 0 o 1 en funcion del frame seleccionado de cada jugador
        button.on('pointerdown', () => {SoundManager.play('click'); this.scene.start('level', { left: left.frame.name, right: right.frame.name });});
    }
}