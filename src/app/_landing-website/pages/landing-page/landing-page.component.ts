import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '../../../routes/app-routes';
import { LandingPageNavBarComponent } from '../../layouts/landing-page-nav-bar/landing-page-nav-bar.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [LandingPageNavBarComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
constructor(
      private router: Router
    ){}
    
    tileBackground = 'assets/images/landing-website-images/employee-management-photo.jpg';

    goToEmployeeManagement() {
      this.router.navigate([AppRoutes.employeeManagement]);
    }
}
