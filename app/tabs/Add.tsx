import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Modal, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Use the correct type for MaterialIcons names
type MaterialIconName = keyof typeof MaterialIcons.glyphMap;

type CategoryIcon = 
  | 'category'
  | 'fastfood'
  | 'directions-bus'
  | 'shopping-cart'
  | 'attach-money';

const categories: { label: string; icon: CategoryIcon }[] = [
  { label: 'General', icon: 'category' },
  { label: 'Food', icon: 'fastfood' },
  { label: 'Transport', icon: 'directions-bus' },
  { label: 'Shopping', icon: 'shopping-cart' },
  { label: 'Salary', icon: 'attach-money' },
];

const AddScreen = () => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [note, setNote] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const handleAdd = () => {
    if (!amount) {
      Alert.alert('Error', 'Please enter an amount.');
      return;
    }
    // TODO: Add transaction logic
    Alert.alert('Success', 'Transaction added!');
    setAmount('');
    setNote('');
    setCategory(categories[0]);
    setType('expense');
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
      <TouchableOpacity style={styles.categoryPicker} onPress={() => setShowCategoryModal(true)}>
        <MaterialIcons name={category.icon} size={20} color="#1E88E5" />
        <Text style={styles.categoryText}>{category.label}</Text>
        <MaterialIcons name="arrow-drop-down" size={20} color="#1E88E5" />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Note (optional)"
        value={note}
        onChangeText={setNote}
      />
      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>

      {/* Category Modal */}
      <Modal visible={showCategoryModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <FlatList
              data={categories}
              keyExtractor={item => item.label}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setCategory(item);
                    setShowCategoryModal(false);
                  }}
                >
                  <MaterialIcons name={item.icon} size={20} color="#1E88E5" />
                  <Text style={styles.categoryText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
              <Text style={{ color: '#E53935', textAlign: 'center', marginTop: 12 }}>Cancel</Text>
            </TouchableOpacity>
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
  button: {
    backgroundColor: '#1E88E5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
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
});