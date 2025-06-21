import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditCaseDetailComponent } from './audit-case-detail.component';

describe('AuditCaseDetailComponent', () => {
  let component: AuditCaseDetailComponent;
  let fixture: ComponentFixture<AuditCaseDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditCaseDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditCaseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
