import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Button } from 'react-native';

const StudentProfile = () => {
    const studentData = {
        fullname: 'Nguyễn Văn A',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        gradeLevel: 'Lớp 10',
        learningGoals: 'Cải thiện môn Toán',
        preferredStudyTime: 'Buổi tối',
        description: 'Học sinh chăm chỉ, yêu thích học hỏi.',
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.profileHeader}>
                <Image
                    source={{ uri: 'https://via.placeholder.com/150' }}
                    style={styles.profileImage}
                />
                <Text style={styles.studentName}>{studentData.fullname}</Text>
                <Text style={styles.studentInfo}>{studentData.gradeLevel} | {studentData.address}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
                <Text style={styles.sectionContent}>- Địa chỉ: {studentData.address}</Text>
                <Text style={styles.sectionContent}>- Mục tiêu học tập: {studentData.learningGoals}</Text>
                <Text style={styles.sectionContent}>- Thời gian học ưa thích: {studentData.preferredStudyTime}</Text>
                <Text style={styles.sectionContent}>- Mô tả: {studentData.description}</Text>
            </View>
            <Button title="Chỉnh sửa thông tin" onPress={() => {}} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 12,
    },
    studentName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    studentInfo: {
        fontSize: 14,
        color: '#666',
    },
    section: {
        marginBottom: 16,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    sectionContent: {
        fontSize: 14,
        marginBottom: 4,
    },
});

export default StudentProfile;