import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CanvasComponent } from '../../../../../services/canvas-engine/canvas/canvas.component';
import { DrawableMode } from '../../../../../types/drawable-mode.type';
import { BackgroundColorService } from '../../../../../services/background-color-service/background-color.service';
import { ResizeHelperService } from '../../../../../services/resize-helper-service/resize-helper.service';
import { Circle } from '../../../../../services/canvas-renderers/circle';
import { BouncingCirclesService } from '../../../../../services/bouncingCirclesService';
import { User } from '../../../../../models/auth-models/user';
import { AuthService } from '../../../../../services/auth-service/auth.service';
import { MainNavBarComponent } from "../../../../../layouts/main-nav-bar/main-nav-bar.component";





@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, CanvasComponent, MainNavBarComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit, AfterViewInit ,OnDestroy{
  @ViewChild('canvasComp') canvasComp!: CanvasComponent;
  @ViewChild('content') contentRef!: ElementRef<HTMLElement>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private bouncingCirclesService: BouncingCirclesService,
    private backgroundColorService: BackgroundColorService,
    private resizeHelperService: ResizeHelperService
  ){}

  private resizeObserver?: ResizeObserver;

  user: User = {
    username: '',
    password: ''
  }

  showPassword: boolean = false;
  private errorMessage: string = '';

  // type in a different string for a different drawable effect.
  private currentDrawable: DrawableMode = 'bouncing-circles';
  private lastIsMobile = false;
  private gravityOn = false;



  //** ngOnInit==========================================================================================
  ngOnInit(): void {
    // If drawing something like circles, initialize it here at the start of the page.
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
  login() : void {
    console.log("Attemping login...");
    this.authService.login(this.user).subscribe({
      next: () => {
        console.log("successfully logged in.");
      },
      error: () => {
        console.log("error");
      }
    });
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
      break;

      case 'mouse-draw':
      break;

      default:
      break;
    }
  }
}
