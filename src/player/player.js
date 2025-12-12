/**
 * Personaje base controlable.
 * Gestiona movimiento, saltos, animaciones y ataques (con hitboxes invisibles).
 * @extends Phaser.Physics.Arcade.Sprite
 */
export default class Player extends Phaser.Physics.Arcade.Sprite {
    /**
     * @param {Phaser.Scene} scene Escena propietaria.
     * @param {'left'|'right'} side Lado del jugador (control + spawn + UI).
     * @param {string} texture Key del spritesheet.
     * @param {{attackSounds?: {h?: string, v?: string, dash?: string}|null, weapon?: 'sword'|'spear'|null}} [opts]
     */
    constructor(scene, side, texture, opts = {}) {
        const defaultOpts = {
            attackSounds: null,
            weapon: null,
        };

        opts = { ...defaultOpts, ...opts };

        let x; // Posicionar jugador según el lado
        if (side == 'left') x = scene.worldWidth / 4;
        else x = scene.worldWidth * 4 / 5;

        // Llamada al constructor padre con posición inicial (según lado)
        super(scene, x, scene.scale.height - 570, texture);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setScale(0.5);
        this.setOrigin(0.1);
        this.setCollideWorldBounds(true);

        // Custom player hitbox
        this.body.setSize(this.width * 0.2, this.height / 2); // ancho, alto
        this.body.setOffset(this.width * 0.39, this.height / 2); // desplazar el hitbox

        this.speed = 400;
        this.jumpSpeed = -610;

        /** Booleano para bloquear nuevos ataques mientras dura la animación. */
        this.attacking = false;
        this.maxJumps = 2;
        this.jumpCount = 0;

        /** Zona invisible: hitbox del ataque horizontal. */
        this.hattackbox = scene.add.zone(0, 0, 120, 80);
        scene.physics.add.existing(this.hattackbox, false);
        this.hattackbox.body.allowGravity = false;
        this.hattackbox.body.enable = false;

        /** Zona invisible: hitbox del ataque vertical. */
        this.vattackbox = scene.add.zone(0, 0, 40, 90);
        this.scene.physics.add.existing(this.vattackbox, false);
        this.vattackbox.body.allowGravity = false;
        this.vattackbox.body.enable = false;

        // Animación de idle
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers(this.texture.key, { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });

        // Animación de salto
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers(this.texture.key, { start: 17, end: 18 }),
            frameRate: 10,
        });

        // Animación de movimiento
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers(this.texture.key, { start: 12, end: 22 }),
            frameRate: 15,
            repeat: -1
        });

        // Animación de ataque horizontal
        this.anims.create({
            key: 'horizontal',
            frames: this.anims.generateFrameNumbers(this.texture.key, { start: 8, end: 11 }),
            frameRate: 12,
        });

        // Animación de ataque vertical
        this.anims.create({
            key: 'vertical',
            frames: this.anims.generateFrameNumbers(this.texture.key, { start: 2, end: 5 }),
            frameRate: 12,
        });

        // Animación de dash
        this.anims.create({
            key: 'dash',
            frames: this.anims.generateFrameNumbers(this.texture.key, { start: 11, end: 11 }),
            frameRate: 1,
        });


        /** Offset por la derecha del ataque horizontal. */
        this.hxoffsetplus = 310;
        /** Offset por la izquierda del ataque horizontal. */
        this.hxoffsetminus = -60;
        /** Offset vertical del ataque horizontal. */
        this.hyoffset = 30 + this.height * 0.3;
        /** Offset por la derecha del ataque vertical. */
        this.vxoffsetplus = 200;
        /** Offset por la izquierda del ataque vertical. */
        this.vxoffsetminus = -160;
        /** Offset vertical del ataque vertical. */
        this.vyoffset = -120 + this.height * 0.3;

        // Guardamos las teclas (pueden ser WASD o flechas)
        if (side === 'left') {
            // Teclas WASD Izq
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
                vattack: Phaser.Input.Keyboard.KeyCodes.MINUS,
                vattack2: Phaser.Input.Keyboard.KeyCodes.CTRL,
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

        this.side = side;

        // Empezar con animación idle
        this.anims.play('idle');

        this.jumpAnimLocked = false;
    }

    /**
     * Intenta inferir el arma por el nombre de la textura.
     * @param {string} textureKey
     * @returns {'sword'|'spear'}
     */
    _inferWeaponFromTexture(textureKey) {
        if (!textureKey) return 'sword';
        const tk = String(textureKey).toLowerCase();
        if (tk.includes('spear') || tk.includes('lanza')) return 'spear';
        if (tk.includes('sword') || tk.includes('espada')) return 'sword';
        return 'sword';
    }
    /** Resetea el contador de saltos (útil tras rebotes/daño). */
    resetJumpCount() {
        this.jumpCount = 0;
    }

    /** Lee input y actualiza movimiento/animación/ataques. */
    handleInput() {
        if (!this.active) return;

        const { left, right, up, hattack, vattack, vattack2 } = this.keys;

        // Reiniciar contador si está tocando el suelo
        if (this.body.blocked.down || this.body.onFloor()) {
            this.jumpCount = 0;
        }

        if (left.isDown && this.body.velocity.x >= -this.speed) {
            this.setVelocityX(-this.speed);
            this.flipX = true;
            //this.body.setOffset(this.width * 0.4, 0);
        }

        else if (right.isDown && this.body.velocity.x <= this.speed) {
            this.setVelocityX(this.speed);
            this.flipX = false;
            //this.body.setOffset(this.width * 0.2, 0);
        }

        else if (this.body.onFloor()) {
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
        }

        if (hattack.isDown && !this.attacking) {
            this.hAttack();
        } if (this.side === 'right') {
            if ((vattack.isDown || vattack2.isDown) && !this.attacking)
                this.vAttack();
        } else {
            if (vattack.isDown && !this.attacking)
                this.vAttack();
        }

        if (this.attacking) return;

        const grounded = this.body.blocked.down || this.body.touching.down || this.body.onFloor();

        if (!grounded) {
            if (!this.jumpAnimLocked) {
                this.anims.play('jump', true);
                this.jumpAnimLocked = true;
            }

            if (!this.anims.isPlaying) {
                this.setFrame(18);
            }
            return;
        }

        this.jumpAnimLocked = false;

        if (this.body.velocity.x !== 0) {
            this.anims.play('run', true);
        } else {
            this.anims.play('idle', true);
        }
    }
    /** Lógica del ataque horizontal: activa hitbox y reproduce animación/sonido. */
    hAttack() {
        this.attacking = true;
        this.hattackbox.body.enable = true;
        this.hattackbox.y = this.y + this.hyoffset;
        if (this.flipX) {
            this.hattackbox.x = this.x - this.hxoffsetminus;
        }
        else {
            this.hattackbox.x = this.x + this.hxoffsetplus;
        }

        if (this.scene && this.scene.sound) this.scene.sound.play(this.attackSounds.h);
        // Reproducir animación de ataque vertical
        this.anims.play('horizontal', true);

        // Cuando acabe la animación:
        this.once('animationcomplete-horizontal', () => { this.AttackFinish(); });
    }
    /** Lógica del ataque vertical: activa hitbox y reproduce animación/sonido. */
    vAttack() {
        this.attacking = true;
        this.vattackbox.body.enable = true;
        this.vattackbox.y = this.y + this.vyoffset;
        if (this.flipX) {
            this.vattackbox.x = this.x - this.vxoffsetminus;
        }
        else {
            this.vattackbox.x = this.x + this.vxoffsetplus;
        }

        if (this.scene && this.scene.sound) this.scene.sound.play(this.attackSounds.v);        // Crear té en una posición aleatoria en la parte superior de la escena

        // Reproducir animación de ataque vertical
        this.anims.play('vertical', true);

        // Cuando acabe la animación:
        this.once('animationcomplete-vertical', () => { this.AttackFinish(); });
    }

    /** Limpia el estado al terminar una animación de ataque. */
    AttackFinish() {
        this.attacking = false;
        this.hattackbox.body.enable = false;
        this.vattackbox.body.enable = false;
    }

    /** Acción de doble salto (sobrescribible por subclases). */
    DoubleJump() {
        this.anims.play('jump', true);
        this.setVelocityY(this.jumpSpeed);
    }

    /**
     * Aplica daño y actualiza UI.
     * @param {number} amount Daño a aplicar.
     */
    reduceLife(amount) {
        this.life -= amount;
        this.updateHealthBar();
        if (this.life < 0) this.life = 0;
        if (this.life <= 0) this.die();
    }

    /** Marca el jugador como muerto e inactivo. */
    die() {
        this.setTint(0xff0000);
        this.setVelocity(0);
        this.stop();
        this.setActive(false);
        this.setVisible(false);
        this.life = 0;
    }

    /**
     * @returns {boolean} `true` si aún tiene vida.
     */
    isAlive() {
        return this.life > 0;
    }

    /**
     * Registra overlaps de esta instancia contra otro jugador.
     * @param {Player} player Jugador que recibirá daño/knockback.
     */
    addCollision(targetPlayer) {
        this.scene.physics.add.overlap(targetPlayer, this.hattackbox, () => {
            if (this.attacking && this.hattackbox.body.enable) {
                targetPlayer.reduceLife(400);
                let knockX;
                if (this.flipX) {
                    knockX = -200; 
                } else {
                    knockX = 200; 
                }

                let knockY = -200; 
                
                // Desactivar colisión hacia abajo para permitir el knockback
                targetPlayer.body.checkCollision.down = false;
                
                // Aplicar el impulso al jugador contrario
                targetPlayer.setVelocityX(knockX);
                targetPlayer.setVelocityY(knockY);
                
                //Reactivar la colisión después de un tiempo
                this.scene.time.delayedCall(100, () => {
                    targetPlayer.body.checkCollision.down = true;
                }, [], this);

                targetPlayer.setVelocityX(knockX);
                targetPlayer.setVelocityY(knockY);
                this.hattackbox.body.enable = false;
            }
        });
        this.scene.physics.add.overlap(targetPlayer, this.vattackbox, () => {
            if (this.attacking && this.vattackbox.body.enable) {
                targetPlayer.reduceLife(400);
                let knockX;
                if (this.flipX) {
                    knockX = 200;
                } else {
                    knockX = -200;
                }

                let knockY = -300; 
                
                //Desactivar colisión hacia abajo para permitir el knockback
                targetPlayer.body.checkCollision.down = false;

                targetPlayer.setVelocityX(knockX);
                targetPlayer.setVelocityY(knockY);
            }
        });
    }
    /** Actualiza la barra de vida situada en el HTML. */
    updateHealthBar() {
        // Asignamos el ancho según el porcentaje de vida restante
        this.healthBar.style.width = `${(this.life / this.maxLife) * 100}%`;
    }
}
