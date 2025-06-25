import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QueueSummaryContainer from './QueueSummaryContainer';
import { getAllQueues } from '../api/api';

export default function QueueSummaryFetcher({ branchId, showWaiting = true, layoutMode = 'horizontal' }) {
  const [loading, setLoading] = useState(true);
  const [lastServed, setLastServed] = useState('-');
  const [waiting, setWaiting] = useState(0);
  const [totalQueue, setTotalQueue] = useState(0);
  const [currentUserQueue, setCurrentUserQueue] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queues = await getAllQueues();
        if (!Array.isArray(queues)) {
          console.error('Data antrean bukan array:', queues);
          return;
        }

        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          console.warn('User belum login atau userId tidak ditemukan');
          return;
        }

        const branchQueues = queues.filter(q => q.branchId === branchId);

        const inProgress = branchQueues.filter(q => q.status === 'in progress');
        const waitingList = branchQueues.filter(q => q.status === 'waiting');
        // const served = branchQueues.filter(q => ['served', 'done'].includes(q.status));

        const last = inProgress.length > 0 ? inProgress[inProgress.length - 1].ticketNumber : '-';

        const userQueue = branchQueues.find(
          q => q.userId === parseInt(userId) && ['waiting', 'inprogress'].includes(q.status)
        );

        const totalActive = inProgress.length + waitingList.length;

        setLastServed(last);
        setWaiting(totalActive);
        setTotalQueue(totalActive); 
        setCurrentUserQueue(userQueue || null);
      } catch (err) {
        console.error('Gagal ambil antrean:', err);
      } finally {
        setLoading(false);
      }
    };

    if (branchId) fetchData();
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
