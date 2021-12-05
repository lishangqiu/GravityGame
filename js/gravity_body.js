const gravitationalConstant = 6.67428e-11;
//const screenScale = 0.00000470883; // pixel/meter
const screenScale = 0.000000001; // pixel/meter
const updateTime = 1; // simulated second/real world second


var _idIndex = 0;

class GravityBody{
    // starting_pos, starting_velocity, radius, (density or mass) in SI units
    constructor(options){
        this.pos = options.starting_pos.clone();
        this.velocity = options.starting_velocity.clone();
        this.radius = options.radius;

        if (options.density){
            this.mass = (4/3)*Math.PI*(Math.pow(options.radius,3)) * options.density;
        }
        else{
            this.mass = options.mass;
        }
        
        this.sceneObj = options.sceneObj;
        this.drawObj = this.sceneObj.createCircle(options.starting_pos.x + 960, options.starting_pos.y + 468.5, this.radius * screenScale);
        this.lastSimulated = new Date().getTime();

        this.id = _idIndex;
        _idIndex += 1;
    }

    // returns displacement(unit: m)
    simGravity(){
        // this is seperate from updatePos because we might want to calculate path
        var deltaTime = ((new Date().getTime() - this.lastSimulated) * 1000) * updateTime; // *1000 is to convert from ms to s
        this.lastSimulated = new Date().getTime();
        var currID = this.id;
        var mass = this.mass;
        var pos = this.pos;


        var accelerations = []
        GravityBodies.forEach(function(item, index, array){
            if (item.id != currID){
                accelerations.push(GravityBody.getGravityAcceleration(mass, item.mass, pos, item.pos));
            }
        });
        var gravitySumVelocity = GravityBody.addVectors(accelerations).multiplyScalar(deltaTime);
        gravitySumVelocity.add(this.velocity);
        this.velocity = gravitySumVelocity;
        
        this.pos.add(gravitySumVelocity.clone().multiplyScalar(deltaTime)); // add the displacement to the current position
        return;
    }

    drawNewPos(){
        this.simGravity();
        this.drawObj.setPosition(this.pos.x * screenScale + 960, this.pos.y * screenScale + 468.5);
    }
}

GravityBody.addVectors = function(vectors){
    var finalVecotr = new Victor(0,0);
    vectors.forEach(function(item, index, array) {
        finalVecotr.add(item);
    });
    return finalVecotr;
}

// returns the acceleration for the first object(m/s^2)
GravityBody.getGravityAcceleration = function(obj1Mass, obj2Mass, obj1Pos_, obj2Pos_){
    // (vector F) = ((G * m1 * m2)/r^2) * (vector r)  Note: F is mutual between the two objects(which is INSANE!)
    // (vector A1) = (vector F) /  m1

    // clone this just to make sure
    var obj1Pos = obj1Pos_.clone();
    var obj2Pos = obj2Pos_.clone();

    var direction = obj2Pos.subtract(obj1Pos); // yes it is correct(opposite of what you'd think)
    var magnitude = direction.magnitude();

    var F = (gravitationalConstant * obj1Mass * obj2Mass) / (magnitude*magnitude); // this is scalar F
    direction.normalize(); // keep the same direction
    direction.multiplyScalar(F); // now we get vector F

    var acceleration = direction.clone();
    acceleration.divideScalar(obj1Mass);

    return acceleration;
}

function MDToVictor(magnitude, direction){
    return new Victor(Math.abs(magnitude)*Math.cos(direction), Math.abs(magnitude)*Math.sin(direction));
}