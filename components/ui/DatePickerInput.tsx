// components/DatePicker.tsx
import React, { useState } from 'react';
import { View, Platform, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Input from './Input';

interface Props {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

const DatePicker: React.FC<Props> = ({ value, onChange, label = "Ngày sinh" }) => {
  const [show, setShow] = useState(false);

  const onDateChange = (_: any, selectedDate?: Date) => {
    if (selectedDate) {
      setShow(false);
      onChange(selectedDate.toISOString().split('T')[0]); // Format YYYY-MM-DD
    } else {
      setShow(false);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setShow(true)}>
        <Input
          label={label}
          value={value}
          onChangeText={() => {}} // không cho người dùng tự nhập
          placeholder="Chọn ngày sinh"
          editable={false}
          containerStyle={{ marginTop: 10 }}
          textAlignVertical="top"
        />
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

export default DatePicker;
