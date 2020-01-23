// used CodeBullet's Dino Processing code and
// Dan Shiffman's toy nn
// as reference when making this class

class NeuralNet {
    constructor(numINodes, numHNodes, numONodes) {
      this.i_nodes = numINodes;
      this.h_nodes = numHNodes;
      this.o_nodes = numONodes;
      
      this.weight_ih = new Matrix(this.h_nodes, this.i_nodes + 1);
      this.weight_hh = new Matrix(this.h_nodes, this.h_nodes + 1);
      this.weight_ho = new Matrix(this.o_nodes, this.h_nodes + 1);
      
      this.weight_ih.randomize();
      this.weight_hh.randomize();
      this.weight_ho.randomize();
      
    } // constructor
    
    output(inputs_array) {
      var inputs = this.weight_ih.fromArray(inputs_array);
      var inputBias = inputs.addBias();
      var hiddenInputs = this.weight_ih.dot(inputBias);
      var hiddenOutputs = hiddenInputs.activate();
      var hiddenOutputsBias = hiddenOutputs.addBias();
      var hiddenInputs2 = this.weight_hh.dot(hiddenOutputsBias);
      var hiddenOutputs2 = hiddenInputs2.activate();
      var hiddenOutputs2Bias = hiddenOutputs2.addBias();
      var hiddenOutputInputs = this.weight_ho.dot(hiddenOutputs2Bias);
      var outputs = hiddenOutputInputs.activate();
      return outputs.toArray();
    }
    
    mutate(mr) {
      this.weight_ih.mutate(mr);
      this.weight_hh.mutate(mr);
      this.weight_ho.mutate(mr);
    }
    
    crossover(parent) {
      var child = new NeuralNet(inputNodes,hiddenNodes,outputNodes);
      child.weight_ih = this.weight_ih.crossover(parent.weight_ih);
      child.weight_hh = this.weight_hh.crossover(parent.weight_hh);
      child.weight_ho = this.weight_ho.crossover(parent.weight_ho);
      return child;
    }
    
    clone() {
      var clone = new NeuralNet(inputNodes,hiddenNodes,outputNodes);
      clone.weight_ih = this.weight_ih.clone();
      clone.weight_hh = this.weight_hh.clone();
      clone.weight_ho = this.weight_ho.clone();
  
      return clone;
    } // clone
    
  } // nn