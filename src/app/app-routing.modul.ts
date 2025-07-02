import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { GlossaryComponent } from './glossary/glossary.component';
import { InsuranceCompaniesComponent } from './insurance-companies/insurance-companies.component';
import { RegulationsComponent } from './regulations/regulations.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InsuranceCompaniesDetailComponent } from './insurance-companies-detail/insurance-companies-detail.component';
import { GlossaryFormComponent } from './glossary-form/glossary-form.component';
import { InsuranceCompaniesFormComponent } from './insurance-companies-form/insurance-companies-form.component';
import { RegulationFormComponent } from './regulation-form/regulation-form.component';
import { AuditCaseComponent } from './audit-case/audit-case.component';
import { AuditCaseDetailComponent } from './audit-case-detail/audit-case-detail.component';
import { AuditCaseFormComponent } from './audit-case-form/audit-case-form.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { AuthGuard } from './services/auth.guard';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { BusinessProcessComponent } from './business-process/business-process.component';
import { PuzzleComponent } from './puzzle/puzzle.component';
import { CrosswordComponent } from './crossword/crossword.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'forbidden', component: ForbiddenComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'business-process', component: BusinessProcessComponent, canActivate: [AuthGuard] },
    { path: 'glossary', component: GlossaryComponent, canActivate: [AuthGuard] },
    { path: 'glossary-form', component: GlossaryFormComponent, canActivate: [AuthGuard] },
    { path: 'insurance-companies', component: InsuranceCompaniesComponent, canActivate: [AuthGuard] },
    { path: 'insurance-companies-detail', component: InsuranceCompaniesDetailComponent, canActivate: [AuthGuard] },
    { path: 'insurance-companies-form', component: InsuranceCompaniesFormComponent, canActivate: [AuthGuard] },
    { path: 'regulations-form', component: RegulationFormComponent, canActivate: [AuthGuard] },
    { path: 'audit-case', component: AuditCaseComponent, canActivate: [AuthGuard] },
    { path: 'audit-case-detail', component: AuditCaseDetailComponent, canActivate: [AuthGuard] },
    { path: 'audit-case-form', component: AuditCaseFormComponent, canActivate: [AuthGuard] },
    { path: 'user-management', component: UserManagementComponent, canActivate: [AuthGuard],data: { roles: ['ADMIN'] } },
    { path: 'user-register', component: UserRegisterComponent, canActivate: [AuthGuard] },
    { path: 'regulations', component: RegulationsComponent, canActivate: [AuthGuard] },
    { path: 'puzzle', component: PuzzleComponent, canActivate: [AuthGuard] },
    { path: 'crossword', component: CrosswordComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

