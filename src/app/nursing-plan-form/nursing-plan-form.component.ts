import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

interface NursingPlan {
  patientName: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  age: string;
  requireCareLevel: number;
  address: string;
  nursingGoal: string;
  planDate: string;
  situation: string;
  supportContent: string;
  evaluation: string;
  hasMaterials: boolean;
  materialDetails: string;
  materialName: string;
  materialQuantity: string;
  visitSchedule: string;
  remarks: string;
  reportYear: string;
  reportMonth: string;
  reportDay: string;
  recipientName: string;
  officeName: string;
  managerName: string;
}

@Component({
  selector: 'app-nursing-plan-form',
  templateUrl: './nursing-plan-form.component.html',
  styleUrls: ['./nursing-plan-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class NursingPlanFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  planForm!: FormGroup;
  today = new Date();

  ngOnInit(): void {
    this.planForm = this.createForm();
  }

  createForm(): FormGroup {
    // フォームを作成
    const form = this.fb.group({
      patientName: ['山田 太郎', Validators.required],
      birthYear: ['1955', Validators.required],
      birthMonth: ['3', Validators.required],
      birthDay: ['15', Validators.required],
      age: [''],
      requireCareLevel: [5], // 要介護3
      address: ['東京都新宿区西新宿1-1-1'],
      nursingGoal: ['日常生活の自立支援とリハビリテーションの継続'],
      planDate: ['2025年3月29日'],
      situation: ['現在の状況・課題文章をここに入力します'],
      supportContent: ['支援内容文章をここに入力します'],
      evaluation: ['評価文章をここに入力します'],
      hasMaterials: [true],
      materialDetails: ['衛生材料と種類の詳細'],
      materialName: ['消毒液、ガーゼ、テープ'],
      materialQuantity: ['各1個'],
      visitSchedule: ['来月以降の訪問予定の概要'],
      remarks: ['備考・特記事項'],
      reportYear: ['2025'],
      reportMonth: ['3'],
      reportDay: ['29'],
      recipientName: ['医療 一郎'],
      officeName: ['東京訪問看護ステーション'],
      managerName: ['看護 花子']
    });

    // 初期年齢を計算
    this.calculateAge(form);

    // 生年月日の変更を監視して年齢を再計算
    form.get('birthYear')?.valueChanges.subscribe(() => this.calculateAge(form));
    form.get('birthMonth')?.valueChanges.subscribe(() => this.calculateAge(form));
    form.get('birthDay')?.valueChanges.subscribe(() => this.calculateAge(form));

    // フォームを返す
    return form;
  }

  // 年齢を計算するメソッド
  calculateAge(form: FormGroup): void {
    const birthYear = form.get('birthYear')?.value;
    const birthMonth = form.get('birthMonth')?.value;
    const birthDay = form.get('birthDay')?.value;

    if (birthYear && birthMonth && birthDay) {
      try {
        // 文字列を数値に変換
        const year = parseInt(birthYear, 10);
        const month = parseInt(birthMonth, 10) - 1; // JavaScriptの月は0から始まる
        const day = parseInt(birthDay, 10);

        // 有効な日付かどうかチェック
        if (isNaN(year) || isNaN(month) || isNaN(day) || month < 0 || month > 11 || day < 1 || day > 31) {
          form.get('age')?.setValue('');
          return;
        }

        const birthDate = new Date(year, month, day);
        const today = new Date();
        
        // 有効な日付かどうか再度チェック
        if (birthDate.toString() === 'Invalid Date') {
          form.get('age')?.setValue('');
          return;
        }
        
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        // 誕生日がまだ来ていない場合は1歳引く
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        form.get('age')?.setValue(age.toString());
      } catch (error) {
        console.error('年齢計算エラー:', error);
        form.get('age')?.setValue('');
      }
    } else {
      form.get('age')?.setValue('');
    }
  }

  toggleCareLevel(level: number): void {
    this.planForm.get('requireCareLevel')?.setValue(level);
  }

  toggleMaterialsAvailability(hasAvailable: boolean): void {
    this.planForm.get('hasMaterials')?.setValue(hasAvailable);
  }

  generatePDF(): void {
    const reportElement = document.getElementById('nursing-plan');
    if (!reportElement) {
      console.error('Report element not found');
      return;
    }

    // 画面サイズを確認
    console.log(`Element size: ${reportElement.offsetWidth} x ${reportElement.offsetHeight}`);

    // HTML2Canvasのオプション
    const options = {
      scale: 2,
      backgroundColor: '#ffffff',
      width: reportElement.scrollWidth + 10,
      height: reportElement.scrollHeight + 100,
      windowWidth: reportElement.scrollWidth + 10,
      windowHeight: reportElement.scrollHeight + 100,
      useCORS: true,
      allowTaint: true,
      letterRendering: true,
      logging: true,
      scrollY: -window.scrollY,
      scrollX: -window.scrollX
    };

    // 処理中メッセージ
    console.log('PDFを生成しています...');

    // HTML要素をキャンバスに変換
    html2canvas(reportElement, options).then(canvas => {
      console.log(`Canvas生成成功: ${canvas.width} x ${canvas.height}`);

      try {
        // A4サイズのPDFドキュメントを作成
        const pdf = new jspdf('p', 'mm', 'a4');

        // A4サイズのピクセル比を計算
        const pageWidth = 210;  // A4幅（mm）
        const pageHeight = 297; // A4高さ（mm）

        // 余白の設定
        const margin = 5;
        const contentWidth = pageWidth - (margin * 2);
        const contentHeight = pageHeight - (margin * 2);

        // キャンバスをPDFに収めるための縮小率計算
        const scale = Math.min(
          contentWidth / canvas.width,
          contentHeight / canvas.height
        ) * 1;

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
        pdf.save('訪問看護計画書.pdf');
        console.log('PDF生成完了');
      } catch (error) {
        console.error('PDF生成エラー:', error);
      }
    }).catch(error => {
      console.error('キャンバス生成エラー:', error);
    });
  }

  onSubmit(): void {
    console.log('Form submitted, validation status:', this.planForm.valid);
    if (this.planForm.valid) {
      this.generatePDF();
    } else {
      const controls = this.planForm.controls;
      const invalidControls = Object.keys(controls).filter(key => controls[key].invalid);
      console.log('Invalid controls:', invalidControls);
      console.log('Form validation failed:', this.planForm.errors);
    }
  }

  resetForm(): void {
    this.planForm.reset();
    this.planForm = this.createForm();
  }
}
