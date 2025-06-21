import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditCaseFormComponent } from './audit-case-form.component';

describe('AuditCaseFormComponent', () => {
  let component: AuditCaseFormComponent;
  let fixture: ComponentFixture<AuditCaseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditCaseFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditCaseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
