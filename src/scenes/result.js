export default class ResultScene extends Phaser.Scene {
    constructor() { super('result'); }

    preload() {
        console.log(this.sys.settings.key + ": preload");
    }

    create(data) {
        console.log(this.sys.settings.key + ": create");

        // Background
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'background');

        let text = 'NO DATA'; // default text

        // Ha muerto el derecho por lo tanto gana el izquierdo
        if (data.winner === 'left') { 
            text = 'Gana el jugador izquierdo!';
            // Plataforma
            this.add.image(500, this.scale.height - 200, 'left').setOrigin(0.5);
            // Personaje
            this.add.sprite(600, this.scale.height - 530, 'characters', data.type).setOrigin(0.5);
        }

        // Ha muerto el izquierdo por lo tanto gana el derecho
        else if (data.winner === 'right') {
            text = 'Gana el jugador derecho!';
            // Plataforma
            this.add.image(this.scale.width - 500, this.scale.height - 200, 'right').setOrigin(0.5);
            // Personaje
            this.add.sprite(this.scale.width - 600, this.scale.height - 530, 'characters', data.type).setOrigin(0.5).setFlipX(true);
        } 
    
        // Caso de empate (sin implementar aún)
        else if (data.winner === 'tie') {
            text = 'Empate!';
            // Plataformas
            this.add.image(500, this.scale.height - 200, 'left').setOrigin(0.5);
            this.add.image(this.scale.width - 500, this.scale.height - 200, 'right').setOrigin(0.5);
            // Personajes
            this.add.sprite(600, this.scale.height - 530, 'characters', data.type).setOrigin(0.5);
            this.add.sprite(this.scale.width - 600, this.scale.height - 530, 'characters', data.type).setOrigin(0.5).setFlipX(true);
        }

        // Texto del ganador
        this.add.text(this.scale.width / 2, 90, text, {
            fontSize: '80px',
            fontFamily: 'Cinzel',
            fontStyle: 'bold',
            fill: '#d9a2edf2'
        }).setOrigin(0.5);

        // Boton de continuar, TODO: reemplazar por una clase button
        const button = this.add.text(this.scale.width / 2, this.scale.height - 70, 'VOLVER', {
            fontSize: '30px',
            fontFamily: 'Cinzel',
            fontStyle: 'bold',
            fill: '#d9a2edf2'
        }).setOrigin(0.5).setInteractive();

        button.on('pointerdown', () => this.scene.start('selection'));
    }
}