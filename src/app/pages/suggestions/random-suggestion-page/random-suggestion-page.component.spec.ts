import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomSuggestionPageComponent } from './random-suggestion-page.component';

describe('RandomSuggestionPageComponent', () => {
  let component: RandomSuggestionPageComponent;
  let fixture: ComponentFixture<RandomSuggestionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RandomSuggestionPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RandomSuggestionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
