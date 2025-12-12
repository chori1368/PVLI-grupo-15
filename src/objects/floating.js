/** Plataforma flotante que se rompe al cabo de x segundos cuando el jugador la pisa */

import Platform from './platform.js';

export default class Floating extends Platform {
    constructor(scene, x, y) {
        super(scene, x, y, 'floating', 0.4);

        // Tiempo hasta romperse en milisegundos
        this.breakTime = 1000;
    }

    addCollision(player) {
        // Añadir colisión con el jugador
        this.scene.physics.add.collider(this, player, () => {
            // Iniciar temporizador para romperse
            this.scene.time.delayedCall(this.breakTime, () => {
                // Animación de caída y auto-destrucción
                this.scene.tweens.add({
                    targets: this,
                    y: this.y + 300,
                    alpha: 0,
                    duration: 500,
                    ease: 'Linear',
                    onComplete: () => this.destroy()
                });
            });
        });
    }
}
