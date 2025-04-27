import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { Send, Paperclip, Mic } from 'lucide-react-native';
import colors from '@/constants/Colors';
import { BORDER_RADIUS, FONT_SIZE, SPACING } from '@/constants/Theme';

interface ChatInputProps {
  onSend: (message: string) => void;
  onAttach?: () => void;
  onVoice?: () => void;
}

export default function ChatInput({
  onSend,
  onAttach,
  onVoice,
}: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={onAttach}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Paperclip size={20} color={colors.textSecondary} />
      </TouchableOpacity>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhắn tin..."
          placeholderTextColor={colors.placeholder}
          value={message}
          onChangeText={setMessage}
          multiline
        />
      </View>
      
      {message.trim() ? (
        <TouchableOpacity 
          style={[styles.button, styles.sendButton]} 
          onPress={handleSend}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Send size={20} color={colors.white} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={styles.button} 
          onPress={onVoice}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Mic size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    backgroundColor: colors.primary,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: BORDER_RADIUS.md,
    marginHorizontal: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  input: {
    fontSize: FONT_SIZE.md,
    color: colors.text,
    maxHeight: 100,
    paddingVertical: SPACING.sm,
  },
});