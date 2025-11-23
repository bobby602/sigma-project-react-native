// src/screens/Home/HomeScreen.js
// 🏠 Home Screen - Main Dashboard (Styled)

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user } = useSelector(state => state.auth);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const menuItems = [
    {
      title: 'รายการสินค้า',
      description: 'ดูรายการสินค้าทั้งหมด แยกตามหมวดหมู่',
      screen: 'Products',
      icon: 'cube-outline',
      color: '#3b82f6',
    },
    {
      title: 'บันทึกราคาสินค้า',
      description: 'จัดการราคาและแพ็คกิ้งสินค้า',
      screen: 'Prices',
      icon: 'pricetag-outline',
      color: '#8b5cf6',
    },
    {
      title: 'ข้อมูลลูกค้า',
      description: 'จัดการข้อมูลและประวัติลูกค้า',
      screen: 'Customers',
      icon: 'people-outline',
      color: '#10b981',
    },
    {
      title: 'สรุปยอดขาย',
      description: 'รายงานและสรุปยอดขายทั้งหมด',
      screen: 'Sales',
      icon: 'bar-chart-outline',
      color: '#f59e0b',
    },
  ];

  const formatTime = (date) => {
    return date.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('th-TH', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const roleLabel =
    user?.StAdmin === '1'
      ? 'ผู้ดูแลระบบ'
      : user?.StAdmin === '2'
      ? 'พนักงานขาย'
      : 'พนักงานทั่วไป';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>สวัสดี, {user?.Name || 'ผู้ใช้'}</Text>
            <View style={styles.roleTag}>
              <Icon name="shield-checkmark-outline" size={14} color="#bfdbfe" />
              <Text style={styles.roleText}>{roleLabel}</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <Text style={styles.time}>{formatTime(currentTime)}</Text>
            <Text style={styles.date}>{formatDate(currentTime)}</Text>
          </View>
        </View>

        <Text style={styles.headerSubtitle}>
          เลือกเมนูด้านล่างเพื่อเริ่มงานประจำวันของคุณ
        </Text>
      </View>

      {/* Content */}
      <View style={styles.contentWrapper}>
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>เมนูหลัก</Text>
          <Text style={styles.sectionSubtitle}>
            จัดการสินค้า ลูกค้า และดูสรุปยอดขาย
          </Text>

          <View style={styles.grid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.menuCard, { borderTopColor: item.color }]}
                onPress={() => navigation.navigate(item.screen)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${item.color}15` },
                  ]}
                >
                  <Icon name={item.icon} size={32} color={item.color} />
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const CARD_WIDTH = (width - 60) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: '#0f172a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    paddingRight: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f9fafb',
    marginBottom: 6,
  },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(15,23,42,0.8)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#1d4ed8',
  },
  roleText: {
    fontSize: 12,
    color: '#bfdbfe',
    marginLeft: 4,
  },
  headerRight: {
    padding: 10,
    backgroundColor: 'rgba(15,23,42,0.85)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    minWidth: 150,
  },
  time: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0ea5e9',
    textAlign: 'right',
  },
  date: {
    fontSize: 12,
    color: '#e5e7eb',
    textAlign: 'right',
    marginTop: 2,
  },
  headerSubtitle: {
    marginTop: 16,
    fontSize: 13,
    color: '#cbd5f5',
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuCard: {
    width: CARD_WIDTH,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderTopWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
  },
  menuDescription: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },
});
