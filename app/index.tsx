import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const WelcomeScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>INCOMI</Text>
      <Text style={styles.subtitle}>Personal Expense Tracker</Text>
      <Text style={styles.description}>
        Track your income and expenses with daily logs, smart budgets, and visual insights.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/login')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#212121',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#212121',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#1E88E5',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});