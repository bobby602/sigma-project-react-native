// src/screens/Customer/CustomerDetailScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CustomerDetailScreen({ route }) {
  const { customer } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>รายละเอียดลูกค้า</Text>
      <Text style={styles.text}>รหัส: {customer?.Code}</Text>
      <Text style={styles.text}>ชื่อ: {customer?.Name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  text: { fontSize: 16, marginBottom: 8 },
});
