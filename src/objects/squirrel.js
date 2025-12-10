import SoundManager from '../manager/soundManager.js';
import Tea from './tea.js';

export default class Squirrel extends Phaser.GameObjects.Sprite {
    constructor(scene, x) {
        super(scene, x, scene.scale.height + 80, 'squirrel');
        // Añadimos el objeto a escena
        this.scene.add.existing(this);

        // Flipear según lado
        if (x < scene.scale.width / 2) this.setFlipX(true);

        // Posición objetivo del té lanzado segun lado
        this.target = { x: 0, y: Phaser.Math.Between(30, 60) };
        if (x > scene.scale.width / 2) this.target.x = Phaser.Math.Between(50, scene.scale.width / 2 - 100);
        else this.target.x = Phaser.Math.Between(scene.scale.width / 2 + 100, scene.scale.width - 100);

        // Algunas propiedades visuales
        this.setOrigin(0.5, 0.75);
        this.setScale(0.75);
        this.setDepth(20);

        // Iniciamos la animación de aparecer
        this.appear();
    }

    // Sube desde fuera de pantalla, “escarba”, luego lanza y se oculta
    appear() {
        this.scene.tweens.add({
            targets: this,
            y: this.scene.scale.height,
            duration: 250,
            ease: 'Sine.easeOut',
            onComplete: () => this.dig()
        });
    }

    // Animación de escarbar
    dig() {
        this.scene.tweens.add({
            targets: this,
            angle: -15,
            yoyo: true,
            duration: 280,
            ease: 'Sine.easeInOut',
            onComplete: () => this.throw()
        });
    }

    // Animación de lanzar té
    throw() {
        this.scene.tweens.add({
            targets: this,
            angle: 35,
            duration: 200,
            ease: 'Sine.easeOut',
            onComplete: () => this.throwTea()
        });
    }

    // Crear y lanzar el té
    throwTea() {
        // Reproducir sonido de lanzar té
        SoundManager.play('tea');
        // Crear té en una posición aleatoria en la parte superior de la escena
        const tea = new Tea(this.scene, this.x, this.y, this.target);
        
        // Le añadimos al té la colisión con los jugadores
        tea.addCollision(this.scene.playerLeft);
        tea.addCollision(this.scene.playerRight);

        // Le añadimos colisiones con colliders de la escena al té creado
        this.scene.colliders.forEach(collider => this.scene.physics.add.collider(tea, collider));

        // Animación de desaparecer
        this.disappear();
    }

    // Animación de desaparecer
    disappear() {
        this.scene.tweens.add({
            targets: this,
            y: this.scene.scale.height + this.displayHeight,
            duration: 250,
            ease: 'Sine.easeIn',
            onComplete: () => this.destroy()
        });
    }
}
