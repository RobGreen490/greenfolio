import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css'
})
export class CanvasComponent implements AfterViewInit{

  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() drawFn!: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, mouse: { x: number, y: number }) => void;

  // will store pointer position of the mouse.
  mouse = { x: 0, y: 0};

  ngAfterViewInit(): void {
      const canvas = this.canvasRef.nativeElement;
      const ctx = canvas.getContext('2d')!;

      canvas.width = document.documentElement.scrollWidth;
      canvas.height = document.documentElement.scrollHeight;

      // this will reshape the size of the canvas when the page is resized.
      window.addEventListener('resize', resizeCanvas);

      // run once on load
      resizeCanvas();

      // will declare a mouse move event in case one of my pages needs it.
      // Canvas listens for mouse movement, and tells the page where it is, even if it doesn't need it.
      window.addEventListener('mousemove', (event: MouseEvent) => {
        this.mouse.x = event.clientX;
        this.mouse.y = event.clientY;
      });


      const animate = ()=>{
        this.drawFn(ctx, canvas, this.mouse);
        requestAnimationFrame(animate);
      }

      // animate the canvas
      animate();

      // resize based on the entire page, not just the window.
      function resizeCanvas() {
        const doc = document.documentElement;
        const body = document.body;

        const width = window.innerWidth;
        const height = Math.max(
          body.scrollHeight,
          body.offsetHeight,
          doc.clientHeight,
          doc.scrollHeight,
          doc.offsetHeight
        );

        canvas.width = width;
        canvas.height = height;

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
  }
}
