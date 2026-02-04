import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutes } from '../../../../routes/app-routes';

@Component({
  selector: 'app-world-map-nav-bar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './world-map-nav-bar.component.html',
  styleUrl: './world-map-nav-bar.component.css'
})
export class WorldMapNavBarComponent {
  routes = AppRoutes;

}
