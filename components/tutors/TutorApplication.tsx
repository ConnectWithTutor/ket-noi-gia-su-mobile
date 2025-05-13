import { useUserProfileStore } from '@/store/profile-store';
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useStatusStore } from '@/store/status-store';
import { formatDate } from '@/utils/date-utils';
import { Swipeable } from 'react-native-gesture-handler';
import { Check, X } from "lucide-react-native";
type TutorApplicationProps = {
  userId: string;
  date: string;
  status: string;
  onPress?: () => void;
};
const TutorApplication = ({ userId, date, status , onPress}: TutorApplicationProps) => {
    const handleAccept = (name: string) => {
    Alert.alert("Chấp nhận", `Bạn đã chấp nhận ${name}`);
  };

  const handleReject = (name: string) => {
    Alert.alert("Từ chối", `Bạn đã từ chối ${name}`);
  };

    const { user,fetchUserById } = useUserProfileStore();
    const { StatusesTutorApplication,fetchStatusTutorApplication } = useStatusStore();
    const [ statusCode, setStatusCode ] = React.useState<string | null>(null);
    useEffect(() => {
        const fetchUser = async () => {
            await fetchUserById(userId);
            await fetchStatusTutorApplication();
            const statusData = StatusesTutorApplication.find((st) => st.statusId === status);
            if (statusData) {
                setStatusCode(statusData.code);
            } else {
                setStatusCode(null);
            }
        };
        fetchUser();

    }, [userId]);
    
    if(StatusesTutorApplication.length === 0 || statusCode !=="Pending" ) {
        return null;
    }
     const renderRightActions = (item: any) => (
    <View style={styles.actionsContainer}>
<TouchableOpacity
    style={styles.iconButton}
    onPress={() => handleAccept(item.fullName)}
>
    <Check color="green" size={24} />
</TouchableOpacity>
<View style={{ width: 1, backgroundColor: '#ddd', marginHorizontal: 8 }} />
<TouchableOpacity
    style={styles.iconButton}
    onPress={() => handleReject(item.fullName)}
>
    <X color="red" size={24} />
</TouchableOpacity>
</View>
  );
    return (
         <Swipeable renderRightActions={() => renderRightActions(user)}>
        <TouchableOpacity style={styles.applicationItem}
            onPress={onPress}>
            <View style={styles.applicationHeader}>
                <Text style={styles.applicationTitle}>
                    {user?.fullName || 'không có tên'} đã nộp đơn ứng tuyển
                </Text>
            </View>
            <Text style={styles.applicationDate}>
                Đã nộp đơn vào ngày {formatDate(date)}
            </Text>
            <Text> </Text>
        </TouchableOpacity>
        </Swipeable>
    );
};
const styles = StyleSheet.create({
    applicationItem: {
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    applicationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    applicationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    applicationStatus: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
        backgroundColor: '#007bff',
    },
    applicationStatusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    applicationDate: {
        fontSize: 14,
        color: '#666',
    },
    item: {
        backgroundColor: '#fff',
        padding: 16,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    degree: {
        fontSize: 14,
        color: '#888',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    iconButton: {
        width: 80,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 30,
        fontWeight: 'bold',
    }
});

export default TutorApplication;