import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { BudgetService } from '../../services/budget.service';
import { BudgetSummary } from '../../models/transaction.model';

@Component({
  selector: 'app-balance-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './balance-summary.component.html',
  styleUrls: ['./balance-summary.component.css'],
})
export class BalanceSummaryComponent implements OnInit {
  summary$!: Observable<BudgetSummary>;

  constructor(private budgetService: BudgetService) {}

  ngOnInit(): void {
    this.summary$ = this.budgetService.getSummary();
  }
}
