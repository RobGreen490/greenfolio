import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeManagementNavBarComponent } from '../../layouts/employee-management-nav-bar/employee-management-nav-bar.component';
import { EmployeeManagementService } from '../../services/employee-management-service/employee-management.service';
import { Employee } from '../../models/employee';
import { AppRoutes } from '../../../../routes/app-routes';


@Component({
  selector: 'app-employee-management-home-page',
  standalone: true,
  imports: [EmployeeManagementNavBarComponent],
  templateUrl: './employee-management-home-page.component.html',
  styleUrl: './employee-management-home-page.component.css'
})
export class EmployeeManagementHomePageComponent implements OnInit{
employees: Employee[] = [];

  constructor(
    private EmployeeManagementService: EmployeeManagementService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.EmployeeManagementService.getEmployees().subscribe((employeeDataFromDB: Employee[]) => {
      this.employees = employeeDataFromDB;
    })
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
}
