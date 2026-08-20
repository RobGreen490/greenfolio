import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeManagementNavBarComponent } from '@layouts';
import { BackgroundColorService, CanvasComponent, DrawHelperService } from '@canvas';
import { Employee } from '@models';
import { AppRoutes } from '@routes';
import { EmployeeManagementService } from '../../../services/employee-management-service/employee-management.service';
import { DrawableMode } from '@types';


@Component({
  selector: 'app-employee-management-home-page',
  standalone: true,
  imports: [EmployeeManagementNavBarComponent, CanvasComponent],
  templateUrl: './employee-management-home-page.component.html',
  styleUrl: './employee-management-home-page.component.css'
})
export class EmployeeManagementHomePageComponent implements OnInit, AfterViewInit, OnDestroy{
  @ViewChild('canvasComp') canvasComp!: CanvasComponent;
  @ViewChild('content') contentRef!: ElementRef<HTMLElement>;

  constructor(
    private EmployeeManagementService: EmployeeManagementService,
    private router: Router,
    private backgroundColorService: BackgroundColorService,
    private drawHelperService: DrawHelperService
  ){}



  employees: Employee[] = [];
  loading: boolean = true;

  //#region DRAWABLE VARIABLES───────────────────────────────────────────────────────────────────────────
  private resizeObserver?: ResizeObserver;
  // type in a different string for a different drawable effect.
  currentDrawable: DrawableMode = 'sine-waves';
  lastIsMobile = false;
  gravityOn = false;
  //#endregion DRAWABLE VARIABLES────────────────────────────────────────────────────────────────────────



  //#region ng-ANGULAR LIFECYCLE HOOKS───────────────────────────────────────────────────────────────────
  //** ngOnInit==========================================================================================
  ngOnInit(): void {
    console.log("loading employees..");
    this.EmployeeManagementService.getEmployees().subscribe((employeeDataFromDB: Employee[]) => {
      this.employees = employeeDataFromDB;
      this.loading = false;
      console.log("finished loading employees.");
    })
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



  deleteEmployee(employeeId: number) : void {
    this.EmployeeManagementService.deleteEmployee(employeeId).subscribe({
      next: (response) => {
        this.employees = this.employees.filter(e => e.employeeId !== employeeId);
      },
      error: (err) => {
        console.log("Error deleting employee", err);
      }
    });
  }



  updateEmployee(employeeId: number) : void{
    this.router.navigate([AppRoutes.updateEmployee(employeeId)]);
  }



  goToCreate() {
    this.router.navigate([AppRoutes.createEmployee]);
  }
  //** BUTTONS===========================================================================================
  //#endregion BUTTONS───────────────────────────────────────────────────────────────────────────────────
}
