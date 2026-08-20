import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CanvasComponent, BackgroundColorService, DrawHelperService } from '@canvas';
import { DrawableMode } from '@types';


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
    private backgroundColorService: BackgroundColorService,
    private drawHelperService: DrawHelperService
  ){}



  //#region DRAWABLE VARIABLES───────────────────────────────────────────────────────────────────────────
  private resizeObserver?: ResizeObserver;
  // type in a different string for a different drawable effect.
  currentDrawable: DrawableMode = 'bouncing-circles';
  lastIsMobile = false;
  gravityOn = false;
  //#endregion DRAWABLE VARIABLES────────────────────────────────────────────────────────────────────────



  //#region ng-ANGULAR LIFECYCLE HOOKS───────────────────────────────────────────────────────────────────
  //** ngOnInit==========================================================================================
  ngOnInit(): void {

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
  //#endregion ng-Angular Lifecycle Hooks────────────────────────────────────────────────────────────────



  //#region DRAWABLE METHODS & LOGIC─────────────────────────────────────────────────────────────────────
  //** RESIZE WINDOW LOGIC===============================================================================
  private resizeCanvasToContent(): void {
    // store the boolean in result so we can reset the sine wave if necessary, and resize the canvas with the method used to determine the value.
    this.lastIsMobile = this.drawHelperService.resizeCanvasToContent(
      this.canvasComp,
      this.contentRef,
      this.currentDrawable,
      this.lastIsMobile
    );
  }
  //** RESIZE WINDOW LOGIC===============================================================================



  //** ALL DRAWING LOGIC=================================================================================
  draw = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    mouse: { x: number, y: number }
  ) => {
    this.drawHelperService.draw(
      ctx,
      canvas,
      mouse,
      this.currentDrawable,
      this.gravityOn
    );
  };
  //** ALL DRAWING LOGIC=================================================================================
  //#endregion DRAWABLE METHODS & LOGIC──────────────────────────────────────────────────────────────────



  //#region BUTTONS──────────────────────────────────────────────────────────────────────────────────────
  //** BUTTONS===========================================================================================
  turnOnGravity(): void{
    this.gravityOn = this.drawHelperService.changeGravity(this.gravityOn);
  }
  //** BUTTONS===========================================================================================
  //#endregion BUTTONS───────────────────────────────────────────────────────────────────────────────────



}
