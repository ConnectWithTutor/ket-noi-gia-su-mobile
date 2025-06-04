import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useClassStore } from '@/store/class-store';
import { formatDate } from '@/utils/date-utils';
import colors from '@/constants/Colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@/constants/Theme';
import { Class } from '@/types';
import StatusBar from '@/components/ui/StatusBar';
import Header from '@/components/ui/Header';
import { useTranslation } from 'react-i18next';

const ClassSearchScreen = () => {
  const router = useRouter();
  const { classes, fetchClasses, findBestClasses ,message,isLoading} = useClassStore();
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation();
  useEffect(() => {
    fetchClasses();
  }, []);
  // Debounced setter for searchTerm
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim()) {
        findBestClasses({ keyword: searchTerm.trim(), limit: 20 });
      } else {
        fetchClasses(); 
      }
    }, 500); 

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const renderItem = ({ item }: { item: Class }) => (
    <TouchableOpacity
      style={styles.classItem}
      onPress={() => router.push(`/class/${item.classId}`)}
    >
      <Text style={styles.classTitle}>{item.className_vi}</Text>
      <Text style={styles.classDate}>
        {item.startDate ? formatDate(item.startDate) : ''}
      </Text>
      <Text style={styles.classDescription} numberOfLines={1}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
       <StatusBar backgroundColor={colors.primary} />
      <Header title={t("Tạo lớp học mới")} showBack />
       <View style={styles.content} >
      <TextInput
        style={styles.input}
        placeholder={t("Tìm kiếm lớp học...")}
        placeholderTextColor={colors.placeholder}
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      {message && !isLoading && classes.length === 0 && (
        <Text style={styles.emptyText}>{message}</Text>
      )}
      {isLoading && classes.length ===0? (
        <ActivityIndicator size="large" color={colors.primary} />
      ):
      (
      <FlatList
        data={classes}
        keyExtractor={(item) => item.classId}
        renderItem={renderItem}
        
      />
      )}
      
      </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
    content: {
      flex: 1,
      padding: SPACING.md,
    },
  input: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: colors.text,
    marginBottom: SPACING.md,
  },
  classItem: {
    backgroundColor: colors.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  classTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: SPACING.xs,
  },
  classDate: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginBottom: SPACING.xs,
  },
  classDescription: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: colors.placeholder,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
});

export default ClassSearchScreen;
