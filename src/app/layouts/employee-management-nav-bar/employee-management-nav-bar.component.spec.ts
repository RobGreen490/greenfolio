import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeManagementNavBarComponent } from './employee-management-nav-bar.component';

describe('EmployeeManagementNavBarComponent', () => {
  let component: EmployeeManagementNavBarComponent;
  let fixture: ComponentFixture<EmployeeManagementNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeManagementNavBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeManagementNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
