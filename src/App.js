import { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import SplashScreenComponent from './components/SplashScreeen';

import LoginScreen from './screens/auth/Login';
import RegisterScreen from './screens/auth/Register';
import HomeUserScreen from './screens/user/Home';



export default function App() {
  const Stack = createNativeStackNavigator();
  const [isAppReady, SetisAppReady] = useState(false);

  if (!isAppReady) {
    return <SplashScreenComponent
      onFinish={(isCancelled) => !isCancelled && SetisAppReady(true)}
    />
  }

  function MyStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" options={{headerShown:false,}} component={LoginScreen} />
        <Stack.Screen name="Register" options={{headerShown:false,}} component={RegisterScreen} />
        <Stack.Screen name="HomeUser" component={HomeUserScreen} />
      </Stack.Navigator>
    );
  }

  return(
    <NavigationContainer>
      <MyStack/>
    </NavigationContainer>
  )

}