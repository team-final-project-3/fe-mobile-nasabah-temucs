import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import Header from '../components/Header';
import QueueList from '../components/QueueList';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getQueueHistory } from '../api/api';

export default function QueueHistoryScreen() {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    try {
      const response = await getQueueHistory();
      console.log('Data Bookingan Diterima:', response);

      if (response?.success && Array.isArray(response.data)) {
        setQueues(response.data);
      } else {
        throw new Error('Data tidak valid');
      }
    } catch (err) {
      console.error('Error fetching history:', err.message || err);
      setError('Gagal memuat riwayat antrean');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setError(null);
    await fetchHistory();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header isHistory />
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#1E4064" />
        ) : error ? (
          <Text style={styles.emptyText}>{error}</Text>
        ) : queues.length > 0 ? (
          <QueueList queues={queues} onRefresh={handleRefresh} refreshing={refreshing} />
        ) : (
          <Text style={styles.emptyText}>Belum ada riwayat antrean.</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666',
  },
});
