import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HanHomePageComponent } from './han-home-page.component';

describe('HanHomePageComponent', () => {
  let component: HanHomePageComponent;
  let fixture: ComponentFixture<HanHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HanHomePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HanHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
