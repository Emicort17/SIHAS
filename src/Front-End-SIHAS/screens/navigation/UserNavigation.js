import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeUserScreen from "../user/Home";
import ProfileScreen from "../user/Profile";
import NutricionUserScreen from "../user/Nutricion";
import SleepUserScreen from "../user/Sleep";
import RunUserScreen from "../user/Run";
import HomeSIcon from "../../assets/icons/home-s.svg";
import HomeDIcon from "../../assets/icons/home-d.svg";
import PersonSIcon from "../../assets/icons/person-s.svg";
import PersonDIcon from "../../assets/icons/person-d.svg";
import NutriSIcon from "../../assets/icons/nutri-s.svg";
import NutriDIcon from "../../assets/icons/nutri-d.svg";
import MoonSIcon from "../../assets/icons/moon-s.svg";
import MoonDIcon from "../../assets/icons/moon-d.svg";
import RunSIcon from "../../assets/icons/run-s.svg";
import RunDIcon from "../../assets/icons/run-d.svg";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#34C759",
        tabBarInactiveTintColor: "#8E8E93",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#e0e0e0",
        },
      }

      }
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
        name="RunUser"
        component={RunUserScreen}
        options={{
          tabBarLabel: "Ejercicio",
          tabBarIcon: ({ focused }) =>
            focused ? <RunSIcon width={24} height={24} /> : <RunDIcon width={24} height={24} />,
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
    </Stack.Navigator>
  );
}
