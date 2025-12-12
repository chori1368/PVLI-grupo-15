/**
 * Escena de resultado: muestra el ganador y permite volver a selección.
 * @extends Phaser.Scene
 */
export default class ResultScene extends Phaser.Scene {
    /** Crea la escena con la key `result`. */
    constructor() { super('result'); }

    /** Precarga el audio usado en el botón. */
    preload() {
        this.load.audio('click', 'assets/sounds/click.mp3' );
    }

    /**
     * Renderiza el resultado.
     * @param {{ winner: 'left'|'right', type?: number }} data Datos pasados desde `level`.
     */
    create(data) {
        // Background
        this.add.image(this.scale.width/2, this.scale.height/2, 'background').displayHeight = this.scale.height;

        let text = 'NO DATA'; // default text

        // Ha muerto el derecho por lo tanto gana el izquierdo
        if (data.winner === 'left') { 
            text = 'Gana el jugador izquierdo!';
            // Personaje
            this.add.sprite(this.scale.width/2 + 100, this.scale.height - 500, 'characters').setOrigin(0.5);
            // Plataforma
            this.add.image(this.scale.width/2, this.scale.height - 160, 'left').setOrigin(0.5);
        }

        // Ha muerto el izquierdo por lo tanto gana el derecho
        else if (data.winner === 'right') {
            text = 'Gana el jugador derecho!';
            // Personaje
            this.add.sprite(this.scale.width/2 - 100, this.scale.height - 500, 'characters', 1).setOrigin(0.5).setFlipX(true);
            // Plataforma
            this.add.image(this.scale.width/2, this.scale.height - 160, 'right').setOrigin(0.5);
        }

        // Texto del ganador
        this.add.text(this.scale.width/2, 90, text, {
            fontSize: '80px',
            fontFamily: 'Cinzel',
            fontStyle: 'bold',
            fill: '#be084dff'
        }).setOrigin(0.5);

        // Boton de continuar
        const button = this.add.text(this.scale.width / 2, this.scale.height - 70, 'VOLVER', {
            fontSize: '30px',
            fontFamily: 'Cinzel',
            fontStyle: 'bold',
            fill: '#be084dff'
        }).setOrigin(0.5).setInteractive();

        button.on('pointerup', () => { this.scene.start('selection'); this.sound.play('click'); });
    }
}
