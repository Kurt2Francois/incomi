import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { expenseService } from '../services/expenses';
import { incomeService } from '../services/income';
import { auth } from '../config/firebase';
import { Expense, Income } from '../types';

type Transaction = (Expense | Income) & { type: 'expense' | 'income' };

const LogsScreen = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadTransactions();
  }, [month, year]);

  const loadTransactions = async () => {
    if (!auth.currentUser) return;

    setLoading(true);
    try {
      const [expenses, incomes] = await Promise.all([
        expenseService.getByUserId(auth.currentUser.uid, month, year),
        incomeService.getByUserId(auth.currentUser.uid, month, year)
      ]);

      const allTransactions: Transaction[] = [
        ...expenses.map(e => ({ ...e, type: 'expense' as const })),
        ...incomes.map(i => ({ ...i, type: 'income' as const }))
      ].sort((a, b) => b.date.getTime() - a.date.getTime());

      setTransactions(allTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.logRow}>
      <MaterialIcons 
        name={item.type === 'expense' ? 'arrow-circle-down' : 'arrow-circle-up'} 
        size={24} 
        color={item.type === 'expense' ? '#E53935' : '#43A047'} 
      />
      <Text style={styles.logCategory}>{item.category}</Text>
      <Text style={item.type === 'expense' ? styles.logExpense : styles.logIncome}>
        {item.type === 'expense' ? '-' : '+'}${item.amount.toFixed(2)}
      </Text>
      {item.note && <Text style={styles.logNote}>{item.note}</Text>}
      <Text style={styles.logDate}>
        {new Date(item.date).toLocaleDateString()}
      </Text>
    </View>
  );

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (month === 0) {
        setMonth(11);
        setYear(year - 1);
      } else {
        setMonth(month - 1);
      }
    } else {
      if (month === 11) {
        setMonth(0);
        setYear(year + 1);
      } else {
        setMonth(month + 1);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigateMonth('prev')}>
          <MaterialIcons name="chevron-left" size={32} color="#1E88E5" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {new Date(year, month).toLocaleDateString('default', { 
            month: 'long', 
            year: 'numeric' 
          })}
        </Text>
        <TouchableOpacity onPress={() => navigateMonth('next')}>
          <MaterialIcons name="chevron-right" size={32} color="#1E88E5" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1E88E5" style={styles.loader} />
      ) : transactions.length > 0 ? (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={item => `${item.type}-${item.id}`}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.noEntry}>No transactions for this month</Text>
      )}
    </View>
  );
};

export default LogsScreen;

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
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#212121',
    marginBottom: 16,
    textAlign: 'center',
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    elevation: 1,
  },
  logCategory: {
    flex: 1,
    marginLeft: 8,
    fontWeight: 'bold',
    color: '#212121',
  },
  logIncome: {
    color: '#43A047',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  logExpense: {
    color: '#E53935',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  logNote: {
    flex: 1,
    color: '#888',
    marginLeft: 8,
    fontStyle: 'italic',
  },
  logDate: {
    color: '#888',
    fontSize: 12,
    marginLeft: 8,
  },
  noEntry: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});