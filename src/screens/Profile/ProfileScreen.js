// src/screens/Profile/ProfileScreen.js
// 👤 Profile Screen

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { logout } from '../../store/authSlice';
import { getUserRole } from '../../utils/helpers';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    Alert.alert(
      'ออกจากระบบ',
      'คุณต้องการออกจากระบบใช่หรือไม่?',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'ออกจากระบบ',
          style: 'destructive',
          onPress: () => dispatch(logout()),
        },
      ]
    );
  };

  const profileItems = [
    {
      icon: 'person-outline',
      label: 'ชื่อผู้ใช้',
      value: user?.Name || user?.Login || 'ไม่ระบุ',
    },
    {
      icon: 'briefcase-outline',
      label: 'สิทธิ์การใช้งาน',
      value: getUserRole(user?.StAdmin),
    },
    {
      icon: 'card-outline',
      label: 'รหัสพนักงานขาย',
      value: user?.SaleCode || 'ไม่ระบุ',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Icon name="person" size={48} color="#ffffff" />
        </View>
        <Text style={styles.name}>{user?.Name || 'ผู้ใช้งาน'}</Text>
        <Text style={styles.role}>{getUserRole(user?.StAdmin)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ข้อมูลส่วนตัว</Text>
        {profileItems.map((item, index) => (
          <View key={index} style={styles.infoCard}>
            <Icon name={item.icon} size={24} color="#64748b" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>การตั้งค่า</Text>
        
        <TouchableOpacity style={styles.settingCard}>
          <Icon name="notifications-outline" size={24} color="#64748b" />
          <Text style={styles.settingText}>การแจ้งเตือน</Text>
          <Icon name="chevron-forward" size={20} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingCard}>
          <Icon name="shield-checkmark-outline" size={24} color="#64748b" />
          <Text style={styles.settingText}>ความเป็นส่วนตัว</Text>
          <Icon name="chevron-forward" size={20} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingCard}>
          <Icon name="help-circle-outline" size={24} color="#64748b" />
          <Text style={styles.settingText}>ช่วยเหลือ</Text>
          <Icon name="chevron-forward" size={20} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Icon name="log-out-outline" size={24} color="#ffffff" />
        <Text style={styles.logoutText}>ออกจากระบบ</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version 2.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: '#64748b',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoContent: {
    flex: 1,
    marginLeft: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  version: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 12,
    paddingBottom: 24,
  },
});
