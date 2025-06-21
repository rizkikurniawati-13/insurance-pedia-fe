import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditCaseComponent } from './audit-case.component';

describe('AuditCaseComponent', () => {
  let component: AuditCaseComponent;
  let fixture: ComponentFixture<AuditCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditCaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
