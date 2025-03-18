import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = '訪問看護報告書システム';
  
  constructor(private router: Router) {}

  /**
   * 指定されたルートに移動する
   * @param route 移動先のルート
   */
  navigateTo(route: string): void {
    // チェックボックスの状態をリセット（メニューを閉じる）
    const menuToggle = document.getElementById('menu-toggle') as HTMLInputElement;
    if (menuToggle) {
      menuToggle.checked = false;
    }

    // 指定されたルートに移動
    this.router.navigate([route]);
  }
}
