import Ground from './platform.js';

export default class Bridge {
    constructor(scene, x, y, textureKey, scaleX = 0.1, scaleY = 0.1) {
        this.scene = scene;
        this.segments = [];

        const temp = scene.add.image(0, 0, textureKey).setScale(scaleX, scaleY);
        const segmentWidth = temp.displayWidth;
        temp.destroy();

        const numSegments = Math.ceil(scene.scale.width / segmentWidth);
        for (let i = 0; i < numSegments; i++) {
            const segX = i * segmentWidth + segmentWidth / 2;
            const segment = new Ground(scene, segX, y, textureKey, scaleX, scaleY);
            this.segments.push(segment);
        }
    }

    collapseParts(count, random = true) {
        let targets = [];
        if (random) {
            // Elegir aleatorios
            const shuffled = this.segments.slice().sort(() => Math.random() - 0.5);
            targets = shuffled.slice(0, count);
        } else {
            // Tomar los del centro
            const mid = Math.floor(this.segments.length / 2);
            const start = Math.max(0, mid - Math.floor(count / 2));
            targets = this.segments.slice(start, start + count);
        }

        targets.forEach(seg => {
            seg.destroy(); //elimina el segmento
            const index = this.segments.indexOf(seg);
            if (index > -1) this.segments.splice(index, 1);
        });
    }
    destroy() {
        this.segments.forEach(seg => seg.destroy());
        this.segments = [];
    }

    getSegments() {
        return this.segments;
    }
}