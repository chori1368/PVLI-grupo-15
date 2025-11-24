export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, side, texture) {

        let x, y;

        if (side === 'left') {
            x = scene.scale.width / 3;
            y = scene.scale.height / 2;
        } else if (side === 'right') {
            x = scene.scale.width * 2 / 3;
            y = scene.scale.height / 2;
        } else {
            // Por si acaso, posición por defecto
            x = scene.scale.width / 2;
            y = scene.scale.height / 2;
        }

        super(scene, x, y, texture);
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

        this.weaponbox = scene.add.zone(0,0,80,30);
        scene.physics.add.existing(this.weaponbox, false);
        this.weaponbox.body.allowGravity = false;
        this.weaponbox.body.enable = false;

        // Guardamos las teclas (pueden ser WASD o flechas)
        if (side === 'left') {
            // Teclas WASD Izq
            this.keys = scene.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            up: Phaser.Input.Keyboard.KeyCodes.W,
            attack: Phaser.Input.Keyboard.KeyCodes.E });
        } 
        
        else if (side === 'right') {
            // Teclas flechas Dcha
            this.keys = scene.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            attack: Phaser.Input.Keyboard.KeyCodes.SHIFT_R }); // poner bien
        }

        // Vida inicial
        this.maxLife = 10000;
        this.life = this.maxLife;

        this.scene = scene; //se guarda la escena para poder hacer los timer de los ataques
    }

    
    handleInput() {
        if (!this.active) return;

        const { left, right, up, attack } = this.keys;

        if (this.body.blocked.down || this.body.onFloor()) {// Reiniciar contador si está tocando el suelo
            this.jumpCount = 0;
        }
        if (left.isDown&&this.body.velocity.x>=-this.speed) {
            this.setVelocityX(-this.speed);
            this.flipX = true;
        } else if (right.isDown&&this.body.velocity.x<=this.speed) {
            this.setVelocityX(this.speed);
            this.flipX = false;
        } else if(this.body.onFloor()){
            this.setVelocityX(0);
        }
        if (Phaser.Input.Keyboard.JustDown(up)) {
            if(this.body.onFloor()&&this.jumpCount==0){
            this.setVelocityY(this.jumpSpeed);
            }
            else if(this.jumpCount < this.maxJumps){    // Doble salto
            this.DoubleJump();
            }
            this.jumpCount++;
            //console.log(this.jumpCount);
        }
        if (attack.isDown && !this.attacking){
            this.Attack();
        }
    }

    Attack(){
        this.attacking = true; 
        this.weaponbox.body.enable = true;
        this.weaponbox.y = this.y+30;
        if (this.flipX){
            this.weaponbox.x = this.x-50;
        }
        else{
            this.weaponbox.x = this.x+70;
        }
        //console.log('empieza ataque');
        this.scene.time.delayedCall(700, this.AttackFinish,[],this);
    }

    AttackFinish(){
        this.attacking=false;
        this.weaponbox.body.enable = false;
        //console.log('acaba ataque');
    }
    DoubleJump(){
        this.setVelocityY(this.jumpSpeed);
    }

    reduceLife(amount) {
        this.life -= amount;
        if (this.life < 0) this.life = 0;
        //console.log(`${this.texture.key} life: ${this.life}/${this.maxLife}`); // debug
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
        this.scene.physics.add.overlap(player, this.weaponbox, () => {
            if (this.attacking&&this.weaponbox.body.enable){
                player.reduceLife(400);
                this.weaponbox.body.enable = false;
                //console.log('daño');
            }
        });
    }
}
