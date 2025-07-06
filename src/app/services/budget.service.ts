import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Transaction, BudgetSummary } from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private readonly STORAGE_KEY = 'budget-transactions';
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  public transactions$ = this.transactionsSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadTransactions();
  }

  private loadTransactions(): void {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const transactions = JSON.parse(stored);
        this.transactionsSubject.next(transactions);
      }
    } else {
      this.transactionsSubject.next([]);
    }
  }

  private saveTransactions(transactions: Transaction[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(transactions));
    }
    this.transactionsSubject.next(transactions);
  }

  addTransaction(transaction: Omit<Transaction, 'id'>): void {
    const transactions = this.transactionsSubject.value;
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now() + Math.random(),
    };
    const updatedTransactions = [...transactions, newTransaction];
    this.saveTransactions(updatedTransactions);
  }

  deleteTransaction(id: number): void {
    const transactions = this.transactionsSubject.value;
    const updatedTransactions = transactions.filter((t) => t.id !== id);
    this.saveTransactions(updatedTransactions);
  }

  getSummary(): Observable<BudgetSummary> {
    return new Observable((observer) => {
      this.transactions$.subscribe((transactions) => {
        const totalIncome = transactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = transactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        const balance = totalIncome - totalExpenses;
        observer.next({ totalIncome, totalExpenses, balance });
      });
    });
  }
}
