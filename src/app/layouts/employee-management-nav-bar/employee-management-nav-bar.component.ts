import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutes } from '@routes';


@Component({
    selector: 'app-employee-management-nav-bar',
    imports: [RouterModule],
    standalone: true,
    templateUrl: './employee-management-nav-bar.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: './employee-management-nav-bar.component.css'
})
export class EmployeeManagementNavBarComponent {
  routes = AppRoutes;
}
