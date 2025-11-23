// src/screens/Product/ProductDetailScreen.js
// 📦 Product Detail Screen (Improved UI)

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ProductDetailScreen({ route }) {
  const { product } = route.params || {};

  if (!product) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="cube-outline" size={40} color="#94a3b8" />
        <Text style={styles.emptyTitle}>ไม่พบข้อมูลสินค้า</Text>
        <Text style={styles.emptyText}>
          กรุณากลับไปเลือกรายการสินค้าจากหน้าก่อนหน้าอีกครั้ง
        </Text>
      </View>
    );
  }

  const displayName = product.Name || product.NameFG || 'ไม่ระบุชื่อสินค้า';

  const infoRows = [
    { label: 'รหัสสินค้า', value: product.ItemCode },
    { label: 'ชื่อสินค้า', value: displayName },
    { label: 'แผนก', value: product.DepartCode },
    {
      label: 'ต้นทุน',
      value:
        product.CostN !== undefined && product.CostN !== null
          ? `฿${parseFloat(product.CostN).toLocaleString()}`
          : null,
    },
    {
      label: 'ราคาขาย',
      value:
        product.Price !== undefined && product.Price !== null
          ? `฿${parseFloat(product.Price).toLocaleString()}`
          : null,
    },
    { label: 'หน่วยนับ', value: product.UnitName || product.Unit || null },
    { label: 'Pack', value: product.Pack || product.PackSize || null },
  ].filter(row => row.value);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <View style={styles.iconCircle}>
          <Icon name="cube-outline" size={32} color="#0ea5e9" />
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {displayName}
        </Text>
        {product.ItemCode && (
          <Text style={styles.code}>{product.ItemCode}</Text>
        )}
      </View>

      <View style={styles.infoCard}>
        {infoRows.map(row => (
          <View key={row.label} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{row.label}</Text>
            <Text style={styles.infoValue}>{row.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.tipCard}>
        <Icon name="information-circle-outline" size={20} color="#0ea5e9" />
        <Text style={styles.tipText}>
          ข้อมูลนี้ดึงมาจากระบบ Sigma Group ERP ถ้ามีการแก้ไขราคา/ต้นทุน
          ให้ซิงก์ข้อมูลใหม่จาก backend อีกครั้ง
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
    backgroundColor: '#0ea5e9',
    borderRadius: 20,
    padding: 20,
    paddingTop: 24,
    marginBottom: 16,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
  code: {
    fontSize: 14,
    color: '#e0f2fe',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e2e8f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  infoValue: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
    marginLeft: 16,
    flexShrink: 1,
    textAlign: 'right',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#e0f2fe',
    marginBottom: 24,
  },
  tipText: {
    flex: 1,
    marginLeft: 8,
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
