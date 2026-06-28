import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CanvasComponent } from "../../../services/canvas-engine/canvas/canvas.component";
import { DrawableMode } from '../../../types/drawable-mode.type';
import { BackgroundColorService } from '../../../services/background-color-service/background-color.service';
import { ResizeHelperService } from '../../../services/resize-helper-service/resize-helper.service';
import { Circle } from '../../../services/canvas-renderers/circle';
import { BouncingCirclesService } from '../../../services/bouncingCirclesService';
import { DatePipe } from '@angular/common';
import { BrowserMultiFormatReader, Result } from '@zxing/library';
import { Visitor, createEmptyVisitor } from '../../../models/visit-management-models/visitor';
import { ScannerService } from '../../../services/scanner-services/scanner.service';
import { ParserService } from '../../../services/scanner-services/parser.service';
import { timestamp } from 'rxjs';
import { CameraService } from '../../../services/camera-services/camera.service';


@Component({
  selector: 'app-visit-management-home-page',
  standalone: true,
  imports: [CanvasComponent, DatePipe],
  templateUrl: './visit-management-home-page.component.html',
  styleUrl: './visit-management-home-page.component.css'
})
export class VisitManagementHomePageComponent implements OnInit, AfterViewInit ,OnDestroy{
  @ViewChild('canvasComp') canvasComp!: CanvasComponent;
  @ViewChild('content') contentRef!: ElementRef<HTMLElement>;
  @ViewChild('video', {static: true})
  videoRef!: ElementRef<HTMLVideoElement>


  scanning = false;
  private enterKeyHandler = (event: KeyboardEvent) => {
  if(event.key === 'Enter')
    if(!this.scanning){
      this.startScan();
      this.scanning = true;
    }
    else{
      this.stopScan();
      this.scanning = false;
    }
  };

  constructor(
    private router: Router,
    private bouncingCirclesService: BouncingCirclesService,
    private backgroundColorService: BackgroundColorService,
    private resizeHelperService: ResizeHelperService,
    private scannerService: ScannerService,
    private parserService: ParserService,
    private cameraService: CameraService

  ){}

  private resizeObserver?: ResizeObserver;

  // type in a different string for a different drawable effect.
  private currentDrawable: DrawableMode = 'dark-canvas';
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
    window.addEventListener('keydown', this.enterKeyHandler);
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
    window.removeEventListener('keydown', this.enterKeyHandler);
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

      case 'dark-canvas':
      break;

      default:
      break;
    }
  }
  //** ALL DRAWING LOGIC=================================================================================



  //** Scanner LOGIC=====================================================================================
  visitor: Visitor = createEmptyVisitor();
  previousVisitor: Visitor = this.visitor;
  debugMessage: string = '';
  scans: any[] = [];
  numberOfScans: number = 0;
  private codeReader = new BrowserMultiFormatReader();
  async startScan() {
    this.visitor = createEmptyVisitor();

    // this sets the resolution of the camera and starts it.
    this.cameraService.startCamera();
    // the scanner is going to read whatever is within the video reference, it isn't what actually starts the camera
    // (unless you don't have a camera service running already)
    this.scannerService.start(this.videoRef.nativeElement, (Result) => {
          this.debugMessage = 'Scanning # ' + this.numberOfScans;
    this.numberOfScans++;
      if(!Result) return;


      const raw = Result.getText();

      // I'm only keeping the parsed data so I can review ALL data within the card.
      const parsed = this.parserService.parseAAMVA(raw);

      // this technically isn't copying the parsed object, it's changing the visitor to refer to the parsed object.
      this.visitor = parsed;

      // make sure each value within the id was grabbed.
      for (const key in this.visitor) {
        if (this.visitor[key as keyof Visitor] === '') {
          this.debugMessage = `${key} is empty, rerunning decoder...`;
          return;
        }
      }

      // empty strings are falsy, so if(empty && previousVisitor === visitor) will evaluate to true.
      const isSamePerson =
      this.previousVisitor.dlNumber &&
      this.previousVisitor.dlNumber === this.visitor.dlNumber;
      if(isSamePerson){
        this.debugMessage = 'previous visitor identified, rerunning decoder...';
        return;
      }

      this.previousVisitor = structuredClone(this.visitor);
      console.log(this.previousVisitor);

      this.debugMessage = "SCAN DETECTED!";
      this.scanning = false;
      this.scans = [];
      this.scans.push({
        timestamp: new Date(),
        raw,
        data: parsed
      });

      this.scannerService.reset();

    })
  }

  debugMessage2 = '';
  async testCamera(){
    const stream = await this.cameraService.startCamera();
    this.videoRef.nativeElement.srcObject = stream;
    const caps = this.cameraService.getCapabilities();
    const settings = this.cameraService.getSettings();
    // this.debugMessage = "max height:" + caps.height;
    // this.debugMessage2 = "max width:" + caps.width;
    this.debugMessage2 = "max width:" + caps.width.max;
    this.debugMessage = "max height:" + caps.height.max;
    // console.log("max height:", caps.height.max);
    // console.log("Max width:", caps.width.max);
  }


  stopScan(){
    this.scannerService.reset();
  }

  //** Scanner LOGIC=====================================================================================
}
