class Game extends Phaser.Scene{
    constructor(){
        super();
    }

    preload(){
        // load stuff soon
        this.load.image('background', 'assets/background.jpg');
        this.load.image("Earth", "assets/earth.png");
        this.load.image("Sun", "assets/sun.png");
    }

    create(){
        var bg = this.add.image(960, 468.5, "background");

        this.createBody(0, 0, 0, 0, 69.34e6, 1.989e30, "Sun");
        this.createBody(149e9, 0, 0, -30000, 6.73e6, 5.972e24, "Earth");
        this.createBody(0, -230e9, 0, -1500, 6.73e6, 16e25, "Earth");

        this.add.text(20, 10, "Scale: 5x10^10 meters/pixel\nTime Scale: Each second in simulation = 1000000 in real life\nRadius are upscaled by: 500x for visibility\n");

        var drawPath = this.add.graphics(this);
    }

    update(){
        GravityBodies.forEach(function(item, index, array) {
            item.drawNewPos();
        });
    }

    createBody(posX, posY, velocityX, velocityY, radius, mass, textureName){
        const config = {
            starting_pos : new Victor(posX, posY),
            starting_velocity : new Victor(velocityX, velocityY),
            radius : radius,
            mass : mass,
            sceneObj : this,
            textureName : textureName,
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