import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { BudgetService } from '../../services/budget.service';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css'],
})
export class TransactionListComponent implements OnInit {
  transactions$!: Observable<Transaction[]>;
  currentFilter = 'all';

  constructor(private budgetService: BudgetService) {}

  ngOnInit(): void {
    this.transactions$ = this.budgetService.transactions$.pipe(
      map((transactions) => this.filterTransactions(transactions))
    );
  }

  setFilter(filter: string): void {
    this.currentFilter = filter;
    this.transactions$ = this.budgetService.transactions$.pipe(
      map((transactions) => this.filterTransactions(transactions))
    );
  }

  private filterTransactions(transactions: Transaction[]): Transaction[] {
    if (this.currentFilter === 'all') return transactions;
    return transactions.filter((t) => t.type === this.currentFilter);
  }

  deleteTransaction(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta transacción?')) {
      this.budgetService.deleteTransaction(id);
    }
  }
}
