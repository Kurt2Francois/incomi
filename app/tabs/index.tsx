import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const recentEntries = [
  { id: 1, type: 'expense', category: 'Food', amount: 12.5, note: 'Lunch', date: '2024-06-01' },
  { id: 2, type: 'income', category: 'Salary', amount: 500, note: '', date: '2024-06-01' },
];

const HomeScreen = () => {
  const [showAnalytics, setShowAnalytics] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <View style={styles.budgetCard}>
        <Text style={styles.budgetLabel}>Overall Budget Left</Text>
        <Text style={styles.budgetAmount}>$0.00</Text>
        <View style={styles.row}>
          <View style={styles.incomeExpenseCard}>
            <MaterialIcons name="arrow-downward" size={24} color="#43A047" />
            <Text style={styles.incomeLabel}>Income</Text>
            <Text style={styles.incomeAmount}>$0.00</Text>
          </View>
          <View style={styles.incomeExpenseCard}>
            <MaterialIcons name="arrow-upward" size={24} color="#E53935" />
            <Text style={styles.expenseLabel}>Expense</Text>
            <Text style={styles.expenseAmount}>$0.00</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.analyticsBtn} onPress={() => setShowAnalytics(true)}>
          <MaterialIcons name="pie-chart" size={20} color="#fff" />
          <Text style={styles.analyticsText}>View Analytics</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.section}>Recent Entries</Text>
      <View style={styles.card}>
        {recentEntries.length === 0 ? (
          <Text style={styles.noEntry}>No recent transactions.</Text>
        ) : (
          recentEntries.map(entry => (
            <View key={entry.id} style={styles.entryRow}>
              <MaterialIcons
                name={entry.type === 'income' ? 'arrow-downward' : 'arrow-upward'}
                size={20}
                color={entry.type === 'income' ? '#43A047' : '#E53935'}
              />
              <Text style={styles.entryCategory}>{entry.category}</Text>
              <Text style={entry.type === 'income' ? styles.entryIncome : styles.entryExpense}>
                {entry.type === 'income' ? '+' : '-'}${entry.amount.toFixed(2)}
              </Text>
              <Text style={styles.entryNote}>{entry.note}</Text>
              <Text style={styles.entryDate}>{entry.date}</Text>
            </View>
          ))
        )}
      </View>

      {/* Analytics Modal */}
      <Modal visible={showAnalytics} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Analytics</Text>
            {/* Placeholder for chart */}
            <MaterialIcons name="pie-chart" size={64} color="#1E88E5" style={{ alignSelf: 'center', marginBottom: 16 }} />
            <Text style={{ textAlign: 'center', color: '#212121', marginBottom: 16 }}>
              Charts and insights will appear here.
            </Text>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowAnalytics(false)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginBottom: 24,
    textAlign: 'center',
  },
  budgetCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#1E88E5',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  budgetLabel: {
    fontSize: 18,
    color: '#212121',
    marginBottom: 8,
    fontWeight: '600',
  },
  budgetAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 12,
  },
  incomeExpenseCard: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    alignItems: 'center',
    elevation: 1,
  },
  incomeLabel: {
    color: '#43A047',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  incomeAmount: {
    color: '#43A047',
    fontWeight: 'bold',
    fontSize: 20,
  },
  expenseLabel: {
    color: '#E53935',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  expenseAmount: {
    color: '#E53935',
    fontWeight: 'bold',
    fontSize: 20,
  },
  analyticsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E88E5',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  analyticsText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  section: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
    color: '#212121',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    alignItems: 'center',
  },
  noEntry: {
    color: '#888',
    fontSize: 16,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
    justifyContent: 'space-between',
  },
  entryCategory: {
    flex: 1,
    marginLeft: 8,
    fontWeight: 'bold',
    color: '#212121',
  },
  entryIncome: {
    color: '#43A047',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  entryExpense: {
    color: '#E53935',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  entryNote: {
    flex: 1,
    color: '#888',
    marginLeft: 8,
    fontStyle: 'italic',
  },
  entryDate: {
    color: '#888',
    fontSize: 12,
    marginLeft: 8,
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
    width: 320,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginBottom: 16,
    textAlign: 'center',
  },
  closeBtn: {
    backgroundColor: '#1E88E5',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 32,
    marginTop: 8,
  },
  closeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});