var config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    backgroundColor: 'black',
    parent: 'PVLI-grupo-15',
    scene: [{
        preload: preload,
        create: create,
        update: update
    }]
};
var game = new Phaser.Game(config);

function preload() {
    console.log("preload");
}
function create() {
    console.log("create");
}
function update() {
    console.log("update");
}