import { Component, OnInit } from '@angular/core';
import { AppRoutes } from '../../../routes/app-routes';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth.service';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-main-nav-bar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './main-nav-bar.component.html',
  styleUrl: './main-nav-bar.component.css'
})
export class MainNavBarComponent implements OnInit{
  routes = AppRoutes;

  constructor(
    private router: Router,
    private authService: AuthService
  ){}

  hoveringLogout = false;
  isLoggedIn = false;
  loggedInUserName = '';

  ngOnInit(): void {
    this.authService.status().subscribe(res => {
      this.isLoggedIn = res.authenticated
      if(this.isLoggedIn)
        this.loggedInUserName = res.user;
    });
  }

  // logout button
  logout(){
    console.log("logging out..");
    this.authService.logout().subscribe(() => {
      this.isLoggedIn = false;
      this.loggedInUserName = '';
      this.router.navigate([this.routes.loginPage]);
    })
  }
}
