import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '../../../../routes/app-routes';
import { LandingPageNavBarComponent } from '../../layouts/landing-page-nav-bar/landing-page-nav-bar.component';
import { CanvasComponent } from '../../../global-pages/canvas/canvas.component';
import { Circle } from '../../../models/circle';
import { DrawableMode } from '../../../types/drawable-mode.type' ;
import { BouncingCirclesService } from '../../../services/bouncingCirclesService';
import { BackgroundColorService } from '../../../services/backgroundColorService';
import { Wave } from '../../../models/wave';

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
    private router: Router,
    private bouncingCirclesService: BouncingCirclesService,
    private backgroundColorService: BackgroundColorService
  ){
  }

  // review 'DrawableMode' to see the different types of strings to use for drawables.
  currentDrawable: DrawableMode = 'sine-waves';
  ngOnInit(): void {
    switch(this.currentDrawable){
      default:
        break;
      case 'bouncing-circles':
        // generate and store the circles within an array to be drawn later.
        this.circles = this.bouncingCirclesService.generateCircles(400, 0, 100);
        break;
      case 'sine-waves':
        //not really necessary but for now I'll keep this switch here.
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
    const newBackgroundColor = this.backgroundColorService.determineBackgroundColor(this.currentDrawable);
    this.toggleCanvasBGC(newBackgroundColor);

    // initialize the size of the canvas.
    this.resizeCanvasToContent();

    // add an event listener that changes the canvas size based on the new size of the window.
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

    if(this.currentDrawable == 'sine-waves')
      this.wave = new Wave();

    const width = window.innerWidth;
    const height = Math.max(
      window.innerHeight,
      this.contentRef.nativeElement.scrollHeight,
      this.contentRef.nativeElement.clientHeight
    );

    this.canvasComp.resizeCanvas(width, height);


  }


  //** ALL DRAWING LOGIC=================================================================================
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
        if(mouse.x > 0 && mouse.y > 100)
          this.mouseDraw(ctx, mouse);
        break;

      case 'sine-waves':
        this.wave.draw(ctx);
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
  //** ROUTING LOGIC====================================================================================>
}
