/**
 * Grupo de segmentos que conforman el puente entero.
 * Se encarga de hundir/flotar segmentos y de romperlos al final.
 * @extends Phaser.GameObjects.Group
 */

import Platform from './platform.js';

export default class Bridge extends Phaser.GameObjects.Group {
    /**
     * @param {Phaser.Scene} scene
     */
    constructor(scene) {
        super(scene);

        // Cantidad de hundimiento de cada segmento
        this.sink = 250;

        // Obtenemos el ancho de la textura de puente
        this.width = scene.textures.get('bridge').getSourceImage().width * 0.45;

        // Posición vertical de los segmentos
        this.height = scene.scale.height - 180;

        // Calculamos cuantos segmentos de puente necesitamos
        this.numSegments = Math.ceil(scene.worldWidth / this.width) + 2;

        // Array de segmentos de puente
        this.segments = [];

        // Creamos tantos segmentos como numSegments
        for (let i = 0; i < this.numSegments; i++) {
            // Creamos un segmento en la posición determindada
            const segment = new Platform(scene, i * this.width, this.height, 'bridge', 0.45);
            // Ajustamos la escala
            segment.setScale(0.45);
            // Añadimos el segmento al grupo
            this.segments.push(segment);
        }
    }

    /**
     * Alterna aleatoriamente segmentos arriba/abajo (efecto “puente inestable”).
     * @param {number} interval Duración del tween (ms).
     */
    break(interval) {
        this.segments.forEach(s => {
            if (Phaser.Math.Between(0, 1) == 0) {
                // Si ya está hundido, lo subimos
                if (s.y > this.height) this.move(s, this.height, interval);
                // Si está arriba, lo hundimos
                else this.move(s, this.height + this.sink, interval);
            }
        });
    }

    /** Rompe todos los segmentos (animación y destrucción). */
    fall() {
        this.segments.forEach(s => s.break());
    }

    /**
     * Mueve un segmento a una altura concreta y actualiza el body.
     * @param {Platform} segment
     * @param {number} height
     * @param {number} interval Duración del tween (ms).
     */
    move(segment, height, interval) {
        this.scene.tweens.add({
            targets: segment,
            y: height,
            duration: interval,
            ease: 'Sine.easeInOut',
            onUpdate: () => segment.body.updateFromGameObject()
        });
    }
}
