import { Category } from '../types';

export const DEFAULT_EXPENSE_CATEGORIES: Omit<Category, 'id' | 'userId'>[] = [
  { name: 'Food & Drinks', icon: 'restaurant', type: 'expense' },
  { name: 'Shopping', icon: 'shopping-bag', type: 'expense' },
  { name: 'Transport', icon: 'directions-car', type: 'expense' },
  { name: 'Bills', icon: 'receipt', type: 'expense' },
  { name: 'Entertainment', icon: 'movie', type: 'expense' },
  { name: 'Health', icon: 'healing', type: 'expense' },
  { name: 'Education', icon: 'school', type: 'expense' },
  { name: 'Other', icon: 'more-horiz', type: 'expense' },
];

export const DEFAULT_INCOME_CATEGORIES: Omit<Category, 'id' | 'userId'>[] = [
  { name: 'Salary', icon: 'work', type: 'income' },
  { name: 'Business', icon: 'business', type: 'income' },
  { name: 'Investment', icon: 'trending-up', type: 'income' },
  { name: 'Gift', icon: 'card-giftcard', type: 'income' },
  { name: 'Other', icon: 'more-horiz', type: 'income' },
];