import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '../../../../routes/app-routes';
import { LandingPageNavBarComponent } from '../../layouts/landing-page-nav-bar/landing-page-nav-bar.component';
import { CanvasComponent } from '../../../global-pages/canvas/canvas.component';
import { Circle } from '../../../models/circle';
import { DrawableMode } from '../../../types/drawable-mode.type' ;

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [LandingPageNavBarComponent, CanvasComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements OnInit, AfterViewInit, OnDestroy{
  @ViewChild('canvasComp') canvasComp!: CanvasComponent;
  @ViewChild('content') contentRef!: ElementRef<HTMLElement>;

  private resizeObserver?: ResizeObserver;
  private resizeHandler = () => this.resizeCanvasToContent();

  constructor(
    private router: Router
  ){}


  ngOnInit(): void {
    switch(this.currentDrawable){
      default:
        break;
      case 'bouncing-circles':
        // generate and store the circles within an array to be drawn later.
        this.generateCircles();
        break;
    }
  }


  // can be used to change the background color of the canvas
  toggleCanvasBGC(color: string): void {
    const canvas = this.canvasComp.canvasRef.nativeElement;
    canvas.style.backgroundColor = color;
  }


  ngAfterViewInit(): void {
    // recolor the background of the canvas based on what is drawn
    switch(this.currentDrawable){
      case 'bouncing-circles':
        this.toggleCanvasBGC("#121318");
        break;
      case 'mouse-draw':
        this.toggleCanvasBGC("#b0b0b0");
        break;
      default:
        this.toggleCanvasBGC("#b0b0b0");
        break;
    }

    this.resizeCanvasToContent();

    window.addEventListener('resize', this.resizeHandler);
    this.resizeObserver = new ResizeObserver(() => {
      this.resizeCanvasToContent();
    });
    this.resizeObserver.observe(this.contentRef.nativeElement);
  }


  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeHandler);
    this.resizeObserver?.disconnect();
  }


  // used to resize the canvas on window resize by user.
  private resizeCanvasToContent(): void {
    if (!this.canvasComp || !this.contentRef) return;

    const width = window.innerWidth;
    const height = Math.max(
      window.innerHeight,
      this.contentRef.nativeElement.scrollHeight
    );

    this.canvasComp.resizeCanvas(width, height);
  }


  //** ALL DRAWING LOGIC=================================================================================
  // will be used to turn drawing on and off.
  currentDrawable: DrawableMode = 'bouncing-circles';
  draw = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    mouse: { x: number, y: number }
  ) => {
    switch(this.currentDrawable){
      case 'bouncing-circles':
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // drawing, updating, and checking bounds all happens within circle.update.
        this.circles.forEach((circle, index) => {
        // update the circle with new x, y cooridates, then draw the circle
        circle.update(canvas.width, canvas.height, ctx, mouse, this.gravityOn, true, true);
        });
        break;

      case 'mouse-draw':
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if(mouse.x > this.minRadius && mouse.y > this.minRadius)
          this.mouseDraw(ctx, mouse);
        break;

      default:
        break;
    }
  }
  //** ALL DRAWING LOGIC================================================================================>


  //** CIRCLES LOGIC=====================================================================================
  circles: Circle [] = [];
  minRadius = 0;
  maxRadius = 100;
  CirclesColorArray: string [] = ['#CCC7B9', '#EAF9D9', '#E2D4BA', '#AF7A6D', '#653239'];
  private generateCircles(){
    for(var i = 0; i < 400; i++){
      this.minRadius = Math.floor(Math.random() * 20 + 1);
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
          this.minRadius,
          // maxRadius (maximum size a circle can get)
          this.maxRadius,
          // outline
          'transparent',
          this.CirclesColorArray[Math.floor(Math.random() * this.CirclesColorArray.length)]
        )
      );
    }
  }
  // Turns on/off gravity for bouncing circles.
  gravityOn = false;
  turnOnGravity(): void{
    this.gravityOn = !this.gravityOn;
    if(!this.gravityOn){
      this.circles.forEach((circle, index) => {
        circle.dx = (Math.random() - 0.5) * 6
        circle.dy = (Math.random() - 0.5) * 8
      });
    }
    console.log(this.gravityOn);
  }
  //** CIRCLES LOGIC====================================================================================>


  //** MOUSE DRAW LOGIC==================================================================================
  mouseDraw (ctx: CanvasRenderingContext2D, mouse: { x: number, y: number }): void {
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, this.minRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'red';
    ctx.stroke();
  }
  //** MOUSE DRAW LOGIC=================================================================================>


  // https://unsplash.com/@bennieray
  employeeManagementBackground = 'assets/images/landing-website-images/employee-management-photo.jpg';

  // https://unsplash.com/@photowolf
  worldMapBackground = 'assets/images/landing-website-images/world-map-photo.jpg';

  bubblePopperBackground = 'assets/images/landing-website-images/bubble-popper-photo.png';


  //** ROUTING LOGIC=====================================================================================
  // Employee Management Website
  goToEmployeeManagement() {
    this.router.navigate([AppRoutes.employeeManagement]);
  }

  // World Map Website
  goToWorldMap(){
    this.router.navigate([AppRoutes.worldMap]);
  }

  goToBubblePopper(){
    this.router.navigate([AppRoutes.bubblePopper]);
  }
  //** ROUTING LOGIC====================================================================================>
}
