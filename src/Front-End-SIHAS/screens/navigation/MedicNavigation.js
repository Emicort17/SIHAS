import React from "react";
import { Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeMedicScreen from "../medic/Home";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MedicTabs() {
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
        component={HomeMedicScreen} 
        screenListeners={{ headerShown: false }}
        options={{
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>🏥</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function MedicNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MedicTabs"
        component={MedicTabs}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
