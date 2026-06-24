import { ElementRef, Injectable } from "@angular/core";
import { CanvasComponent } from "../canvas-engine/canvas/canvas.component";
import { DrawableMode } from "../../types/drawable-mode.type";


@Injectable({
  providedIn: 'root'
})
export class ResizeHelperService {

  private lastIsMobile = false;

  public resizeCanvasToContent(canvasComp: CanvasComponent, contentRef: ElementRef<HTMLElement>, currentDrawable: DrawableMode, lastIsMobile: boolean) {
    if (!canvasComp || !contentRef)
      return;

    const width = document.documentElement.clientWidth;
    const height = contentRef.nativeElement.scrollHeight;

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
