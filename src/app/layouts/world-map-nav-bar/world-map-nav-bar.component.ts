import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutes } from '@routes';


@Component({
    selector: 'app-world-map-nav-bar',
    imports: [RouterModule],
    standalone: true,
    templateUrl: './world-map-nav-bar.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './world-map-nav-bar.component.css'
})
export class WorldMapNavBarComponent {
  routes = AppRoutes;

}
