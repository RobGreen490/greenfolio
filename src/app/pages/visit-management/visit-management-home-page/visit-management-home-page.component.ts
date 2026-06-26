import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CanvasComponent } from "../../../services/canvas-engine/canvas/canvas.component";
import { DrawableMode } from '../../../types/drawable-mode.type';
import { BackgroundColorService } from '../../../services/background-color-service/background-color.service';
import { ResizeHelperService } from '../../../services/resize-helper-service/resize-helper.service';
import { Circle } from '../../../services/canvas-renderers/circle';
import { BouncingCirclesService } from '../../../services/bouncingCirclesService';
import { DatePipe } from '@angular/common';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Visitor } from '../../../models/visit-management-models/visitor';


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

  constructor(
    private router: Router,
    private bouncingCirclesService: BouncingCirclesService,
    private backgroundColorService: BackgroundColorService,
    private resizeHelperService: ResizeHelperService,
    
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

      case 'dark-canvas':
      break;

      default:
      break;
    }
  }
  //** ALL DRAWING LOGIC=================================================================================



  //** Scanner LOGIC=====================================================================================
  visitor: Visitor = {
    dlNumber: '', //DAQ
    dlExpiration: '', //DBA
    firstName: '', //DAC
    lastName: '', //DCS
    fullName: '',
    dob: '', //DBB
    address: '', //DAG
    city: '', //DAI
    state: '', //DAJ
    zip: '' //DAK
  };
  debugMessage: string = '';
  scans: any[] = [];
  numberOfScans: number = 0;
  private codeReader = new BrowserMultiFormatReader();
  async startScan() {
    this.debugMessage = 'Starting scanner...';

    this.codeReader.decodeFromVideoDevice(
      null,
      this.videoRef.nativeElement,
      (result) => {

        // keep track of how many times the camera has attempted to scan the id.
        this.debugMessage = 'Scan # ' + this.numberOfScans;
        this.numberOfScans+=1;

        // if a result isn't found, rerun decodeFromVideoDevice.
        if (!result) {
          return;
        }



        this.debugMessage = 'SCAN DETECTED!';
        const raw = result.getText();
        const parsed = this.parseAAMVA(raw);

        for (const key in this.visitor) {
          if (this.visitor[key as keyof Visitor] === '') {
            console.log(`${key} is empty, rerunning decoder...`);
            return;
          }
        }

        console.log(this.visitor);

        // empty the scan so that the previous scan doesn't persist, then push
        this.scans = [];
        this.scans.push({
          timestamp: new Date(),
          raw,
          data: parsed
        });

        this.codeReader.reset(); // STOP after success
      }
    );
  }


  parseAAMVA(data: string): any {
    const lines = data.split('\n');
    const result: any = {};

    for (const line of lines) {
      const key = line.substring(0, 3);
      const value = line.substring(3).trim();

      switch (key) {
        case 'DAQ': this.visitor.dlNumber = value; break;
        case 'DBA': this.visitor.dlExpiration = value; break;
        case 'DAC': this.visitor.firstName = value; break;
        case 'DCS': this.visitor.lastName = value; break;
        case 'DBB': this.visitor.dob = value; break;
        case 'DAG': this.visitor.address = value; break;
        case 'DAI': this.visitor.city = value; break;
        case 'DAJ': this.visitor.state = value; break;
        case 'DAK': this.visitor.zip = value; break;
      }
    }
    // grab full name
    this.visitor.fullName = `${this.visitor.firstName} ${this.visitor.lastName}`;
    return result;
  }

  stopScan(){
    this.codeReader.reset();
  }
  //** Scanner LOGIC=====================================================================================
}
