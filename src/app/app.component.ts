import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { BalanceSummaryComponent } from './components/balance-summary/balance-summary.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    TransactionFormComponent,
    TransactionListComponent,
    BalanceSummaryComponent,
  ],
  template: `
    <div class="app-container" [class.dark-mode]="isDarkMode">
      <header class="app-header">
        <div class="header-content">
          <div>
            <h1>{{ title }}</h1>
            <p>Controla tus finanzas personales</p>
          </div>
          <button class="theme-toggle" (click)="toggleTheme()">
            {{ isDarkMode ? '☀️' : '🌙' }}
          </button>
        </div>
      </header>

      <main class="app-main">
        <div class="container">
          <app-balance-summary></app-balance-summary>
          <app-transaction-form></app-transaction-form>
          <app-transaction-list></app-transaction-list>
        </div>
      </main>
    </div>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Calculadora de Presupuesto Personal';
  isDarkMode = false;

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }
}
