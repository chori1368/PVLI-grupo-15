/**
 * Botón clicable basado en `Phaser.GameObjects.Image`.
 * @extends Phaser.GameObjects.Image
 */
export default class Button extends Phaser.GameObjects.Image {

    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {string} texture
     * @param {Function} callback Acción al soltar el click/touch.
     */
    constructor(scene, x, y, texture, callback) {

        // Llama al constructor de la clase padre
        super(scene, x, y, texture);
        
        // Añade la imagen al escenario
        this.add.image(x, y, texture);        

        // Hacer que el botón sea interactivo
        this.setInteractive();

        // Configura el evento de clic
        this.on('pointerup', callback);

        // Añade el botón a la escena
        scene.add.existing(this);
    }
}
