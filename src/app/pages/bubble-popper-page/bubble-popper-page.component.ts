import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '@routes';
import { CanvasComponent } from '@canvas';
import { Circle, Projectile , ExplosionParticle } from '@canvas-renders';


@Component({
  selector: 'app-bubble-popper-page',
  standalone: true,
  imports: [CanvasComponent],
  templateUrl: './bubble-popper-page.component.html',
  styleUrl: './bubble-popper-page.component.css'
})
export class BubblePopperPageComponent implements AfterViewInit, OnInit, OnDestroy{
  @ViewChild('canvasComp') canvasComp!: CanvasComponent;
  @ViewChild('content') contentRef!: ElementRef<HTMLElement>;

  private resizeObserver?: ResizeObserver;
  private resizeHandler = () => this.resizeCanvasToContent();
  private escapeKeyHandler = (event: KeyboardEvent) => {
    if(event.key === 'Escape')
      this.escapeKeyHandlerFunction();
  };
  private buttonClickHandler = (event: MouseEvent) => {
    if(event.button === 0){
      this.buttonClickHandlerFunction(event);
    }
  };

  constructor(
    private router: Router
  ){}

  projectiles: Projectile [] = [];
  explosionParticles: ExplosionParticle[] = [];
  colorArray: string [] = [
    '#CCC7B9',
    '#EAF9D9',
    '#E2D4BA',
    '#AF7A6D',
    '#653239'
  ];

  // used to drawing the crosshair
  pointerSize = 10;
  xRadius = 0;

  // used to keep tab on player score
  playerScore = 0;

  // used for circles
  minRadius = 25;
  maxRadius = 100;
  circles: Circle[] = [];
  expandCircles = false;
  private bubbleSpawnTimeout?: number;
  colorHit = "";


  ngOnInit(): void {

  }

  // can be used to change the background color of the canvas
  toggleCanvasBGC(color: string): void {
    const canvas = this.canvasComp.canvasRef.nativeElement;
    canvas.style.backgroundColor = color;
  }



  ngAfterViewInit(): void {

    this.toggleCanvasBGC("#0D0E12");
    this.resizeCanvasToContent();

    window.addEventListener('resize', this.resizeHandler);
    window.addEventListener('keydown', this.escapeKeyHandler);
    window.addEventListener('click', this.buttonClickHandler);

    this.resizeObserver = new ResizeObserver(() => {
      this.resizeCanvasToContent();
    });
    this.resizeObserver.observe(this.contentRef.nativeElement);
    this.startBubbleSpawning();
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.escapeKeyHandler);
    window.removeEventListener('resize', this.resizeHandler);
    window.removeEventListener('click', this.buttonClickHandler);
    this.resizeObserver?.disconnect();

