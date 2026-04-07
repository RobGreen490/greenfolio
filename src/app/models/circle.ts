export class Circle{
  constructor(
    // mouse location (may be a number, may be null)
    // public mouseLocation: {mx: number | null, my: number | null},
    // starting location of the x axis (random * (max - min) + min)
    public x: number,
    // starting location of the y axis (random * (max - min) + min)
    public y: number,
    // horizontal velocity of the moving circle
    public dx: number,
    // vertical velocity of the moving circle
    public dy: number,
    // the distance from the center of the circle to ring of the circle
    public minRadius: number,
    public radius: number,
    public maxRadius: number,
    public strokeColor: string = 'black',
    public fillColor: string = 'rgba(255, 0, 0, 0.5)'
  ){}

  draw(ctx: CanvasRenderingContext2D): void{
    // console.log("Circle.draw()", this.x, this.y, this.radius, this.strokeColor);

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.strokeStyle = this.strokeColor;
    ctx.fillStyle = this.fillColor;
    ctx.stroke();
    ctx.fill();
  }

  // will be used to update the speed of the circle
  update(
    canvasWidth: number,
    canvasHeight: number,
    ctx: CanvasRenderingContext2D,
    mouseLocation: { x: number, y: number},
    gravityOn: boolean,
    expandCircles: boolean
  ): void {
    // console.log("drawing circle..");
    // gravity is off, balls floating in space
    if(!gravityOn){
      // reverse circle direction when they hit the edge of the page wall.
      this.reverseCircleDirection(canvasWidth, canvasHeight);
      // if the page is resized, move the circle within bounds
      this.clampToBounds(canvasWidth, canvasHeight);
    } // gravity on, implement gravity
    else{
      this.gravityAffect(canvasWidth, canvasHeight);
    }

    // expanding the circle on mouse hover if expandCircles is true
    if(expandCircles){
      console.log("Expanding..");
      this.expandCircleOnMouseHover(canvasWidth, canvasHeight, mouseLocation);
    }

    // draw the circle
    this.draw(ctx);
  }

  gravity = 1;
  friction = 0.8;
  // applies gravity, movement, collision, and friction to the circle
  gravityAffect(canvasWidth: number, canvasHeight: number): void {

    // gravity constantly increases downward (y) velocity
    this.dy += this.gravity;

    // apply current velocity to position (move the circle)
    this.x += this.dx;
    this.y += this.dy;

    // ----- FLOOR COLLISION -----
    // if the bottom of the circle goes past the canvas height
    if (this.y + this.radius > canvasHeight) {
      // snap the circle back to sit exactly on the floor
      this.y = canvasHeight - this.radius;
      // reverse vertical direction and reduce energy (bounce with friction)
      this.dy = -this.dy * this.friction;

       // if the bounce is very small, stop it completely to prevents jitter
      if (Math.abs(this.dy) < 0.5) {
        this.dy = 0;
      }
    }

    // ----- RIGHT WALL COLLISION -----
    // if the circle hits the right wall
    if (this.x + this.radius > canvasWidth) {
      // snap it back inside the boundary
      this.x = canvasWidth - this.radius;
      // reverse horizontal direction and reduce energy
      this.dx = -this.dx * this.friction;
    }

    // ----- LEFT WALL COLLISION -----
    // if the circle hits the left wall
    if (this.x - this.radius < 0) {
      // snap it back inside the boundary
      this.x = this.radius;
      // reverse horizontal direction and reduce energy
      this.dx = -this.dx * this.friction;
    }

    // ----- HORIZONTAL FRICTION -----
    // slowly reduce sideways motion over time (like surface friction)
    this.dx *= 0.99;

    // if horizontal speed becomes extremely small, stop it completely
    if (Math.abs(this.dx) < 0.01) {
      this.dx = 0;
    }
  }

  // if a circle hits the bounds of the canvas walls, reverse the direction of the velocity.
  reverseCircleDirection(canvasWidth: number,canvasHeight: number): void{
    if (this.x + this.minRadius >= canvasWidth || this.x - this.minRadius <= 0)
      this.dx = -this.dx;
    this.x += this.dx;
    if (this.y + this.minRadius >= canvasHeight || this.y - this.minRadius <= 0)
      this.dy = -this.dy;
    this.y += this.dy;
  }

  // expands the radius of the circle when mouse is hovered over circles.
  expandCircleOnMouseHover(
    canvasWidth: number,
    canvasHeight: number,
    mouseLocation: {x: number, y:number},): void{
  // if a circle is within 50 pixels from the mouse, and radius is less than 100px, make the circle grow.
    if (
      Math.abs(mouseLocation.x - this.x) < 50 &&
      Math.abs(mouseLocation.y - this.y) < 50 &&
      this.radius < this.maxRadius
    )
      this.radius += 1;
    else { // no mouse on circle, radius is returning to normal size
      if (this.minRadius < this.radius )
        this.radius -= 1;
    }
  }

  // will be used to place circles back within the bounds of the canvas if it is resized.
  clampToBounds(canvasWidth: number, canvasHeight: number): void {
    // if circle is to the left of page bound, bring it back
    if(this.x - this.radius < 0)
      this.x = this.radius;

    // if circle is to the right of page bound, bring it back
    if(this.x + this.radius > canvasWidth)
      this.x = canvasWidth - this.radius;

    // if the circle is above the page bound, bring it back
    if(this.y - this.radius < 0)
      this.y = this.radius;

    // if the circle is below the page bound, bring it back
    if(this.y + this.radius > canvasHeight)
      this.y = canvasHeight - this.radius;
  }


}
