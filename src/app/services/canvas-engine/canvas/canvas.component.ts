import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css'
})
export class CanvasComponent implements AfterViewInit, OnDestroy{

  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() drawFn!: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, mouse: { x: number, y: number }) => void;

  private animationId!: number;
  private running = true;
  private handleMouseMove = (event: MouseEvent) => {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();

    this.mouse.x = event.clientX - rect.left;
    this.mouse.y = event.clientY - rect.top;
  };

  // will store pointer position of the mouse.
  mouse = { x: 0, y: 0};

  ngAfterViewInit(): void {
      const canvas = this.canvasRef.nativeElement;
      const ctx = canvas.getContext('2d')!;

      // temporary initial size so the canvas exists visually before the parent resizes it
      this.resizeCanvas(window.innerWidth, window.innerHeight);

      // will declare a mouse move event in case one of my pages needs it.
      // Canvas listens for mouse movement, and tells the page where it is, even if it doesn't need it.
      window.addEventListener('mousemove', this.handleMouseMove);


      const animate = () =>{
        // if the animation isn't running, don't run it.
        if(!this.running) return;

        this.drawFn(ctx, canvas, this.mouse);

        this.animationId = requestAnimationFrame(animate);
      };

      // animate the canvas
      animate();
  }

  ngOnDestroy(): void {
    this.running = false;
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('mousemove', this.handleMouseMove);
  }

  // public method so the parent component can decide the correct size
  public resizeCanvas(width: number, height: number): void {
    const canvas = this.canvasRef.nativeElement;

    canvas.width = width;
    canvas.height = height;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }
}
