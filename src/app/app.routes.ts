import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/_auth/pages/login/login-page/login-page.component';
import { ForgotPasswordPageComponent } from './pages/_auth/pages/forgot-password/forgot-password-page/forgot-password-page.component';
import { RegisterPageComponent } from './pages/_auth/pages/register/register-page/register-page.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { EmployeeManagementHomePageComponent } from './pages/employee-management/employee-management-home-page/employee-management-home-page.component';
import { EmployeeManagementFormComponent } from './pages/employee-management/employee-management-form/employee-management-form.component';
import { WorldMapHomePageComponent } from './pages/world-map-home-page/world-map-home-page.component';
import { BubblePopperPageComponent } from './pages/bubble-popper-page/bubble-popper-page.component';


export const routes: Routes = [
    // _landing-website ---------------------------------------------------------------------------
    { path: '', component: LandingPageComponent },

    // auth pages ---------------------------------------------------------------------------------
    { path: 'login', component: LoginPageComponent },
    { path: 'login/forgot-password', component: ForgotPasswordPageComponent },
    { path: 'login/register', component: RegisterPageComponent },
    // auth pages ---------------------------------------------------------------------------------

    // employee-management-website-----------------------------------------------------------------
    { path: 'EmployeeManagement', component: EmployeeManagementHomePageComponent },
    { path: 'EmployeeManagement/create', component: EmployeeManagementFormComponent },
    { path: 'EmployeeManagement/update/:employeeId',  component: EmployeeManagementFormComponent },
    // employee-management-website-----------------------------------------------------------------

    { path: 'WorldMap', component: WorldMapHomePageComponent },

    { path: 'Bubble-Popper-Game', component: BubblePopperPageComponent },

    {path: '**', redirectTo: '/', pathMatch:'full' } // wildcard for any page that doesn't exist
];
