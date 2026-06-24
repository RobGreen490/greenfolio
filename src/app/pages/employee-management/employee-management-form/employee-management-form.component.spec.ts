import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeManagementFormComponent } from './employee-management-form.component';

describe('EmployeeManagementFormComponent', () => {
  let component: EmployeeManagementFormComponent;
  let fixture: ComponentFixture<EmployeeManagementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeManagementFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeManagementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
