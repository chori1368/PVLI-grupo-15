export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        this.load.image('background', 'assets/background.png');
    }

    create() {
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'background')
            .setDisplaySize(this.scale.width, this.scale.height);

        this.add.text(this.scale.width / 2, 200, 'MENU PRINCIPAL', {
            fontSize: '60px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        const boton = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Seleccionar Personaje', {
            fontSize: '50px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        boton.setInteractive({ useHandCursor: true });
        boton.on('pointerdown', () => this.scene.start('CharacterScene'));
    }
}
