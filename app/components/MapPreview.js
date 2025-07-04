import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { calculateDistance } from '../utils/distanceCalculator';
import { getAllBranches, getBranchById } from '../api/api';

export default function MapPreview({ branchId }) {
  const [userLocation, setUserLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [targetBranch, setTargetBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [allBranches, setAllBranches] = useState([]);


  const DEFAULT_FALLBACK_REGION = {
    latitude: -6.2088,
    longitude: 106.8456,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      let locationStatus = await Location.requestForegroundPermissionsAsync();

      if (locationStatus.status !== 'granted') {
        setErrorMsg('Izin akses lokasi ditolak.');
        setMapRegion(DEFAULT_FALLBACK_REGION);
        setLoading(false);
        return;
      }

      try {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setUserLocation(currentLocation);

        const response = await getAllBranches();
        const branches = response.data || [];
        setAllBranches(branches);

       

        if (branchId) {
          const foundBranch = branches.find(branch => branch.id === branchId);
          if (foundBranch) {
            setTargetBranch(foundBranch);
            setMapRegion({
              latitude: foundBranch.latitude,
              longitude: foundBranch.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          } else {
            setErrorMsg('Cabang tidak ditemukan.');
            setMapRegion(DEFAULT_FALLBACK_REGION);
          }
        } else {
          
          let minDistance = Infinity;
          let nearestBranch = null;

          for (const branch of branches) {
            if (branch.latitude && branch.longitude) {
              const distance = calculateDistance(
                currentLocation.coords.latitude,
                currentLocation.coords.longitude,
                branch.latitude,
                branch.longitude
              );
              if (distance < minDistance) {
                minDistance = distance;
                nearestBranch = branch;
              }
            }
          }

          if (nearestBranch) {
            setTargetBranch(nearestBranch);
            setMapRegion({
              latitude: nearestBranch.latitude,
              longitude: nearestBranch.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          } else {
            setErrorMsg('Tidak ada cabang valid ditemukan.');
            setMapRegion(DEFAULT_FALLBACK_REGION);
          }
        }
      } catch (error) {
        console.error("Gagal mendapatkan lokasi atau menentukan cabang:", error);
        setErrorMsg('Terjadi kesalahan saat memuat peta.');
        setMapRegion(DEFAULT_FALLBACK_REGION);
      } finally {
        setLoading(false);
      }
    })();
  }, [branchId]);

  

  return (
    <View style={styles.container}>
      {loading || !mapRegion ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Memuat peta...</Text>
        </View>
      ) : (
        <>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={mapRegion}
            showsUserLocation={!!userLocation}
          >
            {allBranches.map(branch => (
              <Marker
                key={branch.id}
                coordinate={{
                  latitude: branch.latitude,
                  longitude: branch.longitude,
                }}
                title={branch.name}
                description={branch.address}
                pinColor={targetBranch && branch.id === targetBranch.id ? 'green' : 'red'}
              />
            ))}
          </MapView>

          {errorMsg && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorTextMap}>{errorMsg}</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 250,
    marginHorizontal: 4,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 8,
    borderRadius: 5,
    zIndex: 1,
  },
  errorTextMap: {
    color: 'red',
    textAlign: 'center',
    fontSize: 12,
  },
});
