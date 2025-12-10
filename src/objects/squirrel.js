import SoundManager from '../manager/soundManager.js';
import Tea from './tea.js';

export default class Squirrel extends Phaser.GameObjects.Sprite {
    constructor(scene, x, colliders = []) {
        super(scene, x, scene.scale.height + 80, 'squirrel');

        this.scene.add.existing(this);

        this.setOrigin(0.5, 0.75);
        this.setScale(0.75);

        this.appear();
    }

    // Sube desde fuera de pantalla, “escarba”, luego lanza y se oculta
    appear() {
        const targetY = this.scene.scale.height;
        this.scene.tweens.add({
            targets: this,
            y: targetY,
            duration: 250,
            ease: 'Sine.easeOut',
            onComplete: () => this.dig()
        });
    }

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

    throw() {
        this.scene.tweens.add({
            targets: this,
            angle: 35,
            yoyo: true,
            duration: 200,
            ease: 'Sine.easeOut',
            onComplete: () => this.throwTea()
        });
    }

    throwTea() {
        // Reproducir sonido de lanzar té
        SoundManager.play('tea');
        // Crear té en una posición aleatoria en la parte superior de la escena
        new Tea(this.scene, this.x, this.y, { x: Phaser.Math.Between(100, this.scene.width - 100), y: Phaser.Math.Between(30, 60) }, this.colliders);
        // Animación de desaparecer
        this.disappear();
    }

    disappear() {
        this.scene.tweens.add({
            targets: this,
            y: this.hideY,
            duration: 250,
            ease: 'Sine.easeIn',
            onComplete: () => this.destroy()
        });
    }
}
