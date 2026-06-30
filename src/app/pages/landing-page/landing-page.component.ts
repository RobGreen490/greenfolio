import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MainNavBarComponent } from '@layouts';
import { AppRoutes } from '@routes';
import { CanvasComponent, ResizeHelperService, BackgroundColorService, BouncingCirclesService } from '@canvas';
import { DrawableMode } from '@types';
import { Circle, Wave } from '@canvas-renders';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [MainNavBarComponent, CanvasComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements OnInit, AfterViewInit, OnDestroy{
  @ViewChild('canvasComp') canvasComp!: CanvasComponent;
  @ViewChild('content') contentRef!: ElementRef<HTMLElement>;


  private resizeObserver?: ResizeObserver;
  private lastIsMobile = false;
  // type in a different string for a different drawable effect.
  currentDrawable: DrawableMode = 'sine-waves';


  constructor(
    private router: Router,
    private bouncingCirclesService: BouncingCirclesService,
    private backgroundColorService: BackgroundColorService,
    private resizeHelperService: ResizeHelperService
  ){}


  //** ngOnInit==========================================================================================
  ngOnInit(): void {
    switch(this.currentDrawable){
      case 'bouncing-circles':
        // generate and store the circles within an array to be drawn later.
        this.circles = this.bouncingCirclesService.generateCircles(400, 0, 100);
        break;
    }
  }
  //** ngOnInit==========================================================================================


  //** ngAfterViewInit===================================================================================
  ngAfterViewInit(): void {
    // recolor the background of the canvas based on what is drawn
    const canvas = this.canvasComp.canvasRef.nativeElement;
    this.backgroundColorService.toggleCanvasBGC(canvas, this.currentDrawable);

    // when the page is resized, or the orientation of the screen is changed, run risizeCanvasToContent().
    this.resizeObserver = new ResizeObserver(() => {
      this.resizeCanvasToContent();
    });
    this.resizeObserver.observe(this.contentRef.nativeElement);
  }
  //** ngAfterViewInit===================================================================================


  //** ngOnDestroy=======================================================================================
  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }
  //** ngOnDestroy=======================================================================================


  //** RESIZE WINDOW LOGIC===============================================================================
  // used to resize the canvas on window resize or orientation change by user.
  private resizeCanvasToContent(): void {
    console.log("resize running..");
    const result = this.resizeHelperService.resizeCanvasToContent(
      this.canvasComp,
      this.contentRef,
      this.currentDrawable,
      this.lastIsMobile
    );

    this.lastIsMobile = result!.isMobile;
    if(result?.shouldResetWave)
      this.wave = new Wave();
  }
  //** RESIZE WINDOW LOGIC===============================================================================


  //** ALL DRAWING LOGIC=================================================================================
  draw = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    mouse: { x: number, y: number }
  ) => {
    // These drawables call their own clearRect, the switch statement should not call clearRect for != drawables.
    if(this.currentDrawable != 'sine-waves')
      ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch(this.currentDrawable){
      case 'sine-waves':
        this.wave.draw(ctx);
      break;

      case 'bouncing-circles':
        // drawing, updating, and checking bounds all happens within circle.update.
        this.circles.forEach((circle, index) => {
        // update the circle with new x & y cooridates, then draw the circle
        circle.update(canvas.width, canvas.height, ctx, mouse, this.gravityOn, true, true);
        });
      break;

      case 'mouse-draw':
        if(mouse.x > 0 && mouse.y > 100)
          this.mouseDraw(ctx, mouse);
      break;

      default:
      break;
    }
  }
  //** ALL DRAWING LOGIC================================================================================>


  //** CIRCLES LOGIC=====================================================================================
  circles: Circle [] = [];

  // html button for gravity (turns on and off gravity when pressed)
  gravityOn = false;
  turnOnGravity(): void{
    this.gravityOn = !this.gravityOn;
    this.bouncingCirclesService.turnOnGravity(this.gravityOn);
  }
  //** CIRCLES LOGIC====================================================================================>


  //** WAVE LOGIC====================================================================================>
  wave: Wave = new Wave();
  //** WAVE LOGIC====================================================================================>


  //** MOUSE DRAW LOGIC==================================================================================
  mouseDraw (ctx: CanvasRenderingContext2D, mouse: { x: number, y: number }): void {
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 50, 0, Math.PI * 2);
    ctx.strokeStyle = 'red';
    ctx.stroke();
  }
  //** MOUSE DRAW LOGIC=================================================================================>


  //** IMAGES FROM UNSPLASH=================================================================================>
  // https://unsplash.com/@bennieray
  employeeManagementBackground = 'assets/images/landing-website-images/employee-management-photo.jpg';

  // https://unsplash.com/@photowolf
  worldMapBackground = 'assets/images/landing-website-images/world-map-photo.jpg';

  bubblePopperBackground = 'assets/images/landing-website-images/bubble-popper-photo-v2.jpg';
  //** IMAGES FROM UNSPLASH=================================================================================>


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

  goToVisit(){
    this.router.navigate([AppRoutes.visitManagement])
  }
  //** ROUTING LOGIC====================================================================================>
}
