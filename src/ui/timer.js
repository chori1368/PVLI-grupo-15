export default class Timer {
    constructor(scene, x, y, totalSeconds) {
        this.scene = scene;
        this.totalSeconds = totalSeconds;
        this.remainingSeconds = totalSeconds;

        // Texto del timer
        this.text = scene.add.text(x, y, this.formatTime(this.remainingSeconds), {
            fontSize: '40px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5, 0);
        
        // Evento para decrementar el tiempo cada segundo
        this.timerEvent = scene.time.addEvent({
            delay: 1000,
            callback: () => {
                this.remainingSeconds--;
                this.text.setText(this.formatTime(this.remainingSeconds));

                if (this.remainingSeconds <= 0) {
                    this.timerEvent.remove();
                }
            },
            loop: true
        });
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const partInSeconds = seconds % 60;
        return `${minutes}:${partInSeconds.toString().padStart(2, '0')}`;
    }

    destroy() {
        this.text.destroy();
        if (this.timerEvent) this.timerEvent.remove();
    }
}
