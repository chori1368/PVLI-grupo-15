import Button from '../ui/button.js';

export default class Menu extends Phaser.Scene {

    constructor() { super({key: "menu"}); }

    init() {
        console.log(this.sys.settings.key + ": init");
    }

    preload() {

        console.log(this.sys.settings.key + ": preload");

        // Texture load:
        this.load.image('background', './assets/background.png'); // Background image
        //this.load.image('suelo', '../assets/suelo.png');
        this.load.image('player', '../assets/characters/player.png');
        this.load.image('suelo', '../assets/suelo.png');
        this.load.image('bridge', '../assets/ground.png');
        this.load.image('lava', '../assets/lava.png');

    }

    create() {

        console.log(this.sys.settings.key + ": create");

        // Background
        this.add.image(this.scale.width, this.scale.height, 'background')
        .setDisplaySize(this.scale.width, this.scale.height);

        // Title
        this.add.text(this.scale.width / 2, 200, 'MENU PRINCIPAL', {
            fontSize: '60px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Character Selection Button
        //const selection_btn = new Button(this, this.scale.width / 2, this.scale.height / 2, 'suelo', () => this.scene.start('CharacterScene'));

        const boton = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Jugar', {
            fontSize: '50px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        boton.setInteractive({ useHandCursor: true });
        boton.on('pointerdown', () => this.scene.start('CharacterScene'));
    }
}