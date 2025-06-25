import { useEffect } from 'react';
import * as Location from 'expo-location';

export default function LocationFetcher({ onSuccess, onError }) {
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        onError('Izin lokasi diperlukan untuk menghitung jarak cabang.');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({ 
          accuracy: Location.Accuracy.High,
          timeInterval : 10000,
          distanceInterval: 25, //-->>> 25 meter
        });
        onSuccess(location);
        console.log(location);
        
      } catch (error) {
        console.error("Error getting location:", error);
        onError('Tidak dapat mengambil lokasi Anda. Pastikan GPS aktif.');
      }
    })();
  }, []);

  return null;
}
