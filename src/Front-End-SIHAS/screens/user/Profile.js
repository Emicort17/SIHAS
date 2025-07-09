import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Icon } from "@rneui/base";
import PersonalInformationCard from "./components/PersonalInformationCard";
import HealthMetricsCard from "./components/HealthMetricsCard";
import ChangePasswordCard from "./components/ChangePasswordCard";

export default function Profile() {
  const [isLogoutCardPressed, setIsLogoutCardPressed] = useState(false);

  return (
    <SafeAreaView edges={["top"]}>
      <ScrollView
        style={{ backgroundColor: "white", height: "100%", paddingBottom: 10 }}
      >
        <View style={styles.container}>
          <PersonalInformationCard
            title="Datos personales"
            data={{
              nombre: "Victor Alejandro",
              apellidoPaterno: "Oliva",
              apellidoMaterno: "Quiroz",
              edad: "22",
              email: "alejandro2312@gmail.com",
            }}
          />

          <HealthMetricsCard
            data={{
              altura: "1.73",
              peso: "73",
              imc: "24.4",
            }}
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
                    color="black"
                    size={24}
                  />
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
    padding: 20,
  },
  containerCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  touchableCard: {
    width: "100%",
    shadowOpacity: 0.1,
    height: 100,
    backgroundColor: "transparent",
  },
  containerCardPressed: {
    backgroundColor: "#F5F5F5",
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
  },
});
