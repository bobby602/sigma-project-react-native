// src/screens/Product/ProductDetailScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProductDetailScreen({ route }) {
  const { product } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>รายละเอียดสินค้า</Text>
      <Text style={styles.text}>รหัสสินค้า: {product?.ItemCode}</Text>
      <Text style={styles.text}>ชื่อ: {product?.Name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  text: { fontSize: 16, marginBottom: 8 },
});
