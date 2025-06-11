import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "./error-boundary";
import { useAuthStore } from "@/store/auth-store";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import "@/i18n";
export const unstable_settings = {
  initialRouteName: "(auth)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { checkAuth, user } = useAuthStore();  // Lấy user từ store
  const [loaded, errorFont] = useFonts({
    ...FontAwesome.font,
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();


  // Bắt lỗi font
  useEffect(() => {
    if (errorFont) {
      console.error(errorFont);
      throw errorFont;
    }
  }, [errorFont]);

  // Ẩn splash screen khi font load xong
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  

  // Kiểm tra auth khi app khởi động
  
  useEffect(() => {
    (async () => {
      const auth = await checkAuth();
      setIsAuthenticated(auth);
      if (auth) {
        router.replace("/(app)/(tabs)/home");
      }
    })();
  }, []);
  if (!loaded || isAuthenticated === null) return null; // Chờ font + auth

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
           <PaperProvider>
          <RootLayoutNav isAuthenticated={!!isAuthenticated} />
          </PaperProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

function RootLayoutNav({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? <Stack.Screen name="(app)" /> : <Stack.Screen name="(auth)" />}
    </Stack>
  );
}
