import Player from './player.js';

export default class PlayerSword extends Player {
    constructor(scene, side) { 
        super(scene, side, 'sword');
        this.type = 0; //sword type

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('sword', { start: 4, end: 5 }),
            frameRate: 0.5, // Velocidad de la animación
            repeat: 0    // Animación en bucle
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('sword', { start: 6, end: 8 }),
            frameRate: 5, // Velocidad de la animación
            repeat: 0    // Animación en bucle
        });

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('sword', { start: 11, end: 21 }),
            frameRate: 5, // Velocidad de la animación
            repeat: -1    // Animación en bucle
        });

        this.anims.create({
            key: 'horizontal',
            frames: this.anims.generateFrameNumbers('sword', { start: 0, end: 3 }),
            frameRate: 5, // Velocidad de la animación
            repeat: 0    // Animación en bucle
        });

        this.anims.create({
            key: 'vertical',
            frames: this.anims.generateFrameNumbers('sword', { start: 22, end: 25 }),
            frameRate: 5, // Velocidad de la animación
            repeat: 0    // Animación en bucle
        });

    }

    DoubleJump() {
        this.setVelocityY(this.jumpSpeed);
    }
}
