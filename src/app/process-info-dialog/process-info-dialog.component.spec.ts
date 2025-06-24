import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessInfoDialogComponent } from './process-info-dialog.component';

describe('ProcessInfoDialogComponent', () => {
  let component: ProcessInfoDialogComponent;
  let fixture: ComponentFixture<ProcessInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessInfoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
