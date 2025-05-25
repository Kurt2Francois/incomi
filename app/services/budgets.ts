import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  query, 
  where,
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { Budget } from '../types';

export class BudgetService {
  async create(userId: string, data: Omit<Budget, 'id' | 'userId' | 'spent'>): Promise<string> {
    try {
      const budgetData = {
        ...data,
        userId,
        spent: 0,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'budgets'), budgetData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating budget:', error);
      throw error;
    }
  }

  async getCurrentBudget(userId: string): Promise<Budget | null> {
    try {
      const now = new Date();
      const q = query(
        collection(db, 'budgets'),
        where('userId', '==', userId),
        where('month', '==', now.getMonth() + 1),
        where('year', '==', now.getFullYear())
      );

      const querySnapshot = await getDocs(q);
      const doc = querySnapshot.docs[0];
      
      return doc ? { id: doc.id, ...doc.data() } as Budget : null;
    } catch (error) {
      console.error('Error fetching current budget:', error);
      throw error;
    }
  }

  async updateSpent(id: string, amount: number): Promise<void> {
    try {
      const budgetRef = doc(db, 'budgets', id);
      await updateDoc(budgetRef, {
        spent: amount,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating budget spent:', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<Budget>): Promise<void> {
    try {
      const budgetRef = doc(db, 'budgets', id);
      await updateDoc(budgetRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'budgets', id));
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  }
}

export const budgetService = new BudgetService();