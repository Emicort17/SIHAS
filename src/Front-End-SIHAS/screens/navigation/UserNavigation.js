import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Icon } from "@rneui/base";

import HomeUserScreen from "../user/Home";
import ProfileScreen from "../user/Profile";
import NutricionUserScreen from "../user/Nutricion";
import SleepUserScreen from "../user/Sleep";
import PushNotifications from "../notification/PushNotification";
import HomeSIcon from "../../assets/icons/home-s.svg";
import HomeDIcon from "../../assets/icons/home-d.svg";
import PersonSIcon from "../../assets/icons/person-s.svg";
import PersonDIcon from "../../assets/icons/person-d.svg";
import NutriSIcon from "../../assets/icons/nutri-s.svg";
import NutriDIcon from "../../assets/icons/nutri-d.svg";
import MoonSIcon from "../../assets/icons/moon-s.svg";
import MoonDIcon from "../../assets/icons/moon-d.svg";
import Logo from "../../assets/logo.jpg";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function CustomHeader({ title, navigation }) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.avatarContainer}>
        <Image source={Logo} style={styles.avatar} />
      </View>
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity
        style={styles.notificationButton}
        onPress={() => {
          navigation.navigate('Notifications');
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

function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#34C759",
        tabBarInactiveTintColor: "#8E8E93",
        headerShown: true,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#e0e0e0",
        },
        header: ({ route, navigation }) => {
          let title = "Perfil";

          switch (route.name) {
            case 'HomeUser':
              title = 'Inicio';
              break;
            case 'NutricionUser':
              title = 'Nutrición';
              break;
            case 'SleepUser':
              title = 'Sueño';
              break;
            case 'Profile':
              title = 'Perfil';
              break;
          }

          return <CustomHeader title={title} navigation={navigation} />;
        },
      }}
    >
      <Tab.Screen
        name="HomeUser"
        component={HomeUserScreen}
        options={{
          tabBarLabel: "Inicio",
          tabBarIcon: ({ focused }) =>
            focused ? <HomeSIcon width={24} height={24} /> : <HomeDIcon width={24} height={24} />,
        }}
      />
      <Tab.Screen
        name="NutricionUser"
        component={NutricionUserScreen}
        options={{
          tabBarLabel: "Nutrición",
          tabBarIcon: ({ focused }) =>
            focused ? <NutriSIcon width={24} height={24} /> : <NutriDIcon width={24} height={24} />,
        }}
      />
      <Tab.Screen
        name="SleepUser"
        component={SleepUserScreen}
        options={{
          tabBarLabel: "Sueño",
          tabBarIcon: ({ focused }) =>
            focused ? <MoonSIcon width={24} height={24} /> : <MoonDIcon width={24} height={24} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ focused }) =>
            focused ? <PersonSIcon width={24} height={24} /> : <PersonDIcon width={24} height={24} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function UserNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="UserTabs"
        component={UserTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notifications"
        component={PushNotifications}
        options={{
          headerShown: true,
          headerTitle: "Notificaciones",
          headerBackTitle: "Atrás",
          headerStyle: {
            backgroundColor: "#C8E6C9",
          },
          headerTintColor: "#2E7D32",
          headerTitleStyle: {
            fontWeight: "600",
          },
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#C8E6C9',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    elevation: 0,
    shadowOpacity: 0, 
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,

  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 38,
    height: 40,
    borderRadius: 16,
    backgroundColor: "#ffffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000000ff',
    flex: 1,
    textAlign: 'center',
  },
  notificationButton: {
    padding: 8,
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
});