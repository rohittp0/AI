// Daniel Shiffman's matrix.js file
// from the Coding Train's Flappy Bird NeuroEvolution coding challange
// https://thecodingtrain.com/CodingChallenges/100.5-neuroevolution-flappy-bird.html

// let m = new Matrix(3,2);


class Matrix {
    constructor(rows, cols) {
      this.rows = rows;
      this.cols = cols;
      this.data = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
    }
  
    copy() {
      let m = new Matrix(this.rows, this.cols);
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          m.data[i][j] = this.data[i][j];
        }
      }
      return m;
    }
  
    fromArray(arr) {
      //print("from array");
      return new Matrix(arr.length, 1).map((e, i) => arr[i]);
    }
  
    static subtract(a, b) {
      if (a.rows !== b.rows || a.cols !== b.cols) {
        console.log('Columns and Rows of A must match Columns and Rows of B.');
        return;
      }
      
  
      // Return a new Matrix a-b
      return new Matrix(a.rows, a.cols)
        .map((_, i, j) => a.data[i][j] - b.data[i][j]);
    }
  
    addBias() {
      let m = new Matrix(this.rows + 1, 1);
      for (let i = 0; i < this.rows; i++) {
          m.data[i][0] = this.data[i][0];
        }
      m.data[this.rows][0] = 1;
      return m;
    }
    
    dot(a) {
      let result = new Matrix(this.rows,a.cols);
      if(this.cols == a.rows) {
        for(let i = 0; i < this.rows; i++) {
          for(let j = 0; j < a.cols; j++) {
            var sum = 0;
            for(let k = 0; k < this.cols; k++) {
              sum += this.data[i][k] * a.data[k][j];
            }
            result.data[i][j] = sum;
          }
        }
      }
      //print("dot result " + result.data);
      return result;
    }
    
    mutate(mutationRate) {
      for(var i = 0; i < this.rows; i++) {
        for(var j = 0; j < this.cols; j++) {
          var rand = random(1);
          if(rand < mutationRate) {
            this.data[i][j] += randomGaussian()/5;
          
            
            if(this.data[i][j] > 1) {
              this.data[i][j] = 1;
            }
            if(this.data[i][j] < -1) {
              this.data[i][j] = -1;
            }
          }
        }
      }
    }
    
    crossover(partner) {
      var child = new Matrix(this.rows,this.cols);
      var randC = floor(random(this.cols));
      var randR = floor(random(this.rows));
      for(var i = 0; i < this.rows; i++) {
        for(var j = 0; j < this.cols; j++) {
          if ((i< randR)|| (i==randR && j<=randC)) {
            child.data[i][j] = this.data[i][j]; // should be this.data?
          } else { //if after the random point then copy from the parameter array
            child.data[i][j] = partner.data[i][j];
          }
        }
      }
      return child;
    }
    
    clone() {
      var clone = new Matrix(this.rows, this.cols);
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.cols; j++) {
          clone.data[i][j] = this.data[i][j];
        }
      }
      return clone;
    }
    
    toArray() {
      let arr = [];
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          arr.push(this.data[i][j]);
        }
      }
      return arr;
    }
  
    randomize() {
      return this.map(e => Math.random() * 2 - 1);
    }
  
    add(n) {
      if (n instanceof Matrix) {
        if (this.rows !== n.rows || this.cols !== n.cols) {
          console.log('Columns and Rows of A must match Columns and Rows of B.');
          return;
        }
        return this.map((e, i, j) => e + n.data[i][j]);
      } else {
        return this.map(e => e + n);
      }
    }
    
    activate() {
      //print("Called activate");
      //print("mathe");
      //print(Math.E);
      var n = new Matrix(this.rows,this.cols);
      for(var i = 0; i<this.rows; i++) {
        for (var j = 0; j< this.cols; j++) {
          n.data[i][j] = (1 / (1 + Math.pow(Math.E,-this.data[i][j])));
        }
      }
      return n;
     }
    
    static sigmoid(x) {
      var mathe = Math.E;
      //print("mathe")
      //print(mathe);
      var y = 1 / (1 + pow(mathe,-x));
      return y;
    }
    static transpose(matrix) {
      return new Matrix(matrix.cols, matrix.rows)
        .map((_, i, j) => matrix.data[j][i]);
    }
  
  
    
    static multiply(a, b) {
      // Matrix product
      if (a.cols !== b.rows) {
        console.log('Columns of A must match rows of B.');
        return;
      }
  
      return new Matrix(a.rows, b.cols).map((e, i, j) => {
          // Dot product of values in col
          let sum = 0;
          for (let k = 0; k < a.cols; k++) {
            sum += a.data[i][k] * b.data[k][j];
          }
          return sum;
        });
    }
  
    multiply(n) {
      if (n instanceof Matrix) {
        if (this.rows !== n.rows || this.cols !== n.cols) {
          console.log('Columns and Rows of A must match Columns and Rows of B.');
          return;
        }
  
        // hadamard product
        return this.map((e, i, j) => e * n.data[i][j]);
      } else {
        // Scalar product
        return this.map(e => e * n);
      }
    }
  
    map(func) {
      // Apply a function to every element of matrix
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          let val = this.data[i][j];
          this.data[i][j] = func(val, i, j);
        }
      }
      return this;
    }
  
    static map(matrix, func) {
      // Apply a function to every element of matrix
      return new Matrix(matrix.rows, matrix.cols)
        .map((e, i, j) => func(matrix.data[i][j], i, j));
    }
  
    print() {
      console.table(this.data);
      return this;
    }
  
    serialize() {
      return JSON.stringify(this);
    }
  
    static deserialize(data) {
      if (typeof data == 'string') {
        data = JSON.parse(data);
      }
      let matrix = new Matrix(data.rows, data.cols);
      matrix.data = data.data;
      return matrix;
    }
  }
  
  if (typeof module !== 'undefined') {
    module.exports = Matrix;
  }
  