import { Component } from '@angular/core';
import { NursingReportFormComponent } from './nursing-report-form/nursing-report-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NursingReportFormComponent],
  template: `
    <div>
      <h1>訪問看護報告書システム</h1>
      <app-nursing-report-form></app-nursing-report-form>
    </div>
  `,
  styles: [`
    h1 {
      color: #2c3e50;
      text-align: center;
      margin: 1rem 0;
    }
  `]
})
export class AppComponent {
  title = '訪問看護報告書システム';
}