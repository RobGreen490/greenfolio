import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '../../../../routes/app-routes';
import { CanvasComponent } from '../../../global-pages/canvas/canvas.component';
import { Circle } from '../../../models/circle';
import { Projectile } from '../../../models/projectile';

@Component({
  selector: 'app-bubble-popper-page',
  standalone: true,
  imports: [CanvasComponent],
  templateUrl: './bubble-popper-page.component.html',
  styleUrl: './bubble-popper-page.component.css'
})
export class BubblePopperPageComponent implements AfterViewInit, OnInit, OnDestroy{
  @ViewChild('canvasComp') canvasComp!: CanvasComponent;
  @ViewChild('content') contentRef!: ElementRef<HTMLElement>;

  private resizeObserver?: ResizeObserver;
  private resizeHandler = () => this.resizeCanvasToContent();
  private escapeKeyHandler = (event: KeyboardEvent) => {
    if(event.key === 'Escape')
      this.escapeKeyHandlerFunction();
  };
  private buttonClickHandler = (event: MouseEvent) => {
    if(event.button === 0){
      this.buttonClickHandlerFunction(event);
    }
  };

  constructor(
    private router: Router
  ){}

  minRadius = 25;
  maxRadius = 100;
  circles: Circle[] = [];
  projectiles: Projectile [] = [];
  colorArray: string [] = [
    '#CCC7B9',
    '#EAF9D9',
    '#E2D4BA',
    '#AF7A6D',
    '#653239'
  ];

  dx: number = 0;
  dy: number = 0;

  // used to drawing the crosshair
  pointerSize = 10;
  xRadius = 0;


  expandCircles = false;
  circle2!: Circle;
  ngOnInit(): void {
    this.circle2 = new Circle(0, 0, 0, 0, this.minRadius, this.minRadius, this.maxRadius, 'blue', this.colorArray[Math.floor(Math.random() * this.colorArray.length)]);
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.escapeKeyHandler);
    window.removeEventListener('resize', this.resizeHandler);
    window.removeEventListener('click', this.buttonClickHandler);
    this.resizeObserver?.disconnect();
  }

  ngAfterViewInit(): void {
    this.resizeCanvasToContent();

    window.addEventListener('resize', this.resizeHandler);
    window.addEventListener('keydown', this.escapeKeyHandler);
    window.addEventListener('click', this.buttonClickHandler);

    this.resizeObserver = new ResizeObserver(() => {
      this.resizeCanvasToContent();
    });
    this.resizeObserver.observe(this.contentRef.nativeElement);
  }

  private resizeCanvasToContent(): void {
    if (!this.canvasComp || !this.contentRef)
      return;

    const width = window.innerWidth;
    const height = Math.max(window.innerHeight,this.contentRef.nativeElement.scrollHeight);

    this.canvasComp.resizeCanvas(width, height);
  }

  private escapeKeyHandlerFunction(): void {
    console.log("Returning to main menu..");
    this.router.navigate([AppRoutes.landingPage]);
  }

  private buttonClickHandlerFunction(event: MouseEvent): void{
    console.log("Shooting cannon..");
      this.fireProjectile(event, this.canvasComp.canvasRef.nativeElement.height);
  }

  draw = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    mouse: { x: number, y: number }
  ) => {
    // clear the canvas every time we start drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // drawing cannon
    this.mouseDrawCrossier(true, ctx, mouse);
    this.drawCannon(canvas.height, ctx, mouse);

    // drawing projectile if active
    if(this.projectiles.length > 0)
      this.projectiles.forEach((projectile, index) => {
        if (projectile.isActive) {
          projectile.x += projectile.dx;
          projectile.y += projectile.dy;

          ctx.beginPath();
          ctx.fillStyle = 'black';
          ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.closePath();

          // if the projectile isn't on screen, stop drawing projectile.
            if ( projectile.x < 0 || projectile.x > canvas.width || projectile.y < 0 || projectile.y > canvas.height)
              projectile.isActive = false;
            else
              // keep only the projectiles where isActive is true, throw away the rest.
              this.projectiles = this.projectiles.filter(p => p.isActive);
        }
      })

  }

  drawCannon(canvasHeight: number, ctx: CanvasRenderingContext2D, mouse: {x: number, y: number}): void{
    const cannonX = 20; // pivot point (center top of base)
    const cannonY = canvasHeight - 30;

    // draw the cannon base
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.rect(0, cannonY, 20, 50);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    // draw the cannon wheel
    ctx.beginPath();
    ctx.arc(15, canvasHeight - 25, this.xRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();

    // save the cannon base and wheel
    ctx.save();

    // move to pivot
    ctx.translate(cannonX, cannonY);

    // rotate toward mouse
    const angle = Math.atan2(mouse.y - cannonY, mouse.x - cannonX);
    ctx.rotate(angle);


    // draw the barrel
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.rect(0, -5, 40, 10); // x, y, width, height
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }

  fireProjectile(mouse: { x: number, y: number }, canvasHeight: number): void {
    const cannonX = 20;
    const cannonY = canvasHeight - 30;
    const angle = Math.atan2(mouse.y - cannonY, mouse.x - cannonX);
    const speed = 12;
    const barrelLength = 40;

    const tempX = cannonX + Math.cos(angle) * barrelLength;
    const tempY = cannonY + Math.sin(angle) * barrelLength;
    const tempDx = Math.cos(angle) * speed;
    const tempDy = Math.sin(angle) * speed;
    const isActive = true;
    this.projectiles.push(new Projectile(
      tempX, tempY, tempDx, tempDy, 8, isActive
    ));
  }


  mouseDrawCrossier(isOn: boolean, ctx: CanvasRenderingContext2D, mouse: { x: number, y: number }): void {
    if (isOn) {
      ctx.beginPath();
      ctx.strokeStyle = 'red';

      // top-left to bottom-right
      ctx.moveTo(mouse.x - this.pointerSize, mouse.y - this.pointerSize);
      ctx.lineTo(mouse.x + this.pointerSize, mouse.y + this.pointerSize);

      // top-right to bottom-left
      ctx.moveTo(mouse.x + this.pointerSize, mouse.y - this.pointerSize);
      ctx.lineTo(mouse.x - this.pointerSize, mouse.y + this.pointerSize);

      ctx.stroke();
      ctx.closePath();

      // determine radius of the x with the Pythagorean theorem.
      this.xRadius = Math.sqrt(this.pointerSize * this.pointerSize + this.pointerSize * this.pointerSize);

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillStyle = 'transparent';
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, this.xRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    }
  }

}
