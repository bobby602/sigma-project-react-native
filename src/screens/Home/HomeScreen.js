// src/screens/Home/HomeScreen.js
// 🏠 Home Screen - Main Dashboard

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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>สวัสดี, {user?.Name || 'ผู้ใช้'}</Text>
          <Text style={styles.role}>
            {user?.StAdmin === '1' ? 'ผู้ดูแลระบบ' : 
             user?.StAdmin === '2' ? 'พนักงานขาย' : 'พนักงานทั่วไป'}
          </Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{formatTime(currentTime)}</Text>
          <Text style={styles.date}>{formatDate(currentTime)}</Text>
        </View>
      </View>

      {/* Menu Grid */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuCard}
              onPress={() => {
                if (item.screen === 'Sales') {
                  navigation.navigate('Sales');
                } else {
                  navigation.navigate(item.screen);
                }
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
                <Icon name={item.icon} size={32} color={item.color} />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: '#64748b',
  },
  timeContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
  },
  time: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0ea5e9',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#64748b',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuCard: {
    width: (width - 60) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 64,
    height: 64,
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
