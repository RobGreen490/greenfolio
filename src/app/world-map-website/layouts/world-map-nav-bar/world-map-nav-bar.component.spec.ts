import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldMapNavBarComponent } from './world-map-nav-bar.component';

describe('WorldMapNavBarComponent', () => {
  let component: WorldMapNavBarComponent;
  let fixture: ComponentFixture<WorldMapNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorldMapNavBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorldMapNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
