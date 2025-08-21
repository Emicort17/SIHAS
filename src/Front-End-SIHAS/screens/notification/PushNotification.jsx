import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  AppState,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import NotificationCard from "./NotificationCard";
import { NOTIFICATION_TYPES } from "../../utils/constants";
import { useAuth } from "../auth/context/AuthContext";
import { AxiosClient } from "../auth/context/http_client";

// Configurar el manejador de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Función mejorada para programar notificaciones (movida fuera)
const scheduleNotificationFromAlert = async (alert) => {
  try {
    const config = NOTIFICATION_TYPES[alert.type] || NOTIFICATION_TYPES.NUTRITION;
    const now = new Date();
    const scheduledTime = new Date(alert.scheduledTime);

    if (scheduledTime <= now) {
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: config.title,
        body: alert.message,
        data: {
          type: alert.type,
          alertId: alert.id,
          timestamp: scheduledTime.toISOString(),
        },
      },
      trigger: {
        date: scheduledTime,
      },
    });

    return notificationId;
  } catch (error) {
    console.error('Error programando notificación:', error);
    return null;
  }
};

// Función para cancelar notificaciones antiguas (movida fuera)
const cancelOldNotifications = async () => {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const now = new Date();
    
    for (const notification of scheduledNotifications) {
      const scheduledDate = new Date(notification.trigger.date);
      if (scheduledDate <= now) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
  } catch (error) {
    console.error('Error cancelando notificaciones antiguas:', error);
  }
};

