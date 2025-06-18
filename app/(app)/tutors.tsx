import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl, TextInput } from "react-native";
import { useTutorStore } from "@/store/tutor-store";
import { useNavigation } from "expo-router";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import TutorCard from "@/components/tutors/TutorCard";
import Header from "@/components/ui/Header";
import Colors from "@/constants/Colors";
import { useTranslation } from "react-i18next";
type RootStackParamList = {
  "(app)/profile/profileTutor/[id]": { id: string };
};

export default function TutorsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { users, isLoading, error, fetchTutors, clearError } = useTutorStore();

  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    clearError();
    fetchTutors();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter(
          (u) =>
            u.fullName?.toLowerCase().includes(search.trim().toLowerCase()) ||
            u.email?.toLowerCase().includes(search.trim().toLowerCase())
        )
      );
    }
  }, [search, users]);

  const handlePress = (userId: string) => {
    navigation.navigate("(app)/profile/profileTutor/[id]", { id: userId });
  };
  const handleRefresh = () => {
    clearError();
    fetchTutors();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header title={t("Danh sách gia sư")} showBack />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t("Tìm kiếm theo tên hoặc email")}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
      </View>
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.userId}
          renderItem={({ item }) => (
            <TutorCard user={item} onPress={() => handlePress(item.userId)} />
          )}
          contentContainerStyle={
            filteredUsers.length === 0
              ? styles.emptyContainer
              : { padding: 16, flexGrow: 1 }
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>{t("Không có gia sư nào.")}</Text>
          }
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} colors={[Colors.primary]} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    backgroundColor: "#fff",
  },
  searchInput: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: Colors.text,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: Colors.danger,
    fontSize: 16,
    textAlign: "center",
    margin: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: "center",
  },
});