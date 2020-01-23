class Player {
  constructor() {
    this.size = 50;
    this.score = 0;
    this.dead = false;
    this.isFlapping = false;
    this.scoreCounter = 0;

    this.position = createVector(150, 300);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.gravity = createVector(0, 0.1);
    // ne ga variables
    this.brain = new NeuralNet(inputNodes, hiddenNodes, outputNodes);
    this.fitness = 0;
    this.vision = [];
    this.action = [];
  } // player constructor

  applyForce(force) {
    var f = createVector(0, force);
    this.acceleration.add(f);
  } // applyforce

  flap() {
    if (!this.dead) {
      this.applyForce(flapForce);
    }
  } // flap

  move() {
    this.applyForce(gravity);
    this.position.y = constrain(this.position.y, 0, 795);
    //this.acceleration.add(this.gravity);
    this.velocity.add(this.acceleration);
    this.velocity.y = constrain(this.velocity.y, -5, 7);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.checkHit();


    if (this.position.y > 650) {
      this.dead = true;
    } else if (this.position.y < 5) {
      this.dead = true;
    }

    if (!this.dead && this.scoreCounter % 10 == 0) {
      this.score++;
    } //
    this.scoreCounter++;

    //if(pipes[0].posx <= 165 && pipes[0].posx > 160) {
    //this.score = this.score + floor((1 / abs(this.position.y - pipes[0].h) * 100));
    //}

  } // move

  show() {
    if (showAll) {
      fill(255, 255, 0);
      if (this.dead) {
        fill(255, 0, 0);
      }
      //ellipse(this.position.x,this.position.y,this.size,this.size - 10);
      imageMode(CENTER);
      image(dotImage, this.position.x, this.position.y, this.size, this.size - 10);
      fill(255, 0, 0);
      ellipse(this.position.x, this.position.y, 5, 5);
    } // show
  }


  checkHit() {
    for (let i = pipes.length - 1; i >= 0; i--) {
      //let p = pipes.get(i);
      let p = pipes[i];
      if (this.position.x > p.posx && this.position.x < p.posx + p.w && (this.position.y > p.h + p.d / 2 || (this.position.y < p.h - p.d / 2))) {
        this.dead = true;
      }
    }
  } // checkHit

  //get inputs for Neural network
  look() { // NEED TO NORMALIZE VISION!!
    var zero_index = 0;
    var minx = 99999;
    var minx_index = -1;

    for (var i = 0; i <= pipes.length - 1; i++) {
      if (pipes[i].posx < minx) {
        minx = pipes[i].posx;
        minx_index = i;
      }
    }
    for (var j = 0; j <= 3; j++) {
      this.vision[j] = 0;
    }
    // if no pipes
    //print("pipes length " + pipes.length)
    if (pipes.length <= 0) {
      this.vision[0] = 1; //  dist to next pipe
      this.vision[1] = 1; //  the height of bottom pipe
      this.vision[2] = 1; // players top pipe
      this.vision[3] = this.position.y / 800; // players height
      //   } else if(this.position.x - 25 > pipes[minx_index].posx + 50) {
      //       stroke(255,255,255);
      //       line(0,(pipes[minx_index + 1].h - pipes[minx_index + 1].d/2),400,(pipes[minx_index + 1].h - pipes[minx_index + 1].d/2));
      //      // strokeWeight(4);
      //       line(0,(pipes[minx_index + 1].h + pipes[minx_index + 1].d/2),400,(pipes[minx_index + 1].h + pipes[minx_index + 1].d/2));
      //       this.vision[0] = (pipes[minx_index + 1].posx - this.position.x)/800;
      //       this.vision[1] = (pipes[minx_index + 1].h - pipes[minx_index + 1].d/2)/800; // height of top pipe
      //       this.vision[2] = (pipes[minx_index + 1].h + pipes[minx_index + 1].d/2)/800; // height bottom pipe
      //       this.vision[3] = this.position.y/height;
    } else {
      stroke(0);
      //line(0,(pipes[minx_index].h - pipes[minx_index].d/2),400,(pipes[minx_index].h - pipes[minx_index].d/2));
      //strokeWeight(4);
      //line(0,(pipes[minx_index].h + pipes[minx_index].d/2),400,(pipes[minx_index].h + pipes[minx_index].d/2));
      this.vision[0] = (pipes[minx_index].posx - this.position.x) / 800; // distance to next pipe
      this.vision[1] = (pipes[minx_index].h - pipes[minx_index].d / 2) / 800; // height of top pipe
      this.vision[2] = (pipes[minx_index].h + pipes[minx_index].d / 2) / 800; // height bottom pipe
      this.vision[3] = (this.position.y) / 800; // players height
    } // else
  } //look

  think() {
    //get the output of nn
    this.action = []
    this.action[0] = 0;
    this.action = this.brain.output(this.vision);

    if (this.action[0] > 0.55) {
      this.flap();
    }
  } // think

  //for genetic algorithm
  calculateFitness() {
    this.fitness = this.score * this.score * this.score;
  } // calcitness


  //---------------------------------------------------------------------------------------------------------------------------------------------------------  
  mutate() {
    this.brain.mutate(globalMutationRate);
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------  
  //returns a clone of this player with the same brian
  clone() {
    var clone = new Player(150, 300);
    clone.brain = this.brain.clone();
    return clone;
  }


  //---------------------------------------------------------------------------------------------------------------------------------------------------------  
  crossover(parent2) {
    var child = new Player(150, 300);
    child.brain = this.brain.crossover(parent2.brain);
    return child;
  }

} // player