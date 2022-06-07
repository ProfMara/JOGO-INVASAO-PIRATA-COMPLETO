const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world, backgroundImg;
var canvas, angle, tower, ground, cannon, boat;
var balls = [];
var boats = [];
var score = 0;
var boatAnimation = [];
var boatSpritedata, boatSpritesheet;

var brokenBoatAnimation = [];
var brokenBoatSpritedata, brokenBoatSpritesheet;

var waterSplashAnimation = [];
var waterSplashSpritedata, waterSplashSpritesheet;

var jogoAcabou = false;
var somTiro;
var somAgua;

function preload() {
    backgroundImg = loadImage("./assets/background.gif");
    towerImage = loadImage("./assets/tower.png");
    boatSpritedata = loadJSON("assets/boat/boat.json");
    boatSpritesheet = loadImage("assets/boat/boat.png");
    brokenBoatSpritedata = loadJSON("assets/boat/broken_boat.json");
    brokenBoatSpritesheet = loadImage("assets/boat/broken_boat.png");
    waterSplashSpritedata = loadJSON("assets/water_splash/water_splash.json");
    waterSplashSpritesheet = loadImage("assets/water_splash/water_splash.png");

    somTiro = loadSound("tiro.mp3");
    somAgua = loadSound("splash.mp3")

}

function setup() {
    canvas = createCanvas(1200, 600);
    engine = Engine.create();
    world = engine.world;
    angleMode(DEGREES)
    angle = 15

    ground = Bodies.rectangle(0, height - 1, width * 2, 1, { isStatic: true });
    World.add(world, ground);

    tower = Bodies.rectangle(160, 350, 160, 310, { isStatic: true });
    World.add(world, tower);

    cannon = new Cannon(180, 110, 200, 100, angle);

    var boatFrames = boatSpritedata.frames;
    for (var i = 0; i < boatFrames.length; i++) {
        var pos = boatFrames[i].position;
        var img = boatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
        boatAnimation.push(img);
    }

    var brokenBoatFrames = brokenBoatSpritedata.frames;
    for (var i = 0; i < brokenBoatFrames.length; i++) {
        var pos = brokenBoatFrames[i].position;
        var img = brokenBoatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
        brokenBoatAnimation.push(img);
    }

    var waterSplashFrames = waterSplashSpritedata.frames;
    for (var i = 0; i < waterSplashFrames.length; i++) {
        var pos = waterSplashFrames[i].position;
        var img = waterSplashSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
        waterSplashAnimation.push(img);
    }
}

function draw() {
    background(189);
    image(backgroundImg, 0, 0, width, height);

    //código que toca a música de fundo 

    Engine.update(engine);

    push();
    translate(ground.position.x, ground.position.y);
    fill("brown");
    rectMode(CENTER);
    rect(0, 0, width * 2, 1);
    pop();

    push();
    translate(tower.position.x, tower.position.y);
    rotate(tower.angle);
    imageMode(CENTER);
    image(towerImage, 0, 0, 160, 310);
    pop();

    showBoats();

    for (var i = 0; i < balls.length; i++) {
        showCannonBalls(balls[i], i);
        collisionWithBoat(i);
    }

    cannon.display();


    fill("#6d4c41");
    textSize(40);
    
    textAlign(CENTER, CENTER);
}

function collisionWithBoat(index) {
    for (var i = 0; i < boats.length; i++) {
        if (balls[index] !== undefined && boats[i] !== undefined) {
            var collision = Matter.SAT.collides(balls[index].body, boats[i].body);

            if (collision.collided) {

                boats[i].remove(i);
                Matter.World.remove(world, balls[index].body);
                delete balls[index];
            }
        }
    }
}


//código que atira a bala de canhão
function keyPressed() {
    if (keyCode === DOWN_ARROW) {
        var cannonBall = new CannonBall(cannon.x, cannon.y);
        cannonBall.trajectory = [];
        Matter.Body.setAngle(cannonBall.body, cannon.angle);
        balls.push(cannonBall);

        //código que toca o som do tiro

    }
}

function showCannonBalls(ball, index) {
    if (ball) {
        ball.display();
        ball.animate();

        if (ball.body.position.x >= width) {
            ball.remove(index);
        }
        if (ball.body.position.y >= height - 50) {
            ball.remove(index);
        }
    }
}

function showBoats() {
    if (boats.length > 0) {
        if (
            boats.length < 4 &&
            boats[boats.length - 1].body.position.x < width - 300
        ) {
            var positions = [-40, -60, -70, -20];
            var position = random(positions);
            var boat = new Boat(
                width,
                height - 100,
                170,
                170,
                position,
                boatAnimation
            );

            boats.push(boat);
        }

        for (var i = 0; i < boats.length; i++) {
            Matter.Body.setVelocity(boats[i].body, {
                x: -0.9,
                y: 0
            });

        //colisão entre a torre e o barco
            var colisao = Matter.SAT.collides(this.tower, boats[i].body);
           
            if(colisao.collided){
                gameOver();
                jogoAcabou = true;
            }
            boats[i].display();
            boats[i].animate();

        }
    } else {
        var boat = new Boat(width, height - 60, 170, 170, -60, boatAnimation);
        boats.push(boat);
    }
}

function keyReleased() {
    if (keyCode === DOWN_ARROW) {
        balls[balls.length - 1].shoot();
    }
}

function gameOver() {

    swal({
        title: `Fim de jogo!!!`,
        text: "Obrigado por jogar!",
        imageUrl: "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
        imageSize: "150x150",
        confirmButtonText: "Jogar Novamente"
    }, function(isConfirm) {
        if (isConfirm) {
            location.reload();
        }
    })

}