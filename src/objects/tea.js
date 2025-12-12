/**
 * Proyectil/objeto lanzado por la ardilla.
 * Vuela hasta un target, cae con físicas y al tocar a un jugador lo cura.
 * @extends Phaser.GameObjects.Sprite
 */
export default class Tea extends Phaser.GameObjects.Sprite {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {{x:number, y:number}} target
     */
    constructor(scene, x, y, target) {
        super(scene, x, y, 'tea');

        // Añadimos el objeto a escena
        this.scene.add.existing(this);

        // Algunas variables del té
        this.target = target; // Posición objetivo a la que volar
        this.healAmount = 2000; // Cantidad de vida que cura
        this.lifetime = 7500; // Tiempo antes de desaparecer (ms)

        // Algunas propiedades visuales
        this.setScale(0.5);
        this.setDepth(19);

        // Iniciamos la animación hacia el target pos
        this.flyToTarget();
    }

    /** Animación de vuelo hacia la posición objetivo. */
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

    /** Habilita físicas/colisiones para que el té caiga y se quede en el suelo. */
    enablePhysics() {
        // Algunas propiedades físicas...
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(true);
        this.body.setBounce(0.05);
        this.body.setDamping(true);
        this.body.setDrag(1200, 0);
        this.body.setFriction(1, 0);

        // Destrucción tras lifetime ms (con una leve animacion)
        this.scene.time.delayedCall(this.lifetime, () => {
            if (this.scene) {
                this.scene.tweens.add({
                    targets: this,
                    alpha: 0,
                    duration: 200,
                    onComplete: () => this.destroy()
                });
            }
        });
    }

    /**
     * Overlap contra un jugador: cura y destruye el té.
     * @param {import('../player/player.js').default} player
     */
    addCollision(player) {
        this.scene.physics.add.overlap(player, this, () => {
            this.scene.sound.play('tea');
            // Curar al jugador
            player.life = Math.min(player.maxLife, player.life + this.healAmount);
            player.updateHealthBar();
            // Destruir el objeto te después de recogerlo
            this.destroy();
        });
    }

    /**
     * Overlap contra la lava
     * @param {import('../objects/lava.js) }
     */
    addLavaCollision(lava) {
        this.scene.physics.add.collider(this, lava, () => {
            this.setDepth(0);
            this.scene.tweens.add({
                targets: this,
                alpha: 0,
                y: this.y + 50,
                duration: 300,
                onComplete: () => this.destroy()
            });
        });
    }
}
