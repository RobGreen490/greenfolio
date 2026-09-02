import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSuggestionPageComponent } from './create-suggestion-page.component';

describe('CreateSuggestionPageComponent', () => {
  let component: CreateSuggestionPageComponent;
  let fixture: ComponentFixture<CreateSuggestionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSuggestionPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSuggestionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
