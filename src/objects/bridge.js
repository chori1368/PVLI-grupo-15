import Ground from './ground.js';

export default class Bridge {
    constructor(scene, x, y, textureKey, scaleX = 0.1, scaleY = 0.1, totalWidth = null) {
        this.scene = scene;
        this.segments = [];

        const widthToCover = totalWidth ?? scene.scale.width;

        const temp = scene.add.image(0, 0, textureKey).setScale(scaleX, scaleY);
        const segmentWidth = temp.displayWidth;
        temp.destroy();

        const left = x;

        // cuantos segmentos necesitamos (añadimos 1 por seguridad contra huecos)
        const numSegments = Math.ceil(widthToCover / segmentWidth) + 1 ;

        for (let i = 0; i < numSegments; i++) {
            // centramos cada segmento en su "celda"
            const segX = left + i * segmentWidth + segmentWidth / 2;
            const segment = new Ground(scene, segX, y, textureKey, scaleX, scaleY);

            // Si Ground no ajusta el body internamente, ajustar aquí:
            if (segment.body && segment.displayWidth) {
                segment.body.setSize(Math.round(segment.displayWidth), Math.round(segment.displayHeight));
                segment.body.setOffset(0, 0); // o ajusta el offset si tu sprite no está anclado en (0,0)
            }

            this.segments.push(segment);
        }
    }

    collapseParts() {
        this.segments.forEach(seg => seg.move() );
    }

    destroy() {
        this.segments.forEach(seg => seg.setActive(false));
        this.segments = [];
    }

    getSegments() {
        return this.segments;
    }
}
