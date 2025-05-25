import { db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Expense, Income, Report } from '../types';
import { expenseService } from './expenses';
import { incomeService } from './income';

export class ReportService {
  async generateMonthlyReport(userId: string, month: number, year: number): Promise<Report> {
    try {
      const [expenses, incomes] = await Promise.all([
        expenseService.getByUserId(userId, month, year),
        incomeService.getByUserId(userId, month, year)
      ]);

      const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);

      // Convert dates to strings and combine transactions
      const recentTransactions = [
        ...expenses.map(exp => ({ 
          ...exp, 
          type: 'expense' as const,
          date: exp.date.toISOString() 
        })),
        ...incomes.map(inc => ({ 
          ...inc, 
          type: 'income' as const,
          date: inc.date.toISOString()
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        recentTransactions
      };
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }
}

export const reportService = new ReportService();