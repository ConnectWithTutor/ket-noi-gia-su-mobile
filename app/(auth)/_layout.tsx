import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import colors from "@/constants/Colors";
import StatusBar from "@/components/ui/StatusBar";

export default function AuthLayout() {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} />
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.background}
      />
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});