import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc,
  getDocs, 
  query, 
  where,
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { Expense } from '../types';

export class ExpenseService {
  async create(userId: string, data: Omit<Expense, 'id' | 'userId' | 'createdAt'>): Promise<string> {
    try {
      const expenseData = {
        ...data,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'expenses'), expenseData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  }

  async getByUserId(userId: string, month?: number, year?: number): Promise<Expense[]> {
    try {
      let constraints = [
        where('userId', '==', userId),
        orderBy('date', 'desc')
      ];

      if (month !== undefined && year !== undefined) {
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);
        constraints.push(where('date', '>=', startDate));
        constraints.push(where('date', '<=', endDate));
      }

      const q = query(collection(db, 'expenses'), ...constraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Expense));
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<Expense>): Promise<void> {
    try {
      const expenseRef = doc(db, 'expenses', id);
      await updateDoc(expenseRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'expenses', id));
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  }
}

export const expenseService = new ExpenseService();