import { ElementRef, Injectable } from '@angular/core';
import { CanvasComponent, ResizeHelperService, BackgroundColorService, BouncingCirclesService } from '@canvas';
import { Circle, Wave } from '@canvas-renders';
import { DrawableMode } from '@types';

@Injectable({
  providedIn: 'root'
})
export class DrawHelperService {

  constructor(
    private bouncingCirclesService: BouncingCirclesService,
    private resizeHelperService: ResizeHelperService,
    private backgroundColorService: BackgroundColorService
  )
  { }

  //#region DRAWABLE VARIABLES───────────────────────────────────────────────────────────────────────────
  wave: Wave = new Wave();
  circles: Circle [] = this.bouncingCirclesService.generateCircles(400, 10, 100);
  //#endregion DRAWABLE VARIABLES────────────────────────────────────────────────────────────────────────


  resizeCanvasToContent(
    canvasComp: CanvasComponent,
    contentRef: ElementRef<HTMLElement>,
    currentDrawable: DrawableMode,
    lastIsMobile: boolean
  ): boolean{
    const result = this.resizeHelperService.resizeCanvasToContent(canvasComp, contentRef, currentDrawable, lastIsMobile);

    if(result?.shouldResetWave && currentDrawable === "sine-waves")
      this.wave = new Wave();

    return !lastIsMobile;
  }



  draw(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    mouse: {x: number, y: number },
    currentDrawable: DrawableMode,
    gravity: boolean
  ) : void {
    // These drawables call their own clearRect, the switch statement should not call clearRect for != drawables.
    if(currentDrawable !== 'sine-waves')
      ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch(currentDrawable){
      case 'sine-waves':
          this.wave.draw(ctx);
        break;

      case 'bouncing-circles':
          this.circles.forEach((circle, index) => {
          // update the circle with new x & y cooridates, then draw the circle
          circle.update(canvas.width, canvas.height, ctx, mouse, gravity, true, true);
          });
        break;

      case 'mouse-draw':
        if(mouse.x > 0 && mouse.y > 100)
          this.mouseDraw(ctx, mouse);
      break;

      case 'dark-canvas':
        this.backgroundColorService.toggleCanvasBGC(canvas, currentDrawable);
        break;

      default:
        break;
    }
  }



  //** MOUSE DRAW LOGIC==================================================================================
  mouseDraw (ctx: CanvasRenderingContext2D, mouse: { x: number, y: number }): void {
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 50, 0, Math.PI * 2);
    ctx.strokeStyle = 'red';
    ctx.stroke();
  }
  //** MOUSE DRAW LOGIC=================================================================================>




  //** CIRCLE GRAVITY CHANGER============================================================================
  changeGravity(gravity: boolean): boolean{
    gravity = !gravity;
    this.bouncingCirclesService.turnOnGravity(gravity);
    return gravity;
  }
  //** CIRCLE GRAVITY CHANGER===========================================================================>
}
