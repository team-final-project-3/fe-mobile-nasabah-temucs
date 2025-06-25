import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { calculateDistance } from '../utils/distanceCalculator';
import { getAllQueues } from '../api/api';

export default function BranchCard({ data, userLocation, onPress }) {
  const [distanceToBranch, setDistanceToBranch] = useState('...');
  const [totalQueue, setTotalQueue] = useState(0);

  useEffect(() => {
    const fetchQueueData = async () => {
      try {
        const allQueues = await getAllQueues();
        const branchQueues = allQueues.filter(q => q.branchId === data.id);
        const inProgress = branchQueues.filter(q => q.status === 'in progress');
        const waitingList = branchQueues.filter(q => q.status === 'waiting');
        setTotalQueue(inProgress.length + waitingList.length);
      } catch {
        setTotalQueue(0);
      }
    };
    if (data?.id) fetchQueueData();
  }, [data?.id]);

  useEffect(() => {
    if (userLocation?.coords && data.latitude && data.longitude) {
      const dist = calculateDistance(
        userLocation.coords.latitude,
        userLocation.coords.longitude,
        data.latitude,
        data.longitude
      );
      setDistanceToBranch(`${dist.toFixed(1)} km`);
    } else if (data.distance !== undefined) {
      setDistanceToBranch(`${data.distance.toFixed(1)} km`);
    } else {
      setDistanceToBranch('...');
    }
  }, [userLocation, data]);

  return (
    <TouchableOpacity onPress={data.status ? onPress : null} activeOpacity={data.status ? 0.8 : 1}>
      <View style={styles.card}>
        {!data.status && <View style={styles.overlay} pointerEvents="none" />}
        <View style={styles.rowContainer}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="map-marker-outline" size={24} color="orange" />
            <Text style={styles.distanceText}>{distanceToBranch}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.branchName}>{data.name}</Text>
            <Text style={styles.addressText} numberOfLines={2}>{data.address || 'Alamat tidak tersedia'}</Text>
          </View>
          <View style={styles.badgeContainer}>
            <Text style={[styles.statusBadge, data.status ? styles.open : styles.closed]}>
              {data.status ? 'Buka' : 'Tutup'}
            </Text>
            <Text style={styles.queueBadge}>{totalQueue} Antrean</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    borderRadius: 16,
    zIndex: 10,
  },
  rowContainer: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoContainer: { flex: 1, justifyContent: 'center' },
  distanceText: { fontSize: 12, color: '#4A5568', marginTop: 4 },
  branchName: { fontWeight: 'bold', fontSize: 14, marginBottom: 2 },
  addressText: { fontSize: 12, color: '#6B7280' },
  statusBadge: {
    minWidth: 80,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 6,
  },
  open: { backgroundColor: '#EBF8EE', color: '#38A169' },
  closed: { backgroundColor: '#FEE8E8', color: '#EF4444' },
  queueBadge: {
    minWidth: 80,
    backgroundColor: '#FFEFD6',
    color: '#C2410C',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  badgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});
