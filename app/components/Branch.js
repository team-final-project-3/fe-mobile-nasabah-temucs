import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { calculateDistance } from '../utils/distanceCalculator';
import { getBranchById } from '../api/api';

export default function Branch({ branchId, data, userLocation, isPressable = false, onLoaded }) {
  const navigation = useNavigation();
  const [branch, setBranch] = useState(data || null);
  const [loading, setLoading] = useState(!data);
  const [addressText, setAddressText] = useState('Memuat alamat...');
  const [distanceToBranch, setDistanceToBranch] = useState('...');

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const res = await getBranchById(branchId);
        console.log('[Branch] Response dari API:', res);
        const branchData = res.branch || res;
        console.log('[Branch] Data cabang hasil parsing:', branchData);

        console.log('[Branch] Data cabang dari API:', branchData);
        setBranch(branchData);
        if (typeof onLoaded === 'function') {
          console.log('[Branch] Memanggil onLoaded dengan:', branchData);
          onLoaded(branchData);
        }
      } catch (error) {
        console.error('Gagal ambil data cabang:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!data && branchId) {
      fetchBranch();
    } else if (data) {
      setBranch(data);
      setLoading(false);
      if (typeof onLoaded === 'function') {
        console.log('[Branch] Memanggil onLoaded dari data prop');
        onLoaded(data);
      }
    }
  }, [branchId, data]);

  useEffect(() => {
    if (userLocation?.coords && branch?.latitude && branch?.longitude) {
      const dist = calculateDistance(
        userLocation.coords.latitude,
        userLocation.coords.longitude,
        branch.latitude,
        branch.longitude
      );
      setDistanceToBranch(`${dist.toFixed(1)} km`);
    } else if (branch?.distance) {
      setDistanceToBranch(branch.distance);
    }

    (async () => {
      if (branch?.latitude && branch?.longitude) {
        try {
          const geo = await Location.reverseGeocodeAsync({
            latitude: branch.latitude,
            longitude: branch.longitude,
          });
          if (geo.length > 0) {
            const info = geo[0];
            const address = `${info.street || info.name || 'Tanpa Nama Jalan'} – ${info.city || info.region || 'Tanpa Kota'}`;
            setAddressText(address);
          } else {
            setAddressText('Alamat tidak ditemukan');
          }
        } catch (err) {
          console.error('Reverse geocoding error:', err);
          setAddressText('Alamat tidak tersedia');
        }
      }
    })();
  }, [userLocation, branch]);

  const handlePress = () => {
    if (isPressable && branch?.id) {
      navigation.navigate('Ambilantre', { branchId: branch.id });
    }
  };

  if (loading || !branch) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#999" />
        <Text style={{ marginTop: 6 }}>Memuat cabang...</Text>
      </View>
    );
  }

  const statusText = branch.status ? 'Buka' : 'Tutup';

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.touchable}
      disabled={!isPressable}
    >
      <View style={styles.branchCard}>
        <View style={styles.headerRow}>
          <Text style={styles.branchName}>{branch.name}</Text>
          <View style={[
            styles.statusBadge,
            branch.status ? styles.statusOpen : styles.statusClosed
          ]}>
            <Text style={branch.status ? styles.statusTextOpen : styles.statusTextClosed}>
              {statusText}
            </Text>
          </View>
        </View>

        <Text style={styles.addressText}>
          {branch?.address || 'Alamat tidak tersedia'}
        </Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="map-marker-outline" size={16} color="#F97316" />
            <Text style={styles.infoText}>{distanceToBranch}</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="clock-outline" size={16} color="#F97316" />
            <Text style={styles.infoText}>{branch.hours || '08:00–15:00'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  touchable: {
    marginBottom: 16,
  },
  branchCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  branchName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F3E63',
  },
  statusBadge: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  statusOpen: {
    backgroundColor: '#A7F3D0',
  },
  statusClosed: {
    backgroundColor: '#FECACA',
  },
  statusTextOpen: {
    color: '#15803D',
    fontWeight: '500',
    fontSize: 13,
  },
  statusTextClosed: {
    color: '#991B1B',
    fontWeight: '500',
    fontSize: 13,
  },
  addressText: {
    color: '#6B7280',
    fontSize: 13,
    marginTop: 6,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#6B7280',
  },
});
