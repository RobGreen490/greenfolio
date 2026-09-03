import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CanvasComponent, BackgroundColorService, DrawHelperService } from '@canvas';
import { DrawableMode } from '@types';
import { MainNavBarComponent } from "@layouts";
import { Suggestion } from '../../../models/suggestion-models/suggestion';
import { SuggestionService } from '../../../services/suggestion-service/suggestion.service';
import { AppRoutes } from '@routes';

@Component({
  selector: 'app-random-suggestion-page',
  standalone: true,
  imports: [CanvasComponent, MainNavBarComponent],
  templateUrl: './random-suggestion-page.component.html',
  styleUrl: './random-suggestion-page.component.css'
})
export class RandomSuggestionPageComponent implements OnInit, AfterViewInit ,OnDestroy{
  @ViewChild('canvasComp') canvasComp!: CanvasComponent;
  @ViewChild('content') contentRef!: ElementRef<HTMLElement>;

  constructor(
    private router: Router,
    private suggestionService: SuggestionService,
    private backgroundColorService: BackgroundColorService,
    private drawHelperService: DrawHelperService
  ){}

  loading: boolean = true;
  //  employees: Employee[] = [];
  suggestions: Suggestion[] = [];
  suggestion: Suggestion = {
    suggestionId: -1,
    suggestionText: "Suggestions failed to populate from the database, please try back later.",
    authorName: "Admin",
    randomKey: "-1"
  };


  //#region DRAWABLE VARIABLES───────────────────────────────────────────────────────────────────────────
  private resizeObserver?: ResizeObserver;
  // type in a different string for a different drawable effect.
  currentDrawable: DrawableMode = 'sine-waves';
  lastIsMobile = false;
  gravityOn = false;
  //#endregion DRAWABLE VARIABLES────────────────────────────────────────────────────────────────────────



  //#region ng-ANGULAR LIFECYCLE HOOKS───────────────────────────────────────────────────────────────────
  //** ngOnInit==========================================================================================
  ngOnInit(): void {
    this.loading = true;
    this.suggestionService.getSuggestionByRandomId().subscribe({
      next: (suggestionFromDb => {
        this.suggestion = suggestionFromDb;
        this.loading = false;
      }),
      error: (err) => {
        this.suggestion = {
          suggestionId: -1,
          suggestionText: "Suggestions failed to populate from the database, please try back later.",
          authorName: "Admin",
          randomKey: "-1"
        };
        this.loading = false;
      }
    })
  }
  //** ngOnInit==========================================================================================



  //** ngAfterViewInit===================================================================================
  ngAfterViewInit(): void {
    // recolor the background of the canvas based on what is drawn
    const canvas = this.canvasComp.canvasRef.nativeElement;
    this.backgroundColorService.toggleCanvasBGC(canvas, this.currentDrawable);

    // when the page is resized, or the orientation of the screen is changed, run risizeCanvasToContent().
    this.resizeObserver = new ResizeObserver(() => {
      this.resizeCanvasToContent();
    });
    this.resizeObserver.observe(this.contentRef.nativeElement);
  }
  //** ngAfterViewInit===================================================================================



  //** ngOnDestroy=======================================================================================
  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }
  //** ngOnDestroy=======================================================================================
  //#endregion ng-Angular Lifecycle Hooks────────────────────────────────────────────────────────────────



  //#region DRAWABLE METHODS & LOGIC─────────────────────────────────────────────────────────────────────
  //** RESIZE WINDOW LOGIC===============================================================================
  private resizeCanvasToContent(): void {
    // store the boolean in result so we can reset the sine wave if necessary, and resize the canvas with the method used to determine the value.
    this.lastIsMobile = this.drawHelperService.resizeCanvasToContent(
      this.canvasComp,
      this.contentRef,
      this.currentDrawable,
      this.lastIsMobile
    );
  }
  //** RESIZE WINDOW LOGIC===============================================================================



  //** ALL DRAWING LOGIC=================================================================================
  // Receives a drawing function from the parent page via [drawFn]="draw".
  // CanvasComponent supplies the canvas context, canvas, and mouse position when calling it.
  draw = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    mouse: { x: number, y: number }
  ) => {
    this.drawHelperService.draw(
      ctx,
      canvas,
      mouse,
      this.currentDrawable,
      this.gravityOn
    );
  };
  //** ALL DRAWING LOGIC=================================================================================
  //#endregion DRAWABLE METHODS & LOGIC──────────────────────────────────────────────────────────────────



  //#region BUTTONS──────────────────────────────────────────────────────────────────────────────────────
  //** BUTTONS==========================================================================================
  turnOnGravity(): void{
    this.gravityOn = this.drawHelperService.changeGravity(this.gravityOn);
  }

  generateRandomSuggestionBtn(): void{
    this.loading = true;
    this.suggestionService.getSuggestionByRandomId().subscribe({
      next: (suggestionFromDb => {
        this.suggestion = suggestionFromDb;
        this.loading = false;
      }),
      error: (err) => {
        this.suggestion = {
          suggestionId: -1,
          suggestionText: "Suggestions failed to populate from the database, please try back later.",
          authorName: "Admin",
          randomKey: "-1"
        };
        this.loading = false;
      }
    })
  }

  createSuggestionBtn(): void{
    this.router.navigate([AppRoutes.createSuggestion]);
  }

  updateSuggestionBtn(): void{
    this.router.navigate([AppRoutes.updateSuggestion(this.suggestion.suggestionId)]);
  }

  deleteSuggestionBtn(suggestionId: number): void{
    const confirmed = confirm("Are you sure you wish to delete this suggestion?");
    if(!confirmed)
      return;


    this.suggestionService.deleteSuggestion(this.suggestion.suggestionId).subscribe({
      next: (response) => {
        this.suggestions = this.suggestions.filter(e => e.suggestionId !== suggestionId);
        this.loading = true;
        window.location.reload();

      },
      error: (err) =>{
        console.log("FULL ERROR: ", err);
      }
    });
  }


  //** BUTTONS===========================================================================================
  //#endregion BUTTONS───────────────────────────────────────────────────────────────────────────────────



}
