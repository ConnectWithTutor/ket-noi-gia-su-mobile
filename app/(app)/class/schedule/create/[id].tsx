import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from '@/components/ui/Header';
import colors from '@/constants/Colors';
import { BORDER_RADIUS, FONT_SIZE, SHADOWS, SPACING } from '@/constants/Theme';

const WEEK_DAYS = [
    { label: 'CN', value: 0 },
    { label: 'T2', value: 1 },
    { label: 'T3', value: 2 },
    { label: 'T4', value: 3 },
    { label: 'T5', value: 4 },
    { label: 'T6', value: 5 },
    { label: 'T7', value: 6 },
];

const CreateScheduleScreen = () => {
        const [title, setTitle] = useState('');
        const [date, setDate] = useState<Date>(new Date());
        const [showDatePicker, setShowDatePicker] = useState(false);
        const [startTime, setStartTime] = useState<Date>(new Date());
        const [showStartTimePicker, setShowStartTimePicker] = useState(false);
        const [endTime, setEndTime] = useState<Date>(new Date());
        const [showEndTimePicker, setShowEndTimePicker] = useState(false);
        const [note, setNote] = useState('');
        const [selectedDays, setSelectedDays] = useState<number[]>([]);

        const onChangeDate = (_: any, selectedDate?: Date) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) setDate(selectedDate);
        };

        const onChangeStartTime = (_: any, selectedTime?: Date) => {
                setShowStartTimePicker(Platform.OS === 'ios');
                if (selectedTime) setStartTime(selectedTime);
        };

        const onChangeEndTime = (_: any, selectedTime?: Date) => {
                setShowEndTimePicker(Platform.OS === 'ios');
                if (selectedTime) setEndTime(selectedTime);
        };

        const toggleDay = (dayValue: number) => {
                setSelectedDays(prev =>
                        prev.includes(dayValue)
                                ? prev.filter(d => d !== dayValue)
                                : [...prev, dayValue]
                );
        };

        const handleSubmit = () => {
                // Xử lý lưu lịch học ở đây
                alert(`Đã tạo lịch học vào các ngày: ${selectedDays.map(d => WEEK_DAYS.find(w => w.value === d)?.label).join(', ')}`);
        };

        return (
                <View style={styles.container}>
                        <Header title="Tạo lịch học" showBack />
                        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        <TextInput
                                style={styles.input}
                                placeholder="Nhập tiêu đề"
                                value={title}
                                onChangeText={setTitle}
                        />

                        <Text style={styles.label}>Chọn các ngày trong tuần</Text>
                        <View style={styles.weekDaysContainer}>
                                {WEEK_DAYS.map(day => (
                                        <TouchableOpacity
                                                key={day.value}
                                                style={[
                                                        styles.dayButton,
                                                        selectedDays.includes(day.value) && styles.dayButtonSelected
                                                ]}
                                                onPress={() => toggleDay(day.value)}
                                        >
                                                <Text style={[
                                                        styles.dayButtonText,
                                                        selectedDays.includes(day.value) && styles.dayButtonTextSelected
                                                ]}>
                                                        {day.label}
                                                </Text>
                                        </TouchableOpacity>
                                ))}
                        </View>

                        <Text style={styles.label}>Ngày học</Text>
                        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                                <Text>{date}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                                <DateTimePicker
                                        value={date}
                                        mode="date"
                                        display="default"
                                        onChange={onChangeDate}
                                />
                        )}

                        <Text style={styles.label}>Giờ bắt đầu</Text>
                        <TouchableOpacity onPress={() => setShowStartTimePicker(true)} style={styles.input}>
                                <Text>{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                        </TouchableOpacity>
                        {showStartTimePicker && (
                                <DateTimePicker
                                        value={startTime}
                                        mode="time"
                                        display="default"
                                        onChange={onChangeStartTime}
                                />
                        )}

                        <Text style={styles.label}>Giờ kết thúc</Text>
                        <TouchableOpacity onPress={() => setShowEndTimePicker(true)} style={styles.input}>
                                <Text>{endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                        </TouchableOpacity>
                        {showEndTimePicker && (
                                <DateTimePicker
                                        value={endTime}
                                        mode="time"
                                        display="default"
                                        onChange={onChangeEndTime}
                                />
                        )}

                        <Button title="Tạo lịch học" onPress={handleSubmit} />
                        </ScrollView>
                </View>
        );
};

const styles = StyleSheet.create({
        container: {
                flex: 1,
                backgroundColor: '#fff',
        },
        content: {
                flex: 1,
                padding: SPACING.md,
        },
        label: {
                marginTop: 16,
                marginBottom: 4,
                fontWeight: 'bold',
                fontSize: 16,
        },
        input: {
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 8,
                padding: 12,
                backgroundColor: '#f9f9f9',
                marginBottom: 8,
        },
        weekDaysContainer: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 12,
        },
        dayButton: {
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: '#ddd',
                backgroundColor: '#f9f9f9',
                marginHorizontal: 2,
        },
        dayButtonSelected: {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
        },
        dayButtonText: {
                color: '#333',
                fontWeight: 'bold',
        },
        dayButtonTextSelected: {
                color: '#fff',
        },
});

export default CreateScheduleScreen;