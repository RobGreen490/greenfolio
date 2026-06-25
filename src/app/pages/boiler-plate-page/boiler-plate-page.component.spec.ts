import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoilerPlatePageComponent } from './boiler-plate-page.component';

describe('BoilerPlatePageComponent', () => {
  let component: BoilerPlatePageComponent;
  let fixture: ComponentFixture<BoilerPlatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoilerPlatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoilerPlatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
