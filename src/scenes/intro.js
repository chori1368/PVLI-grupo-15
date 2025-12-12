/**
 * Escena de introducción: muestra el logo y pasa a selección.
 * También permite saltar con ENTER/ESPACIO.
 * @extends Phaser.Scene
 */
export default class IntroScene extends Phaser.Scene {
    /** Crea la escena con la key `intro`. */
    constructor() { super('intro'); }

    /** Precarga assets mínimos de la intro. */
    preload() {
        // Preload assets
        this.load.image('logo', 'assets/logo.png');
    }

    /** Monta tweens del logo y listeners de teclado. */
    create() {
        // Al pulsar ENTER o ESPACIO, ir a la escena de selección
        this.input.keyboard.on('keydown-ENTER', () => this.scene.start('selection'));
        this.input.keyboard.on('keydown-SPACE', () => this.scene.start('selection'));

        // Logo con alpha 0
        const logo = this.add.image(this.scale.width / 2, this.scale.height / 2, 'logo').setScale(0.5).setAlpha(0);

        // Animacion del logo:
        this.tweens.add({ // Fade in
            targets: logo,
            alpha: 1,
            delay: 1000, // Esperar 1 sec
            duration: 2000, // Aparecer en 2 sec
            ease: 'Power2',
            onComplete: () => {
                this.tweens.add({ // Fade out
                    targets: logo,
                    alpha: 0,
                    delay: 1000, // Esperar 1 sec
                    duration: 2000, // Desaparecer en 2 sec
                    ease: 'Power2',
                    onComplete: () => { this.scene.start('selection'); } 
                    // Todo: poner animacion de intro y luego pantalla de titulo
                });
            }
        });  
    }
}
