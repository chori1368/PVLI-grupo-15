export default class ResultScene extends Phaser.Scene {
    constructor() {
        super('ResultScene');
    }

    preload() {
        this.load.image('resultado', 'assets/resultado.jpg');
    }

    create() {
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'resultado')
            .setDisplaySize(this.scale.width, this.scale.height);

        this.add.text(this.scale.width / 2, 200, 'Resultado', {
            fontSize: '60px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        const botonInicio = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Inicio', {
            fontSize: '50px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        botonInicio.setInteractive({ useHandCursor: true });
        botonInicio.on('pointerdown', () => this.scene.start('MenuScene'));
    }
}
