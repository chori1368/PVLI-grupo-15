import Tea from './tea.js';

export default class Squirrel extends Phaser.GameObjects.Sprite {
    constructor(scene, x) {
        super(scene, x, scene.cameras.main.worldView.bottom, 'squirrel');
        // Añadimos el objeto a escena
        this.scene.add.existing(this);

        // Flipear según lado
        if (x < scene.cameras.main.worldView.centerX) this.setFlipX(true);
        else this.setFlipX(false);

        // Algunas propiedades visuales
        this.setOrigin(0.5, 0.75);
        this.setScale(0.75);
        this.setDepth(20);
        this.alpha = 0;

        // Iniciamos la animación de aparecer
        this.appear();
    }

    // Sube desde fuera de pantalla, “escarba”, luego lanza y se oculta
    appear() {
        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            duration: 250,
            ease: 'Sine.easeOut',
            onUpdate: () => { this.y = this.scene.cameras.main.worldView.bottom - 20 },
            onComplete: () => this.dig()
        });
    }

    // Animación de escarbar
    dig() {
        this.scene.tweens.add({
            targets: this,
            angle: -15,
            yoyo: true,
            repeat: 3,
            duration: 100,
            ease: 'Sine.easeInOut',
            onUpdate: () => { this.y = this.scene.cameras.main.worldView.bottom - 20 },
            onComplete: () => this.throw()
        });
    }

    // Animación de lanzar té
    throw() {
        let dir = -1; // Determinar dirección según posición
        if (this.x < this.scene.cameras.main.worldView.centerX) dir = 1;

        // Cargar (hacia atrás)
        this.scene.tweens.add({
            targets: this,
            y: this.scene.cameras.main.worldView.bottom - 20,
            angle: -30 * dir,
            duration: 600,
            ease: 'Sine.easeInOut',
            onUpdate: () => { this.y = this.scene.cameras.main.worldView.bottom - 20 },
            onComplete: () => {
                // Lanzar (hacia adelante)
                this.throwTea(); // Lanzamos el té al inicio de la animación
                this.scene.tweens.add({
                    targets: this,
                    angle: 35 * dir,
                    duration: 150,
                    ease: 'Sine.easeOut',
                    onComplete: () => this.disappear(),
                    onUpdate: () => { this.y = this.scene.cameras.main.worldView.bottom - 20 }
                });
            }
        });
    }

    // Crear y lanzar el té
    throwTea() {
        // Posición objetivo del té lanzado segun lado
        let target = { x: 0, y: Phaser.Math.Between(80, 100) };

        if (this.x > this.scene.cameras.main.worldView.centerX) 
            target.x = Phaser.Math.Between(this.scene.cameras.main.worldView.left + 50, this.scene.cameras.main.worldView.centerX - 100);
        else 
            target.x = Phaser.Math.Between(this.scene.cameras.main.worldView.centerX + 100, this.scene.cameras.main.worldView.right - 100);

        // Reproducir sonido de lanzar té
        this.scene.sound.play('tea');
        // Crear el té
        const tea = new Tea(this.scene, this.x, this.y, target);

        // Le añadimos al té la colisión con los jugadores
        tea.addCollision(this.scene.playerLeft);
        tea.addCollision(this.scene.playerRight);

        // Le añadimos colisiones con colliders de la escena al té creado
        this.scene.colliders.forEach(collider => this.scene.physics.add.collider(tea, collider));
    }

    // Animación de desaparecer
    disappear() {
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            delay: 100,
            duration: 250,
            ease: 'Sine.easeIn',
            onUpdate: () => { this.y = this.scene.cameras.main.worldView.bottom - 20 },
            onComplete: () => this.destroy()
        });
    }
}
