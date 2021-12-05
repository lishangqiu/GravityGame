const Victor = require("./victor");

const gravitationalConstant = 6.67428 * (10^-11);
const screenScale = 0.00000470883; // pixel/meter

class GravityBody{
    // starting_pos, starting_velocity, radius, (density or mass)
    constructor(options){
        this.pos = options.starting_pos;
        this.velocity = options.starting_velocity;
        this.radius = options.radius;
        if (options.density){
            this.mass = (4/3)*Math.PI*(options.radius^3) * options.density;
        }
        else{
            this.mass = mass;
        }

        this.add.circle(this.pos.x*screenScale, this.pos.y*screenScale, this.radius*screenScale, 0xff0000);
    }
}

// returns the acceleration for the first object
GravityBody.getGravityAcceleration = function(obj1Mass, obj2Mass, obj1Pos_, obj2Pos_){
    // (vector F) = ((G * m1 * m2)/r^2) * (vector r)
    // (vector A) = (((G * m1 * m2)/r^2) * (vector r)) / 

    // clone this just to make sure
    var obj1Pos = obj1Pos_.clone();
    var obj2Pos = obj2Pos_.clone();

    var dir = obj1Pos.subtract(obj2Pos);
    dir.normalize();
}

function MDToVictor(magnitude, direction){
    return new Victor(Math.abs(magnitude)*Math.cos(direction), Math.abs(magnitude)*Math.sin(direction));
}