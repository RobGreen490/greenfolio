import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeManagementHomePageComponent } from './employee-management-home-page.component';

describe('EmployeeManagementHomePageComponent', () => {
  let component: EmployeeManagementHomePageComponent;
  let fixture: ComponentFixture<EmployeeManagementHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeManagementHomePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeManagementHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
