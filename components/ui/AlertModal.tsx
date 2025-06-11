// components/CustomAlertModal.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';

type Button = {
  text: string;
  onPress?: (e: GestureResponderEvent) => void;
  style?: 'default' | 'cancel' | 'destructive';
};

interface CustomAlertModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  buttons?: Button[];
}

const CustomAlertModal: React.FC<CustomAlertModalProps> = ({
  visible,
  title = 'Thông báo',
  message = '',
  onClose,
  buttons = [{ text: 'OK', onPress: onClose }],
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            {buttons.map((btn, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={(e) => {
                  onClose();
                  btn.onPress?.(e);
                }}
                style={[
                  styles.button,
                  btn.style === 'cancel' && styles.cancelButton,
                  btn.style === 'destructive' && styles.destructiveButton,
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    btn.style === 'cancel' && styles.cancelText,
                    btn.style === 'destructive' && styles.destructiveText,
                  ]}
                >
                  {btn.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlertModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: '#1976d2', // Mặc định màu primary
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  destructiveButton: {
    backgroundColor: '#F44336', // Sử dụng màu danger từ Colors
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelText: {
    color: '#333',
    fontWeight: 'bold',
  },
  destructiveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
