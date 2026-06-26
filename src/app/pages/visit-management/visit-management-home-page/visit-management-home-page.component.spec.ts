import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitManagementHomePageComponent } from './visit-management-home-page.component';

describe('VisitManagementHomePageComponent', () => {
  let component: VisitManagementHomePageComponent;
  let fixture: ComponentFixture<VisitManagementHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitManagementHomePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitManagementHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
