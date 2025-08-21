import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView,
} from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from "expo-notifications";

import LogoutDIcon from "../../assets/icons/logout-d.svg";
import PersonalInformationCard from "../components/PersonalInformationCard";
import HealthMetricsCard from "../components/HealthMetricsCard";
import ChangePasswordCard from "../components/ChangePasswordCard";
import BiologicalDataCard from "../components/BiologicalDataCard";
import { useAuth } from "../auth/context/AuthContext";
import { AxiosClient } from "../auth/context/http_client";

export default function Profile() {
  const [isLogoutCardPressed, setIsLogoutCardPressed] = useState(false);
  const [biologicalData, setBiologicalData] = useState(null);
  const { logout, getUserById, user, userData } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [isInactive, setIsInactive] = useState(!user?.status);

  useEffect(() => {
    console.log("User data updated:", userData);
    if (userData) {
      setProfileData(userData);
    }
  }, [userData]);
const handleLogout = async () => {
  try {
    await AsyncStorage.multiRemove([
      'scheduledAlerts',
      'lastAlertSync',
      'notificationHistory',
      'userData',
    ]);

    await Notifications.cancelAllScheduledNotificationsAsync();
    logout();
  } catch (error) {
    console.error("Error durante logout:", error);
  }
};


  const fetchProfileData = async () => {
    if (!user?.token || !user?.userId) return;

    setLoading(true);
    try {
      await getUserById();
      const response = await AxiosClient.get(
        `/api/usuario/datosbiologicos/${user.userId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const { result } = response;

      const biologicalData = result
        ? {
          peso: result.weight?.toString() || "",
          altura: result.height?.toString() || "",
          imc: result.bmi?.toString() || "",
          weight: result.weight || 0,
          height: result.height || 0,
          bmi: result.bmi || 0,
          age: result.age || 0,
          idData: result.idData,
          fatPercentage: result.fatPercentage || 0,
          date: result.date,
        }
        : null;
      setBiologicalData(biologicalData);
    } catch (error) {
      console.log("Error al ver la parte de parte de perfil:", error);
      setBiologicalData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.status != false) {
      fetchProfileData();
    }
  }, []);

  const handleDataUpdate = async (newData, type) => {
    if (type === "user") {
      setProfileData((prev) => ({
        ...prev,
        ...newData,
      }));
      await getUserById();
    } else if (type === "biological") {
      setBiologicalData((prev) => ({
        ...prev,
        ...newData,
      }));
      if (newData.shouldRefetch) {
        await fetchProfileData();
      }
    }
  };

  if (!profileData) {
    return (
      <SafeAreaView edges={["top"]}>
        <View style={styles.container}>
          <Text>Cargando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]}>
      <ScrollView
        style={{ backgroundColor: "white", height: "100%", paddingBottom: 20 }}
      >
        <View style={styles.container}>
          <PersonalInformationCard
            title="Datos personales"
            token={user?.token}
            data={{
              id_user: user?.userId,
              nombre: profileData?.name || "",
              apellidoPaterno: profileData?.surname || "",
              apellidoMaterno: profileData?.lastname || "",
              edad: biologicalData?.age?.toString() || "",
              email: profileData?.email || "",
              password: profileData?.password || "",
              role: profileData?.roles
            }}
            status={user?.status}
            onUpdate={(newData) => handleDataUpdate(newData, "user")}
            onEdadUpdate={(newData) => handleDataUpdate(newData, "biological")}
            biologicalData={biologicalData}
          />

          {isInactive ? (
            <BiologicalDataCard
              onSave={(newData) => {
                handleDataUpdate({ ...newData, shouldRefetch: true }, "biological");
              }}
              token={user?.token}
              userId={user?.userId}
              setIsInactive={setIsInactive}
              fetchProfileData={fetchProfileData}
            />
          ) : (
            <HealthMetricsCard
              token={user?.token}
              userId={user?.userId}
              biologicalData={biologicalData}
              data={biologicalData}
              onUpdate={(newData) => {
                handleDataUpdate({ ...newData, shouldRefetch: true }, "biological");
              }}
            />
          )}

          <ChangePasswordCard token={user?.token} userId={user?.userId} />

          <TouchableOpacity
            style={styles.touchableCard}
            onPressIn={() => setIsLogoutCardPressed(true)}
            onPressOut={() => setIsLogoutCardPressed(false)}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.containerCard,
                isLogoutCardPressed && styles.containerCardPressed,
              ]}
            >
              <View style={styles.ContainerHead}>
                <View style={styles.leftContent}>
                  <LogoutDIcon width={24} height={24} />
                  <Text style={[styles.title, { marginLeft: 10 }]}>
                    Cerrar Sesión
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 20,
  },
  containerCard: {
    backgroundColor: "#FFEBEE",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#FFCDD2",
  },
  touchableCard: {
    width: "100%",
    shadowOpacity: 0.1,
    height: 100,
    backgroundColor: "transparent",
  },
  containerCardPressed: {
    backgroundColor: "#FFCDD2",
    opacity: 0.95,
  },
  ContainerHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D32F2F",
  },
});