// Definir tarea en segundo plano (implementada completamente)
const BACKGROUND_NOTIFICATION_TASK = 'background-notification-task';

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async () => {
  console.log('Ejecutando tarea en segundo plano para notificaciones');
  try {
    const userDataStr = await AsyncStorage.getItem('userData');
    if (!userDataStr) return BackgroundFetch.BackgroundFetchResult.NoData;

    const { userId, token } = JSON.parse(userDataStr);

    const response = await AxiosClient.get(`/api/usuario/alert/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.result) {
      const now = new Date();
      const alerts = response.result.map((alert) => {
        const scheduledTime = new Date(`${alert.scheduled_date}T${alert.scheduled_time}`);
        return {
          id: alert.id_alerta,
          message: alert.description,
          type: alert.type_alert,
          isActive: alert.status,
          scheduledTime,
          isValid: scheduledTime > now,
        };
      });

      const validAlerts = alerts.filter(alert => alert.isActive && alert.isValid);

      await Notifications.cancelAllScheduledNotificationsAsync();
      await cancelOldNotifications();

      let programmedCount = 0;
      for (const alert of validAlerts) {
        const notificationId = await scheduleNotificationFromAlert(alert);
        if (notificationId) programmedCount++;
      }

      await AsyncStorage.setItem('scheduledAlerts', JSON.stringify(validAlerts));
      await AsyncStorage.setItem('lastAlertSync', new Date().toISOString());
    }

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('Error en tarea de segundo plano:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

const PushNotification = () => {
  const { user } = useAuth();
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [scheduledAlerts, setScheduledAlerts] = useState([]);
  const notificationListener = useRef();
  const responseListener = useRef();
  const appState = useRef(AppState.currentState);

  // Función para guardar el historial de notificaciones
  const saveNotificationHistory = async (notificationData) => {
    try {
      const existingHistory = await AsyncStorage.getItem('notificationHistory');
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      
      const newNotification = {
        ...notificationData,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        delivered: true
      };
      
      history.unshift(newNotification);
      
      if (history.length > 100) {
        history.splice(100);
      }
      
      await AsyncStorage.setItem('notificationHistory', JSON.stringify(history));
      return newNotification;
    } catch (error) {
      console.error('Error guardando historial de notificaciones:', error);
    }
  };

  // Función para cargar el historial de notificaciones
  const loadNotificationHistory = async () => {
    try {
      const existingHistory = await AsyncStorage.getItem('notificationHistory');
      if (existingHistory) {
        const history = JSON.parse(existingHistory);
        const today = new Date().toDateString();
        const todayNotifications = history.filter(notif => 
          new Date(notif.timestamp).toDateString() === today
        );
        setNotifications(todayNotifications);
      }
    } catch (error) {
      console.error('Error cargando historial:', error);
    }
  };

  // Nueva función para cargar alertas programadas desde storage
  const loadScheduledAlerts = async () => {
    try {
      const stored = await AsyncStorage.getItem('scheduledAlerts');
      if (stored) {
        const alerts = JSON.parse(stored).map(a => ({
          ...a,
          scheduledTime: new Date(a.scheduledTime)
        }));
        setScheduledAlerts(alerts);
      }
    } catch (error) {
      console.error('Error cargando alertas programadas:', error);
    }
  };

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
        Alert.alert("Error", "Se necesitan permisos de notificaciones para funcionar correctamente");
        return;
      }

      try {
        token = (await Notifications.getExpoPushTokenAsync({
          projectId: "9755b043-0cfc-4a9d-9034-3f044cd8fda4",
        })).data;
      } catch (error) {
        console.error('Error obteniendo token:', error);
      }
    } else {
      console.warn("Las notificaciones push requieren un dispositivo físico");
    }

    return token;
  };

  // Función principal para cargar y programar alertas (modificada para guardar en storage)
  const loadAndScheduleAlerts = async (forceRefresh = false) => {
    if (!user?.userId || !user?.token) {
      console.log('Usuario no autenticado, saltando carga de alertas');
      return;
    }

    try {
      const response = await AxiosClient.get(`/api/usuario/alert/${user.userId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.result) {
        const now = new Date();
        const alerts = response.result.map((alert) => {
          const scheduledTime = new Date(`${alert.scheduled_date}T${alert.scheduled_time}`);
          
          return {
            id: alert.id_alerta,
            message: alert.description,
            type: alert.type_alert,
            isActive: alert.status,
            scheduledTime,
            isValid: scheduledTime > now,
          };
        });

        const validAlerts = alerts.filter(alert => alert.isActive && alert.isValid);
        
        setScheduledAlerts(validAlerts);

        await Notifications.cancelAllScheduledNotificationsAsync();
        await cancelOldNotifications();

        let programmedCount = 0;
        for (const alert of validAlerts) {
          const notificationId = await scheduleNotificationFromAlert(alert);
          if (notificationId) {
            programmedCount++;
          }
        }

        // Guardar en storage
        await AsyncStorage.setItem('scheduledAlerts', JSON.stringify(validAlerts));
        await AsyncStorage.setItem('lastAlertSync', new Date().toISOString());
        
      }
    } catch (error) {
      console.error("Error al cargar alertas del backend:", error);
      if (error.response?.status === 401) {
        Alert.alert("Sesión Expirada", "Por favor, inicia sesión nuevamente");
      } else {
        Alert.alert("Error", "No se pudieron cargar las alertas");
      }
    }
  };

  // Función para verificar si necesita resincronizar
  const shouldResyncAlerts = async () => {
    try {
      const lastSync = await AsyncStorage.getItem('lastAlertSync');
      if (!lastSync) return true;
      
      const lastSyncTime = new Date(lastSync);
      const now = new Date();
      const hoursSinceSync = (now - lastSyncTime) / (1000 * 60 * 60);
      
      return hoursSinceSync > 6;
    } catch (error) {
      return true;
    }
  };

  // Registrar tarea de segundo plano
  const registerBackgroundTask = async () => {
    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_NOTIFICATION_TASK);
      if (!isRegistered) {
        await BackgroundFetch.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK, {
          minimumInterval: 60 * 60, // 1 hora
          stopOnTerminate: false,
          startOnBoot: true,
        });
        console.log('Tarea de segundo plano registrada');
      }
    } catch (error) {
      console.error('Error registrando tarea de segundo plano:', error);
    }
  };

  // Manejar cambios de estado de la app
  const handleAppStateChange = async (nextAppState) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App regresó al primer plano');
      
      const shouldResync = await shouldResyncAlerts();
      if (shouldResync) {
        console.log('Resincronizando alertas...');
        await loadAndScheduleAlerts(true);
      } else {
        await loadScheduledAlerts(); // Cargar desde storage si no resync
      }
      
      await loadNotificationHistory();
    }
    appState.current = nextAppState;
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
    let isMounted = true;

    const initializeNotifications = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        if (isMounted) {
          setExpoPushToken(token || "");
        }

        await loadNotificationHistory();
        await loadScheduledAlerts(); // Cargar programadas desde storage

        await registerBackgroundTask();

        if (user?.userId && user?.token) {
          // Guardar userData para background
          await AsyncStorage.setItem('userData', JSON.stringify({ userId: user.userId, token: user.token }));
          const shouldResync = await shouldResyncAlerts();
          if (shouldResync) {
            await loadAndScheduleAlerts();
          }
        }
      } catch (error) {
        console.error('Error inicializando notificaciones:', error);
      }
    };

    initializeNotifications();

    notificationListener.current = Notifications.addNotificationReceivedListener(async (notification) => {
      const { title, body, data } = notification.request.content;
      
      const notificationData = {
        type: data.type || "NUTRITION",
        title,
        message: body,
        date: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      const savedNotification = await saveNotificationHistory(notificationData);
      
      if (isMounted && savedNotification) {
        setNotifications(prev => [savedNotification, ...prev]);
      }
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Respuesta a notificación:', response);
    });

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      isMounted = false;
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
      subscription?.remove();
    };
  }, [user?.userId, user?.token]);

  // Función para refrescar manualmente
  const handleRefresh = async () => {
    console.log('Refrescando alertas manualmente...');
    await loadAndScheduleAlerts(true);
    await loadNotificationHistory();
    await loadScheduledAlerts();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="Alimentación"
          onPress={() => scheduleHealthNotification("NUTRITION")}
          color="#D18BE0"
        />
        <Button
          title="Ejercicio"
          onPress={() => scheduleHealthNotification("EXERCISE")}
          color="#5BBF9C"
        />
        <Button
          title="Descanso"
          onPress={() => scheduleHealthNotification("SLEEP")}
          color="#658BC9"
        />
      </View>

      <View style={styles.refreshContainer}>
        <Button
          title="🔄 Actualizar Alertas"
          onPress={handleRefresh}
          color="#FF6B6B"
        />
      </View>

      <Text style={styles.subtitle}>
        Alertas Programadas ({scheduledAlerts.length})
      </Text>

      {scheduledAlerts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay alertas programadas</Text>
        </View>
      ) : (
        scheduledAlerts.map((alert) => (
          <NotificationCard
            key={alert.id}
            type={alert.type}
            title={NOTIFICATION_TYPES[alert.type]?.title || "Alerta"}
            message={alert.message}
            date={alert.scheduledTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
        ))
      )}

      <Text style={styles.subtitle}>
        Historial de Notificaciones ({notifications.length})
      </Text>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay notificaciones hoy</Text>
        </View>
      ) : (
        notifications.map((notif) => (
          <NotificationCard
            key={notif.id}
            type={notif.type}
            title={notif.title}
            message={notif.message}
            date={notif.date}
          />
        ))
      )}

      {__DEV__ && (
        <Text style={styles.token}>Token: {expoPushToken}</Text>
      )}
    </ScrollView>
  );
};

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
    marginBottom: 15,
    gap: 10,
  },
  refreshContainer: {
    marginBottom: 20,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default PushNotification;