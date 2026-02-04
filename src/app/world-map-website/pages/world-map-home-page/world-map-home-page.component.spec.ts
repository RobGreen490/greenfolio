import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldMapHomePageComponent } from './world-map-home-page.component';

describe('WorldMapHomePageComponent', () => {
  let component: WorldMapHomePageComponent;
  let fixture: ComponentFixture<WorldMapHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorldMapHomePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorldMapHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
