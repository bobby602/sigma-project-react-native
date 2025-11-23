// src/screens/Profile/ProfileScreen.js
// 👤 Profile Screen (Styled)

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Icon name="person" size={50} color="#ffffff" />
        </View>
        <Text style={styles.name}>{user?.Name || 'ผู้ใช้งาน'}</Text>
        <Text style={styles.role}>{getUserRole(user?.StAdmin)}</Text>
      </View>

      {/* Personal Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ข้อมูลส่วนตัว</Text>
        {profileItems.map((item, index) => (
          <View key={index} style={styles.infoCard}>
            <Icon name={item.icon} size={22} color="#64748b" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>การตั้งค่า</Text>

        <TouchableOpacity style={styles.settingCard}>
          <Icon name="notifications-outline" size={22} color="#64748b" />
          <Text style={styles.settingText}>การแจ้งเตือน</Text>
          <Icon name="chevron-forward" size={20} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingCard}>
          <Icon name="shield-checkmark-outline" size={22} color="#64748b" />
          <Text style={styles.settingText}>ความเป็นส่วนตัว</Text>
          <Icon name="chevron-forward" size={20} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingCard}>
          <Icon name="help-circle-outline" size={22} color="#64748b" />
          <Text style={styles.settingText}>ช่วยเหลือ</Text>
          <Icon name="chevron-forward" size={20} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Icon name="log-out-outline" size={22} color="#ffffff" />
        <Text style={styles.logoutText}>ออกจากระบบ</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version 2.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    paddingBottom: 24,
  },
  header: {
    backgroundColor: '#0f172a',
    paddingTop: 60,
    paddingBottom: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f9fafb',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: '#cbd5f5',
  },
  section: {
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 10,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoContent: {
    flex: 1,
    marginLeft: 14,
  },
  infoLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#0f172a',
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingText: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
    marginLeft: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  version: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 12,
    marginBottom: 8,
  },
});
