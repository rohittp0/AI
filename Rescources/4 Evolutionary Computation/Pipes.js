class Pipes {
    constructor() {
      this.posx = 800;
      this.w = 50;
      this.h = random(250,550);
      this.d = 150;
      this.speed = 10;
      
  
      } //constructor
      
      move(s) {
        this.posx = this.posx - s;
      // move
      }
      show() {
        if(showAll) {
          fill(0,255,0);
          rect(this.posx, 0, this.w, this.h - this.d / 2);
          rect(this.posx, this.h + this.d / 2, this.w, 800);
        }
      } //show
      
      
      offscreen() {
        if (this.posx < 0) {
          return true;
        } else {
          return false;
        } // else
        
      } // offscreen
      
    }