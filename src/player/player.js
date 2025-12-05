import SoundManager from '../manager/soundManager.js';
export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, side, texture, opts = {}) {
        // Llamamos al constructor con nulls (luego los asignamos bien)
        super(scene, null, null, texture);

        const defaultOpts = {
            attackSounds: null,
            weapon: null,
        };
        opts = { ...defaultOpts, ...opts };

        // Mostramos el contenedor de vida de jugador (del html)
        document.querySelector(`healthbar.${side}`).style.display = 'flex';
        // Asignamos la barra de progreso de vida (hijo de healthbar."side")
        this.healthBar = document.querySelector(`healthbar.${side} > div`);

        // Asignamos valores necesarios según el side:
        if (side === 'left') {
            // Posición inicial jugador izquierdo
            this.setPosition(scene.scale.width / 3, scene.scale.height / 2);
            // Teclas
            this.keys = scene.input.keyboard.addKeys({
                //Movimiento
                up: Phaser.Input.Keyboard.KeyCodes.W,
                left: Phaser.Input.Keyboard.KeyCodes.A,
                right: Phaser.Input.Keyboard.KeyCodes.D,
                // Ataques
                horizontal: Phaser.Input.Keyboard.KeyCodes.E,
                vertical: Phaser.Input.Keyboard.KeyCodes.Q,
            });
        }

        else if (side === 'right') {
            // Posición inicial
            this.setPosition(scene.scale.width * 2 / 3, scene.scale.height / 2);
            // Teclas
            this.keys = scene.input.keyboard.addKeys({
                //Movimiento
                up: Phaser.Input.Keyboard.KeyCodes.UP,
                left: Phaser.Input.Keyboard.KeyCodes.LEFT,
                right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
                // Ataques
                horizontal: Phaser.Input.Keyboard.KeyCodes.SHIFT,
                vertical: Phaser.Input.Keyboard.KeyCodes.MINUS, // poner CTRL tambien
            });
        }

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(0.25);
        this.setOrigin(0.25);
        this.setCollideWorldBounds(true);

        this.speed = 300;
        this.jumpSpeed = -650;
        this.attacking = false;
        this.maxJumps = 2;
        this.jumpCount = 0;

        this.horizontalbox = scene.add.zone(0, 0, 80, 30);
        scene.physics.add.existing(this.horizontalbox, false);
        this.horizontalbox.body.allowGravity = false;
        this.horizontalbox.body.enable = false;

        this.verticalbox = scene.add.zone(0, 0, 40, 80);
        scene.physics.add.existing(this.verticalbox, false);
        this.verticalbox.body.allowGravity = false;
        this.verticalbox.body.enable = false;

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

        this.updateHealthBar();

        this.scene = scene; //se guarda la escena para poder hacer los timer de los ataques
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

        const { left, right, up, horizontal, vertical } = this.keys;

        if (this.body.blocked.down || this.body.onFloor()) {// Reiniciar contador si está tocando el suelo
            this.jumpCount = 0;
        }
        if (left.isDown && this.body.velocity.x >= -this.speed) {
            this.setVelocityX(-this.speed);
            this.flipX = true;
        } else if (right.isDown && this.body.velocity.x <= this.speed) {
            this.setVelocityX(this.speed);
            this.flipX = false;
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
        }
        if (horizontal.isDown && !this.attacking) {
            this.attackHorizontal();
        } else if (vertical.isDown && !this.attacking) {
            this.attackVertical();
        }
    }

    attackHorizontal() {
        this.attacking = true;
        this.horizontalbox.body.enable = true;
        this.horizontalbox.y = this.y + 30;
        if (this.flipX) {
            this.horizontalbox.x = this.x - 50;
        }
        else {
            this.horizontalbox.x = this.x + 75;
        }
        try {
            if (this.attackSounds && this.attackSounds.h) {
                SoundManager.play(this.attackSounds.h);
            }
        } catch (e) { }

        this.scene.time.delayedCall(700, this.AttackFinish, [], this);
    }

    attackVertical() {
        this.attacking = true;
        this.verticalbox.body.enable = true;
        this.verticalbox.y = this.y + 20;
        if (this.flipX) {
            this.verticalbox.x = this.x - 30;
        }
        else {
            this.verticalbox.x = this.x + 55;
        }
        try {
            if (this.attackSounds && this.attackSounds.h) {
                SoundManager.play(this.attackSounds.v);
            }
        } catch (e) { }

        this.scene.time.delayedCall(700, this.AttackFinish, [], this);
    }

    AttackFinish() {
        this.attacking = false;
        this.horizontalbox.body.enable = false;
        this.verticalbox.body.enable = false;
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
        this.scene.physics.add.overlap(player, this.horizontalbox, () => {
            if (this.attacking && this.horizontalbox.body.enable) {
                player.reduceLife(400);
                this.horizontalbox.body.enable = false;
            }
        });
        this.scene.physics.add.overlap(player, this.verticalbox, () => {
            if (this.attacking && this.verticalbox.body.enable) {
                player.reduceLife(400);
                this.verticalbox.body.enable = false;
            }
        });
    }

    // Actualiza la barra de vida situada en el html
    updateHealthBar() {
        // Asignamos el ancho según el porcentaje de vida restante
        this.healthBar.style.width = `${(this.life / this.maxLife) * 100}%`;
    }
}
