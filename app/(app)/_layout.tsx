import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "@/store/auth-store";

export default function AppLayout() {
  const { isAuthenticated } = useAuthStore();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="change-password" options={{ presentation: "modal" }} />
    </Stack>
  );
}