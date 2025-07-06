import { Component } from '@angular/core';
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
    <div class="app-container">
      <header class="app-header">
        <h1>{{ title }}</h1>
        <p>Controla tus finanzas personales</p>
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
export class AppComponent {
  title = 'Calculadora de Presupuesto Personal';
}
