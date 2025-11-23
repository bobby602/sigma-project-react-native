// src/screens/Customer/CustomerDetailScreen.js
// 👤 Customer Detail Screen (Improved UI)

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function CustomerDetailScreen({ route }) {
  const { customer } = route.params || {};

  if (!customer) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="people-outline" size={40} color="#94a3b8" />
        <Text style={styles.emptyTitle}>ไม่พบข้อมูลลูกค้า</Text>
        <Text style={styles.emptyText}>
          กรุณากลับไปเลือกรายการลูกค้าจากหน้าก่อนหน้าอีกครั้ง
        </Text>
      </View>
    );
  }

  const name = customer.Name || 'ไม่ระบุชื่อ';
  const code = customer.Code;

  const infoRows = [
    { label: 'รหัสลูกค้า', value: code },
    { label: 'ชื่อร้าน / ลูกค้า', value: name },
    { label: 'ที่อยู่', value: customer.addr },
    { label: 'เบอร์โทร', value: customer.Phone },
    {
      label: 'วงเงินเครดิต',
      value:
        customer.MaxCr !== undefined && customer.MaxCr !== null
          ? `฿${customer.MaxCr}`
          : null,
    },
    {
      label: 'เครดิตเทอม',
      value:
        customer.CRTERM !== undefined && customer.CRTERM !== null
          ? `${customer.CRTERM} วัน`
          : null,
    },
  ].filter(row => row.value);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Icon name="person" size={28} color="#0ea5e9" />
        </View>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>
        {code && <Text style={styles.code}>{code}</Text>}
      </View>

      <View style={styles.infoCard}>
        {infoRows.map(row => (
          <View key={row.label} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{row.label}</Text>
            <Text style={styles.infoValue}>{row.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>หมายเหตุ</Text>
        <Text style={styles.sectionText}>
          ใช้หน้านี้เพื่อดูรายละเอียดลูกค้าก่อนเปิดบิลขาย
          หรือบันทึกรายการจองสินค้าให้ถูกต้อง
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
  },
  headerCard: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 20,
    paddingTop: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f9fafb',
    marginBottom: 4,
    textAlign: 'center',
  },
  code: {
    fontSize: 14,
    color: '#cbd5f5',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  infoRow: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e2e8f0',
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: '#e0f2fe',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 12,
    color: '#0f172a',
    lineHeight: 18,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  emptyText: {
    marginTop: 4,
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});
