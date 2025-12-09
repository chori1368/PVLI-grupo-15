import SoundManager from '../manager/soundManager.js';
export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, side, texture, opts = {}) {
        const defaultOpts = {
            attackSounds: null,
            weapon: null,
        };
        
        opts = { ...defaultOpts, ...opts };

        // Posicionar jugador según el lado
        let x;
        if (side == 'left') x = scene.scale.width / 3;
        else x = scene.scale.width * 2 / 3;

        // Llamada al constructor padre con posición inicial (según lado)
        super(scene, x, scene.scale.height / 2, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(0.5);
        this.setOrigin(0.5);
        this.setCollideWorldBounds(true);

        // Custom player hitbox
        this.body.setSize(this.width * 0.4, this.height); // ancho, alto
        this.body.setOffset(this.width * 0.2, 0); // desplazar el hitbox

        this.speed = 300;
        this.jumpSpeed = -650;
        this.attacking = false;
        this.maxJumps = 2;
        this.jumpCount = 0;

        this.hattackbox = scene.add.zone(0, 0, 80, 30);
        scene.physics.add.existing(this.hattackbox, false);
        this.hattackbox.body.allowGravity = false;
        this.hattackbox.body.enable = false;

        this.vattackbox = scene.add.zone(0, 0, 40, 80);
        scene.physics.add.existing(this.vattackbox, false);
        this.vattackbox.body.allowGravity = false;
        this.vattackbox.body.enable = false;

        // Animación de idle
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers(this.texture.key, { start: 4, end: 5 }),
            frameRate: 2,
            repeat: 0
        });

        // Animación de salto
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers(this.texture.key, { start: 6, end: 8 }),
            frameRate: 10,
            repeat: 0
        });

        // Animación de movimiento
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers(this.texture.key, { start: 11, end: 21 }),
            frameRate: 10,
            repeat: -1
        });

        // Animación de ataque horizontal
        this.anims.create({
            key: 'horizontal',
            frames: this.anims.generateFrameNumbers(this.texture.key, { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0
        });

        // Animación de ataque vertical
        this.anims.create({
            key: 'vertical',
            frames: this.anims.generateFrameNumbers(this.texture.key, { start: 22, end: 25 }),
            frameRate: 10,
            repeat: 0
        });

        if (side === 'left') { // Teclas WASD Izq
            this.keys = scene.input.keyboard.addKeys({
                left: Phaser.Input.Keyboard.KeyCodes.A,
                right: Phaser.Input.Keyboard.KeyCodes.D,
                up: Phaser.Input.Keyboard.KeyCodes.W,
                hattack: Phaser.Input.Keyboard.KeyCodes.E,
                vattack: Phaser.Input.Keyboard.KeyCodes.Q,
            });
        }

        else { // Teclas flechas Dcha
            this.keys = scene.input.keyboard.addKeys({
                left: Phaser.Input.Keyboard.KeyCodes.LEFT,
                right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
                up: Phaser.Input.Keyboard.KeyCodes.UP,
                hattack: Phaser.Input.Keyboard.KeyCodes.SHIFT,
                vattack: Phaser.Input.Keyboard.KeyCodes.MINUS, // poner ctrl también
            });
        }

        // Vida inicial
        this.maxLife = 10000;
        this.life = this.maxLife;
        if (opts.attackSounds) {
            this.attackSounds = opts.attackSounds;
        } else {
            const weapon = opts.weapon || this._inferWeaponFromTexture(texture);
            if (weapon === 'spear') {
                this.attackSounds = {
                    h: 'spear',
                    v: 'spinningSpear',
                    dash: 'speardash' // opcional para dash
                };
            } else {
                // sword por defecto
                this.attackSounds = {
                    h: 'sword',
                    v: 'spinningSword',
                };
            }
        }

        // Asignamos la barra de progreso de vida (hijo de healthbar."side")
        this.healthBar = document.querySelector(`healthbar.${side} > div`);
        this.updateHealthBar();

        this.scene = scene; //se guarda la escena para poder hacer los timer de los ataques???
    }

    _inferWeaponFromTexture(textureKey) {
        if (!textureKey) return 'sword';
        const tk = String(textureKey).toLowerCase();
        if (tk.includes('spear') || tk.includes('lanza')) return 'spear';
        if (tk.includes('sword') || tk.includes('espada')) return 'sword';
        return 'sword';
    }

    handleInput() {
        if (!this.active) return;

        const { left, right, up, hattack, vattack } = this.keys;

        if (this.body.blocked.down || this.body.onFloor()) {// Reiniciar contador si está tocando el suelo
            this.jumpCount = 0;
        }
        if (left.isDown && this.body.velocity.x >= -this.speed) {
            this.setVelocityX(-this.speed);
            this.flipX = true;
            this.body.setOffset(this.width * 0.4, 0);
        } else if (right.isDown && this.body.velocity.x <= this.speed) {
            this.setVelocityX(this.speed);
            this.flipX = false;
            this.body.setOffset(this.width * 0.2, 0);
        } else if (this.body.onFloor()) {
            this.setVelocityX(0);
        }
        if (Phaser.Input.Keyboard.JustDown(up)) {
            if (this.body.onFloor() && this.jumpCount == 0) {
                this.setVelocityY(this.jumpSpeed);
            }
            else if (this.jumpCount < this.maxJumps) {    // Doble salto
                this.DoubleJump();
            }
            this.jumpCount++;
            //console.log(this.jumpCount);
        }
        if (hattack.isDown && !this.attacking) {
            this.hAttack();
        } else if (vattack.isDown && !this.attacking) {
            this.vAttack();
        }
    }

    hAttack() {
        this.attacking = true;
        this.hattackbox.body.enable = true;
        this.hattackbox.y = this.y + 30;
        if (this.flipX) {
            this.hattackbox.x = this.x - 50;
        }
        else {
            this.hattackbox.x = this.x + 75;
        }
        try {
            if (this.attackSounds && this.attackSounds.h) {
                SoundManager.play(this.attackSounds.h);
            }
        } catch (e) { }

        //console.log('empieza ataque');
        this.scene.time.delayedCall(700, this.AttackFinish, [], this);
    }
    vAttack() {
        this.attacking = true;
        this.vattackbox.body.enable = true;
        this.vattackbox.y = this.y + 20;
        if (this.flipX) {
            this.vattackbox.x = this.x - 30;
        }
        else {
            this.vattackbox.x = this.x + 55;
        }
        try {
            if (this.attackSounds && this.attackSounds.h) {
                SoundManager.play(this.attackSounds.v);
            }
        } catch (e) { }

        //console.log('empieza ataque');
        this.scene.time.delayedCall(700, this.AttackFinish, [], this);
    }

    AttackFinish() {
        this.attacking = false;
        this.hattackbox.body.enable = false;
        this.vattackbox.body.enable = false;
        //console.log('acaba ataque');
    }
    DoubleJump() {
        this.setVelocityY(this.jumpSpeed);

    }

    reduceLife(amount) {
        this.life -= amount;
        this.updateHealthBar();
        if (this.life < 0) this.life = 0;
        if (this.life <= 0) this.die();
    }

    die() {
        this.setTint(0xff0000);
        this.setVelocity(0);
        this.setActive(false);
        this.setVisible(false);
        this.life = 0;
    }

    isAlive() {
        return this.life > 0;
    }

    addCollision(player) {
        this.scene.physics.add.overlap(player, this.hattackbox, () => {
            if (this.attacking && this.hattackbox.body.enable) {
                player.reduceLife(400);
                this.hattackbox.body.enable = false;
                //console.log('daño');
            }
        });
        this.scene.physics.add.overlap(player, this.vattackbox, () => {
            if (this.attacking && this.vattackbox.body.enable) {
                player.reduceLife(400);
                this.vattackbox.body.enable = false;
                //console.log('daño');
            }
        });
    }

    // Actualiza la barra de vida situada en el html
    updateHealthBar() {
        // Asignamos el ancho según el porcentaje de vida restante
        this.healthBar.style.width = `${(this.life / this.maxLife) * 100}%`;
    }
}
