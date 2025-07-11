import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import colors from '@/constants/Colors';
import { BORDER_RADIUS, FONT_SIZE, SPACING } from '@/constants/Theme';

interface MessageBubbleProps {
  message: string;
  time: string;
  isMe: boolean;
  avatar?: string;
  showAvatar?: boolean;
}

export default function MessageBubble({
  message,
  time,
  isMe,
  avatar,
  showAvatar = true,
}: MessageBubbleProps) {
  return (
    <View style={[
      styles.container,
      isMe ? styles.myMessageContainer : styles.otherMessageContainer,
    ]}>
      {!isMe && (
        showAvatar ? (
          <Image
            source={{ uri: avatar || require('@/assets/images/user_default.jpg') }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )
      )}
      
      <View style={[
        styles.bubble,
        isMe ? styles.myBubble : styles.otherBubble,
      ]}>
        <Text style={[
          styles.message,
          isMe ? styles.myMessage : styles.otherMessage,
        ]}>
          {message}
        </Text>
        <Text style={[
          styles.time,
          isMe ? styles.myTime : styles.otherTime,
        ]}>
          {time}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
    maxWidth: '80%',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: SPACING.xs,
  },
  avatarPlaceholder: {
  width: 30,
  height: 30,
  marginRight: SPACING.xs,
},
  bubble: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  myBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 0,
  },
  otherBubble: {
    backgroundColor: colors.card,
    borderBottomLeftRadius: 0,
  },
  message: {
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.xs,
  },
  myMessage: {
    color: colors.white,
  },
  otherMessage: {
    color: colors.text,
  },
  time: {
    fontSize: FONT_SIZE.xs,
    alignSelf: 'flex-end',
  },
  myTime: {
    color: colors.white,
    opacity: 0.8,
  },
  otherTime: {
    color: colors.textSecondary,
  },
});