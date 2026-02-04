import { Routes } from '@angular/router';
import { LandingPageComponent } from './_landing-website/pages/landing-page/landing-page.component';
import { EmployeeManagementHomePageComponent } from './employee-management-website/pages/employee-management-home-page/employee-management-home-page.component';
import { EmployeeManagementFormComponent } from './employee-management-website/pages/employee-management-form/employee-management-form.component';


export const routes: Routes = [
    // _landing-website
    { path: '', component: LandingPageComponent },
    { path: 'EmployeeManagement', component: EmployeeManagementHomePageComponent },
    { path: 'EmployeeManagement/create', component: EmployeeManagementFormComponent },
    { path: 'EmployeeManagement/update/:employeeId',  component: EmployeeManagementFormComponent},
    {path: '**', redirectTo: '/', pathMatch:'full'} // wildcard for any page that doesn't exist
];
