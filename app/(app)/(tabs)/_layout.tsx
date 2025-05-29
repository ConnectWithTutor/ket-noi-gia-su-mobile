import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Calendar, MessageSquare, FileText, User, Bell,School } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import colors from '@/constants/Colors';
import { useNotificationStore } from '@/store/notification-store';
import NotificationBadge from '@/components/ui/NotificationBadge';
import { triggerHaptic } from '@/utils/haptics';

export default function TabsLayout() {
  const router = useRouter();
  const { notifications } = useNotificationStore();
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleNotificationPress = () => {
    triggerHaptic('light');
    router.push('/notification-list' as any);
  };

  return (
    <Tabs
      screenOptions={{
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textSecondary,
      tabBarStyle: {
        borderTopColor: colors.border,
        backgroundColor: colors.white,
      },
      headerStyle: {
        backgroundColor: colors.white,
      },
      headerShown: false ,
      headerTitleStyle: {
        color: colors.text,
        fontWeight: '600',
      },
      headerRight: () => (
        <TouchableOpacity 
        onPress={handleNotificationPress}
        style={{ marginRight: 16, position: 'relative' }}
        >
        <Bell size={24} color={colors.text} />
        <NotificationBadge count={unreadCount} size="small" />
        </TouchableOpacity>
      ),
      }}
    >
      <Tabs.Screen
      name="home"
      options={{
        title: 'Trang chủ',
        tabBarIcon: ({ color }) => <Home size={24} color={color} />,
      }}
      />
     <Tabs.Screen
       name="schedule"
       options={{
        title: 'Lịch học',
        tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
      }}
      />
      <Tabs.Screen
      name="posts"
      options={{
        title: 'Bài viết',
        tabBarIcon: ({ color }) => <FileText size={24} color={color} />,
      }}
      />
      <Tabs.Screen
      name="chat"
      options={{
        title: 'Tin nhắn',
        tabBarIcon: ({ color }) => <MessageSquare size={24} color={color} />,
      }}
      />
      <Tabs.Screen
      name="class"
      options={{
        title: 'Lớp học',
        tabBarIcon: ({ color }) => <School size={24} color={color} />,
      }}
      />
      <Tabs.Screen
      name="profile"
      options={{
        title: 'Cá nhân',
        tabBarIcon: ({ color }) => <User size={24} color={color} />,
      }}
      />
     
    </Tabs>
    
  );
}