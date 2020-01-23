class Population {
    constructor(pop_size) {
       this.pop_size = pop_size;
       this.players = [];
       this.gen = 0;
       this.best_player = new Player(150,300);
       this.bestPlayerNo = 0;
       this.best_score = 0;
       this.allTimeHigh = 0;
       this.numAlive = 0;
       //this.players = new Player[this.pop_size];
  
      for(var i = 0; i < this.pop_size; i++) {
        var tempplayer = new Player(150,300);
        //print(i);
        this.players[i] = tempplayer;
      }
    }
    
    updateAlive() {
      for(var i = 0; i < this.pop_size; i++) {
        if (this.players[i].dead == false) {
          lowest_alive = i;
          break;
        }
      }
      this.numAlive = 0;
      playersAliveByIndex = [];
      for (var i = 0; i< this.pop_size; i++) {
        if (!this.players[i].dead) {
          playersAliveByIndex.push(i);
          this.players[i].look();//get inputs for brain 
          this.players[i].think();//use outputs from neural network
          this.players[i].move();//move the player according to the outputs from the neural network
          this.players[i].show();
          this.players[i].checkHit();
          this.numAlive++;
        }
      playersAlive = this.numAlive;
      }
    } // updateAlive
      
  
    addEndingPoints() {
       for(var i = 0; i<this.pop_size; i++) {
         this.players[i].score = this.players[i].score + floor((1 / abs(this.position.y - pipes[0].h) * 1000));
       }
    }
    //------------------------------------------------------------------------------------------------------------------------------------------
    //sets the best player globally and for this gen
    setBestPlayer() {
      var max = 0;
      var maxIndex = 0;
      for (var i = 0; i < this.pop_size; i++) {
        if (this.players[i].fitness > max) {
          max = this.players[i].fitness;
          maxIndex = i;
        }
      }
      //print(maxIndex);
      this.bestPlayerNo = maxIndex;

      if (this.players[this.bestPlayerNo].score > this.best_score) {
        this.best_score = this.players[this.bestPlayerNo].score;
        this.allTimeHigh = this.best_score;
        this.best_player = this.players[this.bestPlayerNo].clone();
      }
    }
      
    done() {
      for(var i = 0; i < this.pop_size; i++) {
        if(!this.players[i].dead) {
          return false;
        }
      }
      return true;
    }

    naturalSelection() {
      var newPlayers = [];

      for(var i = 0; i < this.pop_size; i++) {
        var tempplayer = new Player(150,300);
        newPlayers[i] = tempplayer;
      }

      this.setBestPlayer();//set which player is the best

      newPlayers[0] = this.players[this.bestPlayerNo].clone();//add the best player of this generation to the next generation without mutation

      for (var i = 1; i < this.pop_size; i++) {
        //for each remaining spot in the next generation
        if (i < this.pop_size / 2) {
          newPlayers[i] = this.selectPlayer().clone();//select a random player(based on fitness) and clone it
        } else {
          newPlayers[i] = this.selectPlayer().crossover(this.selectPlayer());
        }
        newPlayers[i].mutate(); //mutate it
      }
      //console.log(this.players[3].brain.weight_ih);
      for(var i = 0; i < this.pop_size; i++) {
        this.players[i] = newPlayers[i].clone();
      }
      //console.log(this.players[3].brain.weight_ih);
      this.gen+=1;
      print("gen: ",this.gen);
    }
    
    selectPlayer() {
      //this function works by randomly choosing a value between 0 and the sum of all the fitnesses
      //then go through all the players and add their fitness to a running sum and if that sum is greater than the random value generated that player is chosen
      //since players with a higher fitness function add more to the running sum then they have a higher chance of being chosen
  
  
      //calculate the sum of all the fitnesses
      var fitnessSum = 0;
      for (var i =0; i < this.pop_size; i++) {
        fitnessSum += this.players[i].fitness;
      }
      var rand = floor(random(fitnessSum));
      var runningSum = 0;
  
      for (var i = 0; i < this.pop_size; i++) {
        runningSum += this.players[i].fitness; 
        if (runningSum > rand) {
          return this.players[i];
        }
      }
      //unreachable code to make the parser happy
      return this.players[0];
    }
  
    //------------------------------------------------------------------------------------------------------------------------------------------
  
    //mutates all the players
    mutate() {
      for (var i =1; i<this.pop_size; i++) {
        this.players[i].mutate();
      }
    }
    //------------------------------------------------------------------------------------------------------------------------------------------
    
    //calculates the fitness of all of the players
    calculateFitness() {
      //print("pop calculating fitness");
      for (var i =0; i<this.pop_size; i++) {
        this.players[i].calculateFitness();
      }
    }
    
    
  }