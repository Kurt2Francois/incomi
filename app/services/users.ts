import { db, auth } from '../config/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { User } from '../types';

export class UserService {
  // Authentication methods
  async register(email: string, password: string, name: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const timestamp = new Date().toISOString();
      const userData: User = {
        id: user.uid,
        email,
        name,
        createdAt: timestamp,
        updatedAt: timestamp
      };

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Update auth profile
      await updateProfile(user, { 
        displayName: name,
      });

      return userData;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  // Profile methods
  async getProfile(userId: string): Promise<User | null> {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }

      return {
        id: docSnap.id,
        ...docSnap.data()
      } as User;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp()
      });

      // Update auth profile if name is changed
      if (data.name && auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: data.name
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async deleteAccount(userId: string): Promise<void> {
    try {
      // Delete user document
      await deleteDoc(doc(db, 'users', userId));
      
      // Delete auth user
      if (auth.currentUser) {
        await auth.currentUser.delete();
      }

      // Clean up related data (optional)
      // Delete user's expenses
      // Delete user's income records
      // Delete user's categories
      // Delete user's budgets
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }

  // Helper methods
  getCurrentUser() {
    return auth.currentUser;
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    return auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await this.getProfile(firebaseUser.uid);
        callback(userData);
      } else {
        callback(null);
      }
    });
  }
}

export const userService = new UserService();