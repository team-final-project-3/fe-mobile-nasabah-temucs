import React, { useEffect, useCallback, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './app/navigation/StackNavigator';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { View } from 'react-native';
import { registerForPushNotificationsAsync } from './app/screens/registerForPushNotificationsAsync';
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('expoPushToken');

        if (!storedToken) {
          const pushToken = await registerForPushNotificationsAsync();
          if (pushToken) {
            await AsyncStorage.setItem('expoPushToken', pushToken);
            console.log('[App.js] Push token berhasil disimpan:', pushToken);
          } else {
            console.log('[App.js] Gagal mendapatkan push token');
          }
        } else {
          console.log('[App.js] Push token sudah tersimpan:', storedToken);
        }

        // Delay agar splash screen terlihat sejenak
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (e) {
        console.warn('[App.js] Error saat prepare:', e);
      } finally {
        setAppIsReady(true);
      }
    };

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </View>
  );
}
