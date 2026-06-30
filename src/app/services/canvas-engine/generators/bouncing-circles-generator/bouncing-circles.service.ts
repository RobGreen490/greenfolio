import { Injectable } from "@angular/core";
import { Circle } from "@canvas-renders";

@Injectable({
  providedIn: 'root'
})
export class BouncingCirclesService{
  CirclesColorArray: string [] = ['#CCC7B9', '#EAF9D9', '#E2D4BA', '#AF7A6D', '#653239'];

  circles: Circle [] = [];
  minRadius = 0;
  radius = 0;
  maxRadius = 100;


  public generateCircles(numberOfCircles: number, minRadius: number, maxRadius: number){
    this.minRadius = minRadius;
    this.maxRadius = maxRadius;
    this.circles = [];
    for(var i = 0; i < numberOfCircles; i++){
      // this is just to initialize the circles, so determine a minimum radius.
      this.minRadius = Math.floor(Math.random() * 20 + 1);
      // then declare the starting radius of each circle to be that minimum radius.
      this.radius = this.minRadius;
      this.circles.push(
        new Circle(
          // mouse location
          //{mx: 0, my: 0},
          // x position
          Math.random() * (innerWidth - 2 * this.minRadius) + this.minRadius,
          // y position
          Math.random() * (innerHeight - 2 * this.minRadius) + this.minRadius,
          // x speed
          (Math.random() - 0.5) * 6,
          // y speed
          (Math.random() - 0.5) * 6,
          // minRadius (smallest the dot can get)
          this.minRadius,
          // the current radius
          this.radius,
          // maxRadius (maximum size a circle can get)
          maxRadius,
          // outline
          'transparent',
          this.CirclesColorArray[Math.floor(Math.random() * this.CirclesColorArray.length)]
        )
      );
    }
    return this.circles;
  }


  turnOnGravity(gravity: boolean){
    if(!gravity){
      this.circles.forEach((circle, index) => {
        circle.dx = (Math.random() - 0.5) * 6
        circle.dy = (Math.random() - 0.5) * 8
      });
    }
    console.log(gravity);
  }
}
