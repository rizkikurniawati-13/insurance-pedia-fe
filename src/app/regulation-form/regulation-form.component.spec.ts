import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegulationFormComponent } from './regulation-form.component';

describe('RegulationFormComponent', () => {
  let component: RegulationFormComponent;
  let fixture: ComponentFixture<RegulationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegulationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegulationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
