var Escena1 = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: 
     function Escena1() {
        Phaser.Scene.call(this, { key: 'Escena1' });
    },
      preload() {
        this.load.image('background', 'assets/background.png');
    },
    create() {
        // Fondo
        this.add.image(game.config.width / 2, game.config.height / 2, 'background')
            .setOrigin(0.5)
            .setDisplaySize(game.config.width, game.config.height);

        // Título
        this.add.text(game.config.width / 2, 200, 'MENU PRINCIPAL', {
            fontSize: '60px',
            fill: '#ffffff',
        }).setOrigin(0.5);
      
        let botonJugar = this.add.text(game.config.width / 2, game.config.height / 2, 'Escena Personaje', {
            fontSize: '50px',
            fill: '#ffffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);
        
       botonJugar.setInteractive({ useHandCursor: true });
        botonJugar.on('pointerdown', () => {
            this.scene.start('Escena2');
        });

    }

});

var Escena2= new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: 
     function Escena2() {
        Phaser.Scene.call(this, { key: 'Escena2' });
    },
      preload() {
        this.load.image('infierno', 'assets/fondoinfierno.jpg');
    },
    create() {
        // Fondo
        this.add.image(game.config.width / 2, game.config.height / 2, 'infierno')
            .setOrigin(0.5)
            .setDisplaySize(game.config.width, game.config.height);

        // Título
        this.add.text(game.config.width / 2, 200, 'Seleccion de Personaje', {
            fontSize: '60px',
            fill: '#ffffff',
        }).setOrigin(0.5);
      
        let botonJugar = this.add.text(game.config.width / 2, game.config.height / 2, 'Controles', {
            fontSize: '50px',
            fill: '#ffffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);
        
       botonJugar.setInteractive({ useHandCursor: true });
        botonJugar.on('pointerdown', () => {
            this.scene.start('Escena3');
        });


    }

});

var Escena3= new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: 
     function Escena3() {
        Phaser.Scene.call(this, { key: 'Escena3' });
    },
      preload() {
        this.load.image('controles', 'assets/controles.jpg');
    },
    create() {
        // Fondo
        this.add.image(game.config.width / 2, game.config.height / 2, 'controles')
            .setOrigin(0.5)
            .setDisplaySize(game.config.width, game.config.height);

        // Título
        this.add.text(game.config.width / 2, 200, 'Controles', {
            fontSize: '60px',
            fill: '#ffffff',
        }).setOrigin(0.5);
      
        let botonJugar = this.add.text(game.config.width / 2, game.config.height / 2, 'Juego', {
            fontSize: '50px',
            fill: '#ffffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);
        
       botonJugar.setInteractive({ useHandCursor: true });
        botonJugar.on('pointerdown', () => {
            this.scene.start('Escena4');
        });
        let botonatras = this.add.text(game.config.width / 2, game.config.height / 2, 'Seleccion de personaje', {
            fontSize: '50px',
            fill: '#ffffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.85, 4);
        
       botonatras.setInteractive({ useHandCursor: true });
        botonatras.on('pointerdown', () => {
            this.scene.start('Escena2');  });

    }

});

var Escena4 = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: 
     function Escena4() {
        Phaser.Scene.call(this, { key: 'Escena4' });
    },

    preload() {
        this.load.image('player', 'assets/player.png');
        this.load.image('suelo', 'assets/suelo.png'); 

    },

    create(){     
        this.physics.world.gravity.y = 500; //Activa la gravedad del nivel
        this.cameras.main.setBackgroundColor('#3b8de5ff');
        let ground2 = this.physics.add.staticImage(300, 550, 'suelo')
            .setScale(0.5, 1)
            ground2.refreshBody(); 

        let ground3 = this.physics.add.staticImage(900, 400, 'suelo')
            .setScale(0.5, 1)
             ground3.refreshBody(); 

        let ground1 = this.physics.add.staticImage(game.config.width / 2, game.config.height - 50, 'suelo') //let es como this pero como no tenemos que llamar al suelo fuera del create pongo let
            .setScale(8, 1)
            .refreshBody(); //Actualiza el cuerpo estático después de escalar

        this.player = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, 'player');
        
        this.player.setScale(0.5);
        this.player.setOrigin(0.5, 0.5);

     
        this.playerSpeed = 300;
        this.jumpSpeed = -500; 
                
        this.physics.add.collider(this.player, [ground1, ground2, ground3]);



        this.keys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            up: Phaser.Input.Keyboard.KeyCodes.W
        });
         let botonJugar = this.add.text(game.config.width / 2, game.config.height / 2, 'Resultado', {
            fontSize: '50px',
            fill: '#ffffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.85, 4);
        
       botonJugar.setInteractive({ useHandCursor: true });
        botonJugar.on('pointerdown', () => {
            this.scene.start('Escena5');  });

    },

    update(time, delta) {
        if(this.keys.left.isDown){
            this.player.setVelocityX(-this.playerSpeed);
               this.player.flipX = true;
        } 
        else if(this.keys.right.isDown){
            this.player.setVelocityX(this.playerSpeed);
               this.player.flipX = false;
        } 
        else {
            this.player.setVelocityX(0);
        }

        if(this.keys.up.isDown && this.player.body.touching.down){
            this.player.setVelocityY(this.jumpSpeed);
        }
    }
    
});
var Escena5= new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: 
     function Escena5() {
        Phaser.Scene.call(this, { key: 'Escena5' });
    },
      preload() {
        this.load.image('resultado', 'assets/resultado.jpg');
    },
    create() {
        // Fondo
        this.add.image(game.config.width / 2, game.config.height / 2, 'resultado.jpg')
            .setOrigin(0.5)
            .setDisplaySize(game.config.width, game.config.height);

        // Título
        this.add.text(game.config.width / 2, 200, 'Resultado', {
            fontSize: '60px',
            fill: '#ffffff',
        }).setOrigin(0.5);
      
        let botonJugar = this.add.text(game.config.width / 2, game.config.height / 2, 'Inicio', {
            fontSize: '50px',
            fill: '#ffffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);
        
       botonJugar.setInteractive({ useHandCursor: true });
        botonJugar.on('pointerdown', () => {
            this.scene.start('Escena1');
        });
        let botonatras = this.add.text(game.config.width / 2, game.config.height / 2, 'Seleccion de personaje', {
            fontSize: '50px',
            fill: '#ffffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.80, 4);
        
       botonatras.setInteractive({ useHandCursor: true });
        botonatras.on('pointerdown', () => {
            this.scene.start('Escena2');  });

    }

});
var config = {
    
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    parent: 'PVLI-grupo-15',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },

    scene: [Escena1, Escena2, Escena3, Escena4, Escena5]
};

var game = new Phaser.Game(config);