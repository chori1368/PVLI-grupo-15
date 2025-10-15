var Escena1 = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: 
     function Escena1() {
        Phaser.Scene.call(this, { key: 'Escena1' });
    },
      preload() {
        this.load.image('background', 'assets/background.png');
    },
    create(){
             this.add.image(game.config.width / 2, game.config.height / 2, 'background')
            .setOrigin(0.5)
            .setDisplaySize(game.config.width, game.config.height)
        text = this.add.text(game.config.width/2, game.config.height/2, 'MENU', {
            fontSize: '40px',
            fill: '#ffffffff'
        }).setOrigin(0.5);
        this.input.on('pointerdown', (pointer)=> {
            this.scene.start('Escena2');
       });
    }

});
var Escena2 = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: 
     function Escena2() {
        Phaser.Scene.call(this, { key: 'Escena2' });
    },

    preload() {
        this.load.image('player', 'assets/player.png');
    },

    create(){     
        this.cameras.main.setBackgroundColor('#3b8de5ff');

        this.player = this.add.sprite(game.config.width / 2, game.config.height / 2, 'player');
        this.player.setScale(0.5);
        this.player.setOrigin(0.5, 0.5);

     
        this.playerSpeed = 300;
        this.jumpSpeed = 200; 

        this.keys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            up: Phaser.Input.Keyboard.KeyCodes.W
        });
    },

    update(time, delta) {
        if(this.keys.left.isDown){
            this.player.x -= this.playerSpeed * delta / 1000;
        } 
        else if(this.keys.right.isDown){
            this.player.x += this.playerSpeed * delta / 1000;
        }
        if(this.keys.up.isDown){
            this.player.y -= this.jumpSpeed * delta / 1000;
        }

    }
});



var config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    parent: 'PVLI-grupo-15',
    scene: [Escena1, Escena2]
};
var game = new Phaser.Game(config);

