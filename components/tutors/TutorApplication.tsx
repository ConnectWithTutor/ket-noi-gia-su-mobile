// import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
// import { LinearGradient } from 'expo-linear-gradient';
import { useUserProfileStore } from '@/store/profile-store';
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useStatusStore } from '@/store/status-store';
import { formatDate } from '@/utils/date-utils';
import { Swipeable } from 'react-native-gesture-handler';
import { Check, X } from "lucide-react-native";
import { useTutorApplicationStore } from '@/store/tutorApplicationStore';
import { Status, TutorApplication } from '@/types';
import { triggerHaptic } from '@/utils/haptics';
import { useStudentRequestStore } from '@/store/post-store';
type TutorApplicationProps = {
    requestId:string;
    StatusAccepted:string;
    StatusRejected:string;
    item: TutorApplication
    statusStudentRequest?: Status[];
    onPress?: () => void;
};
const TutorApplicationComponent = ({  requestId, StatusAccepted,StatusRejected , item,statusStudentRequest, onPress}: TutorApplicationProps) => {
    const {updateApplication} = useTutorApplicationStore();
    const { updateStudentRequest } = useStudentRequestStore();
    const [isLoading, setIsLoading] = React.useState(true);
   
    const handleAccept = (name: string) => {
    triggerHaptic('light');
    Alert.alert("Chấp nhận", `Bạn xác nhận chấp nhậngia sư ${name} không?`, 
        [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "chấp nhận",
          onPress: async () => {
            try {
             
              if (user && item.applicationId) {
                const applicationData = {
                  requestId: requestId,
                  tutorId: item.tutorId,
                  status: StatusAccepted || '',
                };
                const Status = statusStudentRequest?.find((st) => st.code === "InProgress");
                await updateApplication(item.applicationId,applicationData);
                await updateStudentRequest(requestId, {
                  status: Status?.statusId || '',
                });
                fetchStatusTutorApplication();
              } else {
                console.error("Tutor not found");
              }
            }
            catch (error) {
              console.error("Error applying for the request:", error);
            }

            Alert.alert(
              "Thành công",
              `Đã chấp nhận gia sư ${name} thành công.`
            );
          }
        }
      ]
    );
    
    
    };
 
  const handleReject = (name: string) => {
    triggerHaptic('light');
    Alert.alert("Từ chối", `Bạn xác nhận từ chối gia sư ${name} không?`, 
        [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "Từ chối",
          onPress: async () => {
            try {
              if (user && item.applicationId) {
                const applicationData = {
                  requestId: requestId,
                  tutorId: item.tutorId,
                  status: StatusRejected || '',
                };
                await updateApplication(item.applicationId,applicationData);
                fetchStatusTutorApplication();
              } else {
                console.error("Tutor not found");
              }
            }
            catch (error) {
              console.error("Error rejecting the application:", error);
            }
          }
        }
      ]
    );  
  };

    const {fetchUserById } = useUserProfileStore();
    const { StatusesTutorApplication,fetchStatusTutorApplication } = useStatusStore();
    const [ statusCode, setStatusCode ] = React.useState<string | null>(null);
    const [user, setUser] = React.useState<any>(null);
    useEffect(() => {
        const fetchUser = async () => {
            try {
            setIsLoading(true); 
            const user = await fetchUserById(item.tutorId);
            setUser(user);
            await fetchStatusTutorApplication();
            const statusData = StatusesTutorApplication.find((st) => st.statusId === item.status);
            if (statusData) {
                setStatusCode(statusData.code);
            } else {
                setStatusCode(null);
            }
            } catch (error) {
                console.error("Error fetching user/status:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();

    }, [item.tutorId]);
    
    if (StatusesTutorApplication.length === 0) {
    return null;
}
if (isLoading) {
  return (
    // <SkeletonPlaceholder
    //   backgroundColor="#E1E9EE"
    //   highlightColor="#F2F8FC"
    //   // @ts-ignore: Expo cần ignore type này
    //   LinearGradientComponent={LinearGradient}
    // >
    //   <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" padding={16}>
    //     <SkeletonPlaceholder.Item width={50} height={50} borderRadius={25} />
    //     <SkeletonPlaceholder.Item marginLeft={12}>
    //       <SkeletonPlaceholder.Item width={120} height={20} borderRadius={4} />
    //       <SkeletonPlaceholder.Item marginTop={6} width={80} height={20} borderRadius={4} />
    //     </SkeletonPlaceholder.Item>
    //   </SkeletonPlaceholder.Item>
    // </SkeletonPlaceholder>
     <View style={styles.applicationItem}>
      <View style={[styles.skeletonText, { width: '60%' }]} />
      <View style={[styles.skeletonText, { width: '40%', marginTop: 8 }]} />
    </View>
  );
}
if (statusCode === "Accepted" || statusCode === "Rejected") {
    return (
        <TouchableOpacity 
            style={[
                styles.applicationItem,
                statusCode === "Accepted" ? styles.acceptedItem : styles.rejectedItem
            ]}
            onPress={onPress}
        >
            <View style={styles.applicationHeader}>
                <Text style={styles.applicationTitle}>
                    {user?.fullName || 'không có tên'} đã 
                    {statusCode === "Accepted" ? ' được chấp nhận' : ' bị từ chối'}
                </Text>
            </View>
            <Text style={styles.applicationDate}>
                Đã xử lý vào ngày {formatDate(item.applicationDate)}
            </Text>
        </TouchableOpacity>
    );
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
                Đã nộp đơn vào ngày {formatDate(item.applicationDate)}
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
    },
    acceptedItem: {
    backgroundColor: '#e6f4ea', 
    borderColor: '#4CAF50',
    borderWidth: 1,
},

rejectedItem: {
    backgroundColor: '#fdecea',  
    borderColor: '#f44336',
    borderWidth: 1,
},
skeletonText: {
  height: 16,
  backgroundColor: '#e0e0e0',
  borderRadius: 4,
  marginVertical: 4,
},
});

export default TutorApplicationComponent;