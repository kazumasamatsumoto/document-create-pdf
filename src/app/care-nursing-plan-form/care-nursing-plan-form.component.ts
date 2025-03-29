import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

interface CareNursingPlan {
  patientName: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  age: string;
  requireCareLevel: number;
  address: string;
  nursingGoal: string;
  visitYear: string;
  visitMonth: string;
  visitDay: string;
  situation: string;
  evaluation: string;
  hasMaterials: boolean;
  materialDetails: string;
  materialName: string;
  materialQuantity: string;
  remarks: string;
  creatorName1: string;
  creatorName2: string;
  reportYear: string;
  reportMonth: string;
  reportDay: string;
  recipientName: string;
  officeName: string;
  managerName: string;
}

@Component({
  selector: 'app-care-nursing-plan-form',
  templateUrl: './care-nursing-plan-form.component.html',
  styleUrls: ['./care-nursing-plan-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class CareNursingPlanFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  planForm!: FormGroup;
  today = new Date();

  ngOnInit(): void {
    this.planForm = this.createForm();
  }

  createForm(): FormGroup {
    // フォームを作成
    const form = this.fb.group({
      patientName: ['鈴木 花子', Validators.required],
      birthYear: ['1950', Validators.required],
      birthMonth: ['4', Validators.required],
      birthDay: ['25', Validators.required],
      age: [''],
      requireCareLevel: [4], // 要介護2
      address: ['東京都中央区日本橋1-1-1'],
      nursingGoal: ['日常生活機能の維持・向上および心身の安定'],
      visitYear: [String(this.today.getFullYear())],
      visitMonth: [String(this.today.getMonth() + 1)],
      visitDay: [String(this.today.getDate())],
      situation: ['・食事摂取量が不安定\n・排泄の自立に向けたサポートが必要\n・疼痛管理による生活の質向上'],
      evaluation: ['・食事摂取量の変動について観察継続\n・排泄の自立度が向上\n・疼痛管理により活動量が増加'],
      hasMaterials: [true],
      materialDetails: ['創部処置、排泄ケア'],
      materialName: ['ガーゼ（5cm×5cm）、消毒液、保護テープ、尿取りパッド'],
      materialQuantity: ['各10枚、1本、1ロール、適量'],
      remarks: ['認知機能低下に注意し、指示は簡潔に行う。家族への介護指導も実施する。'],
      creatorName1: ['看護 花子'],
      creatorName2: ['リハビリ 太郎'],
      reportYear: [String(this.today.getFullYear())],
      reportMonth: [String(this.today.getMonth() + 1)],
      reportDay: [String(this.today.getDate())],
      recipientName: ['介護 一郎'],
      officeName: ['東京訪問看護ステーション'],
      managerName: ['管理 二郎']
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
    const reportElement = document.getElementById('care-nursing-plan');
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
        pdf.save('介護訪問看護計画書.pdf');
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
