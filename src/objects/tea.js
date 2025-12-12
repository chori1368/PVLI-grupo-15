
export default class Tea extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, target, opts = {}) {
        super(scene, x, y, 'tea');

        // Añadimos el objeto a escena
        this.scene.add.existing(this);

        // Algunas variables del té
        this.target = target; // Posición objetivo a la que volar
        this.colliders = scene.colliders ?? [];
        this.healAmount = opts.healAmount ?? 2000; // Cantidad de vida que cura
        this.lifetime = opts.lifetime ?? 7500; // Tiempo antes de desaparecer (ms)

        // Algunas propiedades visuales
        this.setScale(0.5);
        this.setDepth(19);

        // Iniciamos la animación hacia el target pos
        this.flyToTarget();
    }

    /** Animación de vuelo hacia la posición objetivo */
    flyToTarget() {
        this.scene.tweens.add({
            targets: this,
            x: this.target.x,
            y: this.target.y,
            angle: 360,
            duration: 850,
            ease: 'Sine.easeInOut',
            onComplete: () => this.enablePhysics()
        });
    }

    // Habilitar físicas y colisiones (para dejar caer el té)
    enablePhysics() {
        // Algunas propiedades físicas...
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(true);
        this.body.setBounce(0.05);
        this.body.setDamping(true);
        this.body.setDrag(1200, 0);
        this.body.setFriction(1, 0);

        // Destrucción tras lifetime ms
        this.scene.time.delayedCall(this.lifetime, () => this.destroy());
    }

    // Añadir collisión con jugador (y lo que se hace al colisionar)
    addCollision(player) {
        this.scene.physics.add.overlap(player, this, () => {
            if (this.scene && this.scene.sound) this.scene.sound.play('tea');
            // Curar al jugador
            player.life = Math.min(player.maxLife, player.life + this.healAmount);
            player.updateHealthBar();
            // Destruir el objeto te después de recogerlo
            this.destroy();
        });
    }
}
