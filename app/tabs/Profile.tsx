import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { userService } from '../services/users';
import { auth } from '../config/firebase';
import { navigate } from '../utils/navigation';

const ProfileScreen = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.displayName || '');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate.replace.login();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateProfile = async () => {
    if (!user || !name.trim()) return;
    
    setLoading(true);
    try {
      await userService.updateProfile(user.uid, { name: name.trim() });
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate.replace.login();
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out');
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!user) return;
            try {
              await userService.deleteAccount(user.uid);
              navigate.replace.login(); // Fixed: Changed navigation.replace(ROUTES.auth.login) to navigate.replace.login()
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', 'Failed to delete account');
            }
          }
        }
      ]
    );
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.card}>
        <Image
          source={{ 
            uri: user.photoURL || 
              `https://ui-avatars.com/api/?name=${name}&background=1E88E5&color=fff&size=128` 
          }}
          style={styles.avatar}
        />
        
        {editing ? (
          <View style={styles.editRow}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleUpdateProfile}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <MaterialIcons name="check" size={24} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </>
        )}

        <TouchableOpacity 
          style={styles.button}
          onPress={() => setEditing(!editing)}
        >
          <MaterialIcons name="edit" size={18} color="#fff" />
          <Text style={styles.buttonText}>
            {editing ? 'Cancel' : 'Edit Profile'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={18} color="#fff" />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]}
          onPress={handleDeleteAccount}
        >
          <MaterialIcons name="delete" size={18} color="#fff" />
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;

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
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#212121',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#1E88E5',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    backgroundColor: '#E53935',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#1E88E5',
  },
  saveButton: {
    backgroundColor: '#43A047',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginVertical: 8,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  deleteButton: {
    backgroundColor: '#E53935',
    marginTop: 24,
  },
});