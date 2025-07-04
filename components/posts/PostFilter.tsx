import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Filter, X } from 'lucide-react-native';

import colors from '@/constants/Colors';
import { BORDER_RADIUS, FONT_SIZE, SPACING } from '@/constants/Theme';
import { useTranslation } from 'react-i18next';
import { useSubjectStore } from '@/store/subjectStore';

interface PostFilterProps {
  onFilterChange: (filters: {
    subject?: string;
    location?: string;
    status?: string;
  }) => void;
}

export default function PostFilter({ onFilterChange }: PostFilterProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(undefined);
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const { t } = useTranslation();

  // Lấy danh sách môn học từ subjectStore
  const { subjects, fetchSubjects } = useSubjectStore();

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Các khu vực và trạng thái là dữ liệu tĩnh
  const locations = [t('Quận 1'), t('Quận 2'), t('Quận 3'), t('Quận 5'), t('Quận 7'), t('Quận 10')];
  const statuses = [t('Đang tìm'), t('Đã đóng')];

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSubjectSelect = (subject: string) => {
    const newValue = selectedSubject === subject ? undefined : subject;
    setSelectedSubject(newValue);
    applyFilters(newValue, selectedLocation, selectedStatus);
  };

  const handleLocationSelect = (location: string) => {
    const newValue = selectedLocation === location ? undefined : location;
    setSelectedLocation(newValue);
    applyFilters(selectedSubject, newValue, selectedStatus);
  };

  const handleStatusSelect = (status: string) => {
    const newValue = selectedStatus === status ? undefined : status;
    setSelectedStatus(newValue);
    applyFilters(selectedSubject, selectedLocation, newValue);
  };

  const applyFilters = (
    subject?: string,
    location?: string,
    status?: string
  ) => {
    onFilterChange({
      subject,
      location,
      status: status === t('Đang tìm') ? 'active' : status === t('Đã đóng') ? 'closed' : undefined,
    });
  };

  const clearFilters = () => {
    setSelectedSubject(undefined);
    setSelectedLocation(undefined);
    setSelectedStatus(undefined);
    onFilterChange({});
  };

  const hasActiveFilters = selectedSubject || selectedLocation || selectedStatus;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={toggleFilters}
          activeOpacity={0.7}
        >
          <Filter size={18} color={colors.text} />
          <Text style={styles.filterButtonText}>{t('Lọc')}</Text>
        </TouchableOpacity>
        
        {hasActiveFilters && (
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={clearFilters}
            activeOpacity={0.7}
          >
            <X size={16} color={colors.textSecondary} />
            <Text style={styles.clearButtonText}>{t('Xóa bộ lọc')}</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>{t('Môn học')}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterOptionsContainer}
            >
              {subjects.map((subject) => (
                <TouchableOpacity
                  key={subject.subjectId}
                  style={[
                    styles.filterOption,
                    selectedSubject === subject.subjectName_vi && styles.selectedFilterOption,
                  ]}
                  onPress={() => handleSubjectSelect(subject.subjectName_vi)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedSubject === subject.subjectName_vi && styles.selectedFilterOptionText,
                    ]}
                  >
                    {subject.subjectName_vi}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>{t('Khu vực')}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterOptionsContainer}
            >
              {locations.map((location) => (
                <TouchableOpacity
                  key={location}
                  style={[
                    styles.filterOption,
                    selectedLocation === location && styles.selectedFilterOption,
                  ]}
                  onPress={() => handleLocationSelect(location)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedLocation === location && styles.selectedFilterOptionText,
                    ]}
                  >
                    {location}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>{t('Trạng thái')}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterOptionsContainer}
            >
              {statuses.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterOption,
                    selectedStatus === status && styles.selectedFilterOption,
                  ]}
                  onPress={() => handleStatusSelect(status)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedStatus === status && styles.selectedFilterOptionText,
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
      
      {hasActiveFilters && (
        <View style={styles.activeFiltersContainer}>
          {selectedSubject && (
            <View style={styles.activeFilter}>
              <Text style={styles.activeFilterText}>{selectedSubject}</Text>
              <TouchableOpacity 
                onPress={() => handleSubjectSelect(selectedSubject)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={14} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
          
          {selectedLocation && (
            <View style={styles.activeFilter}>
              <Text style={styles.activeFilterText}>{selectedLocation}</Text>
              <TouchableOpacity 
                onPress={() => handleLocationSelect(selectedLocation)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={14} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
          
          {selectedStatus && (
            <View style={styles.activeFilter}>
              <Text style={styles.activeFilterText}>{selectedStatus}</Text>
              <TouchableOpacity 
                onPress={() => handleStatusSelect(selectedStatus)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={14} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  filterButtonText: {
    fontSize: FONT_SIZE.sm,
    color: colors.text,
    marginLeft: SPACING.xs,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginLeft: SPACING.xs,
  },
  filtersContainer: {
    marginTop: SPACING.md,
  },
  filterSection: {
    marginBottom: SPACING.md,
  },
  filterTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: SPACING.xs,
  },
  filterOptionsContainer: {
    paddingRight: SPACING.md,
  },
  filterOption: {
    backgroundColor: colors.card,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    marginRight: SPACING.xs,
  },
  selectedFilterOption: {
    backgroundColor: colors.primaryLight,
  },
  filterOptionText: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
  },
  selectedFilterOptionText: {
    color: colors.primary,
    fontWeight: '600',
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.sm,
  },
  activeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  activeFilterText: {
    fontSize: FONT_SIZE.xs,
    color: colors.textSecondary,
    marginRight: SPACING.xs,
  },
});