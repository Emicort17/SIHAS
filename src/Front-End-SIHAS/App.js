import { useState } from 'react';
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from '../Front-End-SIHAS/screens/auth/context/AuthContext'

import SplashScreenComponent from './components/SplashScreeen';

import LoginScreen from './screens/auth/Login';
import RegisterScreen from './screens/auth/Register';
import UserTabs from './screens/navigation/UserNavigation'; 
import MedicNavigator from './screens/navigation/MedicNavigation';


export default function App() {
  const Stack = createNativeStackNavigator();
  const [isAppReady, SetisAppReady] = useState(false);
  
  if (!isAppReady) {
    return <SplashScreenComponent
      onFinish={(isCancelled) => !isCancelled && SetisAppReady(true)}
    />
  }

  function MyStack() {
    const { user } = useAuth()
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!user ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          ) : user.rol === "USUARIO" ? (
            <Stack.Screen name="UserStack" component={UserTabs} />
          ) : (
            <Stack.Screen name="MedicStack" component={MedicNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <AuthProvider>
      <MyStack />
    </AuthProvider>
  )

}