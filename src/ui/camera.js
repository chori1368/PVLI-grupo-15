export default class Camera {
    /**
     * scene: Phaser.Scene
     * player1, player2: sprites
     * opts: { minDistance, maxDistance, maxZoom, levelWidth, levelHeight, zoomLerp, moveLerp }
     */
    constructor(scene, player1, player2, opts = {}) {
        this.scene = scene;
        this.cam = scene.cameras.main;

        this.p1 = player1;
        this.p2 = player2;

        // Valores por defecto (se pueden sobreescribir con opts)
        this.maxZoom = opts.maxZoom ?? 1.2;   // zoom máximo hacia dentro
        this.zoomLerp = opts.zoomLerp ?? 0.05;
        this.moveLerp = opts.moveLerp ?? 0.08;

        this.minDistance = opts.minDistance ?? 200;
        this.maxDistance = opts.maxDistance ?? 900;

        // Dimensiones del nivel (siempre debería pasarse o calcularse desde la escena)
        this.levelWidth  = opts.levelWidth  ?? scene.scale.width;
        this.levelHeight = opts.levelHeight ?? scene.scale.height;

        // Calcula minZoom para que la cámara no muestre fuera del nivel
        // (evita dividir por cero)
        if (this.levelWidth > 0 && this.levelHeight > 0) {
            const minZoomByWidth  = this.cam.width  / this.levelWidth;
            const minZoomByHeight = this.cam.height / this.levelHeight;
            this.minZoomByLevel = Math.min(minZoomByWidth, minZoomByHeight);
        } else {
            this.minZoomByLevel = 0.5; // fallback
        }

        // No permitimos que minZoomByLevel sea mayor que maxZoom
        this.minZoom = Math.min(this.minZoomByLevel, this.maxZoom);

        // Inicializamos zoom dentro de los límites
        this.cam.zoom = Phaser.Math.Clamp(this.cam.zoom || 1, this.minZoom, this.maxZoom);
    }

    update() {
        // Seguridad: si no hay jugadores, salir
        const a = this.p1 && typeof this.p1.x !== 'undefined' ? this.p1 : null;
        const b = this.p2 && typeof this.p2.x !== 'undefined' ? this.p2 : null;
        if (!a && !b) return;

        // Punto medio y distancia
        let midX, midY, dist;
        const yOffset = 400; // elevar un poco el centro para ver más suelo

        if (a && b) {
            midX = (a.x + b.x) / 2;
            midY = (a.y + b.y) / 2;
            dist = Phaser.Math.Distance.Between(a.x, a.y, b.x, b.y);
        } else {
            const only = a || b;
            midX = only.x;
            midY = only.y;
            dist = this.minDistance;
        }

        // Mover cámara suavemente (scroll = esquina superior izquierda)
        this.cam.scrollX = Phaser.Math.Linear(this.cam.scrollX, midX - this.cam.width / 2, this.moveLerp);
        this.cam.scrollY = Phaser.Math.Linear(this.cam.scrollY, (midY+ yOffset) - this.cam.height / 2, this.moveLerp);

        // Calcula targetZoom según distancia (entre maxZoom y minZoom)
        const t = Phaser.Math.Clamp((dist - this.minDistance) / (this.maxDistance - this.minDistance), 0, 1);
        const targetZoom = Phaser.Math.Linear(this.maxZoom, this.minZoom, t);

        // Aplica zoom suavizado y lo clamp entre minZoom y maxZoom
        const newZoom = Phaser.Math.Linear(this.cam.zoom, targetZoom, this.zoomLerp);
        this.cam.zoom = Phaser.Math.Clamp(newZoom, this.minZoom, this.maxZoom);
    }
}
