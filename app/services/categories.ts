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
import { Category } from '../types';

export class CategoryService {
  async create(userId: string, data: Omit<Category, 'id' | 'userId'>): Promise<string> {
    try {
      const categoryData = {
        ...data,
        userId,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'categories'), categoryData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async getByUserId(userId: string, type?: 'expense' | 'income'): Promise<Category[]> {
    try {
      let constraints = [where('userId', '==', userId)];
      
      if (type) {
        constraints.push(where('type', '==', type));
      }

      const q = query(collection(db, 'categories'), ...constraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Category));
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<Category>): Promise<void> {
    try {
      const categoryRef = doc(db, 'categories', id);
      await updateDoc(categoryRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
}

export const categoryService = new CategoryService();