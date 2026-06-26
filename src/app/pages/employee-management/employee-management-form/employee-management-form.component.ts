import { AfterContentInit, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../../models/employee-management-models/employee';
import { EmployeeManagementService } from '../../../services/employee-management-service/employee-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeManagementNavBarComponent } from '../../../layouts/employee-management-nav-bar/employee-management-nav-bar.component';
import { AppRoutes } from '../../../../routes/app-routes';
import { CanvasComponent } from '../../../services/canvas-engine/canvas/canvas.component';
import { DrawableMode } from '../../../types/drawable-mode.type';
import { Wave } from '../../../services/canvas-renderers/wave';
import { BackgroundColorService } from '../../../services/background-color-service/background-color.service';
import { ResizeHelperService } from '../../../services/resize-helper-service/resize-helper.service';


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

  currentDrawable: DrawableMode = 'sine-waves';
  private resizeObserver?: ResizeObserver;
  private readonly _resizeHelperService?: ResizeHelperService;
  private lastIsMobile = false;

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

  constructor(
    private employeeManagementService: EmployeeManagementService,
    private router: Router,
    private route: ActivatedRoute, // Provides access to route parameters (e.g., employeeId from the end of the URL)
    private backgroundColorService: BackgroundColorService,
    private resizeHelperService: ResizeHelperService
  ){
    this._resizeHelperService = resizeHelperService;
  }

  ngOnInit(): void {
      //check if we have an employeeId, if we do UPDATE
      this.route.paramMap.subscribe((result) => {
        const employeeId = result.get('employeeId');
        if(employeeId) // if we have an employee, update it
        {
          // console.log(`Updating employeeId ${employeeId}`)
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

  private resizeCanvasToContent(): void {
    const result = this._resizeHelperService?.resizeCanvasToContent(this.canvasComp, this.contentRef, this.currentDrawable, this.lastIsMobile);

    this.lastIsMobile = result!.isMobile;

    if(result?.shouldResetWave)
      this.wave = new Wave();
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasComp.canvasRef.nativeElement;

    // recolor the background of the canvas based on what is drawn
    const newBackgroundColor = this.backgroundColorService.determineBackgroundColor(this.currentDrawable);
    this.backgroundColorService.toggleCanvasBGC(canvas, this.currentDrawable);

    this.resizeObserver = new ResizeObserver(() => {
      this.resizeCanvasToContent();
    });
    this.resizeObserver.observe(this.contentRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
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

  toggleCanvasBGC(color: string): void {
    const canvas = this.canvasComp.canvasRef.nativeElement;
    canvas.style.backgroundColor = color;
  }

  wave: Wave = new Wave();

  // TODO:: draw not implemented yet
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
      default:
        break;
    }
  }
}
