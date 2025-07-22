import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardBpuiComponent } from './dashboard-bpui.component';

describe('DashboardBpuiComponent', () => {
  let component: DashboardBpuiComponent;
  let fixture: ComponentFixture<DashboardBpuiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardBpuiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardBpuiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
