// src/screens/Auth/LoginScreen.js
// 🔐 Login Screen (Styled Card)

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/authSlice';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
      return;
    }

    try {
      console.log('🔐 Attempting login:', username);
      const result = await dispatch(login({ username, password })).unwrap();
      console.log('✅ Login successful:', result);
    } catch (err) {
      console.error('❌ Login failed:', err);
      const message =
        typeof err === 'string'
          ? err
          : err?.message || 'กรุณาลองใหม่อีกครั้ง';
      Alert.alert('เข้าสู่ระบบไม่สำเร็จ', message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo & Title */}
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Sigma Group Thailand</Text>
        <Text style={styles.subtitle}>ระบบจัดการธุรกิจ</Text>

        {/* Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>เข้าสู่ระบบ</Text>

          <TextInput
            style={styles.input}
            placeholder="ชื่อผู้ใช้"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
            placeholderTextColor="#9ca3af"
          />

          <TextInput
            style={styles.input}
            placeholder="รหัสผ่าน"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
            onSubmitEditing={handleLogin}
            placeholderTextColor="#9ca3af"
          />

          {/* Error Message */}
          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Version */}
        <Text style={styles.version}>Version 2.0.0</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#e5e7eb',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 24,
  },
  formCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 12,
    color: '#111827',
  },
  button: {
    backgroundColor: '#0ea5e9',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    marginBottom: 8,
    textAlign: 'center',
  },
  version: {
    position: 'absolute',
    bottom: 24,
    color: '#6b7280',
    fontSize: 12,
  },
});