    if (this.bubbleSpawnTimeout)
      clearTimeout(this.bubbleSpawnTimeout);
  }

  private resizeCanvasToContent(): void {
    if (!this.canvasComp || !this.contentRef)
      return;

    const width = window.innerWidth;
    const height = Math.max(window.innerHeight,this.contentRef.nativeElement.scrollHeight);

    this.canvasComp.resizeCanvas(width, height);
  }

  private escapeKeyHandlerFunction(): void {
    // console.log("Returning to main menu..");
    this.router.navigate([AppRoutes.landingPage]);
  }

  private buttonClickHandlerFunction(event: MouseEvent): void{
    // console.log("Shooting cannon..");
    this.fireProjectile(event, this.canvasComp.canvasRef.nativeElement.height);
  }

  draw = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    mouse: { x: number, y: number }
  ) => {
    // clear the canvas every time we start drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // drawing crosshair and cannon
    this.mouseDrawCrosshair(true, ctx, mouse);
    this.drawCannon(canvas.height, ctx, mouse);

    // drawing projectile if active
    if(this.projectiles.length > 0)
      this.projectiles.forEach((projectile, index) => {
        if (projectile.isActive) {
          projectile.x += projectile.dx;
          projectile.y += projectile.dy;

          ctx.beginPath();
          ctx.fillStyle = '#000';
          ctx.strokeStyle = '#FFF';
          // If I want the projectile to be a circle, use this.
          ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
          // If I want the projectile to be a dot.
          // ctx.rect(projectile.x, projectile.y, 1, 1);
          ctx.fill();
          ctx.stroke();
          ctx.closePath();

          // if the projectile isn't on screen, stop drawing projectile.
            if ( projectile.x < 0 || projectile.x > canvas.width || projectile.y < 0 || projectile.y > canvas.height)
              projectile.isActive = false;
            else
              // keep only the projectiles where isActive is true, throw away the rest.
              this.projectiles = this.projectiles.filter(p => p.isActive);
        }
      })

    // determine if a projectile hits a circle and remove both from the frame
    this.projectiles.forEach((projectile) => {
      this.circles.forEach((circle) => {
        const dx = projectile.x - circle.x;
        const dy = projectile.y - circle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < projectile.radius + circle.radius) {
          this.spawnExplosion(projectile.x, projectile.y);
          // stop drawing the projectile once false (it still exist at the point of contact with the bubble)
          projectile.isActive = false;
          // the projectiles explosion will match the fill color of the circle.
          this.colorHit = circle.fillColor;
          // move the circle off screen (this will automatically drop it from the array of bubbles)
          circle.x = -1000;
          // increment player score based on the radius of the circle.
          this.playerScore += Math.ceil((circle.maxRadius - circle.radius)/ 10) + 1;

          // this actually removes the projectile so its point of contact will not hit other bubbles.
          this.projectiles = this.projectiles.filter(
            projectile => projectile.isActive
          );
        }
      });
    });

    this.explosionParticles.forEach((particle) => {
      particle.x += particle.dx;
      particle.y += particle.dy;
      particle.life -= 1;
      particle.radius *= 0.95;

      const alpha = particle.life / 30;

      ctx.beginPath();
      ctx.fillStyle = this.colorHit;
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    });

    this.explosionParticles = this.explosionParticles.filter(
      particle => particle.life > 0 && particle.radius > 0.5
    );

    this.circles.forEach((circle) => {
      circle.update(canvas.width, canvas.height, ctx, mouse, false, false, false);
    });

    // remove circles where x < 0
    this.circles = this.circles.filter(circle => circle.x >= 0 - circle.radius);
  }

  // used to spawn the bubble
  private spawnBubble(canvas: HTMLCanvasElement): void {
    const radius = Math.floor(Math.random() * (this.maxRadius - this.minRadius + 1)) + this.minRadius;

    const x = canvas.width - 100; // off screen to the right
    const y = Math.random() * (canvas.height - radius * 2) + radius;

    const dx = -(Math.random() * 2 + 1); // move left, between about -1 and -3
    const dy = 0;

    const outlineColor = 'blue';
    const fillColor = this.colorArray[Math.floor(Math.random() * this.colorArray.length)];

    this.circles.push(
      new Circle(x, y, dx, dy, this.minRadius, radius, this.maxRadius, outlineColor, fillColor)
    );
  }

  spawnExplosion(x: number, y: number): void {
    const particleCount = 12;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1;
      const radius = Math.random() * 3 + 2;
      const life = 30;

      const dx = Math.cos(angle) * speed;
      const dy = Math.sin(angle) * speed;

      this.explosionParticles.push(
        // I'll change the color of the explosion in a different part of this code-base based on what it hits.
        new ExplosionParticle(x, y, dx, dy, radius, life, 'orange')
      );
    }
  }

  private startBubbleSpawning(): void {
    const canvas = this.canvasComp.canvasRef.nativeElement;

    const scheduleNext = () => {
      // spawn timer random between 1 and 4 seconds
      const delay = Math.floor(Math.random() * 1000) + 2000;

      this.bubbleSpawnTimeout = window.setTimeout(() => {
        this.spawnBubble(canvas);
        scheduleNext();
      }, delay);
    };

    scheduleNext();
  }

  // draw the cannon
  drawCannon(canvasHeight: number, ctx: CanvasRenderingContext2D, mouse: {x: number, y: number}): void{
    const cannonX = 50; // pivot point (center top of base)
    const cannonY = canvasHeight - 40;

    // Color for the base and barrel
    const gradient = ctx.createLinearGradient(0, 22, 45, 0);
    gradient.addColorStop(0, '#444');
    gradient.addColorStop(0.5, '#999');
    gradient.addColorStop(1, '#222');


    // new cannon base
    const cannonSvgPath = `m 11.229126,197.49092 -10.54818765,6.6487 c 1.03499115,0.18266 0.0267,0.0202 0.83888115,0.11572 0.21263,0.025 0.4233,0.0661 0.6364,0.0868 0.32287,0.0312 0.53726,-0.0413 0.78103,0.20249 0.099,0.099 0.20731,0.21454 0.26034,0.34712 0.0896,0.22398 0.16713,0.87106 0.11571,1.12816 -0.0514,0.25714 -0.16444,0.40181 -0.11571,0.69425 0.0476,0.28568 0.33961,0.32097 0.5496205,0.40498 0.042,0.0168 0.13449,0.0579 0.17356,0.0579 H 0.62307835 v 1.70663 H 3.80506 117.90865 v -2.86094 l -9.40909,-0.16364 -8.16118,-30.45794 h -9.102489 l -7.72839,-28.84275 -9.69888,-4.27204 H 40.508626 l -17.09539,9.87003 -11.77966,43.96228 z`;
    const cannonBasePath = new Path2D(cannonSvgPath);
    ctx.fillStyle = gradient;
    this.drawSvgPath(canvasHeight, ctx, cannonSvgPath, cannonBasePath);

    // draw the cannon wheel

    ctx.beginPath();
    ctx.arc(50, canvasHeight - 40, 12, 0, Math.PI * 2);
    ctx.strokeStyle = '#222'
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(50, canvasHeight - 40, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#777';
    ctx.fill();
    ctx.save();

    // move to pivot
    ctx.translate(cannonX, cannonY);

    // rotate toward mouse
    const angle = Math.atan2(mouse.y - cannonY, mouse.x - cannonX);
    ctx.rotate(angle);


    // draw the barrel
    ctx.fillStyle = gradient;
    ctx.strokeStyle = '#FFF';
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(70, -5);
    ctx.lineTo(60, 5);
    ctx.lineTo(0, 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // I'll use this to get the height of my Path2D
  drawSvgPath(canvasHeight: number, ctx: CanvasRenderingContext2D, svgStringPath: string, svgPath: Path2D,){
    ctx.save();
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", svgStringPath);
    svg.appendChild(path);
    document.body.appendChild(svg);
    const bbox = path.getBBox();
    document.body.removeChild(svg);

    ctx.translate(0, canvasHeight - bbox.height - bbox.y);
    ctx.stroke(svgPath);
    ctx.fill(svgPath);
    ctx.restore();
  }

  fireProjectile(mouse: { x: number, y: number }, canvasHeight: number): void {
    const cannonX = 50;
    const cannonY = canvasHeight - 40;
    // The angle at which the projectile should spawn
    const angle = Math.atan2(mouse.y - cannonY, mouse.x - cannonX);
    // The speed of the projectile
    const speed = 48;
    const barrelLength = 40;
    const projectileRadius = 4;

    const tempX = cannonX + Math.cos(angle) * barrelLength;
    const tempY = cannonY + Math.sin(angle) * barrelLength;
    const tempDx = Math.cos(angle) * speed;
    const tempDy = Math.sin(angle) * speed;
    const isActive = true;
    this.projectiles.push(new Projectile(
      tempX, tempY, tempDx, tempDy, projectileRadius, isActive
    ));
  }


  mouseDrawCrosshair(isOn: boolean, ctx: CanvasRenderingContext2D, mouse: { x: number, y: number }): void {
    if (isOn) {
      ctx.beginPath();
      ctx.strokeStyle = 'red';

      // top-left to bottom-right
      ctx.moveTo(mouse.x - this.pointerSize, mouse.y - this.pointerSize);
      ctx.lineTo(mouse.x + this.pointerSize, mouse.y + this.pointerSize);

      // top-right to bottom-left
      ctx.moveTo(mouse.x + this.pointerSize, mouse.y - this.pointerSize);
      ctx.lineTo(mouse.x - this.pointerSize, mouse.y + this.pointerSize);

      ctx.stroke();
      ctx.closePath();

      // determine radius of the x with the Pythagorean theorem.
      this.xRadius = Math.sqrt(this.pointerSize * this.pointerSize + this.pointerSize * this.pointerSize);

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillStyle = 'transparent';
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, this.xRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    }
  }

}
