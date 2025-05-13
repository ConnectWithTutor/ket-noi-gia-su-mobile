import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import colors from '@/constants/Colors';
import { useStatusStore } from '@/store/status-store';
import { FONT_SIZE } from '@/constants/Theme';
import { Status } from '@/types';
export default  function PostStatus({ statusId }: { statusId: string }) {
    const { statusesStudentRequest, fetchStatuses,loading } = useStatusStore();
    const [status, setStatus] = useState<Status | null>(null);
     
    useEffect(() => {
    fetchStatuses();
  }, [fetchStatuses]);



   useEffect(() => {

    if (!loading && statusesStudentRequest.length > 0) {
        
      const info = statusesStudentRequest.find(s => s.statusId === statusId) || null;
      setStatus(info);
    }
  }, [loading, statusesStudentRequest, statusId]);
  if (loading || status === null) {

    return <View style={styles.statusBadge}><Text>Loading…</Text></View>;
  }
    
    const statusCode = status?.code.toLowerCase();
    return (
        <View
            style={[
                styles.statusBadge,
                {
                    backgroundColor:
                        statusCode === 'inprogress'
                            ? colors.primary + 20
                            : statusCode === 'completed'
                            ? colors.success+ 20
                            : statusCode === 'cancelled'
                            ? colors.danger+ 20
                            : colors.warning+ 20, 
                },
            ]}
        >
            <Text style={[
                styles.statusText,
                {
                    color:
                 statusCode === 'inprogress'
                            ? colors.primary 
                            : statusCode === 'completed'
                            ? colors.success
                            : statusCode === 'cancelled'
                            ? colors.danger
                            : colors.warning, 
             },
            ]}>
             
            {status.name || 'Không rõ'}
            </Text>
           
        </View>
    );
}

const styles = StyleSheet.create({
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
   fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  });