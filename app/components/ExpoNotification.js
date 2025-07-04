import React, { useEffect, useState, useRef } from "react";
import { View, Button, Platform, Text, Alert, Linking } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

// Atur bagaimana notifikasi ditangani saat aplikasi aktif
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function NotificationsExample() {
  

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState({});
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) setExpoPushToken(token);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const url = response.notification.request.content.data?.url;
        if (url) {
          console.log(url);

          Linking.openURL(url);
        }
      });

    return () => {
     
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);


  const scheduleNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Haloo sayang!!",
        body: "Jangan lupa minum air putih yaa",
        sound: true,
      },
      trigger: null, 
    });
  };


async function registerForPushNotificationsAsync() {
  let token;

  console.log(token, "token sekarang");

  if (!Device.isDevice) {
    console.log("hai");

    alert("Must use physical device for Push Notifications");
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    console.log(existingStatus);

    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  console.log(token, "tkn");

  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notifications!");
    return;
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("Expo Push Token:", token);

  
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}