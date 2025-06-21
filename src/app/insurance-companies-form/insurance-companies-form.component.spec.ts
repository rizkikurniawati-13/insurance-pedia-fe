import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceCompaniesFormComponent } from './insurance-companies-form.component';

describe('InsuranceCompaniesFormComponent', () => {
  let component: InsuranceCompaniesFormComponent;
  let fixture: ComponentFixture<InsuranceCompaniesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsuranceCompaniesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsuranceCompaniesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
