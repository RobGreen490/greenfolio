import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BubblePopperPageComponent } from './bubble-popper-page.component';

describe('BubblePopperPageComponent', () => {
  let component: BubblePopperPageComponent;
  let fixture: ComponentFixture<BubblePopperPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BubblePopperPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BubblePopperPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
