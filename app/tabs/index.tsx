import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { reportService } from '../services/reports';
import { budgetService } from '../services/budgets';
import { auth } from '../config/firebase';
import { Report, Budget, Transaction } from '../types';
import { router } from 'expo-router';
import { EventRegister } from 'react-native-event-listeners';

const HomeScreen = () => {
  const [report, setReport] = useState<Report | null>(null);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 0);
      return;
    }
    
    loadDashboardData();

    // Add event listener for transaction updates with type assertion
    const listener = EventRegister.addEventListener(
      'transactionAdded',
      () => {
        loadDashboardData();
      }
    ) as string;  // Add type assertion here

    return () => {
      if (typeof listener === 'string') {
        EventRegister.removeEventListener(listener);
      }
    };
  }, []);

  const loadDashboardData = async () => {
    if (!auth.currentUser) return;
    
    setLoading(true);
    try {
      const now = new Date();
      const [monthlyReport, budget] = await Promise.all([
        reportService.generateMonthlyReport(auth.currentUser.uid, now.getMonth() + 1, now.getFullYear()),
        budgetService.getCurrentBudget(auth.currentUser.uid)
      ]);

      setReport(monthlyReport);
      setCurrentBudget(budget);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E88E5" />
      </View>
    );
  }

  const renderTransaction = (entry: Transaction) => {
    const isExpense = entry.type === 'expense';
    const icon = isExpense ? 'arrow-downward' : 'arrow-upward';
    const color = isExpense ? '#E53935' : '#43A047';
    
    return (
      <View style={styles.transactionRow}>
        <View style={[styles.iconContainer, { backgroundColor: color + '10' }]}>
          <MaterialIcons 
            name={icon}
            size={24} 
            color={color}
          />
        </View>
        
        <View style={styles.transactionInfo}>
          <View>
            <Text style={styles.transactionCategory}>{entry.category}</Text>
            <Text style={styles.transactionDate}>
              {new Date(entry.date).toLocaleDateString()}
            </Text>
          </View>
          <Text style={[
            styles.transactionAmount,
            isExpense ? styles.expenseText : styles.incomeText
          ]}>
            {isExpense ? '-' : '+'}{formatCurrency(entry.amount)}
          </Text>
        </View>
      </View>
    );
  };

  const handleViewAllTransactions = () => {
    router.push('/tabs/Logs');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      
      {/* Summary Cards */}
      <View style={styles.summaryCards}>
        <View style={[styles.card, styles.incomeCard]}>
          <MaterialIcons name="arrow-circle-up" size={24} color="#43A047" />
          <Text style={styles.cardLabel}>Income</Text>
          <Text style={[styles.cardAmount, styles.incomeText]}>
            {formatCurrency(report?.totalIncome || 0)}
          </Text>
        </View>

        <View style={[styles.card, styles.expenseCard]}>
          <MaterialIcons name="arrow-circle-down" size={24} color="#E53935" />
          <Text style={styles.cardLabel}>Expenses</Text>
          <Text style={[styles.cardAmount, styles.expenseText]}>
            {formatCurrency(report?.totalExpense || 0)}
          </Text>
        </View>

        <View style={[styles.card, styles.balanceCard]}>
          <MaterialIcons name="account-balance-wallet" size={24} color="#1E88E5" />
          <Text style={styles.cardLabel}>Balance</Text>
          <Text style={[styles.cardAmount, styles.balanceText]}>
            {formatCurrency(report?.balance || 0)}
          </Text>
        </View>
      </View>

      {/* Budget Status */}
      {currentBudget && (
        <View style={styles.budgetSection}>
          <Text style={styles.sectionTitle}>Monthly Budget</Text>
          <View style={styles.budgetCard}>
            <View style={styles.budgetHeader}>
              <Text style={styles.budgetLabel}>Budget Progress</Text>
              <Text style={styles.budgetAmount}>
                {formatCurrency(currentBudget.spent)} / {formatCurrency(currentBudget.amount)}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${Math.min((currentBudget.spent / currentBudget.amount) * 100, 100)}%`,
                    backgroundColor: currentBudget.spent > currentBudget.amount ? '#E53935' : '#43A047'
                  }
                ]} 
              />
            </View>
          </View>
        </View>
      )}

      {/* Recent Transactions */}
      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {report?.recentTransactions?.slice(0, 5).map((entry, index) => (
          <View key={index}>
            {renderTransaction(entry)}
          </View>
        ))}
        <TouchableOpacity 
          style={styles.viewMoreButton}
          onPress={handleViewAllTransactions}
        >
          <Text style={styles.viewMoreText}>View All Transactions</Text>
          <MaterialIcons name="chevron-right" size={24} color="#1E88E5" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#212121',
  },
  summaryCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 2,
  },
  cardLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  incomeText: {
    color: '#43A047',
  },
  expenseText: {
    color: '#E53935',
  },
  balanceText: {
    color: '#1E88E5',
  },
  incomeCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#43A047'
  },
  expenseCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#E53935'
  },
  balanceCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#1E88E5'
  },
  budgetSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#212121',
  },
  budgetCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  budgetLabel: {
    fontSize: 16,
    color: '#666'
  },
  budgetAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121'
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  recentSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
  },
  transactionDate: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: 8,
  },
  viewMoreText: {
    color: '#1E88E5',
    fontSize: 16,
    marginRight: 4,
  },
});