import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareNursingPlanFormComponent } from './care-nursing-plan-form.component';

describe('CareNursingPlanFormComponent', () => {
  let component: CareNursingPlanFormComponent;
  let fixture: ComponentFixture<CareNursingPlanFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareNursingPlanFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareNursingPlanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
