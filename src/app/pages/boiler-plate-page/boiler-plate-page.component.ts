import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CanvasComponent, ResizeHelperService, BackgroundColorService, BouncingCirclesService } from '@canvas';
import { DrawableMode } from '@types';
import { Circle } from '@canvas-renders';

@Component({
  selector: 'app-boiler-plate-page',
  standalone: true,
  imports: [CanvasComponent],
  templateUrl: './boiler-plate-page.component.html',
  styleUrl: './boiler-plate-page.component.css'
})
export class BoilerPlatePageComponent implements OnInit, AfterViewInit ,OnDestroy{
  @ViewChild('canvasComp') canvasComp!: CanvasComponent;
  @ViewChild('content') contentRef!: ElementRef<HTMLElement>;

  constructor(
    private router: Router,
    private bouncingCirclesService: BouncingCirclesService,
    private backgroundColorService: BackgroundColorService,
    private resizeHelperService: ResizeHelperService
  ){}

  private resizeObserver?: ResizeObserver;

  // type in a different string for a different drawable effect.
  private currentDrawable: DrawableMode = 'bouncing-circles';
  private lastIsMobile = false;
  private circles: Circle [] = [];
  private gravityOn = false;



  //** ngOnInit==========================================================================================
  ngOnInit(): void {
    // If drawing something like circles, initialize it here at the start of the page.
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
    const canvas = this.canvasComp.canvasRef.nativeElement;
    this.backgroundColorService.toggleCanvasBGC(canvas, this.currentDrawable);

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
  private resizeCanvasToContent(): void {
    const result = this.resizeHelperService.resizeCanvasToContent(
      this.canvasComp,
      this.contentRef,
      this.currentDrawable,
      this.lastIsMobile
    );

    this.lastIsMobile = result!.isMobile;
    // if(result?.shouldResetWave)
    //   this.wave = new Wave();
  }
  //** RESIZE WINDOW LOGIC===============================================================================






  //** BUTTONS===========================================================================================

  turnOnGravity(): void{
    this.gravityOn = !this.gravityOn;
    this.bouncingCirclesService.turnOnGravity(this.gravityOn);
  }
  //** BUTTONS===========================================================================================



  //** ALL DRAWING LOGIC=================================================================================
  draw = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    mouse: { x: number, y: number }
  ) => {
    if(this.currentDrawable != 'sine-waves')
      ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch(this.currentDrawable){
      case 'sine-waves':
      break;

      case 'bouncing-circles':
        this.circles.forEach((circle, index) => {
        circle.update(canvas.width, canvas.height, ctx, mouse, this.gravityOn, true, true);
        });
      break;

      case 'mouse-draw':
      break;

      default:
      break;
    }
  }
}
