export class Dot{
  constructor(
    // starting location of the x axis
    public sx: number,
    // starting location of the y axis
    public sy: number,

    // will be used to reverse the direction of the dots
    public maxx: boolean,
    public maxy: boolean,

    // current location of x
    public x: number,
    // current location of y
    public y: number,

    // horizontal velocity of the moving dot
    public dx: number,
    // vertical velocity of the moving dot
    public dy: number,

    public minRadius: number,
    // the distance from the center of the dot to ring of the dot
    public radius: number,
    public maxRadius: number,

    public currentRed: number = 155,
    public maxRedReached: boolean = false,

    public currentBlue: number = 155,
    public maxBlueReached: boolean = false,

    public currentGreen: number = 255,
    public maxGreenReached: boolean = false,

    public transparency: number = .8,
    public fillColor: string = `rgba(${currentRed}, ${currentBlue}, ${currentGreen}, ${transparency})`
        //public strokeColor: string = 'black',
  ){}

  draw(ctx: CanvasRenderingContext2D): void{
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.strokeStyle = this.fillColor;
    ctx.fillStyle = this.fillColor;
    ctx.stroke();
    ctx.fill();
  }

    dotUpdate(
    canvasWidth: number,
    canvasHeight: number,
    ctx: CanvasRenderingContext2D,
    mouseLocation: { x: number, y: number}
  ): void {
    this.dotMouseHover(canvasWidth, canvasHeight, mouseLocation);
    this.draw(ctx);
  }

  dotMouseHover(
    canvasWidth: number,
    canvasHeight: number,
    mouseLocation: {x: number, y:number},): void
    {
      // get the distance in a circular pattern to change the colors and move the dots left to right.
      const distanceSquared = (mouseLocation.x - this.x) ** 2 + (mouseLocation.y - this.y) ** 2;
      if(distanceSquared < 80 ** 2)
      {
        // move the dots left to right
        if(this.x <= (this.sx + 4) && !this.maxx)
        {
          this.x += this.dx;
          if(this.x >= this.sx + 4)
            this.maxx = true;
        }
        else
        {
          this.x -= this.dx;
          if(this.x < (this.sx - 4))
            this.maxx = false;
        }


        // make the dot grow larger (up to the max radius)
        if(this.radius < this.maxRadius)
          this.radius += .2;


        // red color change
        if(this.currentRed < 255 && !this.maxRedReached)
        {
          this.currentRed += 5;
          if(this.currentRed >= 255)
            this.maxRedReached = true;
        }
        else{
          this.currentRed -= 5;
          if(this.currentRed <= 0)
            this.maxRedReached = false;
        }


        // blue color
        if(this.currentBlue < 255 && !this.maxBlueReached)
          this.currentBlue += 1;
        if(this.currentBlue >= 255)
          this.maxBlueReached = true;
        else{
          this.currentBlue -= 1;
          if(this.currentBlue <= 0)
            this.maxBlueReached = false;
        }


        /*
          // green color
          if(this.currentGreen < 255 && !this.maxGreenReached)
          {
            this.currentGreen += 1;
            if(this.currentGreen >= 255)
              this.maxGreenReached = true;
          }
          else{
            this.currentGreen -= 1;
            if(this.currentGreen <= 0)
              this.maxGreenReached = false;
          }
        */


      this.fillColor = `rgba(${this.currentRed}, ${this.currentBlue}, ${this.currentGreen}, ${this.transparency})`;
      //console.log(`Current rbg (${this.currentRed}, ${this.currentBlue}, ${this.currentGreen})`);
      }
      else {
        // no mouse on circle, radius is returning to normal size if radius > minRadius
        if (this.minRadius < this.radius )
          this.radius -= .2;

        // returning red to normal color (gray)
        if(this.currentRed !== 155){
          if(this.currentRed > 155)
            this.currentRed -= 5;
          else if(this.currentRed < 155)
            this.currentRed += 5
        }
          else this.maxRedReached = false;

        // returning blue to normal color (gray)
        if(this.currentBlue !== 155){
          if(this.currentBlue > 155)
            this.currentBlue -= 1;
          else if(this.currentBlue < 155)
            this.currentBlue += 1;
        }
        else this.maxBlueReached = false;

        /*
        // returning green to normal color (gray)
        if(this.currentGreen !== 155){
          if(this.currentGreen > 155)
            this.currentGreen -= 1;
          else if(this.currentGreen < 155)
            this.currentGreen += 1;
        }
        else
          this.maxGreenReached = false;
        */

        // return the circles to their original location.
        if(this.x !== this.sx)
          if(this.x < this.sx)
            this.x += this.dx;
          else
            this.x -= this.dx;


        this.fillColor = `rgba(${this.currentRed}, ${this.currentBlue}, ${this.currentGreen}, ${this.transparency})`
      }
    }
}
