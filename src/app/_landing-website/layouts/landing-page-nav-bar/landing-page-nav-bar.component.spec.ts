import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageNavBarComponent } from './landing-page-nav-bar.component';

describe('LandingPageNavBarComponent', () => {
  let component: LandingPageNavBarComponent;
  let fixture: ComponentFixture<LandingPageNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPageNavBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingPageNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
