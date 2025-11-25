export default class HealthBar {
    constructor(scene, x, y, width, height, color = 0x00ff00) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        // Fondo gris oscuro
        this.background = scene.add.rectangle(x, y, width, height, 0x555555)
            .setOrigin(0, 0)      

        // Barra de vida
        this.bar = scene.add.rectangle(x, y, width, height, color)
            .setOrigin(0, 0)
        // Texto encima
        this.text = scene.add.text(x + width / 2, y + height / 2, '', {
            fontSize: '14px',
            fill: '#ffffff'
        })
        .setOrigin(0.5, 0.5)
    }

    update(current, max) {
        const ratio = Phaser.Math.Clamp(current / max, 0, 1);
        const newWidth = this.width * ratio;

        this.bar.width = newWidth;

        this.text.setText(`${Math.round(current)}/${max}`);
    }

    destroy() {
        this.bar.destroy();
        this.background.destroy();
        this.text.destroy();
    }
}
