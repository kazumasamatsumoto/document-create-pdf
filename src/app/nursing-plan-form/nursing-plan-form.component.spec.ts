import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NursingPlanFormComponent } from './nursing-plan-form.component';

describe('NursingPlanFormComponent', () => {
  let component: NursingPlanFormComponent;
  let fixture: ComponentFixture<NursingPlanFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NursingPlanFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NursingPlanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
