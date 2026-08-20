import { AfterContentInit, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employee } from '@models';
import { EmployeeManagementService } from '../../../services/employee-management-service/employee-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeManagementNavBarComponent } from '@layouts';
import { AppRoutes } from '@routes';
import { CanvasComponent, BackgroundColorService, DrawHelperService } from '@canvas';
import { DrawableMode } from '@types';



@Component({
  selector: 'app-employee-management-form',
  standalone: true,
  imports: [FormsModule, EmployeeManagementNavBarComponent, CanvasComponent],
  templateUrl: './employee-management-form.component.html',
  styleUrl: './employee-management-form.component.css'
})
export class EmployeeManagementFormComponent implements OnInit, AfterViewInit, OnDestroy{
  @ViewChild('canvasComp') canvasComp!: CanvasComponent;
  @ViewChild('content') contentRef!: ElementRef<HTMLElement>;



  constructor(
    private employeeManagementService: EmployeeManagementService,
    private router: Router,
    private route: ActivatedRoute, // Provides access to route parameters (e.g., employeeId from the end of the URL)
    private backgroundColorService: BackgroundColorService,
    private drawHelperService: DrawHelperService
  ){
  }

  //#region DRAWABLE VARIABLES───────────────────────────────────────────────────────────────────────────
  private resizeObserver?: ResizeObserver;
  // type in a different string for a different drawable effect.
  currentDrawable: DrawableMode = 'sine-waves';
  lastIsMobile = false;
  gravityOn = false;
  //#endregion DRAWABLE VARIABLES────────────────────────────────────────────────────────────────────────

  employee: Employee = {
    employeeId: 0,
    employeeFirstName: '',
    employeeLastName: '',
    employeeEmail: '',
    employeePhone: '',
    employeePosition: ''
  }

  // Will be used to check if we're creating or editting the user
  isUpdating: boolean = false;

  errorMessage: string = '';



  ngOnInit(): void {
      //check if we have an employeeId, if we do UPDATE
      this.route.paramMap.subscribe((result) => {
        const employeeId = result.get('employeeId');
        if(employeeId) // if we have an employee, show an update page instead of create page
        {
          this.isUpdating = true; // have to static cast string to number
          this.employeeManagementService.getEmployeeById(Number(employeeId)).subscribe({
            next: (result) => this.employee = result,
            // If the employee doesn't exist, reroute to home page
            error: (err) => {
              console.log("Error loading employee", err);
              this.router.navigate([[AppRoutes.employeeManagement]]);
            }
          })
        }
      });
  }



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



  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }



  private resizeCanvasToContent(): void {
    // store the boolean in result so we can reset the sine wave if necessary, and resize the canvas with the method used to determine the value.
    this.lastIsMobile = this.drawHelperService.resizeCanvasToContent(
      this.canvasComp,
      this.contentRef,
      this.currentDrawable,
      this.lastIsMobile
    );
  }



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

    //#region BUTTONS──────────────────────────────────────────────────────────────────────────────────────
  //** BUTTONS===========================================================================================
  turnOnGravity(): void{
    this.gravityOn = this.drawHelperService.changeGravity(this.gravityOn);
  }



  onSubmit() : void {
    if(this.isUpdating){
      // UPDATING an employee
      this.employeeManagementService.updateEmployee(this.employee)
        .subscribe({
          next: (Response) => {
            // Route the user back to the home page after creating employee
            // console.log(this.employee);
            this.router.navigate([[AppRoutes.employeeManagement]]);
            //(result) => console.log(result)
          },
          error: (err) => {
            //console.log(err);
            console.log(err.message);
            this.errorMessage = `Error occured during updating: (${err.status})`;
          }
        });
    }
    else{
      // CREATING an employee
      this.employeeManagementService.createEmployee(this.employee)
        .subscribe({
          next: (Response) => {
            // Route the user back to the home page after creating employee
            this.router.navigate([[AppRoutes.employeeManagement]]);
          },
          error: (err) => {
            console.log(err.message);
            this.errorMessage = `Error occured during creating: (${err.status})`;
          }
        });
      }
  }
  //** BUTTONS===========================================================================================
  //#endregion BUTTONS───────────────────────────────────────────────────────────────────────────────────
}
