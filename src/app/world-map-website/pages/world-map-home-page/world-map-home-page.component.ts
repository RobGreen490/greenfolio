import { Component } from '@angular/core';
import { WorldMapService } from '../../services/world-map.service';
import { WorldMapNavBarComponent } from "../../layouts/world-map-nav-bar/world-map-nav-bar.component";

@Component({
  selector: 'app-world-map-home-page',
  standalone: true,
  imports: [WorldMapNavBarComponent],
  templateUrl: './world-map-home-page.component.html',
  styleUrl: './world-map-home-page.component.css'
})
export class WorldMapHomePageComponent {

  constructor(private worldMapService: WorldMapService ) {  }

  //variable to store the countries id when the map is clicked.
  clickedCountry: string = '';

  //variable to store the object
  countryDetails: any;

  // triggers the service method when a country is selected and sets local variable that will receive the information about the country for display
  onClick(event: any): void {
    this.worldMapService.getCountry(event.target.id).subscribe(data => {
      this.countryDetails = data[1][0];
      console.log(this.countryDetails);
      this.displayCountryInfo(this.countryDetails);
    })
  }


  // Using the world bank api to grab and store the appropriate data points
  displayCountryInfo(obj: {
    name: string; capitalCity: string, region: { value: string },
    incomeLevel: { value: string }, longitude: string, latitude: string
  }){
      //grabbing the elements in the DOM we'll need to change.
      let countryNameHeader = document.getElementById("countryName");
      let countryCapitalLi = document.getElementById("countryCapital");
      let countryRegionLi = document.getElementById("countryRegion");
      let incomeLevelLi = document.getElementById("incomeLevel");
      let countryLongitudeLi = document.getElementById("countryLongitude");
      let countryLatitudeLi = document.getElementById("countryLatitude");
      //Checking if those DOM items exist, assigning them the necessary values if they do.
      if (countryNameHeader && countryCapitalLi && countryRegionLi && incomeLevelLi && countryLongitudeLi && countryLatitudeLi) {
        countryNameHeader.textContent = obj.name;
        countryCapitalLi.textContent = `Capital: ${obj.capitalCity}`;
        countryRegionLi.textContent = `Region: ${obj.region.value}`;
        incomeLevelLi.textContent = `Income Level: ${obj.incomeLevel.value}`;
        countryLongitudeLi.textContent = `Longitude: ${obj.longitude}`;
        countryLatitudeLi.textContent = `Latitude: ${obj.latitude}`;
      }
  }

}