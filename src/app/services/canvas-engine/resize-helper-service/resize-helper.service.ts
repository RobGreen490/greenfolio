import { ElementRef, Injectable } from "@angular/core";
import { CanvasComponent } from "@canvas";
import { DrawableMode } from "@types";


@Injectable({
  providedIn: 'root'
})
export class ResizeHelperService {

  private lastIsMobile = false;

  public resizeCanvasToContent(canvasComp: CanvasComponent, contentRef: ElementRef<HTMLElement>, currentDrawable: DrawableMode, lastIsMobile: boolean) {
    if (!canvasComp || !contentRef)
      return;

    // get the width and height of the window
    const width = document.documentElement.clientWidth;
    const height = contentRef.nativeElement.scrollHeight;

    // if the height is greater than width, we're using a phone in portrait mode.
    const isMobile = height > width;

    // resize the canvas with the windows new width and height.
    canvasComp.resizeCanvas(width, height);

    //
    const shouldResetWave = currentDrawable === 'sine-waves' && isMobile !== lastIsMobile;

    return{
      isMobile,
      shouldResetWave,
      lastIsMobile: isMobile
    }
  }
}
