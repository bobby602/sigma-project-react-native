// src/screens/Reservation/ReservationScreen.js
// 📝 Reservation Screen (Improved UI - Empty State)

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ReservationScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <View style={styles.iconCircle}>
          <Icon name="bookmark-outline" size={32} color="#0ea5e9" />
        </View>
        <Text style={styles.title}>รายการจองสินค้า</Text>
        <Text style={styles.subtitle}>
          ใช้หน้าจอนี้เพื่อติดตามรายการจองสินค้าจากลูกค้าทั้งหมด
        </Text>
      </View>

      <View style={styles.emptyCard}>
        <Icon name="file-tray-outline" size={40} color="#94a3b8" />
        <Text style={styles.emptyTitle}>ยังไม่มีรายการจอง</Text>
        <Text style={styles.emptyText}>
          เมื่อมีการจองสินค้าจากหน้ารายการสินค้า
          ระบบจะแสดงรายการทั้งหมดไว้ที่นี่ให้คุณตรวจสอบได้ง่าย ๆ
        </Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>ไอเดียข้อมูลที่จะใส่ในอนาคต</Text>
        <Text style={styles.sectionText}>• รายการจองล่าสุดของแต่ละลูกค้า</Text>
        <Text style={styles.sectionText}>• สถานะการจอง (รออนุมัติ / เรียบร้อย)</Text>
        <Text style={styles.sectionText}>• วันที่ต้องการให้สินค้า / กำหนดส่ง</Text>
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
    backgroundColor: '#0ea5e9',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#e0f2fe',
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
    color: '#e0f2fe',
    lineHeight: 18,
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
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
