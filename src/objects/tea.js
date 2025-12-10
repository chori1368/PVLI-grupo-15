import SoundManager from '../manager/soundManager.js';

export default class Tea extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, target, colliders) {
        super(scene, x, y, 'tea');

        // Añadimos el objeto a escena
        this.scene.add.existing(this);

        // Algunas variables del té
        this.target = target; // Posición objetivo a la que volar
        this.heal = 2000; // Cantidad de vida que cura
        this.expire = 7500; // Tiempo antes de desaparecer (ms)
        this.colliders = colliders;

        // Filtrar los colliders por jugadores (objetos con propiedad life)
        this.players = colliders.filter(c => c.life !== undefined);

        // Algunas propiedades visuales
        this.setScale(0.5);
        this.setDepth(19);

        // Iniciamos la animación hacia el target pos
        this.flyToTarget();
    }

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

    enablePhysics() {
        // Algunas propiedades físicas...
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(true);
        this.body.setBounce(0.05);
        this.body.setDamping(true);
        this.body.setDrag(1200, 0);
        this.body.setFriction(1, 0);

        // Comprobar colisión con colliders
        for (let i = 0; i < this.colliders.length; i++) {
            this.scene.physics.add.collider(this, this.colliders[i]);
        }

        // Comprobar colisión con jugadores
        for (let j = 0; j < this.players.length; j++) {
            this.scene.physics.add.overlap(this.players[j], this, () => {
                SoundManager.play('swallow');
                this.players[j].life = Math.min(this.players[j].maxLife, this.players[j].life + this.healAmount);
                if (this.players[j].updateHealthBar) this.players[j].updateHealthBar();
                this.destroy();
            });
        }

        // Destrucción tras lifetime ms
        this.scene.time.delayedCall(this.lifetime, () => { this.destroy(); });
    }
}
