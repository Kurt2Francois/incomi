import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const logs = [
  { id: 1, type: 'expense', category: 'Food', amount: 12.5, note: 'Lunch', date: '2024-06-01' },
  { id: 2, type: 'income', category: 'Salary', amount: 500, note: '', date: '2024-06-01' },
];

const LogsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Daily Logs</Text>
    <Text style={styles.text}>Your daily income and expense entries will appear here.</Text>
    <FlatList
      data={logs}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.logRow}>
          <MaterialIcons
            name={item.type === 'income' ? 'arrow-downward' : 'arrow-upward'}
            size={20}
            color={item.type === 'income' ? '#43A047' : '#E53935'}
          />
          <Text style={styles.logCategory}>{item.category}</Text>
          <Text style={item.type === 'income' ? styles.logIncome : styles.logExpense}>
            {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
          </Text>
          <Text style={styles.logNote}>{item.note}</Text>
          <Text style={styles.logDate}>{item.date}</Text>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.noEntry}>No logs yet.</Text>}
    />
  </View>
);

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
});