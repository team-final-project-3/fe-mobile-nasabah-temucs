import React, { useEffect, useCallback, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, StatusBar } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

import RefreshableScreen from '../components/RefreshableScreen';
import Header from '../components/Header';
import Branch from '../components/Branch';
import MapPreview from '../components/MapPreview';
import NextButton from '../components/NextButton';
import QueueSummaryFetcher from '../components/QueueSummaryFetcher';

export default function Ambilantre() {
  const route = useRoute();
  const navigation = useNavigation();
  const { branchId } = route.params || {};

  const [userLocation, setUserLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [loadingBranch, setLoadingBranch] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedBranchData, setSelectedBranchData] = useState(null);

  const fetchLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMessage('Izin lokasi diperlukan untuk menghitung jarak cabang.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 10000,
        distanceInterval: 25,
      });
      setUserLocation(location);
    } catch (err) {
      setErrorMessage('Tidak dapat mengambil lokasi Anda. Pastikan GPS aktif.');
    } finally {
      setLoadingLocation(false);
    }
  }, []);

  useEffect(() => {
    setErrorMessage('');
    setLoadingLocation(true);
    setLoadingBranch(true);
    setUserLocation(null);
    setSelectedBranchData(null);
    fetchLocation();
  }, [refreshKey, fetchLocation]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loadingBranch) {
        setLoadingBranch(false);
      }
    }, 10000);
    return () => clearTimeout(timeout);
  }, [loadingBranch]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleNextPress = () => {
    if (!branchId || !userLocation?.coords || loadingLocation || loadingBranch || !selectedBranchData) {
      setErrorMessage('Data cabang atau lokasi belum lengkap. Harap tunggu atau periksa izin lokasi.');
      return;
    }

    navigation.navigate('Layanan', {
      selectedBranchData,
      userLocationData: userLocation,
    });
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Header isAmbilAntrean />

      {loadingLocation || loadingBranch ? (
        <View style={styles.fullScreenLoader}>
          <ActivityIndicator size="large" color="#1E4064" />
          <Text style={styles.loadingText}>
            {loadingLocation ? 'Mendeteksi lokasi Anda...' : 'Memuat data cabang...'}
          </Text>
        </View>
      ) : (
        <>
          <RefreshableScreen onRefresh={handleRefresh}>
            <View style={styles.content}>
              {!errorMessage && branchId ? (
                <>
                  <Branch
                    branchId={branchId}
                    userLocation={userLocation}
                    isPressable={false}
                    onLoaded={(branch) => {
                      setSelectedBranchData(branch);
                      setLoadingBranch(false);
                    }}
                  />

                  {selectedBranchData && (
                    <>
                      <View style={styles.queue}>
                        <QueueSummaryFetcher
                          branchId={branchId}
                          showWaiting={false}
                          layoutMode="horizontal"
                        />
                      </View>

                      <View style={styles.mapContainer}>
                        <MapPreview branchId={branchId} />
                      </View>
                    </>
                  )}
                </>
              ) : (
                <Text style={{ color: 'red', textAlign: 'center', marginTop: 16 }}>
                  {errorMessage || 'Cabang tidak ditemukan atau terjadi masalah saat memuat data.'}
                </Text>
              )}
            </View>
          </RefreshableScreen>

          <View style={styles.buttonContainer}>
            <NextButton
              onPress={handleNextPress}
              disabled={loadingLocation || loadingBranch || !userLocation?.coords || !selectedBranchData}
            />
          </View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 0,
  },
  mapContainer: {
    marginTop: 16,
    marginBottom: 16,
    flex: 1,
  },
  queue: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f0f2f5',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  fullScreenLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
