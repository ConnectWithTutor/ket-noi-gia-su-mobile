import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PaymentDetails, Status, PaymentMethod } from '@/types';
import { formatDate } from '@/utils/date-utils';
import colors from '@/constants/Colors';
import { BORDER_RADIUS, FONT_SIZE, SHADOWS, SPACING } from '@/constants/Theme';

interface Props {
  invoice: PaymentDetails;
  status: Status;
  paymentMethod?: PaymentMethod;
  onPay?: () => void; // Thêm props nếu cần xử lý sự kiện thanh toán
}

export default function InvoiceCard({ invoice, status, paymentMethod, onPay }: Props) {
  const { amount, paidAt } = invoice;

  const formatCurrency = (value: string) => {
    return Number(value).toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  };

  const getStatusColor = () => {
    switch (status?.code) {
      case 'Success':
        return colors.success;
      case 'Pending':
        return colors.warning;
      case 'Unpaid':
        return colors.danger;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <View style={[styles.card, SHADOWS.medium]}>
      <View style={styles.header}>
        <Text style={styles.amount}>{formatCurrency(amount)}</Text>
        <Text style={[styles.status, { color: getStatusColor() }]}>
          {status?.name}
        </Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.label}>Ngày thanh toán</Text>
        <Text style={styles.value}>{formatDate(paidAt)}</Text>

        <Text style={styles.label}>Phương thức</Text>
        <Text style={styles.value}>{paymentMethod?.description || 'Không rõ'}</Text>
        {status?.code === 'Unpaid' && (
          <TouchableOpacity style={styles.payButton} onPress={onPay}>
            <Text style={styles.payButtonText}>Thanh toán</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  amount: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: colors.primary,
  },
  status: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  body: {
    marginTop: SPACING.sm,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    color: colors.textSecondary,
    marginTop: SPACING.xs,
  },
  value: {
    fontSize: FONT_SIZE.md,
    color: colors.text,
  },
  payButton: {
    marginTop: SPACING.md,
    backgroundColor: colors.primary,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  payButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: FONT_SIZE.md,
  },
});
