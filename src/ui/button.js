export default class Button extends Phaser.GameObjects.Image {

    constructor(scene, x, y, texture, callback) {

        // Llama al constructor de la clase padre
        super(scene, x, y, texture);
        
        // Añade la imagen al escenario
        this.add.image(x, y, texture);        

        // Hacer que el botón sea interactivo
        this.setInteractive();

        // Configura el evento de clic
        this.on('pointerup', callback);

        // Añade el botón a la escena*/
        scene.add.existing(this);
    }
}
