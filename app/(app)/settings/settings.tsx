import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import StatusBar from '@/components/ui/StatusBar';
import Header from '@/components/ui/Header';
import Colors from '@/constants/Colors';

const languages = [
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'en', label: 'English' },
];

export default function SettingScreen() {
  const { t, i18n } = useTranslation();

  const handleChangeLanguage = (code: string) => {
    i18n.changeLanguage(code);
  };

  return (
    <View style={styles.container}>
        <StatusBar backgroundColor={Colors.primary} />
        <Header title={t("Lựa chọn ngôn ngữ")} showBack />
    <ScrollView contentContainerStyle={{ padding: 24 }}> 
      <Text style={styles.title}>{t('Ngôn ngữ')}</Text>
      {languages.map(lang => (
        <TouchableOpacity
          key={lang.code}
          style={[
            styles.button,
            i18n.language === lang.code && styles.selectedButton,
          ]}
          onPress={() => handleChangeLanguage(lang.code)}
        >
          <Text
            style={[
              styles.buttonText,
              i18n.language === lang.code && styles.selectedButtonText,
            ]}
          >
            {lang.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    marginBottom: 12,
  },
  selectedButton: {
    backgroundColor: '#1976d2',
  },
  buttonText: {
    fontSize: 16,
    color: '#222',
  },
  selectedButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});