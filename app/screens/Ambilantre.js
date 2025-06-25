import React, { useEffect, useCallback, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

import RefreshableScreen from '../components/RefreshableScreen';
import Header from '../components/Header';
import Branch from '../components/Branch';
import MapPreview from '../components/MapPreview';
import NextButton from '../components/NextButton';
import QueueSummaryFetcher from '../components/QueueSummaryFetcher.js';


export default function Ambilantre() {
  const route = useRoute();
  const navigation = useNavigation();
  const { branchId } = route.params || {};

  const [userLocation, setUserLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
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
      console.error('Gagal ambil lokasi:', err.message);
      setErrorMessage('Tidak dapat mengambil lokasi Anda. Pastikan GPS aktif.');
    } finally {
      setLoadingLocation(false);
    }
  }, []);

  useEffect(() => {
    setErrorMessage('');
    setLoadingLocation(true);
    setUserLocation(null);

    fetchLocation();
  }, [refreshKey, fetchLocation]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleNextPress = () => {
    if (!branchId || !userLocation?.coords || loadingLocation) {
      setErrorMessage('Data cabang atau lokasi belum lengkap. Harap tunggu atau periksa izin lokasi.');
      return;
    }

    navigation.navigate('Layanan', {
      selectedBranchData,
      userLocationData: userLocation,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header isAmbilAntrean />

      {loadingLocation ? (
        <View style={styles.fullScreenLoader}>
          <ActivityIndicator size="large" color="#1E4064" />
          <Text style={styles.loadingText}>
            Mendeteksi lokasi Anda...
          </Text>
        </View>
      ) : (
        <>
          <RefreshableScreen onRefresh={handleRefresh}>
            <View style={styles.content}>
              {!errorMessage && branchId && (
                <>
                <Branch branchId={branchId} 
                userLocation={userLocation} 
                isPressable={false} onLoaded={(branch) => setSelectedBranchData(branch)} />


                  <QueueSummaryFetcher
                    branchId={branchId}
                    showWaiting={false}
                    layoutMode="horizontal"
                  />

                  <View style={styles.mapContainer}>
                    <MapPreview branchId={branchId} />
                  </View>
                </>
              )}
              {!!errorMessage && (
                <Text style={{ color: 'red', textAlign: 'center', marginTop: 16 }}>{errorMessage}</Text>
              )}
            </View>
          </RefreshableScreen>

          <View style={styles.buttonContainer}>
            <NextButton
              onPress={handleNextPress}
              disabled={loadingLocation || !userLocation?.coords}
            />
          </View>
        </>
      )}
    </SafeAreaView>
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
  buttonContainer: {
    padding: 16,
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
