import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export default function LocationProvider({ children }) {
  const [userLocation, setUserLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Izin akses lokasi ditolak.');
          setLoadingLocation(false);
          return;
        }

        const currentLoc = await Location.getCurrentPositionAsync({});
        setUserLocation(currentLoc);
      } catch (error) {
        console.error("Error getting location: ", error);
        setLocationError('Gagal mendapatkan lokasi Anda.');
      } finally {
        setLoadingLocation(false);
      }
    })();
  }, []);


  if (typeof children === 'function') {
    return children({ userLocation, loadingLocation, locationError });
  }


  return null;
}
