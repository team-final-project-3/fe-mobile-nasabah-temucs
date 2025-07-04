import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, StatusBar } from 'react-native';
import Header from '../components/Header';
import QueueList from '../components/QueueList';
import { getQueueHistory } from '../api/api';
import SearchBar from '../components/SearchBar';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function QueueHistoryScreen() {
  const [queues, setQueues] = useState([]);
  const [filteredQueues, setFilteredQueues] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    try {
      const response = await getQueueHistory();
      console.log('Data Bookingan Diterima:', response);

      if (response?.success && Array.isArray(response.data)) {
        setQueues(response.data);
        if (searchText.trim()) {
          const filtered = response.data.filter((item) =>
            item.branch?.name?.toLowerCase().includes(searchText.toLowerCase())
          );
          setFilteredQueues(filtered);
        } else {
          setFilteredQueues(response.data);
        }
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

  const handleRefresh = () => {
    setRefreshing(true);
    setError(null);
    fetchHistory();
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim().length === 0) {
      setFilteredQueues(queues);
      return;
    }

    const filtered = queues.filter((item) =>
      item.branch?.name?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredQueues(filtered);
  };

  const handleClearSearch = () => {
    setSearchText('');
    setFilteredQueues(queues);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F6F6F6' }}>
    <StatusBar barStyle="light-content" backgroundColor="transparent" translucent/>
      <Header isHistory />
      <View style={styles.container}>
        <View style={styles.searchBarWrapper}>
          <SearchBar
            searchText={searchText}
            onSearchTextChange={handleSearch}
            placeholder="Cari cabang"
            containerStyle={{ flex: 1 }}
            inputStyle={styles.searchBarInput}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="gray" />
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#1E4064" />
        ) : error ? (
          <Text style={styles.emptyText}>{error}</Text>
        ) : filteredQueues.length > 0 ? (
          <QueueList
            queues={filteredQueues}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />
        ) : (
          <Text style={styles.emptyText}>
            {searchText
              ? `Tidak ditemukan hasil untuk "${searchText}".`
              : 'Belum ada riwayat antrean.'}
          </Text>
        )}
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 175,
    paddingBottom: 16,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  clearButton: {
    marginLeft: 8,
    padding: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    paddingHorizontal: 20,
  },
  searchBarInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
});
