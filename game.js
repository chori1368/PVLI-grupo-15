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
    create(){     
        this.cameras.main.setBackgroundColor('#ffffff'); 
          this.input.on('pointerdown', (pointer)=> {
            this.scene.start('Escena1');
             });
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

