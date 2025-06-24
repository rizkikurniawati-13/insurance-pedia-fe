import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideRouter, RouterModule } from '@angular/router';
import { AppRoutingModule, routes } from './app-routing.modul';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { GlossaryComponent } from './glossary/glossary.component';
import { InsuranceCompaniesComponent } from './insurance-companies/insurance-companies.component';
import { RegulationsComponent } from './regulations/regulations.component';
import { FormsModule } from '@angular/forms';
import { InsuranceCompaniesDetailComponent } from './insurance-companies-detail/insurance-companies-detail.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { GlossaryFormComponent } from './glossary-form/glossary-form.component';
import { InsuranceCompaniesFormComponent } from './insurance-companies-form/insurance-companies-form.component';
import { RegulationFormComponent } from './regulation-form/regulation-form.component';
import { AuditCaseComponent } from './audit-case/audit-case.component';
import { AuditCaseDetailComponent } from './audit-case-detail/audit-case-detail.component';
import { AuditCaseFormComponent } from './audit-case-form/audit-case-form.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';
import { AuthGuard } from './services/auth.guard';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { BusinessProcessComponent } from './business-process/business-process.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    GlossaryComponent,
    GlossaryFormComponent,
    InsuranceCompaniesComponent,
    RegulationsComponent,
    InsuranceCompaniesDetailComponent,
    SidebarComponent,
    InsuranceCompaniesFormComponent,
    RegulationFormComponent,
    AuditCaseComponent,
    AuditCaseDetailComponent,
    AuditCaseFormComponent,
    UserManagementComponent,
    UserRegisterComponent,
    ForbiddenComponent,
    BusinessProcessComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxGraphModule,
    NgxChartsModule,
    MatDialogModule,
    MatButtonModule,
    NgxPaginationModule
  ],
  providers: [
    AuthGuard,
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }