import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';
import { userService } from '../services/users';
import { navigate } from '../utils/navigation';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate.replace.tabs();
    } catch (error: any) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <MaterialIcons name="person-add" size={64} color="#1E88E5" />
      <Text style={styles.title}>Create Account</Text>
      
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <MaterialIcons name="person" size={24} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={24} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={24} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={navigate.push.login} // Changed from navigation to navigate
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F4F6F8',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 32,
    color: '#212121',
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1E88E5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#90CAF9',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    color: '#1E88E5',
    fontSize: 16,
  },
});

export default RegisterScreen;