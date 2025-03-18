import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

interface NursingReport {
  patientName: string;
  birthDate: string;
  caregiverFacility: string;
  requireCareLevel: number;
  visitDatesPrevMonth: number[];
  visitDatesCurrentMonth: number[];
  specialNotes: string;
  nursingContent: string;
  familyCooperation: string;
  materialName: string;
  usagePurpose: string;
  usageAmount: string;
  materialChange: boolean;
  changeDetails: string;
  otherNotes: string;
  creatorName: string;
  reportYear: string;
  reportMonth: string;
  reportDay: string;
  managerName: string;
}

@Component({
  selector: 'app-nursing-report-form',
  templateUrl: './nursing-report-form.component.html',
  styleUrls: ['./nursing-report-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class NursingReportFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  reportForm!: FormGroup;
  today = new Date();
  currentMonth = new Date();
  prevMonth = new Date();
  currentMonthName: string = '';
  prevMonthName: string = '';

  ngOnInit(): void {
    // 現在の月を設定
    this.currentMonth = new Date();

    // 前月を設定
    this.prevMonth = new Date();
    this.prevMonth.setMonth(this.prevMonth.getMonth() - 1);

    // 月名を設定
    this.currentMonthName = this.getMonthName(this.currentMonth);
    this.prevMonthName = this.getMonthName(this.prevMonth);

    this.reportForm = this.createForm();
  }

  getMonthName(date: Date): string {
    // 年月の表示形式はそのまま保持
    return date.getFullYear() + '年' + (date.getMonth() + 1) + '月';
  }

  createForm(): FormGroup {
    return this.fb.group({
      patientName: ['山田 太郎', Validators.required],
      birthYear: ['1955', Validators.required],
      birthMonth: ['3', Validators.required],
      birthDay: ['15', Validators.required],
      caregiverFacility: ['東京訪問看護ステーション'],
      requireCareLevel: [5], // 要介護3
      visitDatesPrevMonth: this.createVisitDatesArray(),
      visitDatesCurrentMonth: this.createVisitDatesArray(),
      specialNotes: ['特記事項なし'],
      nursingContent: ['バイタルサイン測定、健康状態確認、服薬指導、運動機能訓練を実施'],
      familyCooperation: ['長男が主に介護を担当しており、毎日の生活支援を行っている'],
      materialName: ['消毒液、ガーゼ、テープ'],
      usagePurpose: ['創傷処置に使用'],
      usageAmount: ['各1個'],
      materialChange: [false],
      changeDetails: [''],
      otherNotes: [''],
      creatorName: ['看護 花子'],
      reportYear: ['2025'],
      reportMonth: ['3'],
      reportDay: ['17'],
      managerName: ['']
    });
  }

  createVisitDatesArray(): FormArray {
    // すべての日を非表示（0）に設定
    const defaultVisits = Array(31).fill(0);

    return this.fb.array(defaultVisits.map(value => this.fb.control(value)));
  }

  toggleVisitDate(index: number, month: string): void {
    const monthKey = month === 'Current' ? 'visitDatesCurrentMonth' : 'visitDatesPrevMonth';
    const visitDates = this.reportForm.get(monthKey) as FormArray;
    const currentValue = visitDates.at(index).value;

    // 0: 非表示、1: ○、2: ◎、3: △、4: ×、5: 非表示（0に戻る）
    const nextValue = (currentValue + 1) % 5;

    visitDates.at(index).setValue(nextValue);
  }

  // 月の日数を取得
  getDaysInMonth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  toggleCareLevel(level: number): void {
    this.reportForm.get('requireCareLevel')?.setValue(level);
  }

  generatePDF(): void {
    const reportElement = document.getElementById('nursing-report');
    if (!reportElement) {
      console.error('Report element not found');
      return;
    }

    // 画面サイズを確認
    console.log(`Element size: ${reportElement.offsetWidth} x ${reportElement.offsetHeight}`);

    // HTML2Canvasのオプション - 重要な設定を調整
    const options = {
      // 高解像度で全体を捉える
      scale: 2,
      // 背景色
      backgroundColor: '#ffffff',
      // 要素の全体を確実に捉えるための設定
      width: reportElement.scrollWidth + 10, // 横幅にも余裕を持たせる
      height: reportElement.scrollHeight + 100, // 余裕を持たせる
      windowWidth: reportElement.scrollWidth + 10, // 横幅のウィンドウサイズも調整
      windowHeight: reportElement.scrollHeight + 100,
      // セキュリティ関連設定
      useCORS: true,
      allowTaint: true,
      // レンダリング改善
      letterRendering: true,
      // ログを詳細に
      logging: true,
      // スクロール対策
      scrollY: -window.scrollY,
      scrollX: -window.scrollX
    };

    // 処理中メッセージ
    console.log('PDFを生成しています...');

    // HTML要素をキャンバスに変換 - 全体を一度に捉える
    html2canvas(reportElement, options).then(canvas => {
      console.log(`Canvas生成成功: ${canvas.width} x ${canvas.height}`);

      try {
        // A4サイズのPDFドキュメントを作成（単一ページ）
        const pdf = new jspdf('p', 'mm', 'a4');

        // A4サイズのピクセル比を計算
        const pageWidth = 210;  // A4幅（mm）
        const pageHeight = 297; // A4高さ（mm）

        // 余白の設定
        const margin = 5; // mmを増やす
        const contentWidth = pageWidth - (margin * 2);
        const contentHeight = pageHeight - (margin * 2);

        // キャンバスをPDFに収めるための縮小率計算
        const scale = Math.min(
          contentWidth / canvas.width,
          contentHeight / canvas.height
        ) * 1; // 85%に縮小してさらに余裕を持たせる

        // 縮小後のサイズ
        const scaledWidth = canvas.width * scale;
        const scaledHeight = canvas.height * scale;

        // 画像を中央に配置するための座標計算
        const x = (pageWidth - scaledWidth) / 2;
        const y = (pageHeight - scaledHeight) / 2;

        // PNG形式で画像を取得
        const imgData = canvas.toDataURL('image/png', 1.0);

        // PDFに画像を追加（縮小・中央配置）
        pdf.addImage(
          imgData,
          'PNG',
          x,
          y,
          scaledWidth,
          scaledHeight
        );

        // PDFを保存
        pdf.save('訪問看護報告書.pdf');
        console.log('PDF生成完了');
      } catch (error) {
        console.error('PDF生成エラー:', error);
      }
    }).catch(error => {
      console.error('キャンバス生成エラー:', error);
    });
  }

  onSubmit(): void {
    console.log('Form submitted, validation status:', this.reportForm.valid);
    if (this.reportForm.valid) {
      this.generatePDF();
    } else {
      const controls = this.reportForm.controls;
      const invalidControls = Object.keys(controls).filter(key => controls[key].invalid);
      console.log('Invalid controls:', invalidControls);
      console.log('Form validation failed:', this.reportForm.errors);
    }
  }

  resetForm(): void {
    this.reportForm.reset();
    this.reportForm = this.createForm();
  }

  getVisitDatesArray(month: string): number[] {
    if (!this.reportForm) return Array(31).fill(0);
    const monthKey = month === 'Current' ? 'visitDatesCurrentMonth' : 'visitDatesPrevMonth';
    const visitDatesFormArray = this.reportForm.get(monthKey) as FormArray;
    return visitDatesFormArray ? visitDatesFormArray.controls.map(control => control.value as number) : [];
  }

  // 訪問マークの種類を取得
  getVisitMark(value: number): string {
    switch (value) {
      case 1: return '○';
      case 2: return '◎';
      case 3: return '△';
      case 4: return '×';
      default: return '';
    }
  }
}
