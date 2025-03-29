import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentalHealthNursingReportFormComponent } from './mental-health-nursing-report-form.component';

describe('MentalHealthNursingReportFormComponent', () => {
  let component: MentalHealthNursingReportFormComponent;
  let fixture: ComponentFixture<MentalHealthNursingReportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentalHealthNursingReportFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentalHealthNursingReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
