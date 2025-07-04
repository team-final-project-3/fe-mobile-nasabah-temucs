import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QueueSummaryContainer from './QueueSummaryContainer';
import { getBranchById } from '../api/api';

export default function QueueSummaryFetcher({ branchId, showWaiting = true, layoutMode = 'horizontal' }) {
  const [loading, setLoading] = useState(true);
  const [lastServed, setLastServed] = useState('-');
  const [waiting, setWaiting] = useState(0);
  const [totalQueue, setTotalQueue] = useState(0);
  const [currentUserQueue, setCurrentUserQueue] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('branchId yang diterima:', branchId);
        const response = await getBranchById(branchId);
        console.log('Response dari getBranchById:', response);

        const branch = response?.branch || response;
        if (!branch) {
          console.error('Data cabang tidak valid:', response);
          setLoading(false);
          return;
        }

        setLastServed(branch.lastInProgressTicket?.ticketNumber || '-');
        setWaiting(branch.activeQueueCount || 0);
        setTotalQueue(branch.activeQueueCount || 0);

        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          setCurrentUserQueue(null);
        }
      } catch (err) {
        console.error('Gagal ambil data cabang:', err);
      } finally {
        setLoading(false);
      }
    };

    if (branchId) {
      fetchData();
    } else {
      console.warn('branchId tidak tersedia, tidak bisa memuat data');
      setLoading(false);
    }
  }, [branchId]);

  if (loading) {
    return (
      <View style={{ alignItems: 'center', marginVertical: 16 }}>
        <ActivityIndicator size="small" color="#1E4064" />
        <Text>Memuat antrean...</Text>
      </View>
    );
  }

  return (
    <QueueSummaryContainer
      lastServed={lastServed}
      waiting={waiting}
      totalQueue={totalQueue}
      showWaiting={showWaiting}
      layoutMode={layoutMode}
    />
  );
}