import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NursingReportFormComponent } from './nursing-report-form.component';

describe('NursingReportFormComponent', () => {
  let component: NursingReportFormComponent;
  let fixture: ComponentFixture<NursingReportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NursingReportFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NursingReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
