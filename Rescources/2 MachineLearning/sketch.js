let model;
let targetLabel = 'C';
// let trainingData = [];

let state = 'collection';

let notes = {
  C: 261.6256,
  D: 293.6648,
  E: 329.6276
};

let env, wave;

function setup() {
  //Initiation of P5 canvas
  createCanvas(1000, 600);
  background(200);

  //Setting up P5 sound libreary
  env = new p5.Envelope();
  env.setADSR(0.05, 0.1, 0.5, 1);
  env.setRange(1.2, 0);

  wave = new p5.Oscillator();

  wave.setType('sine');
  wave.start();
  wave.freq(440);
  wave.amp(env);

  //Creation of Neural Network
  let options = {
    inputs: ['x', 'y'],
    outputs: ['label'],
    task: 'classification',
    debug: 'true'
  };
  model = ml5.neuralNetwork(options);
}

function keyPressed() {
  if (key == 't') {
    state = 'training';
    console.log('starting training');
    //Start training of the model.
    model.normalizeData();
    let options = {
      epochs: 200
    };
    model.train(options, whileTraining, () => {
      console.log('finished training.');
      state = 'prediction';
    });
  } else {
    targetLabel = key.toUpperCase();
  }
}

function whileTraining(epoch, loss) {
  console.log(epoch);
}

function mousePressed() {
  let inputs = {
    x: mouseX,
    y: mouseY
  };

  //Data collection
  if (state == 'collection') {
    let target = {
      label: targetLabel
    };
    model.addData(inputs, target);
    stroke(0);
    noFill();
    ellipse(mouseX, mouseY, 24);
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(targetLabel, mouseX, mouseY);

    wave.freq(notes[targetLabel]);
    env.play();
  }
  //Result Prediction 
  else if (state == 'prediction') {
    model.classify(inputs, gotResults);
  }
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  console.log(results);
  stroke(0);
  fill(0, 0, 255, 100);
  ellipse(mouseX, mouseY, 24);
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  let label = results[0].label;
  text(label, mouseX, mouseY);
  wave.freq(notes[label]);
  env.play();
}