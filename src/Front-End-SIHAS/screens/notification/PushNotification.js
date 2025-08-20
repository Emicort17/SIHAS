import React, { useState, useEffect, useRef } from "react";
import { View, Text, Button, ScrollView, StyleSheet, Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import NotificationCard from "./NotificationCard";
import { NOTIFICATION_TYPES } from "../../utils/constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const PushNotification = () => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notifications, setNotifications] = useState([]);
  const notificationListener = useRef();
  const responseListener = useRef();

  const registerForPushNotificationsAsync = async () => {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }

      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "9755b043-0cfc-4a9d-9034-3f044cd8fda4",
        })
      ).data;
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  };

  const scheduleHealthNotification = async (type) => {
    const config = NOTIFICATION_TYPES[type];
    const randomMessage = config.messages[Math.floor(Math.random() * config.messages.length)];

    await Notifications.scheduleNotificationAsync({
      content: {
        title: config.title,
        body: randomMessage,
        data: { type: type, timestamp: new Date().toISOString() },
      },
      trigger: { seconds: 2 },
    });
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      const { title, body, data } = notification.request.content;
      setNotifications(prev => [
        ...prev,
        {
          id: Date.now(),
          type: data.type || "NUTRITION",
          title,
          message: body,
          date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Alimentación" onPress={() => scheduleHealthNotification("NUTRITION")} color="#D18BE0" />
        <Button title="Ejercicio" onPress={() => scheduleHealthNotification("EXERCISE")} color="#5BBF9C" />
        <Button title="Descanso" onPress={() => scheduleHealthNotification("SLEEP")} color="#658BC9" />
      </View>

      <Text style={styles.subtitle}>Notificaciones del Día</Text>

      {notifications.map((notif) => (
        <NotificationCard
          key={notif.id}
          type={notif.type}
          title={notif.title}
          message={notif.message}
          date={notif.date}
        />
      ))}

      <Text style={styles.token}>Token: {expoPushToken}</Text>
    </ScrollView>
  );
};

export default PushNotification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    color: "#555",
  },
  token: {
    fontSize: 12,
    marginTop: 16,
    color: "#999",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 25,
    gap: 10,
  },
});
