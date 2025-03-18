import { Routes } from '@angular/router';
import { NursingReportFormComponent } from './nursing-report-form/nursing-report-form.component';

export const routes: Routes = [
  // デフォルトルート - 訪問看護報告書にリダイレクト
  { path: '', redirectTo: 'nursing-report', pathMatch: 'full' },
  
  // 訪問看護報告書
  { path: 'nursing-report', component: NursingReportFormComponent },
  
  // 医療報告書 - 今後実装予定
  { path: 'medical-report', component: NursingReportFormComponent }, // 仮に同じコンポーネントを使用
  
  // 介護報告書 - 今後実装予定
  { path: 'care-report', component: NursingReportFormComponent }, // 仮に同じコンポーネントを使用
  
  // 設定 - 今後実装予定
  { path: 'settings', component: NursingReportFormComponent }, // 仮に同じコンポーネントを使用
  
  // 存在しないルートの場合は訪問看護報告書にリダイレクト
  { path: '**', redirectTo: 'nursing-report' }
];
