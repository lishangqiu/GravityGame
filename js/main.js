class Game extends Phaser.Scene{
    constructor(){
        super();
    }

    preload(){
        // load stuff soon
        this.load.image('background', 'assets/background.jpg');
    }

    create(){
        var bg = this.add.image(960, 468.5, "background");

        this.createBody(0, 0, 0, 0, 69.34e9, 1.989e30);
        this.createBody(149e9, 0, 0, 30000, 6.73e9, 5.972e24);
        
    }

    createCircle(x, y, radius){
        return this.add.circle(x, y, radius, 0x035956);
    }

    update(){
        GravityBodies.forEach(function(item, index, array) {
            item.drawNewPos();
        });
    }

    createBody(posX, posY, velocityX, velocityY, radius, mass){
        const config = {
            starting_pos : new Victor(posX, posY),
            starting_velocity : new Victor(velocityX, velocityY),
            radius : radius,
            mass : mass,
            sceneObj : this,
        };
        GravityBodies.push(new GravityBody(config));
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

var GravityBodies = [];
var game = new Phaser.Game(config);