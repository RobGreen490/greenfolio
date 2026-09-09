import { Injectable } from '@angular/core';
import { Dot } from '@canvas-renders';

@Injectable({
  providedIn: 'root'
})
export class DotsService {

  dots: Dot [] = [];
  minRadius = 0;
  radius = 0;
  maxRadius = 20;
  spacing = 20;

  public generateDots(canvasWidth: number, canvasHeight: number, minRadius: number, maxRadius: number){
    this.minRadius = minRadius;
    this.radius = minRadius;
    this.maxRadius = maxRadius;
    this.dots = [];
    for(let x = 0; x <= canvasWidth; x+= this.spacing){
      for(let y = 0; y <= canvasHeight; y+= this.spacing){
        this.dots.push(
          new Dot(
            x,
            y,
            false,
            false,
            x,
            y,
            // x speed
            2,
            // y speed
            (Math.random() - 0.5) * 2,
            this.minRadius,
            this.radius,
            maxRadius
          )
        )
      }
    }
    return this.dots;
  }
}
