import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Transaction, BudgetSummary } from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private storageKey = 'budget-transactions';
  private transactionsSubject = new BehaviorSubject<Transaction[]>(
    this.loadFromStorage()
  );
  private nextId = this.getNextId();

  transactions$ = this.transactionsSubject.asObservable();

  constructor() {}

  addTransaction(transaction: Omit<Transaction, 'id'>): void {
    const newTransaction: Transaction = {
      ...transaction,
      id: this.nextId++,
    };

    const currentTransactions = this.transactionsSubject.value;
    const updatedTransactions = [...currentTransactions, newTransaction];

    this.transactionsSubject.next(updatedTransactions);
    this.saveToStorage(updatedTransactions);
  }

  deleteTransaction(id: number): void {
    const currentTransactions = this.transactionsSubject.value;
    const updatedTransactions = currentTransactions.filter((t) => t.id !== id);

    this.transactionsSubject.next(updatedTransactions);
    this.saveToStorage(updatedTransactions);
  }

  getSummary(): Observable<BudgetSummary> {
    return this.transactions$.pipe(
      map((transactions) => {
        const totalIncome = transactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = transactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        return {
          totalIncome,
          totalExpenses,
          balance: totalIncome - totalExpenses,
        };
      })
    );
  }

  private loadFromStorage(): Transaction[] {
    const data = localStorage.getItem(this.storageKey);
    if (!data) return [];

    return JSON.parse(data).map((t: any) => ({
      ...t,
      date: new Date(t.date),
    }));
  }

  private saveToStorage(transactions: Transaction[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(transactions));
  }

  private getNextId(): number {
    const transactions = this.loadFromStorage();
    return transactions.length > 0
      ? Math.max(...transactions.map((t) => t.id)) + 1
      : 1;
  }
}
