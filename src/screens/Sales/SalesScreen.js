// src/screens/Sales/SalesScreen.js
// 📊 Sales Summary Screen (Improved UI - Placeholder)

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function SalesScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <View style={styles.iconCircle}>
          <Icon name="bar-chart-outline" size={32} color="#22c55e" />
        </View>
        <Text style={styles.title}>สรุปยอดขาย</Text>
        <Text style={styles.subtitle}>
          ภาพรวมยอดขายของคุณจะแสดงอยู่ในหน้านี้
          ทั้งตามวัน เดือน และตามพนักงานขาย
        </Text>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>ยอดขายวันนี้</Text>
          <Text style={styles.summaryValue}>฿0.00</Text>
          <Text style={styles.summaryHint}>รอเชื่อมต่อข้อมูลจาก backend</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>ยอดขายเดือนนี้</Text>
          <Text style={styles.summaryValue}>฿0.00</Text>
          <Text style={styles.summaryHint}>สามารถคำนวณจากรายงานในอนาคต</Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>สิ่งที่จะใส่ได้ในอนาคต</Text>
        <Text style={styles.sectionText}>• กราฟยอดขายต่อวัน / ต่อเดือน</Text>
        <Text style={styles.sectionText}>• Top 10 สินค้าขายดี</Text>
        <Text style={styles.sectionText}>• ยอดขายตามพนักงานขาย / ลูกค้า</Text>
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
    paddingBottom: 32,
  },
  headerCard: {
    backgroundColor: '#22c55e',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f9fafb',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#ecfdf3',
    lineHeight: 18,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  summaryHint: {
    fontSize: 11,
    color: '#94a3b8',
  },
  sectionCard: {
    backgroundColor: '#e0f2fe',
    borderRadius: 16,
    padding: 16,
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
});
