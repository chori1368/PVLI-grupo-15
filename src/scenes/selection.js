export default class CharacterScene extends Phaser.Scene {
    constructor() {
        super('CharacterScene');
    }

    preload() {
        this.load.image('infierno', 'assets/fondoinfierno.jpg');
    }

    create() {
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'infierno')
            .setDisplaySize(this.scale.width, this.scale.height);

        this.add.text(this.scale.width / 2, 200, 'Seleccion de Personaje', {
            fontSize: '60px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        const boton = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Jugar', {
            fontSize: '50px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        boton.setInteractive({ useHandCursor: true });
        boton.on('pointerdown', () => this.scene.start('LevelScene'));
    }
}
