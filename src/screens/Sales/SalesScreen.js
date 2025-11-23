// src/screens/Sales/SalesScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SalesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>สรุปยอดขาย</Text>
      <Text style={styles.text}>หน้านี้จะแสดงสรุปยอดขาย</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  text: { fontSize: 16, marginBottom: 8 },
});
