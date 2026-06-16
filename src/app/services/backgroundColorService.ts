import { Injectable } from "@angular/core";
import { DrawableMode } from "../types/drawable-mode.type";

@Injectable({
  providedIn: 'root'
})
export class BackgroundColorService{

  determineBackgroundColor(currentDrawable: DrawableMode){
    switch(currentDrawable){
      case 'sine-waves':
        return "#0D0E12";
        break;
      case 'bouncing-circles':
        return "#0D0E12";
        break;
      case 'mouse-draw':
        return "#b0b0b0";
        break;
      default:
        return "#b0b0b0";
        break;
    }
  }

}
