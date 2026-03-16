import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }: { navigation: any }) {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.greeting}>Hello,</Text>
        <Text style={styles.email}>{user?.email ?? 'User'}</Text>
        <Text style={styles.message}>You're logged in.</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Submissions')}
        >
          <Text style={styles.buttonText}>View submissions</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
  },
  content: {
    padding: 32,
  },
  greeting: {
    fontSize: 24,
    color: '#94a3b8',
    marginBottom: 4,
  },
  email: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#0ea5e9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  logoutText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '500',
  },
});
