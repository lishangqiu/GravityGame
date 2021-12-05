class Game extends Phaser.Scene{
    constructor(){
        super();
    }

    preload(){
        // load stuff soon
        this.load.image('background', 'assets/background.jpg');
    }

    create(){
        var bg = this.add.image(960, 540, "background");
        this.circle = this.add.circle(400, 300, 300, 0xff6699);
    }
}
const config = {
    parent: "game",
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    width: 1920,
    height: 937,
    backgroundColor: "#FF0000",
    scene: [Game]
}
var game = new Phaser.Game(config);
console.log(window.innerWidth);
console.log(window.innerHeight);