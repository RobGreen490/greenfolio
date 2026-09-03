import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HanUserStatsPageComponent } from './han-user-stats-page.component';

describe('HanUserStatsPageComponent', () => {
  let component: HanUserStatsPageComponent;
  let fixture: ComponentFixture<HanUserStatsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HanUserStatsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HanUserStatsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
