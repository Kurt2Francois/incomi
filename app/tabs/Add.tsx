import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Modal, FlatList, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { expenseService } from '../services/expenses';
import { incomeService } from '../services/income';
import { categoryService } from '../services/categories';
import { auth } from '../config/firebase';
import { Category } from '../types';
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '../constants/categories';
import { router } from 'expo-router';

const AddScreen = () => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [note, setNote] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('category');

  useEffect(() => {
    loadCategories();
  }, [type]);

  const createDefaultCategories = async () => {
    if (!auth.currentUser) return;
    
    try {
      const defaultCategories = type === 'expense' ? 
        DEFAULT_EXPENSE_CATEGORIES : 
        DEFAULT_INCOME_CATEGORIES;

      for (const category of defaultCategories) {
        await categoryService.create(auth.currentUser.uid, category);
      }
      
      await loadCategories();
    } catch (error) {
      console.error('Error creating default categories:', error);
      Alert.alert('Error', 'Failed to create default categories');
    }
  };

  const loadCategories = async () => {
    if (!auth.currentUser) return;
    try {
      const userCategories = await categoryService.getByUserId(auth.currentUser.uid, type);
      if (userCategories.length === 0) {
        await createDefaultCategories();
      } else {
        setCategories(userCategories);
        setCategory(userCategories[0]);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      Alert.alert('Error', 'Failed to load categories');
    }
  };

  const handleAdd = async () => {
    if (!auth.currentUser) return;

    setLoading(true);
    try {
      const data = {
        amount: parseFloat(amount),
        category: category?.name || '',
        note,
        date: new Date(),
      };

      if (type === 'expense') {
        await expenseService.create(auth.currentUser.uid, data);
      } else {
        await incomeService.create(auth.currentUser.uid, data);
      }

      // Clear form
      setAmount('');
      setCategory(null);
      setNote('');
      
      // Navigate back to home
      router.push('/tabs');
      
    } catch (error) {
      console.error('Error adding transaction:', error);
      Alert.alert('Error', 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!auth.currentUser || !newCategoryName.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    try {
      const newCategory = {
        name: newCategoryName.trim(),
        icon: selectedIcon,
        type,
      };

      await categoryService.create(auth.currentUser.uid, newCategory);
      await loadCategories();
      setShowNewCategoryModal(false);
      setNewCategoryName('');
      setSelectedIcon('category');
    } catch (error) {
      console.error('Error creating category:', error);
      Alert.alert('Error', 'Failed to create category');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Transaction</Text>
      <View style={styles.switchRow}>
        <TouchableOpacity
          style={[styles.switchBtn, type === 'expense' && styles.switchActive]}
          onPress={() => setType('expense')}
        >
          <MaterialIcons name="arrow-upward" size={18} color={type === 'expense' ? '#fff' : '#1E88E5'} />
          <Text style={type === 'expense' ? styles.switchTextActive : styles.switchText}>Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.switchBtn, type === 'income' && styles.switchActive]}
          onPress={() => setType('income')}
        >
          <MaterialIcons name="arrow-downward" size={18} color={type === 'income' ? '#fff' : '#1E88E5'} />
          <Text style={type === 'income' ? styles.switchTextActive : styles.switchText}>Income</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <View style={styles.categoryRow}>
        <TouchableOpacity 
          style={[styles.categoryPicker, { flex: 1 }]} 
          onPress={() => setShowCategoryModal(true)}
        >
          <MaterialIcons 
            name={category?.icon as keyof typeof MaterialIcons.glyphMap || 'category'} 
            size={20} 
            color="#1E88E5" 
          />
          <Text style={styles.categoryText}>
            {category?.name || 'Select Category'}
          </Text>
          <MaterialIcons name="arrow-drop-down" size={20} color="#1E88E5" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.addCategoryBtn}
          onPress={() => setShowNewCategoryModal(true)}
        >
          <MaterialIcons name="add" size={24} color="#1E88E5" />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Note (optional)"
        value={note}
        onChangeText={setNote}
      />

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleAdd}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Add Transaction</Text>
        )}
      </TouchableOpacity>

      {/* Category Selection Modal */}
      <Modal visible={showCategoryModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>
            {categories.length > 0 ? (
              <FlatList
                data={categories}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setCategory(item);
                      setShowCategoryModal(false);
                    }}
                  >
                    <MaterialIcons 
                      name={item.icon as keyof typeof MaterialIcons.glyphMap} 
                      size={20} 
                      color="#1E88E5" 
                    />
                    <Text style={styles.categoryText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text style={styles.noCategories}>
                No categories found. Add one to continue.
              </Text>
            )}
            <TouchableOpacity 
              style={styles.modalCloseBtn}
              onPress={() => setShowCategoryModal(false)}
            >
              <Text style={styles.modalCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* New Category Modal */}
      <Modal visible={showNewCategoryModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Category</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Category Name"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
            />

            <FlatList
              data={Object.keys(MaterialIcons.glyphMap)}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.iconButton,
                    selectedIcon === item && styles.selectedIcon
                  ]}
                  onPress={() => setSelectedIcon(item)}
                >
                  <MaterialIcons 
                    name={item as keyof typeof MaterialIcons.glyphMap}
                    size={24}
                    color={selectedIcon === item ? '#fff' : '#1E88E5'}
                  />
                </TouchableOpacity>
              )}
              keyExtractor={item => item}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowNewCategoryModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddCategory}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginBottom: 24,
    textAlign: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'center',
  },
  switchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: '#e3eaf2',
  },
  switchActive: {
    backgroundColor: '#1E88E5',
  },
  switchText: {
    color: '#1E88E5',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  switchTextActive: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    borderColor: '#1E88E5',
    borderWidth: 1,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    borderColor: '#1E88E5',
    borderWidth: 1,
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#1E88E5',
    flex: 1,
  },
  addCategoryBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#1E88E5',
  },
  button: {
    backgroundColor: '#1E88E5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: 300,
    maxHeight: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  noCategories: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 20,
  },
  modalCloseBtn: {
    backgroundColor: '#E53935',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  modalCloseBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  selectedIcon: {
    backgroundColor: '#1E88E5',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#E53935',
  },
  saveButton: {
    backgroundColor: '#43A047',
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});