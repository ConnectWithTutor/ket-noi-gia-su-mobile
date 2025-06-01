import React, { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useComplaintStore } from "@/store/complaint-store";
import { useRouter } from "expo-router";
import StatusBar from "@/components/ui/StatusBar";
import Header from "@/components/ui/Header";
import colors from "@/constants/Colors";
import { AlertCircle, ChevronRight, Plus } from "lucide-react-native";
// Import ComplaintStatus as an enum or object, not just a type
import { ComplaintStatus } from "@/types/complaint";
const ComplaintListScreen = () => {
    const {
        complaints,
        loading,
        error,
        fetchComplaints,
        pagination,
        clearError,
    } = useComplaintStore();
    const router = useRouter();

    useEffect(() => {
        fetchComplaints();
        return () => clearError();
    }, []);

    const handlePressComplaint = (id: string) => {
        router.push(`(app)/complaint/${id}` as any);
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>{error}</Text>
            </View>
        );
    }

    return (
    <View style={styles.container}>
        <StatusBar backgroundColor={colors.primary} />
        <Header title="Danh sách khiếu nại" showBack showNotification />
        <FlatList
            data={complaints}
            keyExtractor={(item) => item.complaintId}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={styles.itemCard}
                    onPress={() => handlePressComplaint(item.complaintId)}
                    activeOpacity={0.85}
                >
                    <View style={styles.row}>
                        <AlertCircle
                            size={28}
                            color={item.status === ComplaintStatus.Done ? "#4CAF50" : "#FF9800"}
                            style={{ marginRight: 12 }}
                        />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={[
                                styles.status,
                                { color: item.status === ComplaintStatus.Done ? "#4CAF50" : "#FF9800" }
                            ]}>
                                {item.status === ComplaintStatus.Done ? "Đã xử lý" : "Đang xử lý"}
                            </Text>
                        </View>
                        <ChevronRight size={22} color="#bbb" />
                    </View>
                </TouchableOpacity>
            )}
            ListEmptyComponent={
                <View style={styles.center}>
                    <Text>Không có khiếu nại nào.</Text>
                </View>
            }
        />
        
        <Text style={styles.pagination}>
            Trang {pagination.page} / {pagination.totalPages}
        </Text>
        <TouchableOpacity
            style={styles.fab}
            onPress={() => router.push("(app)/complaint/create" as any)}
            activeOpacity={0.8}
        >
            <Plus color="#fff" size={28} />
        </TouchableOpacity>
    </View>
);
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    itemCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginHorizontal: 12,
        marginVertical: 6,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    fab: {
        position: "absolute",
        right: 24,
        bottom: 32,
        backgroundColor: colors.primary,
        borderRadius: 32,
        width: 56,
        height: 56,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
        color: "#222",
    },
    status: {
        fontSize: 13,
        fontWeight: "600",
    },
    error: { color: colors.error },
    pagination: { textAlign: "center", padding: 8, color: colors.textSecondary },
});

export default ComplaintListScreen;