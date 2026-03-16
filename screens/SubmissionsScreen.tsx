import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { supabase } from '../lib/supabase';

type Submission = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export default function SubmissionsScreen() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchSubmissions() {
    const { data, error } = await supabase
      .from('form_submissions')
      .select('id, name, email, message, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch submissions:', error);
      return;
    }
    setSubmissions(data ?? []);
  }

  async function onRefresh() {
    setRefreshing(true);
    await fetchSubmissions();
    setRefreshing(false);
  }

  useEffect(() => {
    setLoading(true);
    fetchSubmissions().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={submissions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No submissions yet.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.date}>
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </View>
            <Text style={styles.email}>{item.email}</Text>
            <Text style={styles.message}>{item.message}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
  },
  date: {
    fontSize: 12,
    color: '#64748b',
  },
  email: {
    fontSize: 14,
    color: '#0ea5e9',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  empty: {
    color: '#64748b',
    textAlign: 'center',
    marginTop: 48,
  },
});
