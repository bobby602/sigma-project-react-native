// src/screens/Reservation/ReservationScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ReservationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>รายการจอง</Text>
      <Text style={styles.text}>หน้านี้จะแสดงรายการจองสินค้า</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  text: { fontSize: 16, marginBottom: 8 },
});
