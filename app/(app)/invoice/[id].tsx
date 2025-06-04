import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

type InvoiceDetailProps = {
    id: string;
};

const mockInvoice = {
    id: '12345',
    date: '2024-06-10',
    customer: 'Nguyen Van A',
    items: [
        { name: 'Dịch vụ gia sư Toán', quantity: 10, price: 200000 },
        { name: 'Dịch vụ gia sư Văn', quantity: 5, price: 180000 },
    ],
    total: 2900000,
    status: 'Đã thanh toán',
};

const InvoiceDetailScreen: React.FC = () => {
    const route = useRoute();
    const { id } = route.params as InvoiceDetailProps;
  const { t } = useTranslation(); 
    // In real app, fetch invoice by id
    const invoice = mockInvoice; // Replace with fetched data

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{t("Chi tiết hoá đơn")}</Text>
            <View style={styles.section}>
                <Text>{t("Mã hoá đơn")}: {invoice.id}</Text>
                <Text>{t("Ngày lập")}: {invoice.date}</Text>
                <Text>{t("Khách hàng")}: {invoice.customer}</Text>
                <Text>{t("Trạng thái")}: {invoice.status}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.subtitle}>{t("Danh sách dịch vụ")}</Text>
                {invoice.items.map((item, idx) => (
                    <View key={idx} style={styles.itemRow}>
                        <Text>{item.name}</Text>
                        <Text>
                            {item.quantity} x {item.price.toLocaleString()}đ
                        </Text>
                    </View>
                ))}
            </View>
            <View style={styles.section}>
                <Text style={styles.total}>
                    {t("Tổng cộng")}: {invoice.total.toLocaleString()}đ
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
    section: { marginBottom: 20 },
    subtitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    total: { fontSize: 18, fontWeight: 'bold', color: '#2e7d32' },
});

export default InvoiceDetailScreen;