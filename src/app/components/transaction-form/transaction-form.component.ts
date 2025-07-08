import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BudgetService } from '../../services/budget.service';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css'],
})
export class TransactionFormComponent {
  transactionForm: FormGroup;

  categories = {
    income: ['Salario', 'Freelance', 'Inversiones', 'Otros'],
    expense: [
      'Alimentación',
      'Transporte',
      'Entretenimiento',
      'Servicios',
      'Otros',
    ],
  };

  constructor(private fb: FormBuilder, private budgetService: BudgetService) {
    this.transactionForm = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(3)]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      type: ['expense', Validators.required],
      category: ['', Validators.required],
      date: [new Date().toISOString().split('T')[0], Validators.required],
    });

    // Limpiar categoría cuando cambie el tipo
    this.transactionForm.get('type')?.valueChanges.subscribe(() => {
      this.transactionForm.get('category')?.setValue('');
    });
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.value;
      this.budgetService.addTransaction({
        ...formValue,
        amount: parseFloat(formValue.amount),
        date: new Date(formValue.date),
      });

      this.transactionForm.reset({
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }

  getCurrentCategories(): string[] {
    const type = this.transactionForm.get('type')?.value;
    return this.categories[type as keyof typeof this.categories] || [];
  }
}
