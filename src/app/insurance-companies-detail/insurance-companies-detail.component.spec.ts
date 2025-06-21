import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceCompaniesDetailComponent } from './insurance-companies-detail.component';

describe('InsuranceCompaniesDetailComponent', () => {
  let component: InsuranceCompaniesDetailComponent;
  let fixture: ComponentFixture<InsuranceCompaniesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsuranceCompaniesDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsuranceCompaniesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
