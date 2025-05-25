import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { budgetService } from '../services/budgets';
import { categoryService } from '../services/categories';
import { auth } from '../config/firebase';
import { Budget, Category } from '../types';

const BudgetsScreen = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newAmount, setNewAmount] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!auth.currentUser) return;

    setLoading(true);
    try {
      const [userBudgets, expenseCategories] = await Promise.all([
        budgetService.getCurrentBudget(auth.currentUser.uid),
        categoryService.getByUserId(auth.currentUser.uid, 'expense')
      ]);

      setBudgets(userBudgets ? [userBudgets] : []);
      setCategories(expenseCategories);
    } catch (error) {
      console.error('Error loading budgets:', error);
      Alert.alert('Error', 'Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBudget = async (budgetId: string) => {
    if (!newAmount || isNaN(Number(newAmount))) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      await budgetService.update(budgetId, { amount: Number(newAmount) });
      setEditingId(null);
      setNewAmount('');
      loadData(); // Reload budgets
    } catch (error) {
      console.error('Error updating budget:', error);
      Alert.alert('Error', 'Failed to update budget');
    }
  };

  const handleCreateBudget = async () => {
    if (!auth.currentUser) return;
    if (!newAmount || isNaN(Number(newAmount))) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      const now = new Date();
      await budgetService.create(auth.currentUser.uid, {
        amount: Number(newAmount),
        month: now.getMonth() + 1,
        year: now.getFullYear()
      });
      setNewAmount('');
      loadData(); // Reload budgets
    } catch (error) {
      console.error('Error creating budget:', error);
      Alert.alert('Error', 'Failed to create budget');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Monthly Budget</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#1E88E5" style={styles.loader} />
      ) : budgets.length > 0 ? (
        budgets.map(budget => (
          <View key={budget.id} style={styles.budgetCard}>
            <View style={styles.budgetHeader}>
              <Text style={styles.budgetMonth}>
                {new Date(budget.year, budget.month - 1).toLocaleDateString('default', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </Text>
              <TouchableOpacity onPress={() => setEditingId(budget.id)}>
                <MaterialIcons name="edit" size={24} color="#1E88E5" />
              </TouchableOpacity>
            </View>

            {editingId === budget.id ? (
              <View style={styles.editRow}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={newAmount}
                  onChangeText={setNewAmount}
                  placeholder="Enter new amount"
                />
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={() => handleUpdateBudget(budget.id)}
                >
                  <MaterialIcons name="check" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.budgetAmount}>
                  ${budget.amount.toFixed(2)}
                </Text>
                <Text style={styles.budgetSpent}>
                  Spent: ${budget.spent.toFixed(2)}
                </Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { 
                        width: `${Math.min((budget.spent / budget.amount) * 100, 100)}%`,
                        backgroundColor: budget.spent > budget.amount ? '#E53935' : '#43A047'
                      }
                    ]} 
                  />
                </View>
              </>
            )}
          </View>
        ))
      ) : (
        <View style={styles.createBudgetCard}>
          <Text style={styles.noBudgetText}>No budget set for this month</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={newAmount}
            onChangeText={setNewAmount}
            placeholder="Enter budget amount"
          />
          <TouchableOpacity 
            style={styles.button}
            onPress={handleCreateBudget}
          >
            <MaterialIcons name="add" size={24} color="#fff" />
            <Text style={styles.buttonText}>Set Monthly Budget</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default BudgetsScreen;

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
  budgetCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  budgetMonth: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E88E5',
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    borderColor: '#1E88E5',
    borderWidth: 1,
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#43A047',
    borderRadius: 8,
    padding: 10,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  budgetAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginBottom: 8,
  },
  budgetSpent: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  createBudgetCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  noBudgetText: {
    fontSize: 18,
    color: '#757575',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#1E88E5',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  }
});