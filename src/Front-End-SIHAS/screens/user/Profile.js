import React, { useState } from "react";
import { View, Text, Alert, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { Icon } from "@rneui/base";
import PersonalInformationCard from "./components/PersonalInformationCard";
import HealthMetricsCard from "./components/HealthMetricsCard";
import ChangePasswordCard from "./components/ChangePasswordCard";
import WelcomeModal from "./components/WelcomeModal";
import BiologicalDataCard from "./components/BiologicalDataCard";
import { useAuth } from "../auth/context/AuthContext";

export default function Profile() {
  const [isLogoutCardPressed, setIsLogoutCardPressed] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [biologicalData, setBiologicalData] = useState(null);
  const { logout } = useAuth();
  
  const handleLogout = () => {
    try {
      logout()
    } catch (err){
      console.error(err);
    }
  }

  return (
    <SafeAreaView edges={["top"]}>
      <ScrollView
        style={{ backgroundColor: "white", height: "100%", paddingBottom: 20 }}
      >
        <View style={styles.container}>
          <PersonalInformationCard
            title="Datos personales"
            data={{
              nombre: "Victor Alejandro",
              apellidoPaterno: "Oliva",
              apellidoMaterno: "Quiroz",
              edad: null,
              email: "alejandro2312@gmail.com",
            }}
          />

          {!biologicalData ? (
            <BiologicalDataCard onSave={(data) => setBiologicalData(data)} />
          ) : (
            <HealthMetricsCard
              data={{
                altura: "1.73",
                peso: "73",
                imc: "24.4",
              }}
            />
          )}

          <WelcomeModal
            visible={showModal}
            onClose={() => setShowModal(false)}
          />
          <ChangePasswordCard />

          <TouchableOpacity
            style={styles.touchableCard}
            onPressIn={() => setIsLogoutCardPressed(true)}
            onPressOut={() => setIsLogoutCardPressed(false)}
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
                  <Icon
                    name="logout"
                    type="material-community"
                    color="#D32F2F"
                    size={24}
                  />
                  <Text onPress={() => {handleLogout()}} style={[styles.title, { marginLeft: 10 }]}>
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
    levation: 3,
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
