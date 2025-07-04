import React from 'react';
import { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import Ambilantre from '../screens/Ambilantre';
import Layanan from '../screens/Layanan';
import Dokumen from '../screens/Dokumen';
import { Tiket } from '../screens/Tiket';
import Search from '../screens/Search'; 
import { DetailHistory } from '../screens/DetailHistory';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import NewPasswordScreen from '../screens/NewPasswordScreen';
import OtpRegistrasiScreen from '../screens/OtpRegistrasiScreen';
import OtpResetPasswordScreen from '../screens/OtpResetPasswordScreen';
import ProfilePage from '../screens/ProfileScreen';
import AboutUsScreen from '../screens/AboutUsScreen';
import SplashScreen from '../screens/SplashScreen';
import TermsAndConditionsScreen from '../screens/TermsAndConditionsScreen'
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import { registerForPushNotificationsAsync } from '../screens/registerForPushNotificationsAsync';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Notifications from 'expo-notifications';
import { useRef } from 'react';
import { Platform } from 'react-native';
import { sendExpoPushToken } from '../api/api';

const Stack = createNativeStackNavigator();




export default function StackNavigator() {
  console.log("Kevin diks");
  
    const notificationListener = useRef();
    console.log(notificationListener, "=> 111");
    
    const responseListener = useRef();
    console.log(responseListener, "==> 222");
    
    useEffect(() => {
      async function setupPushToken() {
        const expoPushToken = await registerForPushNotificationsAsync();
        if (expoPushToken) {
          console.log("333");
          
          await AsyncStorage.setItem('expoPushToken', expoPushToken);
          console.log("444");
          
          await sendExpoPushToken(expoPushToken);
          console.log("555");
          
        }
      }
      setupPushToken();
    }, []);
  
    useEffect(() => {
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        console.log('📨 Notifikasi diterima:', notification);
      });
  
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log('📨 User membuka notifikasi:', response);
      });
  
      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }, []);
    
  

  return (
    <Stack.Navigator>
       <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="TermsAndConditionsScreen"
        component={TermsAndConditionsScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="PrivacyPolicyScreen"
        component={PrivacyPolicyScreen}
        options={{ headerShown: false }}
      />


        <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Main"
        component={BottomTabs}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
        options={{ title: 'ChangePasswordScreen', headerShown: false,}}
      />

      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
        options={{ title: 'ForgotPasswordScreen', headerShown: false,}}
      />

      <Stack.Screen
        name="NewPasswordScreen"
        component={NewPasswordScreen}
        options={{ title: 'NewPasswordScreen', headerShown: false,}}
      />

    <Stack.Screen
        name="OtpRegistrasiScreen"
        component={OtpRegistrasiScreen}
        options={{ title: 'OtpRegistrasiScreen', headerShown: false,}}
      />

    <Stack.Screen
        name="OtpResetPasswordScreen"
        component={OtpResetPasswordScreen}
        options={{ title: 'OtpResetPasswordScreen', headerShown: false,}}
      />

    <Stack.Screen
        name="ProfilePage"
        component={ProfilePage}
        options={{ title: 'ProfilePage', headerShown: false,}}
      />


        <Stack.Screen
        name="Layanan"
        component={Layanan}
        options={{ title: 'Ambil Antrean', headerShown: false,}}
      />
        <Stack.Screen
        name="Dokumen"
        component={Dokumen}
        options={{ title: 'Dokumen Layanan', headerShown: false,}}
      />

      <Stack.Screen
        name="Tiket"
        component={Tiket}
        options={{ title: 'Tiket', headerShown: false,}}
      />

      <Stack.Screen
        name="Search"
        component={Search} 
        options={{ title: 'Search', headerShown: false,}}
      />

      <Stack.Screen
        name="DetailHistory"
        component={DetailHistory} 
        options={{ title: 'DetailHistory', headerShown: false,}}
      />

      <Stack.Screen
        name="Ambilantre"
        component={Ambilantre} 
        options={{ title: 'Ambilantre', headerShown: false,}}
      />

      <Stack.Screen
        name="AboutUsScreen"
        component={AboutUsScreen} 
        options={{ title: 'AboutUsScreen', headerShown: false,}}
      />
      
    </Stack.Navigator>
  );
}