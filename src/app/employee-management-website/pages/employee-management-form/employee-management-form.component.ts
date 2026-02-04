import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../models/employee';
import { EmployeeManagementService } from '../../services/employee-management-service/employee-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeManagementNavBarComponent } from '../../layouts/employee-management-nav-bar/employee-management-nav-bar.component';
import { AppRoutes } from '../../../routes/app-routes';

@Component({
  selector: 'app-employee-management-form',
  standalone: true,
  imports: [FormsModule, EmployeeManagementNavBarComponent],
  templateUrl: './employee-management-form.component.html',
  styleUrl: './employee-management-form.component.css'
})
export class EmployeeManagementFormComponent implements OnInit{
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
    private route: ActivatedRoute // Provides access to route parameters (e.g., employeeId from the end of the URL)
  ){}

  ngOnInit(): void {
      //check if we have an employeeId, if we do UPDATE
      this.route.paramMap.subscribe((result) => {
        const employeeId = result.get('employeeId');
        if(employeeId) // if we have an employee, update it
        {
          console.log(`Updating employeeId ${employeeId}`)
          this.isUpdating = true;             //have to static cast string to number
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

  onSubmit() : void {
    if(this.isUpdating){
      // UPDATING an employee
      this.employeeManagementService.updateEmployee(this.employee)
        .subscribe({
          next: (Response) => {
            // Route the user back to the home page after creating employee
            console.log(this.employee);
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
            console.log(this.employee);
            this.router.navigate([[AppRoutes.employeeManagement]]);
            //(result) => console.log(result)
          },
          error: (err) => {
            //console.log(err);
            console.log(err.message);
            this.errorMessage = `Error occured during creating: (${err.status})`;
          }
        });
      }
  }
}
