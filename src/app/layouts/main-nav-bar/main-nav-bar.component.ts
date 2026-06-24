import { Component } from '@angular/core';
import { AppRoutes } from '../../../routes/app-routes';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-nav-bar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './main-nav-bar.component.html',
  styleUrl: './main-nav-bar.component.css'
})
export class MainNavBarComponent {
  routes = AppRoutes;

  constructor(
    private router: Router
  ){}
}
