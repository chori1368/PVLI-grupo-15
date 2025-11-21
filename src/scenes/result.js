export default class ResultScene extends Phaser.Scene {
    constructor() {
        super('ResultScene');
    }

    preload() {
        this.load.image('resultado', 'assets/resultado.jpg');
    }

    create(data) {
    this.add.image(this.scale.width / 2, this.scale.height / 2, 'resultado')
        .setDisplaySize(this.scale.width, this.scale.height);

    // Texto del ganador
    this.add.text(this.scale.width / 2, 200, data.winner || 'Sin datos', {
        fontSize: '80px',
        fill: '#ff0000ff'
    }).setOrigin(0.5);

    const botonInicio = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Inicio', {
        fontSize: '50px',
        fill: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 20, y: 10 }
    }).setOrigin(0.5);

    botonInicio.setInteractive({ useHandCursor: true });
    botonInicio.on('pointerdown', () => this.scene.start('menu'));
}
}
