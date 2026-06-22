import { ElementRef, Injectable } from "@angular/core";
import { CanvasComponent } from "../global-pages/canvas/canvas.component";
import { DrawableMode } from "../types/drawable-mode.type";
@Injectable({
  providedIn: 'root'
})
export class ResizeHelperService{

  private lastIsMobile = false;

  public resizeCanvasToContent(canvasComp: CanvasComponent, contentRef: ElementRef<HTMLElement>, currentDrawable: DrawableMode, lastIsMobile: boolean) {
    if (!canvasComp || !contentRef)
      return;

    console.log("resize running..");
    // prior to documentElement, I was using const width = window.innerWidth;
    // This wasn't updating quickly enough. this new document.documentElement.ClientWidth
    // is tied to the layout viewport after it settles, so will work better on phones.
    const width = document.documentElement.clientWidth;
    const height = contentRef.nativeElement.scrollHeight;
    /*
    // this was causing an issue with phones, so just use scrollHeight instead
    const height = Math.max(
      window.innerHeight,
      contentRef.nativeElement.scrollHeight,
      contentRef.nativeElement.clientHeight
    );
    */

    const isMobile = height > width;

    canvasComp.resizeCanvas(width, height);

    const shouldResetWave = currentDrawable === 'sine-waves' && isMobile !== lastIsMobile;

    return{
      isMobile,
      shouldResetWave,
      lastIsMobile: isMobile
    }
  }
}
