export default class Te extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, lifetime = 5000) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(0.05);
        this.body.allowGravity = true;  // si no quieres que caiga
        this.healAmount = 2000;

        this.scene = scene;
        // Tiempo de vida en ms; por defecto 5000 (5 segundos)
        this.lifetime = lifetime;

        // Programar autodestrucción si nadie lo recoge en el tiempo indicado
        this.destroyTimer = this.scene.time.delayedCall(this.lifetime, () => {
            // Si sigue activo en la escena, lo destruimos
            if (this && this.active) {
                this.destroy();
            }
        }, [], this);
    }

    addCollision(player) {
        this.scene.physics.add.overlap(player, this, () => {
            // Curar al jugador
            player.life = Math.min(player.maxLife, player.life + this.healAmount);
            // Destruir el objeto te después de recogerlo
            this.destroy();
        });
    }
}
