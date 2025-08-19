import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Icon } from "@rneui/base";

import HomeAdminScreen from "../medic/Home";
import ProfileAdminScreen from "../medic/Profile";
import NutritionAdminScreen from "../medic/Nutrition";
import SleepAdminScreen from "../medic/Sleep";
import listAdminScreen from "../medic/patient/PatientListScreen";
import PatientDetailScreen from "../medic/patient/PatientDetailScreen";

import HomeSIcon from "../../assets/icons/home-s.svg";
import HomeDIcon from "../../assets/icons/home-d.svg";
import PersonSIcon from "../../assets/icons/person-s.svg";
import PersonDIcon from "../../assets/icons/person-d.svg";
import NutriSIcon from "../../assets/icons/nutri-s.svg";
import NutriDIcon from "../../assets/icons/nutri-d.svg";
import MoonSIcon from "../../assets/icons/moon-s.svg";
import MoonDIcon from "../../assets/icons/moon-d.svg";
import GroupSIcon from "../../assets/icons/group-s.svg";
import GroupDIcon from "../../assets/icons/group-d.svg";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// --- Header personalizado para médicos ---
function CustomHeader({ title, navigation }) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>M</Text>
      </View>
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity
        style={styles.notificationButton}
        onPress={() => {
          navigation.navigate('Notifications'); // Puedes crear una pantalla de notificaciones si quieres
        }}
      >
        <View style={styles.notificationIcon}>
          <Icon
            name="bell-outline"
            type="material-community"
            color="#424242"
            size={24}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

// --- Tabs para médicos ---
function MedicTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        tabBarActiveTintColor: "#34C759",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#e0e0e0",
        },
        header: () => {
          let title = "Perfil";
          switch (route.name) {
            case "HomeUser":
              title = "Inicio";
              break;
            case "NutricionUser":
              title = "Nutrición";
              break;
            case "SleepUser":
              title = "Sueño";
              break;
            case "GroupUser":
              title = "Pacientes";
              break;
            case "Profile":
              title = "Perfil";
              break;
          }
          return <CustomHeader title={title} navigation={navigation} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeUser"
        component={HomeAdminScreen}
        options={{
          tabBarLabel: "Inicio",
          tabBarIcon: ({ focused }) =>
            focused ? <HomeSIcon width={24} height={24} /> : <HomeDIcon width={24} height={24} />,
        }}
      />
      <Tab.Screen
        name="NutricionUser"
        component={NutritionAdminScreen}
        options={{
          tabBarLabel: "Nutrición",
          tabBarIcon: ({ focused }) =>
            focused ? <NutriSIcon width={24} height={24} /> : <NutriDIcon width={24} height={24} />,
        }}
      />
      <Tab.Screen
        name="SleepUser"
        component={SleepAdminScreen}
        options={{
          tabBarLabel: "Sueño",
          tabBarIcon: ({ focused }) =>
            focused ? <MoonSIcon width={24} height={24} /> : <MoonDIcon width={24} height={24} />,
        }}
      />
      <Tab.Screen
        name="GroupUser"
        component={listAdminScreen}
        options={{
          tabBarLabel: "Pacientes",
          tabBarIcon: ({ focused }) =>
            focused ? <GroupSIcon width={24} height={24} /> : <GroupDIcon width={24} height={24} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileAdminScreen}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ focused }) =>
            focused ? <PersonSIcon width={24} height={24} /> : <PersonDIcon width={24} height={24} />,
        }}
      />
    </Tab.Navigator>
  );
}

// --- Stack navigator ---
export default function MedicNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MedicTabs"
        component={MedicTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Detail"
        component={PatientDetailScreen}
        options={{ title: "Detalle de Paciente" }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#C8E6C9",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#000",
    flex: 1,
    textAlign: "center",
  },
  notificationButton: {
    padding: 8,
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
});
