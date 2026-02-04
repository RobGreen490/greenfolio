import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {AppRoutes } from '../../../routes/app-routes';

@Component({
  selector: 'app-landing-page-nav-bar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing-page-nav-bar.component.html',
  styleUrl: './landing-page-nav-bar.component.css'
})
export class LandingPageNavBarComponent {
  routes = AppRoutes;

  constructor(
    private router: Router
  ){}
}
