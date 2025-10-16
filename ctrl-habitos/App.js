import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";

// Import das telas
import HomeScreen from "./screens/HomeScreen";
import AddHabitScreen from "./screens/AddHabitScreen";
import EditHabitScreen from "./screens/EditHabitScreen";
import ProgressScreen from "./screens/ProgressScreen";

// Import do sistema de notificações
import { initializeNotifications } from "./utils/notifications";

const Stack = createNativeStackNavigator();

// Manter a tela de splash visível até o app estar pronto
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Inicializar notificações
        await initializeNotifications();

        // Aguardar um pouco para carregar recursos se necessário
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#4A90E2",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          contentStyle: {
            backgroundColor: "#f8f9fa",
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "Controle de Hábitos",
          }}
        />
        <Stack.Screen
          name="AddHabit"
          component={AddHabitScreen}
          options={{
            title: "Adicionar Hábito",
          }}
        />
        <Stack.Screen
          name="EditHabit"
          component={EditHabitScreen}
          options={{
            title: "Editar Hábito",
          }}
        />
        <Stack.Screen
          name="Progress"
          component={ProgressScreen}
          options={{
            title: "Meu Progresso",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
