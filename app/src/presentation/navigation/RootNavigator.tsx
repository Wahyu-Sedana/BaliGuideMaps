import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { observer } from "mobx-react";
import MapScreen from "../screens/MapScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import SplashScreen from "../screens/SplashScreen";
import ServiceLocator from "../../di/ServiceLocator";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Map: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = observer(() => {
  const authStore = ServiceLocator.getAuthStore();
  const [showSplash, setShowSplash] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    authStore.checkAuth().finally(() => setAuthReady(true));
  }, []);

  // Keep splash visible until both animation is done AND auth check finished
  const handleSplashFinish = () => {
    if (authReady) {
      setShowSplash(false);
    } else {
      // Auth still loading — wait then hide
      const check = setInterval(() => {
        if (authReady) {
          clearInterval(check);
          setShowSplash(false);
        }
      }, 100);
    }
  };

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {authStore.isAuthenticated ? (
            <Stack.Screen name="Map" component={MapScreen} />
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="Map" component={MapScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>

      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
    </>
  );
});
