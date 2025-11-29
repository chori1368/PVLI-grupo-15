import Ground from './platform.js';
import SoundManager from '../manager/soundManager.js';

export default class BreakableGround extends Ground {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        // Referencia a la escena (aseguramos que exista)
        this.scene = scene || this.scene || null;

        // Estado y tiempos
        this.isBreaking = false;      // true mientras está en proceso de romperse
        this.breakTime = 5000;        // ms hasta destruirse por completo
        this.shakeTime = 4000;        // ms hasta empezar a temblar

        // Referencias a timers/tweens para poder cancelarlos
        this._shakeTimer = null;
        this._breakTimer = null;
        this._debugInterval = null;

        // Estado de contacto
        this._isTouched = false;      // true si se detectó contacto recientemente
        this._lastTouchedTime = 0;    // timestamp del último contacto detectado
        this._touchTimeout = 300;     // ms que esperamos sin contacto para considerar que se ha soltado

        // Guardamos la posición original para restaurarla después del temblor
        if (!this._orig) this._orig = { x: this.x, y: this.y };

        // Si el objeto tiene cuerpo físico, desactivamos la gravedad local
        if (this.body) this.body.allowGravity = false;
    }

    // Devuelve un "now" fiable: se intenta usar Phaser, si no Date.now()
    _getNow() {
        if (this.scene && this.scene.time && typeof this.scene.time.now === 'number') return this.scene.time.now;
        if (this.scene && this.scene.sys && this.scene.sys.game && this.scene.sys.game.loop && typeof this.scene.sys.game.loop.time === 'number') return this.scene.sys.game.loop.time;
        return Date.now();
    }

    // Devuelve el GameObject que tiene el body físico para usar en overlap
        _getPhysicsObject(obj) {
        if (!obj) return null;
        if (obj.sprite) return obj.sprite;                        // si es wrapper con sprite
        if (obj.body && obj.body.gameObject) return obj.body.gameObject; // si body referencia al gameObject
        return obj;                                              // fallback: el propio objeto
    }

    // Llamado desde el collider cuando detecta contacto
    // Marca el contacto y arranca la cuenta como respaldo
    touch(player) {
        this._isTouched = true;
        this._lastTouchedTime = this._getNow();

        // Si no estaba en proceso, arrancamos la cuenta (backup inmediato)
        if (!this.isBreaking) {
            this.startBreaking(player);
        }
    }

    update(playersArray = []) {
        // Si no hay scene o physics o no hay jugadores, usamos el fallback de tiempo
        if (!this.scene || !this.scene.physics || !playersArray || playersArray.length === 0) {
            if (this._isTouched) {
                const now = this._getNow();
                if ((now - this._lastTouchedTime) > this._touchTimeout) {
                    // ya no hay contacto: paramos la rotura
                    this._isTouched = false;
                    this.stopBreaking();
                }
            }
            return;
        }

        // Obtenemos los objetos físicos para overlap
        const physSelf = this._getPhysicsObject(this.sprite ?? this);
        if (!physSelf) return;

        // Comprobamos si alguno de los players está solapando con la plataforma
        let stillTouching = false;
        for (const p of playersArray) {
            if (!p) continue;
            const physP = this._getPhysicsObject(p);
            if (!physP) continue;
            try {
                if (this.scene.physics.world.overlap(physSelf, physP)) {
                    // Hay contacto: actualizamos timestamp y salimos
                    stillTouching = true;
                    this._lastTouchedTime = this._getNow();
                    break;
                }
            } catch (e) {
                // Si overlap falla por tipos raros, lo ignoramos y seguimos
            }
        }

        if (stillTouching) {
            // Si hay contacto y no estaba en breaking, arrancamos
            if (!this.isBreaking) this.startBreaking();
            this._isTouched = true;
        } else {
            // Si antes había contacto y ahora no, esperamos _touchTimeout y paramos
            if (this._isTouched) {
                const now = this._getNow();
                if ((now - this._lastTouchedTime) > this._touchTimeout) {
                    this._isTouched = false;
                    this.stopBreaking();
                }
            }
        }
    }

    // Inicia la cuenta atrás para temblar y destruir
    startBreaking(player) {
        if (this.isBreaking) return;
        this.isBreaking = true;
        const startTime = this._getNow();

        // Intervalo de depuración que puede ayudarte a ver el tiempo transcurrido
        this._debugInterval = setInterval(() => {
            const elapsed = this._getNow() - startTime;
            if (!this.isBreaking) {
                clearInterval(this._debugInterval);
                this._debugInterval = null;
            }
        }, 1000);

        //Phaser.delayedCall si está disponible, si no fallback a setTimeout
        if (this.scene && this.scene.time && typeof this.scene.time.delayedCall === 'function') {
            // Timer para empezar a temblar
            this._shakeTimer = this.scene.time.delayedCall(this.shakeTime, () => {
                if (!this.active) return;
                this.shake();
            });
            // Timer para destruir la plataforma
            this._breakTimer = this.scene.time.delayedCall(this.breakTime, () => {
                if (!this.active) return;
                this._clearTimers();
                this.destroy();
            });
        } else {
            // Fallback setTimeout si algo raro ocurre
            this._shakeTimer = setTimeout(() => { if (this.active) this.shake(); }, this.shakeTime);
            this._breakTimer = setTimeout(() => { if (this.active) { this._clearTimers(); this.destroy(); } }, this.breakTime);
        }
    }

    // Para la rotura y restaura el estado original
    stopBreaking() {
        if (!this.isBreaking) return;

        // Limpiamos timers/tweens
        this._clearTimers();
        try { if (this.scene && this.scene.tweens) this.scene.tweens.killTweensOf(this); } catch (e) {}

        // Restauramos posición original si la tenemos guardada
        if (this._orig) { this.x = this._orig.x; this.y = this._orig.y; }

        this.isBreaking = false;
    }

    // Detecta de forma simple si un objeto parece ser un Phaser DelayedCall
    _isPhaserDelayedCall(obj) {
        if (!obj) return false;
        return (typeof obj.remove === 'function') || (typeof obj.getProgress === 'function') || (obj && typeof obj.hasOwnProperty === 'function' && obj.hasOwnProperty('delay'));
    }

    // Elimina cualquier timer o intervalo 
    _clearTimers() {
        if (this._shakeTimer) {
            try {
                if (this._isPhaserDelayedCall(this._shakeTimer) && this.scene && this.scene.time && typeof this._shakeTimer.remove === 'function') {
                    this._shakeTimer.remove(false); // Phaser DelayedCall
                } else {
                    clearTimeout(this._shakeTimer);
                }
            } catch (e) {}
            this._shakeTimer = null;
        }

        if (this._breakTimer) {
            try {
                if (this._isPhaserDelayedCall(this._breakTimer) && this.scene && this.scene.time && typeof this._breakTimer.remove === 'function') {
                    this._breakTimer.remove(false);
                } else {
                    clearTimeout(this._breakTimer);
                }
            } catch (e) {}
            this._breakTimer = null;
        }

        if (this._debugInterval) {
            try { clearInterval(this._debugInterval); } catch(e) {}
            this._debugInterval = null;
        }
    }

    // Temblor de la plataforma
    shake() {
        if (!this._orig) this._orig = { x: this.x, y: this.y };

        // Pequeño shake de cámara si existe
        try { if (this.scene && this.scene.cameras && this.scene.cameras.main) this.scene.cameras.main.shake(600, 0.001); } catch(e) {}

        // Tween local que mueve la plataforma un poco y la vuelve a su sitio
        try {
            if (this.scene && this.scene.tweens) {
                this.scene.tweens.add({
                    targets: this,
                    x: { getEnd: () => this._orig.x + (Phaser.Math.Between(-12, 12)) },
                    y: { getEnd: () => this._orig.y + (Phaser.Math.Between(-8, 8)) },
                    duration: 35,
                    repeat: 16,
                    yoyo: true,
                    ease: 'Sine.inOut',
                    onComplete: () => { this.x = this._orig.x; this.y = this._orig.y; }
                });
            }
        } catch (e) {}
    }

    // Limpieza final al destruir el objeto
    destroy(fromScene) {
        SoundManager.play('break');
        this._clearTimers();
        if (this._debugInterval) {
            try { clearInterval(this._debugInterval); } catch(e) {}
            this._debugInterval = null;
        }
        try { if (this.scene && this.scene.tweens) this.scene.tweens.killTweensOf(this); } catch (e) {}
        this.isBreaking = false;
        super.destroy(fromScene);
    }

    // Método público para resetear el estado
    reset() { this.stopBreaking(); }
}
