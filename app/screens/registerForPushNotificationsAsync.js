import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert } from 'react-native';

export async function registerForPushNotificationsAsync() {
  let token = null;

  try {
    if (!Device.isDevice) {
      Alert.alert('Harus dijalankan di perangkat fisik.');
      console.log('Bukan perangkat fisik');
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    console.log('[PushNotif] Status izin awal:', existingStatus);

    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
      console.log('[PushNotif] Status izin setelah request:', status);
    }

    if (finalStatus !== 'granted') {
      Alert.alert('Izin notifikasi ditolak.');
      console.log('Izin tidak diberikan:', finalStatus);
      return null;
    }

    const { data } = await Notifications.getExpoPushTokenAsync({
      projectId: '0510c1fd-9904-41ab-a297-1684055df897', 
    });
    token = data;
    console.log('Token berhasil diperoleh:', token);

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  } catch (error) {
    console.log('Gagal mendapatkan token:', error);
  }

  return token;
}
