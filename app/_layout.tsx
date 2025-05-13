import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "./error-boundary";
import { useAuthStore } from "@/store/auth-store";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
export const unstable_settings = {
  initialRouteName: "(auth)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
    const { checkAuth } = useAuthStore();

  const [loaded, errorFont] = useFonts({
    ...FontAwesome.font,
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (errorFont) {
      console.error(errorFont);
      throw errorFont;
    }
  }, [errorFont]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  

  useEffect(() => {
    (async () => {
      const auth = await checkAuth();
      setIsAuthenticated(auth);
      if (auth) {
        router.replace("/(app)/(tabs)/home");
      }
    })();
  }, []);
  if (!loaded || isAuthenticated === null) return null;  // chờ xong font + auth

return (
  <ErrorBoundary>
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
      <RootLayoutNav isAuthenticated={isAuthenticated} />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  </ErrorBoundary>
);
}

function RootLayoutNav({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated
        ? <Stack.Screen name="(app)" />
        : <Stack.Screen name="(auth)" />
      }
    </Stack>
  );
}