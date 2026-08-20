import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MainNavBarComponent } from '@layouts';
import { AppRoutes } from '@routes';
import { CanvasComponent, BackgroundColorService, DrawHelperService } from '@canvas';
import { DrawableMode } from '@types';


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

  constructor(
    private router: Router,
    private backgroundColorService: BackgroundColorService,
    private drawHelperService: DrawHelperService
  ){}

  //** IMAGES FROM UNSPLASH=================================================================================>
  // https://unsplash.com/@bennieray
  employeeManagementBackground = 'assets/images/landing-website-images/employee-management-photo.jpg';

  // https://unsplash.com/@photowolf
  worldMapBackground = 'assets/images/landing-website-images/world-map-photo.jpg';

  bubblePopperBackground = 'assets/images/landing-website-images/bubble-popper-photo-v2.jpg';
  //** IMAGES FROM UNSPLASH=================================================================================>

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
  // used to resize the canvas on window resize or orientation change by user.
  private resizeCanvasToContent(): void {
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
  //** ALL DRAWING LOGIC================================================================================>
  //#endregion DRAWABLE METHODS & LOGIC──────────────────────────────────────────────────────────────────



  //#region BUTTONS──────────────────────────────────────────────────────────────────────────────────────
  //** BUTTONS===========================================================================================
  turnOnGravity(): void{
    this.gravityOn = this.drawHelperService.changeGravity(this.gravityOn);
  }
  //** BUTTONS===========================================================================================
  //#endregion BUTTONS───────────────────────────────────────────────────────────────────────────────────



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
