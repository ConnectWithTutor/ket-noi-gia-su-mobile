import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, ActivityIndicator, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { usePaymentStore } from '@/store/payment-store';
import InvoiceCard from '@/components/payment/InvoiceCard';
import colors from '@/constants/Colors';
import StatusBar from '@/components/ui/StatusBar';
import Header from '@/components/ui/Header';
import {PaymentMethod, Status,PaymentOrderResponse} from '@/types';
const StudentInvoices = () => {
  const { payments, fetchPayments, loading, error, fetchPaymentMethods,PaymentOrder } = usePaymentStore();
  const { fetchStatusPayment , StatusesPayment } = useStatusStore();
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        fetchPayments(user.userId);
        await fetchStatusPayment();
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchMethods = async () => {
      const methods = await fetchPaymentMethods();
      setMethods(methods);
    };
    fetchMethods();
  }, [fetchPaymentMethods]);

  const getStatusById = (id: string) => {
    return StatusesPayment.find((st) => st.statusId === id);
  };
  const getPaymentMethodById = (id: string) => {
    return methods.find((st) => st.methodId === id);
  };
  const openVnpayUrl = async (url: string) => {
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    console.warn('Cannot open URL:', url);
  }
};
  const handlePay = async (paymentId: string, methodId: string) => {
    if (!paymentId || !methodId) return;

    try {
      const response = await PaymentOrder({
         paymentId : paymentId,
         methodId : methodId,
      }) as PaymentOrderResponse;
      if (response) {
        if (response.redirect_url) {
          // <WebView 
          //     source={{ uri: response.redirect_url }} 
          //     startInLoadingState
          //   />
          openVnpayUrl(response.redirect_url);
        }
      } else {
        // Handle error
        console.error('Payment order failed:', (response as PaymentOrderResponse)?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Payment error:', error);
    }
  };
  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary} />;
  }
  if (error) {
    return <Text style={{ color: colors.danger, textAlign: 'center' }}>{error}</Text>;
  }
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} />
      <Header title={t("Danh sách hóa đơn")} showBack />
        {payments.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ textAlign: 'center', marginTop: 20 }}>{t("Không có hóa đơn nào")}</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ padding: 16 }} >
            {payments
              .map((invoice) => {
                const status = getStatusById(invoice.status);
                if (!status) return null;
                return (
                  <InvoiceCard key={invoice.paymentId} invoice={invoice} status={status} paymentMethod={getPaymentMethodById(invoice.methodId)} onPay={() => handlePay(invoice.paymentId, invoice.methodId)} />
                );
              })
              .filter(Boolean)}
          </ScrollView>
        )}
    </View>
  );
};
import { StyleSheet } from 'react-native';
import { useAuthStore } from '@/store/auth-store';
import { useStatusStore } from '@/store/status-store';
import { useTranslation } from 'react-i18next';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    });

export default StudentInvoices;
