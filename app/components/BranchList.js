import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { calculateDistance } from '../utils/distanceCalculator';
import { getAllBranches } from '../api/api';
import BranchCard from './BranchCard';
import LocationProvider from './LocationProvider';

export default function BranchList({ onBranchPress, filterText = '', limit, sortByDistance = false, statusFilter = 'all'}) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const response = await getAllBranches();
        setBranches(response.branches || []);
      } catch (err) {
        console.error('Gagal memuat cabang:', err);
        setApiError('Gagal memuat data cabang.');
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  
  return (
    <LocationProvider>
      {({ userLocation, loadingLocation, locationError }) => {
        if (loading || loadingLocation) {
          return (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color="#1E4064" />
              <Text style={styles.loadingText}>
                {loadingLocation ? 'Mencari lokasi Anda...' : 'Mengambil data cabang...'}
              </Text>
            </View>
          );
        }

        if (apiError || locationError) {
          return (
            <View style={styles.centerContent}>
              <Text style={styles.errorText}>{apiError || locationError}</Text>
              <Text style={styles.subText}>Menampilkan cabang tanpa urutan jarak.</Text>
            </View>
          );
        }

        let result = [...branches];

        if (filterText) {
          const lower = filterText.toLowerCase();
          result = result.filter(branch =>
            branch.name.toLowerCase().includes(lower) ||
            branch.address.toLowerCase().includes(lower)
          );
        }
        if (statusFilter !== 'all') {
            const isOpen = statusFilter === 'open';
            result = result.filter(branch => branch.status === isOpen);
          }

        if (sortByDistance && userLocation?.coords) {
          result = result.map(branch => {
            if (branch.latitude && branch.longitude) {
              const dist = calculateDistance(
                userLocation.coords.latitude,
                userLocation.coords.longitude,
                branch.latitude,
                branch.longitude
              );
              return { ...branch, distance: parseFloat(dist.toFixed(1)) };
            }
            return { ...branch, distance: Infinity };
          });
          result.sort((a, b) => a.distance - b.distance);
        }

        if (limit) {
          result = result.slice(0, limit);
        }

        return (
          <FlatList
            data={result}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <BranchCard
                data={item}
                userLocation={userLocation}
                onPress={() => onBranchPress(item)}
              />
            )}
            scrollEnabled={false}
            ListEmptyComponent={() => (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>
                Tidak ada cabang ditemukan.
              </Text>
            )}
          />
        );
      }}
    </LocationProvider>
  );
}

const styles = StyleSheet.create({
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  subText: {
    marginTop: 8,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});