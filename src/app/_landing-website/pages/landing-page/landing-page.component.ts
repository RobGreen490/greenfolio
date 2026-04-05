import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '../../../../routes/app-routes';
import { LandingPageNavBarComponent } from '../../layouts/landing-page-nav-bar/landing-page-nav-bar.component';
import { CanvasComponent } from '../../../global-pages/canvas/canvas.component';
import { Circle } from '../../../models/circle';

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

  // radius of the circle
  minRadius = 0;
  maxRadius = 100;
  circles: Circle [] = [];
  colorArray: string [] = [
    '#CCC7B9',
    '#EAF9D9',
    '#E2D4BA',
    '#AF7A6D',
    '#653239'
  ];

  ngOnInit(): void {
    for(var i = 0; i < 800; i++){
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
          (Math.random() - 0.5) * 4,
          // y speed
          (Math.random() - 0.5) * 4,
          // minRadius (smallest the dot can get)
          this.minRadius,
          // the current radius
          this.minRadius,
          // maxRadius (maximum size a circle can get)
          this.maxRadius,
          // outline
          'transparent',
          this.colorArray[Math.floor(Math.random() * this.colorArray.length)]
        )
      );
    }
  }

  ngAfterViewInit(): void {
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


  private resizeCanvasToContent(): void {
    if (!this.canvasComp || !this.contentRef) return;

    const width = window.innerWidth;
    const height = Math.max(
      window.innerHeight,
      this.contentRef.nativeElement.scrollHeight
    );

    this.canvasComp.resizeCanvas(width, height);
  }

  // will be used to turn drawing on and off.
  isMouseDrawOn = false;
  gravityOn = false;
  draw = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    mouse: { x: number, y: number }
  ) => {
    // if we're not drawing normal lines, do circles
    if(!this.isMouseDrawOn){
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // drawing, updating, and checking bounds all happens within circle.update.
      this.circles.forEach((circle, index) => {
        // update the circle with new x, y cooridates, then draw the circle
        circle.update(canvas.width, canvas.height, ctx, mouse, this.gravityOn);
      });
    }
    else{
      //ctx.clearRect(0, 0, canvas.width, canvas.height);
      if(mouse.x > this.minRadius && mouse.y > this.minRadius)
        this.mouseDraw(this.isMouseDrawOn, ctx, mouse);
    }

  }

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

  mouseDraw (isOn: boolean, ctx: CanvasRenderingContext2D, mouse: { x: number, y: number }): void {
    if(isOn){
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, this.minRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'red';
      ctx.stroke();
    }
  }

  // https://unsplash.com/@bennieray
  employeeManagementBackground = 'assets/images/landing-website-images/employee-management-photo.jpg';

  // https://unsplash.com/@photowolf
  worldMapBackground = 'assets/images/landing-website-images/world-map-photo.jpg';

  // Employee Management Website
  goToEmployeeManagement() {
    this.router.navigate([AppRoutes.employeeManagement]);
  }

  // World Map Website
  goToWorldMap(){
    this.router.navigate([AppRoutes.worldMap]);
  }
}
