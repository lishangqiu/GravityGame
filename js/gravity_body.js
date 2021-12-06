const gravitationalConstant = 6.67428e-11;
//const screenScale = 0.00000470883; // pixel/meter
const screenScale = 0.000000002; // pixel/meter
const updateTime = 1000000; // simulated second/real world second
const radiusUpscale = 1;
const labelDegree = -225;

var a = 0;
var b =0;
var _idIndex = 0;

class GravityBody{
    // starting_pos(note coordinates start from the center as 0,0), starting_velocity, radius, (density or mass) in SI units
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
        this.initDraw(this.radius, options.textureName);

        this.lastSimulated = new Date().getTime();

        this.id = _idIndex;
        _idIndex += 1;

        this.pathPoints = [];
        this.lastPoint = this.pos.clone().multiplyScalar(screenScale);
    }

    // returns displacement(unit: m)
    simGravity(){
        // this is seperate from updatePos because we might want to calculate path
        //var deltaTime = ((new Date().getTime() - this.lastSimulated) / 1000) * updateTime; // /1000 is to convert from ms to s
        var deltaTime = 16000;
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
        console.log(accelerations);
        var gravitySumVelocity = GravityBody.addVectors(accelerations).multiplyScalar(deltaTime);
        gravitySumVelocity.add(this.velocity);
        this.velocity = gravitySumVelocity;
        
        this.pos.add(gravitySumVelocity.clone().multiplyScalar(deltaTime)); // add the displacement to the current position


        if (
            (Math.abs(((this.pos.x * screenScale) - this.lastPoint.x)) > 1) ||
            (Math.abs(((this.pos.y * screenScale) - this.lastPoint.y)) > 1)){
            this.sceneObj.add.line(0, 0, this.lastPoint.x + 960, this.lastPoint.y + 468.5,
                (this.pos.x * screenScale) + 960, (this.pos.y * screenScale) + 468.5, 0xf8f9f0);
            this.lastPoint = this.pos.clone().multiplyScalar(screenScale);
        }
        return;
    }

    drawNewPos(){
        this.simGravity();
        this.sprite.setPosition(this.pos.x * screenScale + 960, this.pos.y * screenScale + 468.5);

        var diplacements = this.getAngleDisplacements(this.radius * screenScale * radiusUpscale);
        this.label.setPosition(this.sprite.x - diplacements[0], this.sprite.y - diplacements[1] - this.label.displayHeight);
    }

    initDraw(radius, textureName){
        this.sprite = this.sceneObj.add.sprite(-1, -1, textureName);
        this.sprite.displayWidth = radius * screenScale * radiusUpscale *2; // times two for diameter(scaling the image)
        this.sprite.scaleY = this.sprite.scaleX;

        this.label = this.sceneObj.add.text(-1, -1, textureName, {color:"#00ffff"})
        this.sceneObj.add.circle()
    }

    getAngleDisplacements(radius){
        return [Math.cos((labelDegree/180)*Math.PI)*radius, Math.sin((labelDegree/180)*Math.PI)*radius]
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