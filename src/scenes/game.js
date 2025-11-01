var Escena1 = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: 
     function Escena1() {
        Phaser.Scene.call(this, { key: 'Escena1' });
    },
    create(){
        text = this.add.text(game.config.width/2, game.config.height/2, 'Esta es la escena 1', {
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
        text = this.add.text(game.config.width/2, game.config.height/2, 'Esta es la escena 2', {
            fontSize: '40px',
            fill: '#fffffff'
        }).setOrigin(0.5);
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

