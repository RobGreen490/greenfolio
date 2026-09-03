import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CanvasComponent, BackgroundColorService, DrawHelperService } from '@canvas';
import { DrawableMode } from '@types';
import { MainNavBarComponent } from "@layouts";
import { FormsModule } from '@angular/forms';
import { Result } from '@zxing/library';
import { Suggestion } from '../../../models/suggestion-models/suggestion';
import { SuggestionService } from '../../../services/suggestion-service/suggestion.service';
import { AppRoutes } from '@routes';
import { CreateSuggestion } from '../../../models/suggestion-models/createSuggestion';

@Component({
  selector: 'app-create-suggestion-page',
  standalone: true,
  imports: [FormsModule, CanvasComponent, MainNavBarComponent],
  templateUrl: './create-suggestion-page.component.html',
  styleUrl: './create-suggestion-page.component.css'
})
export class CreateSuggestionPageComponent implements OnInit, AfterViewInit ,OnDestroy{
  @ViewChild('canvasComp') canvasComp!: CanvasComponent;
  @ViewChild('content') contentRef!: ElementRef<HTMLElement>;

  constructor(
    private router: Router,
    private backgroundColorService: BackgroundColorService,
    private drawHelperService: DrawHelperService,
    private route: ActivatedRoute,
    private suggestionService: SuggestionService
  ){}

  isUpdating: boolean = false;
  errorMessage: string = '';
  createSuggestion: CreateSuggestion = {
    suggestionId: 0,
    authorName: '',
    suggestionText: ''
  };

  suggestion: Suggestion = {
    suggestionId: 0,
    suggestionText: '',
    authorName: '',
    randomKey: ''
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
    this.route.paramMap.subscribe((Result) => {
      const suggestionId = Result.get('suggestionId');
      if(suggestionId)
      {
        this.isUpdating = true;
        this.suggestionService.getSuggestionById(Number(suggestionId)).subscribe({
          next: (result) => {
            this.suggestion = result;
            this.createSuggestion.suggestionId = this.suggestion.suggestionId;
            this.createSuggestion.authorName = this.suggestion.authorName;
            this.createSuggestion.suggestionText = this.suggestion.suggestionText;
          },
          error: (err) => {
            console.log("Error loading suggestion", err);
            this.router.navigate([[AppRoutes.randomSuggestionsPage]]);
          }
        })
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
  //** BUTTONS===========================================================================================
  onSubmit(): void{
    if(this.isUpdating){
      this.suggestionService.updateSuggestion(this.createSuggestion)
        .subscribe({
          next: (response) => {
            this.router.navigate([[AppRoutes.randomSuggestionsPage]]);
          },
          error: (err) => {
            console.log('ERROR BODY:', err.error);
            this.errorMessage = `Error occured during update: (${err.status})`;
          }
        });
    }
    else{
      this.suggestionService.createSuggestion(this.createSuggestion)
        .subscribe({
          next: (Response) => {
            this.router.navigate([[AppRoutes.randomSuggestionsPage]]);
          },
          error: (err) => {
            console.log('ERROR BODY:', err.error);
          }
        });
    }
  }

  turnOnGravity(): void{
    this.gravityOn = this.drawHelperService.changeGravity(this.gravityOn);
  }
  //** BUTTONS===========================================================================================
  //#endregion BUTTONS───────────────────────────────────────────────────────────────────────────────────



}
