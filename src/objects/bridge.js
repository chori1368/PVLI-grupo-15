/** Grupo de segmentos que conforman el puente entero, 
 * se gestiona su animación de hundirse/flotar y su destrucción */

import Platform from './platform.js';

export default class Bridge extends Phaser.GameObjects.Group {
    constructor(scene) {
        super(scene);

        // Algunas constantes
        this.diveTime = 1000; // Tiempo entre hundirse y flotar

        // Obtenemos el ancho de la textura de puente
        this.width = scene.textures.get('bridge').getSourceImage().width * 0.45;

        // Calculamos cuantos segmentos de puente necesitamos
        const numSegments = Math.ceil(scene.worldWidth / this.width) + 2;

        // Array de segmentos de puente
        this.segments = [];

        // Creamos tantos segmentos como numSegments
        for (let i = 0; i < numSegments; i++) {

            // Creamos un segmento en la posición determindada
            const segment = new Platform(scene, i * this.width, scene.scale.height - 180, 'bridge', 0.45);

            // Ajustamos la escala
            segment.setScale(0.45);

            // Animación de hundirse/flotar
            // scene.tweens.add({
            //     targets: segment,
            //     y: segment.y + 20,
            //     duration: 1000,
            //     ease: 'Linear',
            //     yoyo: true,
            //     repeat: -1,
            //     onUpdate: () => segment.body.updateFromGameObject(),
            // });

            // Añadimos el segmento al grupo
            this.segments.push(segment);
        }
    }

    move(distance = 250, duration = 1000) {
    this.scene.tweens.add({
      targets: this,
      y: this.y + distance,
      duration,
      ease: 'Linear',
      onUpdate: () => segment.body.updateFromGameObject(),
      onComplete: () => this.destroy()
    });
  }

    break() {
        // Animación de hundirse de todos los segmentos
        this.segments.forEach(segment => {
            segment.move(300, 500);
        });
    }

    destroy() {
        this.segments.forEach(s => s.setActive(false));
        this.segments = [];
    }

    getSegments() {
        return this.segments;
    }
}
