export default class IntroScene extends Phaser.Scene {
    constructor() { super('intro'); }

    preload() {
        console.log(this.sys.settings.key + ": preload");

        // Preload assets
        this.load.image('logo', 'assets/logo.png');
    }

    create() {
        console.log(this.sys.settings.key + ": create");

        // Saltar la intro al hacer clic en cualquier parte, Todo: no funciona y no se porque
        this.input.on('pointerdown', () => this.scene.start('selection'));
        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('selection');
        });

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