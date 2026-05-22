import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeManagementNavBarComponent } from '../../layouts/employee-management-nav-bar/employee-management-nav-bar.component';
import { EmployeeManagementService } from '../../services/employee-management-service/employee-management.service';
import { Employee } from '../../models/employee';
import { AppRoutes } from '../../../../routes/app-routes';
import { CanvasComponent } from '../../../global-pages/canvas/canvas.component';


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

  private resizeObserver?: ResizeObserver;
  private resizeHandler = () => this.resizeCanvasToContent();

  employees: Employee[] = [];
  loading: boolean = true;

  constructor(
    private EmployeeManagementService: EmployeeManagementService,
    private router: Router
  ){}

  ngOnInit(): void {
    // console.log("loading employees..");
    this.EmployeeManagementService.getEmployees().subscribe((employeeDataFromDB: Employee[]) => {
      this.employees = employeeDataFromDB;
      this.loading = false;
      // console.log("finished loading employees.");
    })
  }

  ngAfterViewInit(): void {
    this.toggleCanvasBGC("#0D0E12");

    this.resizeCanvasToContent();

    window.addEventListener('resize', this.resizeHandler);
    this.resizeObserver = new ResizeObserver(() => {
      this.resizeCanvasToContent();
    });
    this.resizeObserver.observe(this.contentRef.nativeElement);
  }

  ngOnDestroy(): void {

  }

  // used to resize the canvas on window resize by user.
  private resizeCanvasToContent(): void {
    if (!this.canvasComp || !this.contentRef) return;

    const width = window.innerWidth;
    const height = Math.max(
      window.innerHeight,
      this.contentRef.nativeElement.scrollHeight
    );

    this.canvasComp.resizeCanvas(width, height);
  }

  // can be used to change the background color of the canvas
  toggleCanvasBGC(color: string): void {
    const canvas = this.canvasComp.canvasRef.nativeElement;
    canvas.style.backgroundColor = color;
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

  draw = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    mouse: { x: number, y: number }
  ) => {

  }

  updateEmployee(employeeId: number) : void{
    this.router.navigate([AppRoutes.updateEmployee(employeeId)]);
  }

  goToCreate() {
    this.router.navigate([AppRoutes.createEmployee]);
  }
}
