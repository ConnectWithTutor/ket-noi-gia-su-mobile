import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Home, Calendar, MessageSquare, FileText, User, Bell,School } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import colors from '@/constants/Colors';
import { useNotificationStore } from '@/store/notification-store';
import NotificationBadge from '@/components/ui/NotificationBadge';
import { triggerHaptic } from '@/utils/haptics';
import { useAuthStore } from '@/store/auth-store';
import {useChatStore } from '@/store/chat-store';
import { useTranslation } from 'react-i18next';
export default function TabsLayout() {
  const router = useRouter();
  const { notifications } = useNotificationStore();
   const { t } = useTranslation();
  const { user } = useAuthStore();
  const { connectWebSocket } = useChatStore();
  const unreadCount = notifications.filter(n => !n.read).length;
useEffect(() => {
  const initiateWebSocketConnection = async () => {
    if (user?.userId) {
      await connectWebSocket(user.userId)
        .catch((err) => {
          console.error('WebSocket connection failed:', err);
        });
    }
  };
  initiateWebSocketConnection();
}, [user?.userId]);
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
        title: t('Trang chủ'),
        tabBarIcon: ({ color }) => <Home size={24} color={color} />,
      }}
      />
     <Tabs.Screen
       name="schedule"
       options={{
        title: t('Lịch học'),
        tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
      }}
      />
      <Tabs.Screen
      name="posts"
      options={{
        title: t('Bài viết'),
        tabBarIcon: ({ color }) => <FileText size={24} color={color} />,
      }}
      />
      <Tabs.Screen
      name="chat"
      options={{
        title: t('Tin nhắn'),
        tabBarIcon: ({ color }) => <MessageSquare size={24} color={color} />,
      }}
      />
      <Tabs.Screen
      name="class"
      options={{
        title: t('Lớp học'),
        tabBarIcon: ({ color }) => <School size={24} color={color} />,
      }}
      />
      <Tabs.Screen
      name="profile"
      options={{
        title: t('Cá nhân'),
        tabBarIcon: ({ color }) => <User size={24} color={color} />,
      }}
      />
     
    </Tabs>
    
  );
}

function useUserStore(): { user: any; } {
  throw new Error('Function not implemented.');
}
