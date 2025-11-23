// src/screens/Auth/SplashScreen.js
// 🎨 Splash Screen (Styled)

import React from 'react';
import { View, Image, ActivityIndicator, StyleSheet, Text } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Sigma Group Thailand</Text>
        <Text style={styles.subtitle}>กำลังโหลดระบบจัดการธุรกิจ...</Text>
      </View>
      <ActivityIndicator size="large" color="#0ea5e9" style={styles.loader} />
      <Text style={styles.version}>Version 2.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e5e7eb',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#9ca3af',
  },
  loader: {
    marginTop: 32,
  },
  version: {
    position: 'absolute',
    bottom: 24,
    color: '#6b7280',
    fontSize: 12,
  },
});
