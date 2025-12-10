import SoundManager from '../manager/soundManager.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, side, texture, opts = {}) {
        const defaultOpts = {
            attackSounds: null,
            weapon: null,
        };

        opts = { ...defaultOpts, ...opts };

        let x; // Posicionar jugador según el lado
        if (side == 'left') x = scene.scale.width / 3;
        else x = scene.scale.width * 2 / 3;

        // Llamada al constructor padre con posición inicial (según lado)
        super(scene, x, scene.scale.height / 2.5, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(0.5);
        this.setOrigin(0);
        this.setCollideWorldBounds(true);

        // Custom player hitbox
        this.body.setSize(this.width * 0.4, this.height/2); // ancho, alto
        this.body.setOffset(this.width *0.32, this.height*0.5 ); // desplazar el hitbox

        this.speed = 300;
        this.jumpSpeed = -650;
        /** boleano para comprobar si ha terminado el cooldown del ataque */
        this.attacking = false;
        this.maxJumps = 2;
        this.jumpCount = 0;

        /** zona invisible que sirve para la hitbox del ataque horizontal*/
        this.hattackbox = scene.add.zone(0, 0, 80, 30);
        scene.physics.add.existing(this.hattackbox, false);
        this.hattackbox.body.allowGravity = false;
        this.hattackbox.body.enable = false;

        /** zona invisible que sirve para la hitbox del ataque vertical*/
        this.vattackbox = scene.add.zone(0, 0, 40, 90);
        scene.physics.add.existing(this.vattackbox, false);
        this.vattackbox.body.allowGravity = false;
        this.vattackbox.body.enable = false;

        // Animación de idle
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers(this.texture.key, { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });

        // Animación de salto
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers(this.texture.key, { start: 6, end: 7 }),
            frameRate: 10,
            repeat: 0
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
            frameRate: 20,
            repeat: 0
        });

        // Animación de ataque vertical
        this.anims.create({
            key: 'vertical',
            frames: this.anims.generateFrameNumbers(this.texture.key, { start: 2, end: 5 }),
            frameRate: 20,
            repeat: 0
        });


        /** offset por la derecha del ataque horizontal */
        this.hxoffsetplus = 160;
        /** offset por la izquierda del ataque horizontal */
        this.hxoffsetminus = 40;
        /** offset vertical del ataque vertical */
        this.hyoffset = 30+this.height*0.3;
        /** offset por la derecha del ataque vertical */
        this.vxoffsetplus = 140;
        /** offset por la izquierda del ataque vertical */
        this.vxoffsetminus = 20;
        /** offset vertical del ataque vertical */
        this.vyoffset = 20+this.height*0.3;

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
        this.scene = scene; //se guarda la escena para poder hacer los timer de los ataques

        // Empezar con animación idle
        this.anims.play('idle');
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

        const { left, right, up, hattack, vattack,vattack2 } = this.keys;

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
        }if (this.side === 'right'){
            if((vattack.isDown||vattack2.isDown) && !this.attacking)
                this.vAttack();
        }else {
            if (vattack.isDown && !this.attacking)
            this.vAttack();
        }

        if (this.attacking) return;

        if (this.body.velocity.y > 40 || this.body.velocity.y < -40) {
            this.anims.play('jump', true);
        } else if (this.body.velocity.x !== 0) {
            this.anims.play('run', true);
        } else {
            this.anims.play('idle', true);
        }
    }
    /** lógica del ataque horizontal */
    hAttack(){
        this.attacking = true; 
        this.hattackbox.body.enable = true;
        this.hattackbox.y = this.y+this.hyoffset;
        if (this.flipX){
            this.hattackbox.x = this.x-this.hxoffsetminus;
        }
        else{
            this.hattackbox.x = this.x+this.hxoffsetplus;
        }

        SoundManager.play(this.attackSounds.h);

        // Reproducir animación de ataque vertical
        this.anims.play('horizontal', true);

        // Cuando acabe la animación:
        this.once('animationcomplete-horizontal', () => { this.AttackFinish(); });
    }
    /** lógica del ataque vertical */
    vAttack(){
        this.attacking = true; 
        this.vattackbox.body.enable = true;
        this.vattackbox.y = this.y+this.vyoffset;
        if (this.flipX){
            this.vattackbox.x = this.x-this.vxoffsetminus;
        }
        else{
            this.vattackbox.x = this.x+this.vxoffsetplus;
        }

        SoundManager.play(this.attackSounds.v);

        // Reproducir animación de ataque vertical
        this.anims.play('vertical', true);

        // Cuando acabe la animación:
        this.once('animationcomplete-vertical', () => { this.AttackFinish(); });
    }

    AttackFinish() {
        this.attacking = false;
        this.hattackbox.body.enable = false;
        this.vattackbox.body.enable = false;
    }

    DoubleJump() {
        this.setVelocityY(this.jumpSpeed);
        this.anims.play('jump', true);
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
        this.stop();
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
        /** Actualiza la barra de vida situada en el html*/
    updateHealthBar() {
        // Asignamos el ancho según el porcentaje de vida restante
        this.healthBar.style.width = `${(this.life / this.maxLife) * 100}%`;
    }
}
