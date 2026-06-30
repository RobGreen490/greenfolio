import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Data, Router } from '@angular/router';
import { CanvasComponent, ResizeHelperService, BackgroundColorService, BouncingCirclesService } from '@canvas';
import { DrawableMode } from '@types';
import { Circle } from '@canvas-renders';
import { DatePipe, JsonPipe } from '@angular/common';
import { Visitor, createEmptyVisitor, Scan } from '@models';
import { ScannerService, ParserService, ScanRulesService } from '@services';
import { timestamp } from 'rxjs';
import { CameraService } from '@services';


@Component({
  selector: 'app-visit-management-home-page',
  standalone: true,
  imports: [CanvasComponent, DatePipe, JsonPipe],
  templateUrl: './visit-management-home-page.component.html',
  styleUrl: './visit-management-home-page.component.css'
})
export class VisitManagementHomePageComponent implements OnInit, AfterViewInit ,OnDestroy{
  @ViewChild('canvasComp') canvasComp!: CanvasComponent;
  @ViewChild('content') contentRef!: ElementRef<HTMLElement>;
  @ViewChild('video', {static: true})
  videoRef!: ElementRef<HTMLVideoElement>

  // used to get the capabilities and settings of the camera.
  private track!: MediaStreamTrack;

  // messages shown to the user on screen.
  debugMessage: string = '';


  // used to determine action is taken when the user hits 'enter'
  private scanning = false;

  // I need to remember if I ever implement typing into this form that I'll have to remove this handler.
  private enterKeyHandler = (event: KeyboardEvent) => {
  if(event.key === 's')
    if(!this.scanning){
      this.startScan();
    }
    else{
      this.stopScan();
    }
  };

  constructor(
    private router: Router,
    private bouncingCirclesService: BouncingCirclesService,
    private backgroundColorService: BackgroundColorService,
    private resizeHelperService: ResizeHelperService,
    private scannerService: ScannerService,
    private parserService: ParserService,
    private cameraService: CameraService,
    private scanRules: ScanRulesService

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
  private stream!: MediaStream;
  visitor: Visitor = createEmptyVisitor();
  previousVisitor: Visitor = this.visitor;
  currentScan: Scan | null = null;
  scanNumber: number = 1;
  async startScan(){
    // scanning initiated, user can stop with the 'enter' key because of this boolean:
    this.scanning = true;

    // start the camera and store the stream for accessing camera settings
    this.stream = await this.cameraService.startCamera();

    // show the video feed on screen, to the user.
    this.videoRef.nativeElement.srcObject = this.stream;

    // scanning services will continuously scan frames until specified not to.
    this.scannerService.start(this.stream, this.videoRef.nativeElement, (result) => {

      // keep track of the number of scans done
      this.debugMessage = 'attempted scan # ' + this.scanNumber;
      this.scanNumber++;

      // failed to get a scan on id, return.
      if(!result)
        return;

      // translate result into raw text data (this is all the data from the card)
      const raw = result.getText();

      // grab only data we need from raw and store it in this.visitor.
      this.visitor = this.parserService.parseAAMVA(raw);

      // if all values were scanned for visitor, continue:
      if(!this.scanRules.isValidVisitor(this.visitor)){
        this.debugMessage = "Incomplete scan, retrying...";
        return;
      }

      // all information on the id was found at this point, we can stop the scan and video.
      this.scannerService.reset();
      this.cameraService.stopCamera();

      // if previously scanned id: reset scan counter. We don't need to rescan the same id.
      if(this.scanRules.isDuplicate(this.visitor, this.previousVisitor)){
        this.debugMessage = 'previous visitor identified, closing decoder..';
        this.scanNumber = 1;
        return;
      }

      // successful scan, store the scanned visitor in previousVisitor.
      this.previousVisitor = structuredClone(this.visitor);

      // pass the current date/time, all data from the license, and the desired visitor object into currentScan.
      this.currentScan = {
        timestamp: new Date(),
        raw,
        visitor: structuredClone(this.visitor)
      };

      // advise the user of success. The currentScan will be used within the html page to display necessary information.
      this.debugMessage = "SCAN SUCCESSFUL!";
    })
  }


  abilities: any [] = [];
  camMessageMaxAchievableWidth = '';
  camMessageMaxAchievableHeight = '';
  camMessageCurrentWidth = '';
  camMessageCurrentHeight = '';
  async testCamera(){
    const settings = this.cameraService.getSettings();
    this.camMessageCurrentWidth = "current camera width: " + settings.width;
    this.camMessageCurrentHeight = "current camera height: " + settings.height;
    console.log("Settings: ", settings);

    const caps = this.cameraService.getCapabilities();
    this.camMessageMaxAchievableWidth = "max achievable width: " + caps.width.max;
    this.camMessageMaxAchievableHeight = "max achievable height: " + caps.height.max;
    console.log("Capabilities: ", caps);
    this.abilities = [caps];
  }

  // button to stop scanning.
  stopScan(){
    this.scannerService.reset();
    this.cameraService.stopCamera();
    this.scanning = false;
  }
  //** Scanner LOGIC=====================================================================================
}
