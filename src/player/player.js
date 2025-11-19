export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, keys) {
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
        this.keys = keys;

        // Vida inicial
        this.maxLife = 10000;
        this.life = this.maxLife;

        this.scene = scene; //se guarda la escena para poder hacer los timer de los ataques
    }

    
    handleInput() {
        if (!this.active) return;

        const { left, right, up, attack} = this.keys;

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
            console.log(this.jumpCount);
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
        this.scene.die(this);
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
