import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutes } from '../../../../routes/app-routes';

@Component({
  selector: 'app-employee-management-nav-bar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './employee-management-nav-bar.component.html',
  styleUrl: './employee-management-nav-bar.component.css'
})
export class EmployeeManagementNavBarComponent {
  routes = AppRoutes;
}
