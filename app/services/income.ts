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
import { Income } from '../types';

export class IncomeService {
  async create(userId: string, data: Omit<Income, 'id' | 'userId' | 'createdAt'>): Promise<string> {
    try {
      const incomeData = {
        ...data,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'income'), incomeData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating income:', error);
      throw error;
    }
  }

  async getByUserId(userId: string, month?: number, year?: number): Promise<Income[]> {
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

      const q = query(collection(db, 'income'), ...constraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Income));
    } catch (error) {
      console.error('Error fetching income:', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<Income>): Promise<void> {
    try {
      const incomeRef = doc(db, 'income', id);
      await updateDoc(incomeRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating income:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'income', id));
    } catch (error) {
      console.error('Error deleting income:', error);
      throw error;
    }
  }
}

export const incomeService = new IncomeService();