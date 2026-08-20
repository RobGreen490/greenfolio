import { Component, OnInit } from '@angular/core';
import { AppRoutes } from '@routes';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthService } from '@services';

@Component({
  selector: 'app-main-nav-bar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './main-nav-bar.component.html',
  styleUrl: './main-nav-bar.component.css'
})
export class MainNavBarComponent implements OnInit{

  routes = AppRoutes;
  currentUrl = '';
  hoveringLogout = false;
  isLoggedIn = false;
  loggedInUserName = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ){
    this.currentUrl = router.url;
  }

  ngOnInit(): void {
    this.authService.status().subscribe(res => {
      this.isLoggedIn = res.authenticated
      if(this.isLoggedIn)
        this.loggedInUserName = res.user;
    });

    // get the current url so we can add buttons to the nav bar based on that url.
    this.currentUrl = this.router.url;
    console.log("current url: ", this.currentUrl);
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
