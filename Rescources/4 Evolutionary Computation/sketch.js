var dotImage;
var bgImage;
//var pipedImage;
var player;
var showAll = true;
var pipes = [];
var pipecounter = 0;
var speed = 6;
var gravity = 0.2;
var flapForce = -7;

// ne ga code variables
var populate;
var population_size = 750;
var inputNodes = 4 // number of inputs to NN
var hiddenNodes = 4;
var outputNodes = 1 // number of possible agent actions
var lowest_alive = 0;
var allTimeHigh = 0;
var globalMutationRate = 0.1;
var playersAlive = 0;
var playersAliveByIndex = [];

function preload() {
  dotImage = loadImage('./images/dot.png');
  bgImage = loadImage('./images/bgimage.gif');
}


function setup() {
  createCanvas(800, 650);
  populate = new Population(population_size);
}

function draw() {
  background(196, 230, 255);
  image(bgImage, 400, 400);


  if (pipecounter % 100 == 0) {
    pipes.push(new Pipes());
    pipecounter = 0;
  }

  if (!populate.done()) {
    populate.updateAlive();
    showPipes();
    pipecounter++;
  } else {
    //populate.addEndingPoints();
    populate.calculateFitness();
    populate.naturalSelection();
    resetPipes();
  }
  showInfo();
} // draw


function showPipes() {
  for (let i = pipes.length - 1; i >= 0; i--) {
    let p = pipes[i];
    p.move(speed);
    p.show();
    if (p.offscreen()) {
      pipes.splice(i, 1);
    }
  }
}

function resetPipes() {
  pipes = [];
  pipecounter = 98;
}

function showInfo() {
  fill(200);
  textAlign(LEFT);
  textSize(20);
  text("Gen: " + populate.gen, 30, height - 40);
  text("Score: " + populate.players[lowest_alive].score, 30, height - 60);
}