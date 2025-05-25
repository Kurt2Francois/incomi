export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string; // Change from Date to string
  updatedAt?: string;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  note: string;
  date: Date;
}

export interface Income {
  id: string;
  userId: string;
  amount: number;
  category: string;
  note: string;
  date: Date;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  icon: string;
  type: 'expense' | 'income';
}

export interface Budget {
  id: string;
  userId: string;
  amount: number;
  spent: number;
  month: number;
  year: number;
}

export interface Report {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  recentTransactions: Array<{
    type: 'income' | 'expense';
    id: string;
    userId: string;
    amount: number;
    category: string;
    note: string;
    date: string;  // Changed from Date to string
  }>;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  note: string;
  date: string;
}